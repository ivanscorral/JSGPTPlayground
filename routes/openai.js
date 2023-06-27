const express = require('express');
const router = express.Router();
const constants = require('../constants/constants');
const { v4 } = require('uuid');
const JSONDatabaseManager = require('../db/jsondb');
const OpenAIWrapper = require('../openai/openaiwrapper');
const log = require('../utils/logger');

// Import JSONDatabaseManager and OpenAIWrapper classes.
const dbManager = new JSONDatabaseManager();
const openaiWrapper = new OpenAIWrapper(process.env.OPENAI_API_KEY);

/**
 * Endpoint to retrieve chat object by chatId and authToken.
 * @name getChat
 * @route {POST} /getChat
 * @param {string} chatId - The ID of the chat to retrieve.
 * @param {string} authToken - The authentication token of the chat.
 * @returns {Chat|null} - The chat data, or null if an error occurred.
 */
router.get('/getChat', async (req, res) => {
	const chat = await getChat(req, res);
	return res.status(200).json({
		messages: chat.messages,
		usedTokens: chat.lastTokenCount,
		model: chat.model,
	});
});

// List available initial prompts

router.get('/listPrompts', async (req, res, next) => {
	try {
		const prompts = await dbManager.listPrompts();
		return res.status(200).json({ prompts });
	} catch (error) {
		next(error); // Pass the error to the error handler middleware
	}
});

/**
 * Check if a request is authorized
 *
 * @param {string} authToken - the authorization token
 * @param {Object} res - the response object
 * @returns {boolean} true if authorized, false otherwise
 */
async function isAuthorized(authToken, res) {
	return authToken === process.env.AUTH_TOKEN
		? true
		: res.status(401).json({ message: 'Unauthorized' });
}
/**
 * Endpoint to create a new chat
 *
 * @param {Object} req - the request object
 * @param {Object} res - the response object
 */
router.post('/createNewChat', async (req, res) => {
	// Destructuring with default values
	const {
		authToken,
		model = constants.DEFAULT_MODEL,
		prompt = constants.DEFAULT_PROMPT,
		max_tokens: maxTokens = constants.DEFAULT_MAX_TOKENS,
		presence_penalty: presencePenalty = constants.DEFAULT_PRESENCE_PENALTY,
		temperature = constants.DEFAULT_TEMPERATURE
	} = req.body;

	// Check authorization
	if (!await isAuthorized(authToken, res)) return;

	// Generate a unique chatId
	const chatId = v4();

	// Construct chat object
	const chat = {
		chatId,
		model,
		messages: [{ role: 'system', content: prompt }],
		maxTokens,
		lastTokenCount: 0,
		presencePenalty,
		temperature,
		authToken,
	};

	// Store the chat and send response
	try {
		await dbManager.storeChat(chat);
		log.basic(`Created new chat with id ${chatId}`);
		return res.status(200).json({ chatId });
	} catch (error) {
		log.basic(`Error creating chat: ${error}`);
		return res.status(500).json({ message: 'An error occurred waiting the chat' });
	}
});

/**
 * Fetches a chat with the given chatId and authToken, and returns it if the
 * authToken matches the chat's authToken. If either chatId or authToken is
 * missing, or if the chat is not found or unauthorized, an appropriate error
 * response is returned.
 *
 * @param {Object} req - The request object
 * @param {Object} res - The response object
 * @return {Chat|null} The chat object, or null if chatId or authToken is missing
 * or invalid.
 */
async function getChat(req, res) {
	const { chatId, authToken } = req.method === 'GET' ? req.query : req.body;

	// Early return if parameters are missing
	if (!chatId || !authToken) return null;

	// Fetch chat and return unauthorized or not found when necessary
	const chat = await fetchChat(chatId);
	return chat && chat.authToken === authToken
		? chat
		: res
			.status(chat ? 401 : 400)
			.json({ message: chat ? 'Unauthorized' : 'Chat not found' });
}


/**
 * Fetch chat from the database.
 * @param {string} chatId - The unique ID of the chat.
 * @returns {object|null} Chat object or null if not found.
 */
async function fetchChat(chatId) {
	try {
		return await dbManager.getChat(chatId);
	} catch (error) {
		log.basic('Error fetching chat:', error);
		return null;
	}
}

/**
 * Validate and retrieve required parameters from request body.
 * @param {object} req - Express request object.
 * @param {object} res - Express response object.
 * @param {string[]} requiredParameters - Array of required parameter names.
 * @returns {object|null} Object with parameters or null if any are missing.
 */
function getRequiredParameters(req, res, requiredParameters) {
	const params = requiredParameters.reduce((acc, param) => {
		if (req.body[param]) acc[param] = req.body[param];
		return acc;
	}, {});

	// Send error response if any required parameters are missing
	const missingParams = requiredParameters.filter((param) => !params[param]);
	if (missingParams.length) {
		res
			.status(400)
			.json({
				message: `Missing required parameters: ${missingParams.join(', ')}`,
			});
		return null;
	}

	return params;
}

/**
 * Regenerate the last completion of the chat.
 */
router.post('/regenerateLastCompletion', async (req, res) => {
	const chat = await getChat(req, res);
	if (!chat) return;

	await openaiWrapper.regenerateLastCompletion(chat);
	return res.status(200).json({
		regeneratedMessage: chat.messages[chat.messages.length - 1].content,
	});
});

/**
 * Undo the last completion of the chat.
 */
router.post('/undoLastCompletion', async (req, res) => {
	const chat = await getChat(req, res);
	if (!chat) return;
	let status = openaiWrapper.undoLastCompletion(chat);
	if (status === 0) return res.status(200).json({ message: 'Last completion undone successfully' });
	if (chat.messages[chat.messages.length - 1]) {
		chat.messages.pop();
		try {
			await dbManager.storeChat(chat);
			res.status(200).json({ message: 'Last completion undone successfully' });
		} catch (error) {
			log.basic('Error updating chat:', error);
			res.status(500).json({ message: 'An error occurred while updating the chat' });
		}
	} else {
		return res.status(400).json({ message: 'There is nothing to undo' });
	}
});

/**
 * Create a simple chat.
 */
router.post('/simpleChat', async (req, res) => {
	let chat = await getChat(req, res);
	if (!chat) return;

	const message = req.body.message;
	chat = await openaiWrapper.appendCompletion(chat, message);

	log.basic(`Chat: ${chat.messages[chat.messages.length - 1].content}`);

	// Store chat in the database and log result in the background
	await dbManager.storeChat(chat);

	// Respond with the newly generated message
	return res.status(200).json({ response: chat.messages[chat.messages.length - 1] });
});

module.exports = router;

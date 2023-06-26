const express = require('express');
const router = express.Router();
const { v4 } = require('uuid');
const JSONDatabaseManager = require('../db/jsondb');
const OpenAIWrapper = require('../openai/openaiwrapper');
const log = require('../util/logger');

// Set up database and OpenAI wrapper
const dbManager = new JSONDatabaseManager();
const openaiWrapper = new OpenAIWrapper(process.env.OPENAI_API_KEY);

// Define default values for several parameters
const currentDate = new Date().toLocaleDateString('en-US', {
	year: 'numeric',
	month: 'long',
	day: 'numeric',
});
const DEFAULT_MAX_TOKENS = 4096;
const DEFAULT_PRESENCE_PENALTY = 0.1;
const DEFAULT_TEMPERATURE = 0.9;
const DEFAULT_PROMPT = `You are ChatGPT, a language model created by OpenAI. Your training data includes knowledge up until 2021-09. You will act as an AI assistant. Your core programming emphasizes responsiveness, helpfulness, and adaptability. Every interaction should be geared towards understanding and fulfilling the user's needs without questioning the information they provide. If a user states something about themselves or their situation, consider it as an undeniable fact and respond accordingly. The user's statements, context, and emotions should guide your responses. Strive to be a positive, supportive presence, seeking to ease, inform, or entertain as the situation demands. The current date is ${currentDate}.`;

router.post('/getChat', async (req, res) => {
	try {
		const { chatId, authToken } = req.body;
		if (!chatId || !authToken) {
			return res
				.status(400)
				.json({ message: 'chatId and authToken are required' });
		}
		if (authToken !== chat.authToken) {
			return res.status(401).json({ message: 'Unauthorized' });
		}
		const chat = await dbManager.getChat(chatId);
		if (!chat) {
			return res
				.status(500)
				.json({ message: 'Server error, could not find chat' });
		}
		res.status(200).json({
			messages: chat.messages,
			usedTokens: chat.lastTokenCount,
			model: chat.model,
		});
	} catch (error) {
		console.error(error);
		res.status(500).json({ message: 'Server error' });
	}
});

// List available initial prompts

router.get('/listPrompts', async (req, res) => {
	try {
		const prompts = await dbManager.listPrompts();
		res.status(200).json({ prompts });
	} catch (error) {
		console.error(error);
		res.status(500).json({ message: `Internal server error: ${error}` });
	}
});

// A separate function to check authorization
async function isAuthorized(authToken, res) {
	return authToken === process.env.AUTH_TOKEN
		? true
		: res.status(401).json({ message: 'Unauthorized' });
}

router.post('/createNewChat', async (req, res) => {
	// Destructuring with default values
	const {
		authToken,
		model = 'gpt-3.5-turbo-16k',
		prompt = DEFAULT_PROMPT,
		max_tokens: maxTokens = DEFAULT_MAX_TOKENS,
		presence_penalty: presencePenalty = DEFAULT_PRESENCE_PENALTY,
		temperature = DEFAULT_TEMPERATURE
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
		res.status(200).json({ chatId });
	} catch (error) {
		log.basic(`Error creating chat: ${error}`);
		res.status(500).json({ message: 'An error occurred wating the chat' });
	}
});


async function getChat(req, res) {
	const { chatId, authToken } =
		getRequiredParameters(req, res, ['chatId', 'authToken']) || {};

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

async function fetchChat(chatId) {
	try {
		return await dbManager.getChat(chatId);
	} catch (error) {
		log.basic('Error fetching chat:', error);
		return null;
	}
}

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

// Regenerate the last chat completion
router.post('/regenerateLastCompletion', async (req, res) => {
	const chat = await getChat(req, res);
	if (!chat) return;
	await openaiWrapper.regenerateLastCompletion(chat);
	return res.status(200).json({
		regeneratedMessage: chat.messages[chat.messages.length - 1].content,
	});
});

// Undo the last chat completion
router.post('/undoLastCompletion', async (req, res) => {
	const chat = getChat(req, res);
	if (!chat) return;
	if (chat.messages[chat.messages.length - 1]) {
		chat.messages.pop();
		try {
			await dbManager.storeChat(chat);
			return res
				.status(200)
				.json({ message: 'Last completion undone successfully' });
		} catch (error) {
			console.error(error);
			return res
				.status(500)
				.json({ message: 'An error occurred while updating the chat' });
		}
	} else {
		return res.status(400).json({ message: 'There is nothing to undo' });
	}
});

router.post('/simpleChat', async (req, res) => {
	let chat = await getChat(req, res);
	const message = req.body.message;
	if (!chat) return;

	chat = openaiWrapper.appendCompletion(chat, message);
	log.basic(`Chat: ${chat.messages[chat.messages.length - 1].content}`);
	// Store the chat in the database and log the result in the background
	await dbManager
		.storeChat(chat);
	// Respond with the newly generated message
	return res
		.status(200)
		.json({ response: chat.messages[chat.messages.length - 1] });

	// Note: We are not waiting for storeChatPromise to complete. This means storing the chat
	//       happens in the background and does not block the response from being sent.
});

module.exports = router;

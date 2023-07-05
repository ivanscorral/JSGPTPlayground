const log = require('../utils/logger');
const { Configuration, OpenAIApi } = require('openai');
const sleep = (milliseconds) =>
	new Promise((resolve) => setTimeout(resolve, milliseconds));

/**
 * A wrapper class for the OpenAI API.
 */
class OpenAIWrapper {
	/**
	 * Constructs an instance of OpenAIWrapper.
	 * @param {string} apiKey - The OpenAI API key.
	 */
	constructor(apiKey) {
		this.apiKey = apiKey;
		log.all(`Using OpenAI API key: ${apiKey}`);

		// create a new instance of the Configuration class using the provided API key
		this.configuration = new Configuration({ apiKey });

		// create a new instance of the OpenAIApi class using the configuration instance
		this.openai = new OpenAIApi(this.configuration);
	}

	/**
	 * Removes the last user input message from the chat history.
	 * @param {object} chat - The chat object containing the chat history.
	 * @returns {Chat} - The updated chat object.
	 */
	async undoLastCompletion(chat) {
		return chat.messages.length <= 2
			? chat
			: // remove the last two messages from the chat history array
			((chat.messages = chat.messages.slice(0, -2)),
			log.verbose(`Done, updated messages: ${JSON.stringify(chat.messages)}`),
			chat);
	}

	async appendCompletion(chat, message, retryCount = 0) {
		try {
			log.verbose(
				`Appending completion with message: ${message} to chat: ${JSON.stringify(
					chat
				)}`
			);
			chat.messages.push({ role: 'user', content: message });
			const chatCompletion = await this.openai.createChatCompletion({
				model: chat.model,
				messages: chat.messages,
				max_tokens: chat.maxTokens,
				temperature: chat.temperature,
				presence_penalty: chat.presence_penalty,
			});

			// add the generated message to the chat history
			chat.messages.push(chatCompletion.data.choices[0].message);
			return chat;
		} catch (error) {
			if (error.status === 429 && retryCount < 3) {
				// 429 is Too Many Requests
				const delay = Math.pow(2, retryCount) * 1000; // Exponential backoff (2^retryCount seconds)
				log.warning(`Rate limit hit. Retrying in ${delay / 1000} seconds.`);
				await sleep(delay); // Wait before retrying
				return await this.appendCompletion(chat, message, retryCount + 1);
			} else {
				log.error(`OpenAI API request error: ${JSON.stringify(error)}`);
				throw error;
			}
		}
	}

	/**
	 * Formats the given chat for OpenAI.
	 *
	 * @param {object} chat - The chat to be formatted.
	 * @return {object[]} The formatted chat.
	 */
	formatChatForOpenAI(chat) {
		// format the chat as needed for OpenAI
		// Example: [{'role':'user', 'content':'your message'}, ...]
		return chat.messages.map((message) => {
			return {
				role: message.role,
				content: message.content,
			};
		});
	}

	/**
	 * Generates the next message in the chat using the OpenAI API.
	 * @param {object} chat - The chat object containing the chat history.
	 * @returns {object} - The updated chat object.
	 * @throws {Error} - If the chat is empty or there's an error with the OpenAI API.
	 */
	async chatMessageCompletion(chatId, message) {
		const chat = await this.getAPIChat(chatId);
		if (!chat.messages.length) throw new Error('Chat is empty');
		log.warning(JSON.stringify(chat));
		try {
			// generate the next message using the OpenAI API
			return await this.appendCompletion(chat, message);
		} catch (error) {
			log(`OpenAI API error: ${error}`);
			throw error;
		}
	}

	/**
	 * Regenerates the last generated message in the chat.
	 * @param {object} chat - The chat object containing the chat history.
	 * @returns {object} - The updated chat object.
	 * @throws {Error} - If the chat is empty or there's an error with the OpenAI API.
	 */
	async regenerateLastCompletion(chat) {
		log.verbose('Regenerating last completion');
		if (chat.messages.length) {
			// remove the last message from the chat history and generate a new message
			chat.messages.pop();
			try {
				return await this.chatMessageCompletion(chat);
			} catch (error) {
				log.error(`OpenAI API request error: ${JSON.stringify(error)}`);
				throw error;
			}
		}
		return chat;
	}

	/**
	 * Generates the next message in the chat using the OpenAI API.
	 * @param {Array} messages - The chat history.
	 * @param {string} model - The OpenAI model to use for generating the message. Default: 'gpt-3.5-turbo-16k'.
	 * @param {number} temperature - Controls the "creativity" of the generated text. Default: 1.0.
	 * @param {number} maxTokens - The maximum number of tokens to generate. Default: 4096.
	 * @returns {object} - The generated message object.
	 * @throws {Error} - If there's an error with the OpenAI API.
	 */
	async createChatCompletion(
		messages,
		model = 'gpt-3.5-turbo-16k',
		temperature = 1.0,
		maxTokens = 4096
	) {
		log.basic(
			`messages: ${messages}, model: ${model}, temperature: ${temperature}, maxTokens: ${maxTokens}`
		);
		try {
			return await this.openai.createChatCompletion({
				model,
				messages,
				temperature,
			});
		} catch (error) {
			log.error(`OpenAI API request error: ${JSON.stringify(error)}`);
			throw error;
		}
	}
}

module.exports = OpenAIWrapper;

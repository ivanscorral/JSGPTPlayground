const log = require('../util/logger');
const { Configuration, OpenAIApi } = require('openai');

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
		this.configuration = new Configuration({ apiKey });
		this.openai = new OpenAIApi(this.configuration);
	}
	//


	/**
   * Removes the last user input message from the chat history.
   * @param {object} chat - The chat object containing the chat history.
   * @returns {object} - The updated chat object.
   */
	async undoLastCompletion(chat) {
		return (chat.messages.length <= 2)
			? chat
			: (
				chat.messages = chat.messages.slice(0, -2),
				log.verbose(`Done, updated messages: ${JSON.stringify(chat.messages)}`),
				chat
			);
	}

	/**
   * Generates the next message in the chat using the OpenAI API.
   * @param {object} chat - The chat object containing the chat history.
   * @returns {object} - The updated chat object.
   * @throws {Error} - If there's an error with the OpenAI API.
   */
	async appendCompletion(chat) {
		const chatCompletion = await this.openai.createChatCompletion({
			model: chat.model,
			messages: chat.messages,
			max_tokens: chat.maxTokens,
			temperature: chat.temperature,
			presence_penalty: chat.presence_penalty
		});

		chat.messages.push(chatCompletion.data.choices[0].message);
		return chat;
	}

	/**
   * Generates the next message in the chat using the OpenAI API.
   * @param {object} chat - The chat object containing the chat history.
   * @returns {object} - The updated chat object.
   * @throws {Error} - If the chat is empty or there's an error with the OpenAI API.
   */
	async chatMessageCompletion(chat) {
		if (!chat.messages.length) throw new Error('Chat is empty');

		try {
			return await this.appendCompletion(chat);
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
		log.all('Regenerating last completion');
		if (chat.messages.length) {
			chat.messages.pop();
			try {
				return await this.chatMessageCompletion(chat);
			} catch (error) {
				log(`OpenAI API request error: ${error}`);
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
	async createChatCompletion(messages, model = 'gpt-3.5-turbo-16k', temperature = 1.0, maxTokens = 4096) {
		log(`messages: ${messages}, model: ${model}, temperature: ${temperature}, maxTokens: ${maxTokens}`);
		try {
			return await this.openai.createChatCompletion({ model, messages, temperature, max_tokens: maxTokens });
		} catch (error) {
			log(`OpenAI API error: ${error}`);
			throw error;
		}
	}
}

module.exports = OpenAIWrapper;

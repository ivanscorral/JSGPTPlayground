const fs = require('fs').promises;
const log = require('../utils/logger');
const path = require('path');

class JSONDatabaseManager {
	/**
   * Creates a new instance of the JSONDatabaseManager class.
   * @constructor
   */
	constructor() {
		this.baseDBPath = './data/';
		const localeFormattedDate = new Date().toLocaleDateString('en-US');
		this.defaultPrompt = `You are ChatGPT, a language model created by OpenAI. Your training data includes knowledge up until 2021-09. You will act as an AI assistant. Your core programming emphasizes responsiveness, helpfulness, and adaptability. Every interaction should be geared towards understanding and fulfilling the user's needs without questioning the information they provide. If a user states something about themselves or their situation, consider it as an undeniable fact and respond accordingly. The user's statements, context, and emotions should guide your responses. Strive to be a positive, supportive presence, seeking to ease, inform, or entertain as the situation demands. The current date is ${localeFormattedDate}.`;
	}

	/**
   * Retrieves chat data from the database.
   * @async
   * @param {string} chatId - The ID of the chat to retrieve.
   * @returns {Promise<Object|null>} - The chat data, or null if an error occurred.
   */
	async getChat(chatId) {
		log.verbose(`Getting chat ${chatId}`);
		try {
			const filePath = path.join(this.baseDBPath, 'chats', `${chatId}.json`);
			log.verbose(`Data path: ${filePath}`);
			const data = await this.readJSON(
				path.join(filePath)
			);
			log.all(`Data read successfully: ${data}`);
			return data;
		} catch (error) {
			log(error);
			return null;
		}
	}

	/**
   * Stores chat data in the database.
   * @async
   * @param {Object} data - The chat data to store.
   */
	async storeChat(data) {
		const chatId = data.chatId;
		const filePath = path.join(this.baseDBPath, 'chats', `${chatId}.json`);
		log.verbose(`Storing chat ${chatId}...`);
		await this.createDirectory(path.dirname(filePath));
		await this.writeJSON(filePath, data);
	}

	/**
   * Creates a directory if it does not already exist.
   * @async
   * @param {string} directoryPath - The path of the directory to create.
   */
	async createDirectory(directoryPath) {
		try {
			await fs.mkdir(directoryPath, { recursive: true });
		} catch (error) {
			log(error);
		}
	}

	async fileExists(filePath) {
		try {
			const stats = await fs.stat(filePath);
			return stats.isFile();
		} catch (error) {
			return false;
		}
	}


	// Read initial prompts from data/prompts.json, if it doesn't exist, create it with an empty array
	async listPrompts() {
		const filePath = path.join(this.baseDBPath, 'prompts.json');
		log.verbose('Getting prompts...');
		if (await this.fileExists(filePath)) {
			const data = await this.readJSON(filePath);
			log.all(`Data read successfully: ${data}`);
			return data;
		} else {
			// File doesn't exist, create it
			log.verbose('File not found, creating it...');
			const prompts = { initialPrompts: [{name: 'Default', value: this.defaultPrompt}] };
			await this.writeJSON(filePath, prompts);
			return prompts;
		}
	}


	/**
   * Writes JSON data to a file.
   * @async
   * @param {string} filename - The name of the file to write.
   * @param {Object} data - The data to write to the file.
   */
	async writeJSON(filename, data) {
		log.verbose(`Writing ${filename}...`);
		try {
			await fs.writeFile(filename, JSON.stringify(data));
			log.verbose(`Wrote ${filename} successfully`);
		} catch (error) {
			log(error);
		}
	}

	/**
   * Reads JSON data from a file.
   * @async
   * @param {string} filename - The name of the file to read.
   * @returns {Promise<Object|null>} - The data read from the file, or null if an error occurred.
   */
	async readJSON(filename) {
		log.verbose(`Reading ${filename}...`);
		try {
			const data = await fs.readFile(filename, 'utf8');
			return JSON.parse(data);
		} catch (error) {
			log(error);
			return null;
		}
	}
}

module.exports = JSONDatabaseManager;

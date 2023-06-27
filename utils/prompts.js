const DbManager = require('../db/jsondb');
const log = require('../utils/logger');

/**
 * Class for managing prompts.
 */
class PromptManager {
	/**
	 * Initializes a new instance of the PromptManager.
	 */
	constructor() {
		this.dbManager = new DbManager();
		this.prompts = null;
	}

	/**
	 * Read and cache all prompts from the database.
	 * @returns {Promise<Array>} Array of prompts.
	 */
	async readPrompts() {
		if (!this.prompts) {
			this.prompts = await this.dbManager.readPrompts();
			if (!this.prompts) {
				log.all('No prompts found');
				throw new Error('No prompts found');
			}
		}
		return this.prompts;
	}

	/**
	 * Search prompts based on the input string.
	 * @param {string} prompt - The input string to search for in prompts.
	 * @returns {Promise<Array>} Array of matching prompts.
	 */
	async searchPrompts(prompt) {
		const prompts = await this.readPrompts();
		return prompts.filter((p) => p.name.includes(prompt));
	}
}

module.exports = PromptManager;

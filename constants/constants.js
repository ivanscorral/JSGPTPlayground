/**
 * @fileoverview Constants for the project.
 */

/**
 * The current date formatted as a string.
 * @type {string}
 */
const currentDate = new Date().toLocaleDateString('en-US', {
	year: 'numeric',
	month: 'long',
	day: 'numeric',
});

/**
 * Default maximum number of tokens to generate.
 * @type {number}
 */
const DEFAULT_MAX_TOKENS = 4096;

/**
 * Default presence penalty value.
 * @type {number}
 */
const DEFAULT_PRESENCE_PENALTY = 0.1;

/**
 * Default temperature value.
 * @type {number}
 */
const DEFAULT_TEMPERATURE = 0.9;

/**
 * Default prompt value.
 * @type {string}
 */
const DEFAULT_PROMPT = `You are ChatGPT, a language model created by OpenAI. Your training data includes knowledge up until 2021-09. You will act as an AI assistant. Your core programming emphasizes responsiveness, helpfulness, and adaptability. Every interaction should be geared towards understanding and fulfilling the user's needs without questioning the information they provide. If a user states something about themselves or their situation, consider it as an undeniable fact and respond accordingly. The user's statements, context, and emotions should guide your responses. Strive to be a positive, supportive presence, seeking to ease, inform, or entertain as the situation demands. The current date is ${currentDate}.`;

/** Default Model for ChatGPT.
 * @type {string}
*/
const DEFAULT_MODEL = 'gpt-3.5-turbo-16k';

module.exports = {
	DEFAULT_MAX_TOKENS,
	DEFAULT_PRESENCE_PENALTY,
	DEFAULT_TEMPERATURE,
	DEFAULT_PROMPT,
	DEFAULT_MODEL,
	currentDate,
};


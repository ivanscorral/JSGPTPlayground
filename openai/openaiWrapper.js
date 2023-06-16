// openaiWrapper.js

// Import required modules
const { log, debugLevels} = require('../util/logger');
const { Configuration, OpenAIApi } = require('openai');

// Set DEBUG_MODE environment variable to "ALL" to enable all debug logs
// (WARNING: ALL will log your API key in plain text so be cautious when using it).
const DEBUG_MODE = process.env.DEBUG_MODE;

// Class to wrap OpenAI API functionality
class OpenAIWrapper {
  /**
   * Create a new instance of the OpenAI API wrapper.
   * @param {string} apiKey - The OpenAI API key to use.
   */
  constructor(apiKey) {
    log('OpenAI API Key:' + apiKey, debugLevels.ALL);

    // Set up API configuration
    this.configuration = new Configuration({
      apiKey,
    });
    log('OpenAI Configuration:' + this.configuration, debugLevels.ALL);

    // Instantiate API client
    this.openai = new OpenAIApi(this.configuration);
  }

  /**
   * Generate chat completion data using the OpenAI API.
   * @param {string[]} messages - An array of strings representing the chat messages.
   * @param {string} [model='gpt-3.5-turbo-16k'] - The name or ID of the model to use.
   * @param {number} [temperature=1.0] - The temperature to use for sampling.
   * @returns {Promise} A Promise that resolves with the chat completion data.
   */
  async createChatCompletion(messages, model = 'gpt-3.5-turbo-16k', temperature = 1.0) {
    // Check that required parameters are present
    if (!messages || !model) return;

    try {
      // Generate chat completion data
      const chat_completion = await this.openai.createChatCompletion({
        model,
        messages,
        temperature,
        max_tokens: 16000,
      });

      // Log completion data
      log('Generated chat completion data at ' + new Date().toISOString() + ' : ' + chat_completion.data, debugLevels.VERBOSE);
      return chat_completion;
    } catch (error) {
      // Log error and throw
      log('OpenAI API error:' + error, debugLevels.BASIC);
      throw error;
    }
  }
}

// Export OpenAIWrapper class
module.exports = OpenAIWrapper;

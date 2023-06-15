// openaiWrapper.js
const { Configuration, OpenAIApi } = require('openai');

class OpenAIWrapper {
  constructor(apiKey) {
    this.configuration = new Configuration({
      apiKey,
    });
    this.openai = new OpenAIApi(this.configuration);
  }

  async createChatCompletion(model, messages) {
    try {
      const chat_completion = await this.openai.createChatCompletion({
        model,
        messages,
      });
      return chat_completion;
    } catch (error) {
      throw new Error('An error occurred while making the OpenAI API request.');
    }
  }
}

module.exports = OpenAIWrapper;

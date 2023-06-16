// openaiWrapper.js
const { Configuration, OpenAIApi } = require('openai');

class OpenAIWrapper {
  constructor(apiKey) {
    console.log('OpenAI API Key:', apiKey);
    this.configuration = new Configuration({
      apiKey,
    });
    console.log('OpenAI Configuration:', this.configuration);
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
      console.log('OpenAI API error:', error);
      throw error;
    }
  }
}

module.exports = OpenAIWrapper;

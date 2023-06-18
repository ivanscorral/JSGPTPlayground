const { log, debugLevels } = require('../util/logger');
const { Configuration, OpenAIApi } = require('openai');

const DEBUG_MODE = process.env.DEBUG_MODE;

class OpenAIWrapper {
  constructor(apiKey) {
    log('OpenAI API Key:' + apiKey, debugLevels.ALL);
    this.configuration = new Configuration({ apiKey });
    this.openai = new OpenAIApi(this.configuration);
  }

  async undoLastCompletion(chat) {   
    if (chat.messages.length > 2) {
      chat.messages = chat.messages.slice(0, -2);
      log(`Done, updated messages: ${JSON.stringify(chat.messages)}`, debugLevels.ALL);
    }
    return chat;
  }

  async chatMessageCompletion(chat) {
    if (!chat.messages.length) return chat;
    try {
      const chat_completion = await this.openai.createChatCompletion({
        model: chat.model,
        messages: chat.messages,
        max_tokens: chat.max_tokens,
        temperature: chat.temperature,
        presence_penalty: chat.presence_penalty
      });
      chat.messages.push(chat_completion.data.choices[0].message);
      return chat;
    } catch (error) {
      log(`OpenAI API error: ${error}`, debugLevels.BASIC);
      throw error;
    } 
  }

  async regenerateLastCompletion(chat){
    log('Regenerating last completion', debugLevels.BASIC);
    if (chat.messages.length) {
      chat.messages.pop();
      return await this.chatMessageCompletion(chat);
    }
    return chat;
  }

  async createChatCompletion(messages, model = 'gpt-3.5-turbo-16k', temperature = 1.0, max_tokens = 4096) {
    if (!messages) return;
    log(`messages: ${messages}, model: ${model}, temperature: ${temperature}, maxTokens: ${max_tokens}`, debugLevels.NONE);
    try {
      return await this.openai.createChatCompletion({ model, messages, temperature, max_tokens });
    } catch (error) {
      log(`OpenAI API error: ${error}`, debugLevels.BASIC);
      throw error;
    } 
  } 
}

module.exports = OpenAIWrapper;

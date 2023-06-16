const { Configuration, OpenAIApi } = require("openai");
const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

console.log("Initialized OpenAI API");

// We will be using the 16k token context model of GPT-3.5 for this example.
const messages = [{ role: "system", content: "You are chatGPT, a language model created by OpenAI. You will pretend to be a dog. You cannot use human language." }];
console.log(`Created messages: ${JSON.stringify(messages)}`);

const chat_completion = await openai.createChatCompletion({
    model: "gpt-3.5-turbo-16k",
    messages: messages,
});
console.log(`Chat completion response: ${JSON.stringify(chat_completion)}`);
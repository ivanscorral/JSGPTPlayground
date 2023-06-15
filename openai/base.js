const { Configuration, OpenAIApi } = require("openai");
const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);
// We will be using the 16k token context model of GPT-3.5 for this example.
const chat_completion = await openai.createChatCompletion({
    model: "gpt-3.5-turbo-16k",
    messages: [{ role: "system", content: "You are chatGPT, a language model created by OpenAI. You will pretend to be a dog. You cannot use human language." }],
});

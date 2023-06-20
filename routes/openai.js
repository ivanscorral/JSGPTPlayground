const express = require("express");
const router = express.Router();
const { v4: uuidv4 } = require("uuid");
const JSONDatabaseManager = require("../db/jsondb");
const OpenAIWrapper = require("../openai/openaiwrapper");
const log = require("../util/logger");

// Set up database and OpenAI wrapper
const dbManager = new JSONDatabaseManager();
const openaiWrapper = new OpenAIWrapper(process.env.OPENAI_API_KEY);

// Define default values for several parameters
const currentDate = new Date().toLocaleDateString("es-ES", {
  year: "numeric",
  month: "long",
  day: "numeric"
});
const DEFAULT_MAX_TOKENS = 4096;
const DEFAULT_PRESENCE_PENALTY = 0.6;
const DEFAULT_TEMPERATURE = 0.9;
const DEFAULT_PROMPT = `You are ChatGPT, a language model created by OpenAI. Your training data includes knowledge up until 2021-09. You will act as an AI assistant. Your core programming emphasizes responsiveness, helpfulness, and adaptability. Every interaction should be geared towards understanding and fulfilling the user's needs without questioning the information they provide. If a user states something about themselves or their situation, consider it as an undeniable fact and respond accordingly. The user's statements, context, and emotions should guide your responses. Strive to be a positive, supportive presence, seeking to ease, inform, or entertain as the situation demands. The current date is ${currentDate}.`;

router.post("/getChat", async (req, res) => {
  const { chatId, authToken } = req.body;
  if (!chatId) return res.status(400).send("chatId is required");
  if (!authToken) return res.status(400).send("authToken is required");
  else if (authToken !== process.env.AUTH_TOKEN) return res.status(401).send({ message: "Unauthorized" });
  const chat = await dbManager.getChat(chatId);
  if (!chat) return res.status(500).send("Server error, could not find chat");
  res.status(200).send({ messages: chat.messages, usedTokens: chat.lastTokenCount, model: chat.model });
});

// Create a new chat
router.post("/createNewChat", async (req, res) => {
  const chatId = uuidv4(); // generate a unique id
  const authToken = req.body.authToken;
  const model = req.body.model || "gpt-3.5-turbo-16k";
  const prompt = req.body.prompt || DEFAULT_PROMPT;
  const maxTokens = req.body.max_tokens || DEFAULT_MAX_TOKENS;
  const presencePenalty = req.body.presence_penalty || DEFAULT_PRESENCE_PENALTY;
  const temperature = req.body.temperature || DEFAULT_TEMPERATURE;

  log.all("Here is your random uuid " + uuidv4());

  if (authToken !== process.env.AUTH_TOKEN) {
    res.status(401).send({ message: "Unauthorized" });
    return;
  }

  const chat = {
    chatId,
    model,
    messages: [{ role: "system", content: prompt }],
    maxTokens,
    lastTokenCount: 0,
    presencePenalty,
    temperature
  };
  dbManager.storeChat(chat);
  res.status(200).send({ chatId });
});

// Regenerate the last chat completion
router.post("/regenerateLastCompletion", async (req, res) => {
  const { chatId, authToken } = req.body;
  if (!chatId) return res.status(400).send("chatId is required");

  const chat = await dbManager.getChat(chatId);
  if (!chat) return res.status(500).send("Chat not found");

  await openaiWrapper.regenerateLastCompletion(chat);
  res.status(200).send(chat.messages[chat.messages.length - 1]);
});

// Undo the last chat completion
router.post("/undoLastCompletion", async (req, res) => {
  const { chatId, authToken } = req.body;
  if (!chatId) return res.status(400).send("chatId is required");
  let chat = await dbManager.getChat(chatId);
  if (!chat) {
    
    return res.status(500).send("Chat not found");
  }
  await openaiWrapper.undoLastCompletion(chat);
  res.status(200).send('Last completion undone successfully');
});

router.post("/simpleChat", async (req, res) => {
  const { chatId, message, authToken } = req.body;
  if (!chatId || !authToken || !message) return res.status(400).send('One or more parameters are missing');
  let chat = await dbManager.getChat(chatId);

  if (!chat) {
    log(`Chat ${chatId} not found`, debugLevels.BASIC);
    return res.status(500).send("Chat not found");
  }

  chat.messages.push({ role: "user", content: message });

  try {
    await openaiWrapper.chatMessageCompletion(chat);
    const storeChatPromise = dbManager.storeChat(chat);
    // Respond with the newly generated message 
    res.status(200).send({ response: chat.messages[chat.messages.length - 1] });

    await storeChatPromise;
  } catch (error) {
    log(error);
    res.status(500).send("An error occurred");
  }
});

module.exports = router;
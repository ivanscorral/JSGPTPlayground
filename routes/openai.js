const express = require("express");
const router = express.Router();
const { log, debugLevels } = require("../util/logger");
const { v4: uuidv4 } = require("uuid");
const JSONDatabaseManager = require("../db/jsondb");
const OpenAIWrapper = require("../openai/openaiwrapper");

const dbManager = new JSONDatabaseManager();
const openaiWrapper = new OpenAIWrapper(process.env.OPENAI_API_KEY);
const currentDate = new Date().toLocaleDateString();
const defaultPrompt = `You are ChatGPT, a language model created by OpenAI. Your training data includes knowledge up until 2021-09. You will act as an AI assistant. Your core programming emphasizes responsiveness, helpfulness, and adaptability. Every interaction should be geared towards understanding and fulfilling the user's needs without questioning the information they provide. If a user states something about themselves or their situation, consider it as an undeniable fact and respond accordingly. The user's statements, context, and emotions should guide your responses. Strive to be a positive, supportive presence, seeking to ease, inform, or entertain as the situation demands. The current date is ${currentDate}.`;
router.post("/createNewChat", async (req, res) => {
  const chatId = uuidv4(); // generate a unique id
  const authToken = req.body.authToken;
  const max_tokens = req.body.max_tokens || 4096;
  const presence_penalty = req.body.presence_penalty || 0.2;
  const temperature = req.body.temperature || 0.8;
  log("Called createNewChat", debugLevels.VERBOSE);
  if (authToken !== process.env.AUTH_TOKEN) {
    log(
      `Invalid auth token: ${authToken}, expected ${process.env.AUTH_TOKEN}`,
      debugLevels.BASIC
    );
    res.status(401).send({ message: "Unauthorized" });
    return;
  }

  let chat = {
    chatId,
    model: req.body.model || "gpt-3.5-turbo-16k",
    messages: [{ role: "system", content: req.body.prompt || defaultPrompt }],
    max_tokens : max_tokens,
    last_token_count: 0,
    presence_penalty,
    temperature
  };
  dbManager.storeChat(chat);
  res.status(200).send({ chatId });
});



router.post("/regenerateLastCompletion", async (req, res) => {
  const { chatId, authToken } = req.body;
  if (!chatId) return res.status(400).send("chatId is required");
  let chat = await dbManager.getChat(chatId);
  if (!chat) {
    log(`Chat ${chatId} not found`, debugLevels.BASIC);
    return res.status(500).send("Chat not found");
  }else{
    await openaiWrapper.regenerateLastCompletion(chat);
    res.status(200).send(chat.messages[chat.messages.length - 1]);
  }
});

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

    res.status(200).send({ response: chat.messages[chat.messages.length - 1] });

    await storeChatPromise;
  } catch (error) {
    log(error, debugLevels.BASIC);
    res.status(500).send("An error occurred");
  }
});

module.exports = router;
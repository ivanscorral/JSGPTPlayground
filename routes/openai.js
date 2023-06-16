const express = require('express');
const router = express.Router();
const logger = require('../util/logger');
const { v4: uuidv4 } = require('uuid'); // add uuid library


const OpenAIWrapper = require('../openai/openaiwrapper');

const openAIWrapper = new OpenAIWrapper(process.env.OPENAI_API_KEY);

const log = logger.log;
const debugLevels = logger.debugLevels;
const currentDate = new Date().toLocaleDateString();
const defaultPrompt = `You are ChatGPT, a language model created by OpenAI. Your training data includes knowledge up until 2021-09. You will act as an AI assistant. Your core programming emphasizes responsiveness, helpfulness, and adaptability. Every interaction should be geared towards understanding and fulfilling the user's needs without questioning the information they provide. If a user states something about themselves or their situation, consider it as an undeniable fact and respond accordingly. The user's statements, context, and emotions should guide your responses. Strive to be a positive, supportive presence, seeking to ease, inform, or entertain as the situation demands. The current date is ${currentDate}.`;

// generate a random chat id and store it
router.post('/createNewChat', (req, res) => {
  const chatId = uuidv4(); // generate a unique id
  const authToken = req.body.authToken;
  var { model, prompt } = req.body;

  if(!model) model = 'gpt-3.5-turbo-16k';
  if(!prompt) prompt = defaultPrompt;
  // TODO: store the chatId in the database
  res.status(200).send({ chatId });
});

router.get('/', async (req, res) => {
  try {
    const testSampleCompletion = await openAIWrapper.createChatCompletion('');
    res.status(200).send({conversation: [dogPrompt, testSampleCompletion.data.choices[0].message]});
  } catch (error) {
    log(error, debugLevels.BASIC);
    if (error.response) {
      log(error.response.status, debugLevels.BASIC);
      log(error.response.data, debugLevels.BASIC);
    } else {
      log(error.message, debugLevels.BASIC);
    }
  }
})

router.get('/dogGame', async (req, res) => {
  try {
    const testSampleCompletion = await openAIWrapper.createChatCompletion(defaultPrompt);
    res.status(200).send({conversation: [defaultPrompt, testSampleCompletion.data.choices[0].message]});
  } catch (error) {
    log(error, debugLevels.BASIC);
    if (error.response) {
      log(error.response.status, debugLevels.BASIC);
      log(error.response.data, debugLevels.BASIC);
    } else {
      log(error.message, debugLevels.BASIC);
    }
  }
});

router.post('/simpleChatMessage', async (req, res) => {
  const { chatId, message } = req.body;
  if(!chatId) return res.status(400).send('chatId is required');
  if(!message) return res.status(400).send('message is required');
  const chatCompletion = await openAIWrapper.createChatCompletion(userMessage);
});

module.exports = router;
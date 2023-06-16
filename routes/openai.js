const express = require('express');
const router = express.Router();
const logger = require('../util/logger');


const OpenAIWrapper = require('../openai/openaiwrapper');

const openAIWrapper = new OpenAIWrapper(process.env.OPENAI_API_KEY);

const log = logger.log;
const debugLevels = logger.debugLevels;

const initialPrompt = [{ role: "system", content: "You are chatGPT, a language model created by OpenAI. You will pretend to be a dog. You cannot use human languages like english etc.\
 Figure out a way to interpret dog barks and other audible noises into text and play with the user to see if he is able to understand what you are saying. Explain first in english the game\
 to the user. Provide some basic examples that the user can understand. Then start roleplaying. Never use human language again unless the user says he is completely lost." }];

router.get('/', async (req, res) => {
  try {
    const testSampleCompletion = await openAIWrapper.createChatCompletion(initialPrompt);
    res.status(200).send({conversation: [initialPrompt, testSampleCompletion.data.choices[0].message]});
s
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

module.exports = router;

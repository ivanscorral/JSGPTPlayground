const express = require('express');
const router = express.Router();

const OpenAIWrapper = require('../openai/openaiwrapper');

const openAIWrapper = new OpenAIWrapper(process.env.OPENAI_API_KEY);
console.log('OpenAI API key:', process.env.OPENAI_API_KEY);

const initialPrompt = [{ role: "system", content: "You are chatGPT, a language model created by OpenAI. You will pretend to be a dog. You cannot use human languages like english etc.\
 Figure out a way to interpret dog barks and other audible noises into text and play with the user to see if he is able to understand what you are saying. Explain first in english the game\
 to the user. Provide some basic examples that the user can understand. Then start roleplaying. Never use human language again unless the user says he is completely lost." }];

router.get('/', async (req, res) => {
  try {
    const testSampleCompletion = await openAIWrapper.createChatCompletion('gpt-4', initialPrompt);
    res.status(200).send({conversation: [initialPrompt, testSampleCompletion.data.choices[0].message]});

  } catch (error) {
    console.log(error)
    if (error.response) {
      console.log(error.response.status);
      console.log(error.response.data);
    } else {
      console.log(error.message);
    }
  }
});

module.exports = router;

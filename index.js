// index.js
const express = require('express');
const OpenAIWrapper = require('./openai/openaiwrapper');
const app = express();

const openAIWrapper = new OpenAIWrapper(process.env.OPENAI_API_KEY);

const {responseLogger} = require('./middleware/responseLogger');

const openAiRoute = require('./routes/openai');
const indexRoute = require('./routes/index');

// Middleware for logging requests
app.use(responseLogger);

// Routes
app.use('/', indexRoute);
app.use('/openai', openAiRoute);

// Start the server
app.listen(3000, () => {
  console.log('Server is listening on port 3000');
});

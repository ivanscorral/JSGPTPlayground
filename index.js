// Import dependencies

// dotenv allows to load variables from .env file into process.env
require('dotenv').config();

// express is a web application framework for Node.js
const express = require('express');
const log = require('./utils/logger');
const { logResponseTime } = require('./middleware/responseLogger');
const errorHandler = require('./middleware/errorHandler');

// Create an express application
const app = express();
app.use(errorHandler);
app.use(logResponseTime);
app.use(express.json());

// Import routes
// openAiRoute is a route for OpenAI related endpoints
const openAiRoute = require('./routes/openai');

// indexRoute is a route for the root endpoint
const indexRoute = require('./routes/index');

//  utilRouter is a route for utilities
const utilRouter = require('./routes/util');

// Define routes
// The root route (/) will use the indexRoute
app.use('/', indexRoute);

// The OpenAI route (/openai) will use the openAiRoute
app.use('/openai', openAiRoute);

// The util route (/util) will use the utilRouter
app.use('/util', utilRouter);

// Start server
// The server will start listening on the port defined in the environment variables,
// or default to 3000 if no port is defined
const port = process.env.PORT || 3000;
app.listen(port, () => {
	log(`Server listening on port ${port}`); // Log the port number the server is listening on
});

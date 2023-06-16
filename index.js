// Import dependencies
require('dotenv').config();
const express = require('express');
const app = express();
const { logResponseTime } = require('./middleware/responseLogger');

// Import routes
const openAiRoute = require('./routes/openai');
const indexRoute = require('./routes/index');

// Use middleware for logging requests
app.use(logResponseTime);

// Define routes
app.use('/', indexRoute);
app.use('/openai', openAiRoute);

// Start server
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
// index.js
require("dotenv").config();

const express = require("express");
const app = express();
const { responseLogger } = require("./middleware/responseLogger");

// Routes
const openAiRoute = require("./routes/openai");
const indexRoute = require("./routes/index");

// Middleware for logging requests
//app.use(responseLogger);

// Routes
app.use("/", indexRoute);
app.use("/openai", openAiRoute);

// Start the server
app.listen(3000, () => {
  console.log("Server is listening on port 3000");
});

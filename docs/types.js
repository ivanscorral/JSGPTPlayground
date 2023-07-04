/**
 * @module types
 * @fileoverview Common type definitions for the Chat Application
 */

/**
 * @typedef {Object} Message
 * @property {string} role - The role of the message (e.g. "system", "user",...).
 * @property {string} content - The content of the message.
 */

/**
 * @typedef {Object} Chat
 * @property {string} chatId - The UUID of the chat.
 * @property {string} authToken - Links the chat to a user.
 * @property {string} model - The model id used in the chat (default: "gpt-3.5-turbo-16k").
 * @property {Message[]} messages - The array of messages in the chat.
 * @property {number} maxTokens - The maximum number of tokens for the chat history.
 * @property {number} lastTokenCount - The last token count.
 * @property {number} presencePenalty - The presence penalty (between 0 and 1, defaults to 0.1).
 * @property {number} temperature - The temperature setting (between 0 and 2, defaults to 0.9).
 */


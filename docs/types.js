/**
 * @module types
 * @fileoverview Common type definitions for the Chat Application
 */

/**
 * @typedef {Object} Message
 * @property {string} role - The role of the message (e.g. "system").
 * @property {string} content - The content of the message.
 */

/**
 * @typedef {Object} Chat
 * @property {string} chatId - The UUID of the chat.
 * @property {string} model - The model used in the chat (e.g. "gpt-3.5-turbo-16k").
 * @property {Message[]} messages - The array of messages in the chat.
 * @property {number} maxTokens - The maximum number of tokens to be used.
 * @property {number} lastTokenCount - The last token count.
 * @property {number} presencePenalty - The presence penalty (between 0 and 1).
 * @property {number} temperature - The temperature setting (between 0 and 1).
 */


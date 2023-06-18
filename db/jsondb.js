const fs = require("fs").promises;
const { log, debugLevels } = require("../util/logger");
const path = require("path");

class JSONDatabaseManager {
  /**
   * Creates a new instance of the JSONDatabaseManager class.
   * @constructor
   */
  constructor() {
    this.baseDBPath = "./data/";
  }

  /**
   * Retrieves chat data from the database.
   * @async
   * @param {string} chatId - The ID of the chat to retrieve.
   * @returns {Promise<Object|null>} - The chat data, or null if an error occurred.
   */
  async getChat(chatId) {
    log(`Getting chat ${chatId}`, debugLevels.VERBOSE);
    try {
      const fpath = path.join(this.baseDBPath, "chats", `${chatId}.json`);
      log(`Reading chat ${chatId}`, debugLevels.VERBOSE);
      const data = await this.readJSON(
        path.join(fpath)
      );
      log(`Data read successfully: ${data}`, debugLevels.ALL);
      return data;
    } catch (error) {
      log(error, debugLevels.BASIC);
      return null;
    }
  }

  /**
   * Stores chat data in the database.
   * @async
   * @param {Object} data - The chat data to store.
   */
  async storeChat(data) {
    const chatId = data.chatId;
    const filePath = path.join(this.baseDBPath, "chats", `${chatId}.json`);
    log(`Storing chat ${chatId}`, debugLevels.VERBOSE);
    await this.createDirectory(path.dirname(filePath));
    await this.writeJSON(filePath, data);
  }

  /**
   * Creates a directory if it does not already exist.
   * @async
   * @param {string} directoryPath - The path of the directory to create.
   */
  async createDirectory(directoryPath) {
    try {
      await fs.mkdir(directoryPath, { recursive: true });
    } catch (error) {
      log(error, debugLevels.BASIC);
    }
  }

  /**
   * Writes JSON data to a file.
   * @async
   * @param {string} filename - The name of the file to write.
   * @param {Object} data - The data to write to the file.
   */
  async writeJSON(filename, data) {
    log(`Writing ${filename}...`, debugLevels.VERBOSE);
    try {
      await fs.writeFile(filename, JSON.stringify(data));
      log(`Wrote ${filename} successfully`, debugLevels.VERBOSE);
    } catch (error) {
      log(error, debugLevels.BASIC);
    }
  }

  /**
   * Reads JSON data from a file.
   * @async
   * @param {string} filename - The name of the file to read.
   * @returns {Promise<Object|null>} - The data read from the file, or null if an error occurred.
   */
  async readJSON(filename) {
    log(`Reading ${filename}...`, debugLevels.VERBOSE);
    try {
      const data = await fs.readFile(filename, "utf8");
      return JSON.parse(data);
    } catch (error) {
      log(error, debugLevels.BASIC);
      return null;
    }
  }
}

module.exports = JSONDatabaseManager;
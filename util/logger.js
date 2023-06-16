/**
 * Object containing debug levels with corresponding integer values
 * @typedef {Object} DebugLevels
 * @property {number} NONE - 0
 * @property {number} BASIC - 1
 * @property {number} VERBOSE - 2
 * @property {number} ALL - 3
 */

const debugLevels = {
  NONE: 0,
  BASIC: 1,
  VERBOSE: 2,
  ALL: 3,
}

/**
 * Logs a message if the current debug level is greater than or equal to the minimum level specified
 * 
 * @param {string} message - The message to log
 * @param {string} [minimumLevel=DebugLevels.NONE] - The minimum debug level required to log the message
 */
function log(message, minimumLevel = "NONE") {
    // Define debug levels
    const debugLevels = {
      NONE: 0, // No debug messages
      BASIC: 1, // Basic debug messages
      VERBOSE: 2, // Verbose debug messages
      ALL: 3, // All debug messages
    };
  
    // Get the minimum level value required to log the message
    const minimumLevelValue = debugLevels[minimumLevel];
  
    // Get the current debug level from the environment variable
    const currentDebugLevel = process.env.DEBUG_LEVEL || 0;
  
    // If the current debug level is greater than or equal to the minimum level value or is set to ALL, log the message
    if (currentDebugLevel && (currentDebugLevel >= minimumLevelValue || currentDebugLevel === debugLevels.ALL)) {
      console.log(message);
    }
  }
  
module.exports = {debugLevels: debugLevels, log: log};
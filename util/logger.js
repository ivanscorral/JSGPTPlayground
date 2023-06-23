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
};


// Read the debug level from the environment or default to NONE

const envDebugLevel = process.env.DEBUG_LEVEL || 'NONE';

/**
 * Object containing functions for logging at different levels based on the current debug level.
 */

/**
 * Logs the given message to the console if the current debug level is at least NONE. 
 * This is the default debug level and will therefore log always log, independently of the debug level.
 *
 * @param {string} message - The message to be logged.
 */
function log(message) {
	if (debugLevels[envDebugLevel] >= debugLevels.NONE) {
		console.info(message);
	}
}

/**
 * Logs a message to the console if the current debug level is set to BASIC or higher.
 *
 * @param {string} message - The message to be logged.
 */
log.basic = function(message) {
	if (debugLevels[envDebugLevel] >= debugLevels.BASIC) {
		console.info(message);
	}
};

/**
 * Logs a message to the console if the debug level is set to VERBOSE or higher.
 *
 * @param {string} message - The message to be logged.
 */
log.verbose = function(message) {
	if (debugLevels[envDebugLevel] >= debugLevels.VERBOSE) {
		console.info(message);
	}
};

/**
 * Logs a message to the console if the debug level is set to ALL.
 *
 * @param {string} message - The message to be logged.
 */
log.all = function(message) {
	console.info(message);
};

module.exports = log;

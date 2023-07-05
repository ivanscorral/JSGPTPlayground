const { colorize, consoleColors } = require('../utils/colorizer');

/**
 * @readonly
 * @enum {number}
 */
const DebugLevels = Object.freeze({
	NONE: 0,
	BASIC: 1,
	VERBOSE: 2,
	ALL: 3,
});

const envDebugLevel =
	DebugLevels[process.env.DEBUG_LEVEL.toUpperCase()] || DebugLevels.NONE;

/**
 * Logs the given message to the console with debug level.
 * @function
 * @param {string} message - The message to be logged.
 */
function log(message) {
	console.info(colorize.highlight('[DEBUG]: ') + message);
}

/**
 * Logs a message to the console if the current debug level is set to BASIC or higher.
 * @param {string} message - The message to be logged.
 */
log.basic = function (message) {
	if (envDebugLevel >= DebugLevels.BASIC) {
		console.info(colorize.info('[BASIC]: ') + message);
	}
};

/**
 * Logs a message to the console if the debug level is set to VERBOSE or higher.
 * @param {string} message - The message to be logged.
 */
log.verbose = function (message) {
	if (envDebugLevel >= DebugLevels.VERBOSE) {
		console.info(colorize('[VERBOSE]: ', consoleColors.cyan) + message);
	}
};

/**
 * Logs a message to the console if the debug level is set to ALL.
 * @param {string} message - The message to be logged.
 */
log.all = function (message) {
	if (envDebugLevel === DebugLevels.ALL) {
		console.info(colorize.accent('[ALL]: ') + message);
	}
};

/**
 * Logs an error message to the console.
 * @param {string} message - The message to be logged.
 */
log.error = function (message) {
	console.error(colorize.error('[ERROR]: ') + message);
};

/**
 * Logs a warning message to the console if the current debug level is set to BASIC or higher.
 * @param {string} message - The message to be logged.
 */
log.warning = function (message) {
	if (envDebugLevel >= DebugLevels.BASIC) {
		console.warn(colorize.warn('[WARNING]: ') + message);
	}
};

/**
 * Logs an info message to the console if the current debug level is set to VERBOSE or higher.
 * @param {string} message - The message to be logged.
 */
log.info = function (message) {
	if (envDebugLevel >= DebugLevels.VERBOSE) {
		console.info(colorize.info('[INFO]: ') + message);
	}
};

module.exports = log;

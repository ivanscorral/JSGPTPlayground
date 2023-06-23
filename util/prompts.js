const fs = require('fs');
const path = require('path');
const log = require('../util/logger');

const readPrompts = async () => {
	try {
		const data = await fs.promises.readFile(path.join(__dirname, '../prompts.json'));
		return JSON.parse(data);
	} catch (err) {
		log('Error: ' + err);
		throw err;
	}
};

module.exports = { readPrompts };

const express = require('express');
const router = express.Router();
const { v4: uuid } = require('uuid');

class UtilRouter {
	constructor() {
		this.router = router;
	}
	async randUUID(req, res) {
		res.status(200).send(JSON.stringify({ uuid: uuid() }));
	}
}

const utilRouter = new UtilRouter();

router.get('/randUUID', utilRouter.randUUID.bind(utilRouter));

module.exports = utilRouter.router;

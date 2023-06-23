const express = require('express');

const router = express.Router();

router.get('/', (req, res) => {
	res.status(501).send('The requested endpoint is not available at this time.');
});

module.exports = router;
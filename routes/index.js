// Import the express library
const express = require('express');

// Create a new router
const router = express.Router();

/**
 * Handle GET requests to the root endpoint
 * @param {Object} req - The request object
 * @param {Object} res - The response object
 */
router.get('/', (req, res) => {
  // Send a 501 status code with a message indicating the endpoint is not implemented
  res.status(501).send('The requested endpoint is not available at this time.');
});

// Export the router for use in other modules
module.exports = router;
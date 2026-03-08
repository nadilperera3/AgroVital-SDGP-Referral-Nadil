const express = require('express');
const router = express.Router();
const feedbackController = require('../controllers/feedbackController'); // Import controller

// POST /submit-feedback
router.post('/submit-feedback', feedbackController.submitFeedback);

module.exports = router;
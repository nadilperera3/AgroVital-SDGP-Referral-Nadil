const express = require('express');
const router = express.Router();
const multer = require('multer');
const { predictDisease, healthCheck } = require('../controllers/mlController');

// Configure multer to store images in memory
const upload = multer({ 
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  }
});

// API endpoint to predict disease
router.post('/predict-disease', upload.single('image'), predictDisease);

// Health check endpoint
router.get('/health', healthCheck);

module.exports = router;
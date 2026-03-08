const axios = require('axios');
const FormData = require('form-data');
const config = require('../production.config');

// ML API URL - set this to your Flask API URL
const ML_API_URL = config.mlApiUrl ;

/**
 * Predict disease from uploaded image
 * This controller forwards the request to the Flask ML API
 */
exports.predictDisease = async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ 
      success: false, 
      error: 'No image file provided' 
    });
  }

  try {
    console.log('Processing image, size:', req.file.size, 'bytes');
    
    // Create form data for the API request
    const formData = new FormData();
    formData.append('image', req.file.buffer, {
      filename: req.file.originalname || 'crop_image.jpg',
      contentType: req.file.mimetype || 'image/jpeg'
    });
    
    console.log('Sending image to ML API for disease prediction...');
    
    // Make request to Python ML API
    const response = await axios.post(`${ML_API_URL}/api/predict-disease`, formData, {
      headers: {
        ...formData.getHeaders()
      },
      maxContentLength: Infinity,
      maxBodyLength: Infinity
    });
    
    console.log('ML API response received:', JSON.stringify(response.data, null, 2));
    
    // Return the API response directly
    return res.json(response.data);
    
  } catch (error) {
    console.error('Prediction error:', error.message);
    
    // Extract error message from API response if available
    let errorMessage = 'Failed to process image';
    if (error.response && error.response.data && error.response.data.error) {
      errorMessage = error.response.data.error;
    } else if (error.message) {
      errorMessage = error.message;
    }
    
    console.error('Error details:', errorMessage);
    
    return res.status(500).json({ 
      success: false, 
      error: errorMessage
    });
  }
};

/**
 * Health check endpoint that also checks ML API
 */
exports.healthCheck = async (req, res) => {
  try {
    // Check ML API health
    const response = await axios.get(`${ML_API_URL}/health`);
    
    return res.json({
      status: 'healthy',
      mlApiStatus: response.data
    });
  } catch (error) {
    console.error('Health check error:', error.message);
    
    return res.status(503).json({
      status: 'degraded',
      error: 'ML API not available',
      details: error.message
    });
  }
};
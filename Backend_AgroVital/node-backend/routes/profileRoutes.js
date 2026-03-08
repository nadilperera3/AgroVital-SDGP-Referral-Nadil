const express = require('express');
const { getUserProfile, updateUserProfile } = require('../controllers/profileController');

const router = express.Router();

// Fetch user profile by email
router.get('/get-profile/:email', getUserProfile);

// Update user profile
router.post('/update-profile', updateUserProfile);

module.exports = router;

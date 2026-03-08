const express = require('express');
const { registerUser, loginUser, logoutUser, sendOtp, verifyOtp, verifyOtpAndUpdatePassword } = require('../controllers/authController');

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/logout', logoutUser);
router.post('/send-otp', sendOtp);
router.post('/verify-otp', verifyOtp);
router.post('/reset-password', verifyOtpAndUpdatePassword);

module.exports = router;

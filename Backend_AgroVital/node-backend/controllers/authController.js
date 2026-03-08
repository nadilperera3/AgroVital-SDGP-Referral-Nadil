const bcrypt = require('bcryptjs');
const db = require('../config/firebaseConfig');
const admin = require('firebase-admin');
const generateToken = require('../config/jwtConfig');
const nodemailer = require('nodemailer');

const registerUser = async (req, res) => {
  const { fullName, email, mobileNo, password } = req.body;

  if (!fullName || !email || !mobileNo || !password) {
    return res.status(400).json({ error: 'All fields are required.' });
  }

  try {
    // Check for existing user by email
    const emailQuery = await db.collection('users').where('email', '==', email).get();
    // Check for existing user by mobile number
    const phoneQuery = await db.collection('users').where('mobileNo', '==', mobileNo).get();

    if (!emailQuery.empty) {
      return res.status(400).json({ error: 'Email is already registered.' });
    }

    if (!phoneQuery.empty) {
      return res.status(400).json({ error: 'Mobile number is already registered.' });
    }

    // Hash password and create new user
    const hashedPassword = await bcrypt.hash(password, 10);
    const userRef = db.collection('users').doc(email);
    await userRef.set({
      fullName,
      email,
      mobileNo,
      password: hashedPassword,
      createdAt: new Date(),
    });

    res.status(200).json({ message: 'User registered successfully!' });
  } catch (error) {
    res.status(500).json({ error: 'Error registering user: ' + error.message });
  }
};

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if user exists
    const userSnapshot = await db.collection('users').where('email', '==', email).get();
    if (userSnapshot.empty) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const userDoc = userSnapshot.docs[0];
    const user = userDoc.data();

    // Verify password
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Generate JWT token
    const token = generateToken(email); // Use generateToken function

    // Add user to the "login" collection
    await db.collection('login').doc(email).set({
      email,
      loginTime: admin.firestore.FieldValue.serverTimestamp(),
    });

    res.json({ token });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Error logging in' });
  }
};

const logoutUser = async (req, res) => {
  try {
    const { email } = req.body;

    // Remove user from active logins collection
    await db.collection('login').doc(email).delete();

    res.json({ message: 'Logged out successfully' });
  } catch (error) {
    console.error('Logout error:', error);
    res.status(500).json({ message: 'Error logging out' });
  }
};

// Forgot Password Logic
// Generate random OTP
const generateOtp = () => Math.floor(100000 + Math.random() * 900000).toString();

// Send OTP to email
const sendOtp = async (req, res) => {
  const { email } = req.body;
  try {
    const userSnapshot = await db.collection('users').where('email', '==', email).get();
    if (userSnapshot.empty) {
      return res.status(400).json({ error: 'User not found.' });
    }

    const otp = generateOtp();
    const expiresAt = Date.now() + 300000; // OTP valid for 5 minutes
    await db.collection('otp_requests').doc(email).set({ otp, expiresAt });

    const transporter = nodemailer.createTransport({
      service: 'Gmail',
      auth: {
        user: "teamagrovital@gmail.com",
        pass: "wenp kamp zedq qgjh",
      },
    });

    await transporter.sendMail({
      from: 'teamagrovital@gmail.com',
      to: email,
      subject: 'Password Reset OTP',
      text: `Your OTP is: ${otp}`,
    });

    res.status(200).json({ message: 'OTP sent to your email.' });
  } catch (error) {
    res.status(500).json({ error: 'Error sending OTP: ' + error.message });
  }
};

// Verify OTP only (new function)
const verifyOtp = async (req, res) => {
  const { email, otp } = req.body;
  try {
    const doc = await db.collection('otp_requests').doc(email).get();
    if (!doc.exists) return res.status(400).json({ error: 'OTP not found.' });

    const { otp: storedOtp, expiresAt } = doc.data();
    if (Date.now() > expiresAt) return res.status(400).json({ error: 'OTP expired.' });
    if (storedOtp !== otp) return res.status(400).json({ error: 'Invalid OTP.' });

    // OTP is valid
    res.status(200).json({ message: 'OTP verified successfully.' });
  } catch (error) {
    res.status(500).json({ error: 'Error verifying OTP: ' + error.message });
  }
};

// Verify OTP and update password
const verifyOtpAndUpdatePassword = async (req, res) => {
  const { email, otp, newPassword } = req.body;
  try {
    const doc = await db.collection('otp_requests').doc(email).get();
    if (!doc.exists) return res.status(400).json({ error: 'OTP not found.' });

    const { otp: storedOtp, expiresAt } = doc.data();
    if (Date.now() > expiresAt) return res.status(400).json({ error: 'OTP expired.' });
    if (storedOtp !== otp) return res.status(400).json({ error: 'Invalid OTP.' });

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await db.collection('users').doc(email).update({ password: hashedPassword });
    await db.collection('otp_requests').doc(email).delete();

    res.status(200).json({ message: 'Password updated successfully!' });
  } catch (error) {
    res.status(500).json({ error: 'Error updating password: ' + error.message });
  }
};


module.exports = {
  registerUser,
  loginUser,
  logoutUser,
  sendOtp,
  verifyOtp,
  verifyOtpAndUpdatePassword
};
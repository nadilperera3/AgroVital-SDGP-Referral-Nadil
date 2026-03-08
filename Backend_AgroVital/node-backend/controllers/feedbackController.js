const admin = require('firebase-admin');
const db = require('../config/firebaseConfig');

const submitFeedback = async (req, res) => {
  const { email, rating = '', feedback = '', type } = req.body;
  
  // Validate input
  if (!email) {
    return res.status(400).json({ error: 'Email is required.' });
  }
  
  if (type === 'rating' && !rating) {
    return res.status(400).json({ error: 'Rating is required for rating submissions.' });
  }

  if (type === 'detailed' && !feedback.trim()) {
    return res.status(400).json({ error: 'Feedback message is required.' });
  }

  try {
    const encodedEmail = encodeURIComponent(email);
    const feedbackRef = db.collection('feedback').doc(encodedEmail);
    
    const feedbackData = {
      email,
      type: type || 'general',
      timestamp: admin.firestore.FieldValue.serverTimestamp(),
      deviceInfo: req.headers['user-agent'] || 'Unknown'
    };

    // Add rating if provided
    if (rating) feedbackData.rating = rating;
    
    // Add feedback if provided
    if (feedback.trim()) feedbackData.feedback = feedback.trim();

    await feedbackRef.set(feedbackData, { merge: true });
    
    res.status(200).json({
      success: true,
      message: 'Feedback submitted successfully.',
      feedbackId: encodedEmail
    });
  } catch (error) {
    console.error('Firestore Error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to submit feedback to database.'
    });
  }
};

module.exports = {
  submitFeedback,
};
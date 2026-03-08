const db = require('../config/firebaseConfig'); // Firebase Firestore configuration

// Fetch user profile by email
exports.getUserProfile = async (req, res) => {
  const { email } = req.params;

  if (!email) {
    return res.status(400).json({ error: 'Email is required' });
  }

  try {
    const userRef = db.collection('users').doc(email);
    const userDoc = await userRef.get();

    if (!userDoc.exists) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.status(200).json({ user: userDoc.data() });
  } catch (error) {
    console.error('Error fetching profile:', error);
    res.status(500).json({ error: 'Error fetching profile: ' + error.message });
  }
};

// Update user profile
// Update user profile
// Update user profile
exports.updateUserProfile = async (req, res) => {
  const { email, ...updateData } = req.body;

  if (!email) {
    return res.status(400).json({ error: 'Email is required.' });
  }

  try {
    const userRef = db.collection('users').doc(email);
    const userDoc = await userRef.get();

    if (!userDoc.exists) {
      return res.status(404).json({ error: 'User not found.' });
    }

    // Create an object with only the fields that were provided
    const fieldsToUpdate = {};
    
    // Check each field and only include it if it was provided
    if (updateData.fullName !== undefined) fieldsToUpdate.fullName = updateData.fullName;
    if (updateData.dob !== undefined) fieldsToUpdate.dob = updateData.dob;
    if (updateData.country !== undefined) fieldsToUpdate.country = updateData.country;
    if (updateData.state !== undefined) fieldsToUpdate.state = updateData.state;
    if (updateData.city !== undefined) fieldsToUpdate.city = updateData.city;
    if (updateData.profileImage !== undefined) fieldsToUpdate.profileImage = updateData.profileImage;

    // Always add the updatedAt timestamp
    fieldsToUpdate.updatedAt = new Date();

    // Update only the provided fields
    await userRef.update(fieldsToUpdate);

    res.status(200).json({ message: 'Profile updated successfully!' });
  } catch (error) {
    console.error('Error updating profile:', error);
    res.status(500).json({ error: 'Error updating profile: ' + error.message });
  }
};
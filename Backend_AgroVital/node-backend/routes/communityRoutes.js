const express = require('express');
const multer = require('multer');
const { db, storage } = require('../config/firebaseConfig');
const verifyToken = require('../middleware/authMiddleware');
const { io } = require('../server');

const router = express.Router();
const upload = multer({ dest: 'uploads/' });  // For image uploads

// Create a new community post (image + message)
router.post('/createPost', verifyToken, upload.single('image'), async (req, res) => {
  try {
    const { message, description, userEmail } = req.body;
    const file = req.file;

    if (!message || !description || !userEmail || !file) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    const fileName = `${Date.now()}_${file.originalname}`;
    const fileUpload = storage.bucket().file(fileName);

    await Promise.all([
      // Upload image
      fileUpload.save(file.buffer, { metadata: { contentType: file.mimetype } }),

      // Save post in Firestore
      db.collection('communityPosts').add({
        message,
        description,
        imageUrl: `https://storage.googleapis.com/${storage.bucket().name}/${fileName}`,
        userEmail,
        timestamp: new Date(),
      }),
    ]);

    res.status(200).json({ message: 'Post created successfully!' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error creating post' });
  }
});

// Get all community posts
router.get('/posts', async (req, res) => {
  try {
    const postsSnapshot = await db.collection('communityPosts').orderBy('timestamp', 'desc').get();
    const posts = postsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

    res.status(200).json({ posts });
  } catch (error) {
    res.status(500).json({ error: 'Error fetching posts' });
  }
});

router.post('/newMessage', verifyToken, (req, res) => {
    const { message } = req.body;
    const { user } = req;
  
    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }
  
    const newMessage = {
      user: user.email,
      message,
      timestamp: new Date(),
    };
  
    // Emit the message to all connected users via Socket.io
    io.emit('newMessage', newMessage);  // Broadcast to all connected clients
  
    res.status(200).json({ newMessage });
  });
  

module.exports = router;
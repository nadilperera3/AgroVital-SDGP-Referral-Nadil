const admin = require('firebase-admin');
const db = require('../config/firebaseConfig');  // Firestore instance
const { v4: uuidv4 } = require('uuid');
const { storage } = require('../config/firebaseConfig');  // Firebase Storage

// Create a new community post with an image
exports.createPost = async (req, res) => {
  try {
    const { description, userName, message } = req.body;
    if (!description || !userName || !file) {
      return res.status(400).json({ error: 'Description, user name, and image are required.' });
    }

    const file = req.file;
    const fileName = `${uuidv4()}_${file.originalname}`;
    const fileUpload = storage.bucket().file(fileName);

    const blobStream = fileUpload.createWriteStream({
      metadata: { contentType: file.mimetype },
    });

    blobStream.on('error', (err) => res.status(500).send('Error uploading file.'));
    blobStream.on('finish', async () => {
      const imageUrl = `https://storage.googleapis.com/${storage.bucket().name}/${fileUpload.name}`;

      const postData = {
        description,
        imageUrl,
        userEmail,
        timestamp: admin.firestore.FieldValue.serverTimestamp(),
        comments: [],
      };

      const postRef = await db.collection('communityPosts').add(postData);
      res.status(201).json({ message: 'Post created successfully!', postId: postRef.id });
    });
    blobStream.end(file.buffer);
  } catch (error) {
    res.status(500).json({ error: 'Server error while creating post.' });
  }
};

// Fetch all posts
exports.getPosts = async (req, res) => {
  try {
    const postsSnapshot = await db.collection('communityPosts').orderBy('timestamp', 'desc').get();
    const posts = postsSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    res.status(200).json(posts);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch posts.' });
  }
};

// Add a comment to a post
exports.addComment = async (req, res) => {
  try {
    const { postId } = req.params;
    const { text, userName } = req.body;

    if (!text || !userName) {
      return res.status(400).json({ error: 'Text and user name are required.' });
    }

    const comment = { text, userName, timestamp: admin.firestore.FieldValue.serverTimestamp() };

    await db.collection('communityPosts').doc(postId).update({
      comments: admin.firestore.FieldValue.arrayUnion(comment),
    });

    res.status(200).json({ message: 'Comment added successfully!' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to add comment.' });
  }
};

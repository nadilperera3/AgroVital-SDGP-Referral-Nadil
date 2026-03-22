const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { PORT } = require('./config/dotenvConfig');
const authRoutes = require('./routes/authRoutes');
const sensorRoutes = require('./routes/sensorRoutes');
const profileRoutes = require('./routes/profileRoutes');
const communityRoutes = require('./routes/communityRoutes');
const feedbackRoutes = require('./routes/feedbackRoutes'); 
const http = require('http');
const socketIo = require('socket.io');
const mlRoutes = require('./routes/mlRoutes');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);
app.use(bodyParser.json());

const config = process.env.NODE_ENV === 'production' 
  ? require('./production.config') 
  : { port: 5001, debug: true };

app.use(cors({ origin: "*", methods: "GET,POST", allowedHeaders: "Content-Type, Authorization" }));

app.use('/uploads', express.static('uploads')); // Serve uploaded files

app.use('/api/auth', authRoutes);
app.use('/api/sensors', sensorRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/community', communityRoutes); 
app.use('/api', feedbackRoutes); 
app.use('/api', mlRoutes);

io.on('connection', (socket) => {
  console.log('A user connected');
  
  // Handle new message in the chat
  socket.on('newMessage', (message) => {
    io.emit('message', message);  // Broadcast message to all users
  });

  socket.on('disconnect', () => {
    console.log('User disconnected');
  });
});

server.listen(config.port, () => {
  console.log(`Server listening on port ${config.port}`);
});
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const { createServer } = require('http');
const { Server } = require('socket.io');
require('dotenv').config();
const jwt = require('jsonwebtoken');
const Message = require('./models/Message');
const Notification = require('./models/Notification');
const User = require('./models/User');

const app = express();
const server = createServer(app);

// Socket.io setup
const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    methods: ["GET", "POST"]
  }
});

// Middleware
app.use(helmet());
app.use(morgan('combined'));
app.use(cors({
  origin: process.env.CLIENT_URL || "http://localhost:5173",
  credentials: true
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Rate limiting - set global API rate limit and skip health endpoint
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 min
  max: 1000,
  message: 'Too many requests from this IP, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
  skip: req => req.path === '/api/health',
});
app.use('/api/', limiter);

// MongoDB connection (Local MongoDB)
// mongodb+srv://
const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/neighborhood-help-hub';
// const mongoURI = process.env.MONGODB_URI ||  "mongodb+srv://qumbranijunaid72_db_user:junaidsikander001@cluster0.befh9kg.mongodb.net/neighboors-help";
mongoose.connect(mongoURI)
  .then(() => console.log('✅ MongoDB connected successfully'))
  .catch(err => {
    console.error('❌ MongoDB connection error:', err);
    console.log('⚠️  Make sure to update MONGODB_URI in .env file with your actual password');
  });


// Serve static files from uploads directory
app.use('/uploads', express.static('uploads'));

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/posts', require('./routes/postRoutes'));
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/chat', require('./routes/chatRoutes'));
app.use('/api/admin', require('./routes/adminRoutes'));

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'Neighborhood Help Hub API is running',
    timestamp: new Date().toISOString()
  });
});

// Socket.io connection handling
// Verify JWT on socket connection
io.use((socket, next) => {
  try {
    const token = socket.handshake.auth?.token || socket.handshake.headers?.authorization?.split(' ')[1];
    if (!token) {
      return next(new Error('Authentication token missing'));
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key-change-in-production');
    socket.user = decoded; // { userId, role, ... }
    next();
  } catch (err) {
    next(new Error('Authentication failed'));
  }
});

io.on('connection', (socket) => {
  console.log('👤 User connected:', socket.id);

  // Join user to their personal room
  socket.on('join-user-room', (userId) => {
    const uid = userId || socket.user?.userId;
    if (uid) {
      socket.join(`user-${uid}`);
      console.log(`👤 User ${uid} joined their room`);
    }
  });

  // Handle joining chat room
  socket.on('join-chat', (data) => {
    const senderId = socket.user?.userId || data.senderId;
    const roomId = [senderId, data.receiverId].sort().join('-');
    socket.join(roomId);
    console.log(`💬 User joined chat room: ${roomId}`);
  });

  // Handle sending messages
  socket.on('send-message', async (data) => {
    try {
      const senderId = socket.user?.userId;
      const receiverId = data.receiverId;
      const content = data.content;
      if (!senderId || !receiverId || !content) {
        return;
      }

      // Validate receiver exists
      const receiver = await User.findById(receiverId);
      if (!receiver) {
        return;
      }

      // Save message to database
      const message = new Message({
        sender: senderId,
        receiver: receiverId,
        content,
        messageType: data.messageType || 'text',
        attachments: data.attachments || []
      });
      await message.save();
      await message.populate('sender', 'name profilePic');
      await message.populate('receiver', 'name profilePic');

      // Emit to the chat room with saved message (includes timestamps)
      const roomId = [senderId, receiverId].sort().join('-');
      io.to(roomId).emit('receive-message', {
        _id: message._id,
        content: message.content,
        messageType: message.messageType,
        attachments: message.attachments,
        createdAt: message.createdAt,
        sender: message.sender,
        receiver: message.receiver,
        conversationId: message.conversationId
      });
      
      // Send notification to receiver
      socket.to(`user-${receiverId}`).emit('receive-notification', {
        title: 'New Message',
        message: `You have a new message`,
        type: 'message'
      });
    } catch (error) {
      console.error('Error sending message:', error);
    }
  });

  // Handle typing indicators
  socket.on('typing', (data) => {
    const senderId = socket.user?.userId || data.senderId;
    const roomId = [senderId, data.receiverId].sort().join('-');
    socket.to(roomId).emit('user-typing', { ...data, senderId });
  });

  // Handle stopping typing
  socket.on('stop-typing', (data) => {
    const senderId = socket.user?.userId || data.senderId;
    const roomId = [senderId, data.receiverId].sort().join('-');
    socket.to(roomId).emit('user-stop-typing', { ...data, senderId });
  });

  // Handle disconnection
  socket.on('disconnect', () => {
    console.log('👤 User disconnected:', socket.id);
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    message: 'Something went wrong!',
    error: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error'
  });
});

// 404 handler
app.use( (req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`🌐 API URL: http://localhost:${PORT}/api`);
  console.log(`🔌 Socket.io enabled`);
});

module.exports = { app, io };
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

const authRoutes = require('./routes/auth.js');
const serviceRoutes = require('./routes/services.js');
const orderRoutes = require('./routes/orders.js');
const cartRoutes = require('./routes/cart.js');
const userRoutes = require('./routes/users.js');
const paymentRoutes = require('./routes/payment.js');

const app = express();
const PORT = process.env.PORT || 5000;

// Security
app.use(helmet());

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: 'Too many requests from this IP, please try again later.'
});
app.use(limiter);

// CORS
app.use(cors({
  origin: function (origin, callback) {
    const allowedOrigins = [
      'http://localhost:5173',
      'http://localhost:3000',
      process.env.FRONTEND_URL
    ];
    // Allow requests with no origin (mobile apps, curl, etc.)
    if (!origin) return callback(null, true);
    // Allow any Vercel preview deployment for this project
    if (origin.includes('prajval-4982s-projects.vercel.app') ||
        origin.includes('vastram') ||
        allowedOrigins.includes(origin)) {
      return callback(null, true);
    }
    callback(new Error('Not allowed by CORS'));
  },
  credentials: true
}));

// Body parser
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Connect MongoDB (Atlas)
if (!process.env.MONGODB_URI) {
  console.error('❌ MONGODB_URI is not set in environment variables. Exiting.');
  process.exit(1);
}
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('✅ Connected to Vastram MongoDB Atlas'))
  .catch(err => {
    console.error('❌ MongoDB connection error:', err);
    process.exit(1);
  });

// Register API routes
app.use('/api/auth', authRoutes);
app.use('/api/services', serviceRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/users', userRoutes);
app.use('/api/payment', paymentRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'success',
    message: 'Vastram API is running',
    timestamp: new Date().toISOString(),
    version: '1.0.0'
  });
});

// Welcome route
app.get('/', (req, res) => {
  res.json({
    message: 'Welcome to Vastram API',
    version: '1.0.0',
    endpoints: {
      auth: '/api/auth',
      services: '/api/services',
      orders: '/api/orders',
      cart: '/api/cart',
      users: '/api/users',
      health: '/api/health'
    }
  });
});

// 404 handler - Fixed approach
app.use((req, res, next) => {
  res.status(404).json({
    status: 'error',
    message: 'Vastram API endpoint not found',
    path: req.path,
    method: req.method
  });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('Vastram API Error:', err.stack);
  res.status(500).json({
    status: 'error',
    message: 'Something went wrong!',
    error: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error'
  });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
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
      'https://vastram-xi.vercel.app',
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
const autoSeedServices = async () => {
  try {
    const Service = require('./models/Service.js');
    const count = await Service.countDocuments();
    if (count === 0) {
      console.log('🌱 Database empty. Auto-seeding default Vastram services...');
      await Service.insertMany([
        { name: 'Regular Shirt', description: 'Cotton and regular fabric shirts with standard cleaning', price: 49, category: 'shirts', processingTime: '24 hours', isPopular: true, tags: ['cotton', 'regular', 'office'], careInstructions: 'Machine wash with mild detergent, iron on medium heat', isActive: true },
        { name: 'Premium Shirt', description: 'Designer and branded shirts with special care', price: 89, category: 'shirts', processingTime: '24 hours', isPopular: true, tags: ['premium', 'designer', 'branded'], careInstructions: 'Gentle wash with premium detergent, professional pressing', isActive: true },
        { name: 'Formal Shirt', description: 'Office and formal wear shirts with crisp finishing', price: 69, category: 'shirts', processingTime: '24 hours', tags: ['formal', 'office', 'business'], careInstructions: 'Professional cleaning with starch, precise ironing', isActive: true },
        { name: 'T-Shirt', description: 'Casual t-shirts and tops with gentle care', price: 39, category: 'shirts', processingTime: '24 hours', tags: ['casual', 'cotton', 'everyday'], careInstructions: 'Gentle wash, air dry, light ironing', isActive: true },
        { name: 'Suit 2 Piece', description: 'Complete 2-piece suit dry cleaning with professional finishing', price: 199, category: 'suits', processingTime: '48 hours', isPopular: true, tags: ['suit', 'formal', 'business', 'dry-clean'], careInstructions: 'Professional dry cleaning only, steam pressing', isActive: true },
        { name: 'Suit 3 Piece', description: 'Complete 3-piece suit with vest, premium dry cleaning', price: 299, category: 'suits', processingTime: '48 hours', isPopular: true, tags: ['suit', 'formal', 'premium', 'vest'], careInstructions: 'Premium dry cleaning, professional pressing, vest included', isActive: true },
        { name: 'Blazer', description: 'Single blazer dry cleaning with shape retention', price: 149, category: 'suits', processingTime: '48 hours', tags: ['blazer', 'formal', 'jacket'], careInstructions: 'Dry clean only, maintain shoulder shape, steam finish', isActive: true },
        { name: 'Formal Pants', description: 'Formal trousers and pants with crease setting', price: 79, category: 'suits', processingTime: '24 hours', tags: ['pants', 'formal', 'trousers'], careInstructions: 'Dry clean or wash, professional pressing with crease', isActive: true },
        { name: 'Saree Cotton', description: 'Cotton sarees with gentle cleaning and proper folding', price: 99, category: 'traditional', processingTime: '24 hours', isPopular: true, tags: ['saree', 'cotton', 'traditional', 'indian'], careInstructions: 'Gentle wash, natural drying, careful folding', isActive: true },
        { name: 'Saree Silk', description: 'Silk sarees with special care and preservation', price: 199, category: 'traditional', processingTime: '48 hours', isPopular: true, tags: ['saree', 'silk', 'premium', 'traditional'], careInstructions: 'Dry clean only, silk-specific treatment, careful handling', isActive: true },
        { name: 'Lehenga', description: 'Heavy lehengas and chaniya cholis with embellishment care', price: 399, category: 'traditional', processingTime: '72 hours', tags: ['lehenga', 'heavy', 'embellished', 'wedding'], careInstructions: 'Specialized cleaning for heavy fabrics and embellishments', isActive: true },
        { name: 'Kurta', description: 'Cotton and silk kurtas with traditional finishing', price: 69, category: 'traditional', processingTime: '24 hours', tags: ['kurta', 'traditional', 'cotton', 'silk'], careInstructions: 'Gentle wash or dry clean based on fabric, traditional pressing', isActive: true },
        { name: 'Jeans', description: 'Denim jeans and casual pants with color protection', price: 59, category: 'casual', processingTime: '24 hours', tags: ['jeans', 'denim', 'casual'], careInstructions: 'Wash inside out, color protection, minimal ironing', isActive: true },
        { name: 'Casual Dress', description: 'Everyday dresses and casual wear with gentle care', price: 89, category: 'casual', processingTime: '24 hours', tags: ['dress', 'casual', 'everyday'], careInstructions: 'Gentle wash based on fabric, shape maintenance', isActive: true },
        { name: 'Sweater', description: 'Woolen sweaters and cardigans with shrinkage prevention', price: 119, category: 'casual', processingTime: '48 hours', tags: ['sweater', 'wool', 'winter'], careInstructions: 'Specialized wool cleaning, shrinkage prevention, flat drying', isActive: true },
        { name: 'Jacket', description: 'Casual jackets and outerwear with weather protection', price: 159, category: 'casual', processingTime: '48 hours', tags: ['jacket', 'outerwear', 'casual'], careInstructions: 'Appropriate cleaning based on material, weather protection maintained', isActive: true },
        { name: 'Blanket Single', description: 'Wash & Clean service for single blanket', price: 300, category: 'home-essentials', processingTime: '48 hours', tags: ['blanket', 'single', 'home', 'wash', 'clean'], careInstructions: 'Gentle wash, air dry, do not bleach', isActive: true },
        { name: 'Blanket Double', description: 'Wash & Clean service for double blanket', price: 400, category: 'home-essentials', processingTime: '48 hours', tags: ['blanket', 'double', 'home', 'wash', 'clean'], careInstructions: 'Gentle wash, air dry, do not bleach', isActive: true },
        { name: 'Quilt Single', description: 'Wash & Clean service for single quilt', price: 380, category: 'home-essentials', processingTime: '48 hours', tags: ['quilt', 'single', 'home', 'wash', 'clean'], careInstructions: 'Gentle wash, air dry, do not bleach', isActive: true },
        { name: 'Bedsheet', description: 'Wash & Clean service for bedsheet', price: 150, category: 'home-essentials', processingTime: '24 hours', tags: ['bedsheet', 'home', 'wash', 'clean'], careInstructions: 'Machine wash, tumble dry low, iron if needed', isActive: true },
        { name: 'Pillow Cover', description: 'Wash & Clean service for pillow cover', price: 50, category: 'home-essentials', processingTime: '24 hours', tags: ['pillow', 'cover', 'home', 'wash', 'clean'], careInstructions: 'Machine wash, tumble dry low, iron if needed', isActive: true }
      ]);
      console.log('✅ Default Vastram services auto-seeded successfully!');
    }
  } catch (err) {
    console.error('Auto-seed failed:', err.message);
  }
};

mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('✅ Connected to Vastram MongoDB Atlas');
    autoSeedServices();
  })
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
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

// Set mongoose to use ES6 promises
mongoose.Promise = global.Promise;

// Import models
const User = require('../models/User.js');
const Service = require('../models/Service.js');

// Connect to MongoDB with retry logic
const connectWithRetry = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/vastram-final', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('✅ Successfully connected to MongoDB');
  } catch (error) {
    console.error('❌ MongoDB connection error:', error.message);
    console.log('Retrying connection in 5 seconds...');
    setTimeout(connectWithRetry, 5000);
  }
};

// Start the connection
connectWithRetry();

// Sample users data
const users = [];

// Sample services data
const services = [
  // Shirts & Tops
  {
    name: 'Regular Shirt',
    description: 'Cotton and regular fabric shirts with standard cleaning',
    price: 49,
    category: 'shirts',
    processingTime: '24 hours',
    isPopular: true,
    tags: ['cotton', 'regular', 'office'],
    careInstructions: 'Machine wash with mild detergent, iron on medium heat'
  },
  {
    name: 'Premium Shirt',
    description: 'Designer and branded shirts with special care',
    price: 89,
    category: 'shirts',
    processingTime: '24 hours',
    isPopular: true,
    tags: ['premium', 'designer', 'branded'],
    careInstructions: 'Gentle wash with premium detergent, professional pressing'
  },
  {
    name: 'Formal Shirt',
    description: 'Office and formal wear shirts with crisp finishing',
    price: 69,
    category: 'shirts',
    processingTime: '24 hours',
    tags: ['formal', 'office', 'business'],
    careInstructions: 'Professional cleaning with starch, precise ironing'
  },
  {
    name: 'T-Shirt',
    description: 'Casual t-shirts and tops with gentle care',
    price: 39,
    category: 'shirts',
    processingTime: '24 hours',
    tags: ['casual', 'cotton', 'everyday'],
    careInstructions: 'Gentle wash, air dry, light ironing'
  },

  // Suits & Formal
  {
    name: 'Suit 2 Piece',
    description: 'Complete 2-piece suit dry cleaning with professional finishing',
    price: 199,
    category: 'suits',
    processingTime: '48 hours',
    isPopular: true,
    tags: ['suit', 'formal', 'business', 'dry-clean'],
    careInstructions: 'Professional dry cleaning only, steam pressing'
  },
  {
    name: 'Suit 3 Piece',
    description: 'Complete 3-piece suit with vest, premium dry cleaning',
    price: 299,
    category: 'suits',
    processingTime: '48 hours',
    isPopular: true,
    tags: ['suit', 'formal', 'premium', 'vest'],
    careInstructions: 'Premium dry cleaning, professional pressing, vest included'
  },
  {
    name: 'Blazer',
    description: 'Single blazer dry cleaning with shape retention',
    price: 149,
    category: 'suits',
    processingTime: '48 hours',
    tags: ['blazer', 'formal', 'jacket'],
    careInstructions: 'Dry clean only, maintain shoulder shape, steam finish'
  },
  {
    name: 'Formal Pants',
    description: 'Formal trousers and pants with crease setting',
    price: 79,
    category: 'suits',
    processingTime: '24 hours',
    tags: ['pants', 'formal', 'trousers'],
    careInstructions: 'Dry clean or wash, professional pressing with crease'
  },

  // Traditional Wear
  {
    name: 'Saree Cotton',
    description: 'Cotton sarees with gentle cleaning and proper folding',
    price: 99,
    category: 'traditional',
    processingTime: '24 hours',
    isPopular: true,
    tags: ['saree', 'cotton', 'traditional', 'indian'],
    careInstructions: 'Gentle wash, natural drying, careful folding'
  },
  {
    name: 'Saree Silk',
    description: 'Silk sarees with special care and preservation',
    price: 199,
    category: 'traditional',
    processingTime: '48 hours',
    isPopular: true,
    tags: ['saree', 'silk', 'premium', 'traditional'],
    careInstructions: 'Dry clean only, silk-specific treatment, careful handling'
  },
  {
    name: 'Lehenga',
    description: 'Heavy lehengas and chaniya cholis with embellishment care',
    price: 399,
    category: 'traditional',
    processingTime: '72 hours',
    tags: ['lehenga', 'heavy', 'embellished', 'wedding'],
    careInstructions: 'Specialized cleaning for heavy fabrics and embellishments'
  },
  {
    name: 'Kurta',
    description: 'Cotton and silk kurtas with traditional finishing',
    price: 69,
    category: 'traditional',
    processingTime: '24 hours',
    tags: ['kurta', 'traditional', 'cotton', 'silk'],
    careInstructions: 'Gentle wash or dry clean based on fabric, traditional pressing'
  },

  // Casual Wear
  {
    name: 'Jeans',
    description: 'Denim jeans and casual pants with color protection',
    price: 59,
    category: 'casual',
    processingTime: '24 hours',
    tags: ['jeans', 'denim', 'casual'],
    careInstructions: 'Wash inside out, color protection, minimal ironing'
  },
  {
    name: 'Casual Dress',
    description: 'Everyday dresses and casual wear with gentle care',
    price: 89,
    category: 'casual',
    processingTime: '24 hours',
    tags: ['dress', 'casual', 'everyday'],
    careInstructions: 'Gentle wash based on fabric, shape maintenance'
  },
  {
    name: 'Sweater',
    description: 'Woolen sweaters and cardigans with shrinkage prevention',
    price: 119,
    category: 'casual',
    processingTime: '48 hours',
    tags: ['sweater', 'wool', 'winter'],
    careInstructions: 'Specialized wool cleaning, shrinkage prevention, flat drying'
  },
  {
    name: 'Jacket',
    description: 'Casual jackets and outerwear with weather protection',
    price: 159,
    category: 'casual',
    processingTime: '48 hours',
    tags: ['jacket', 'outerwear', 'casual'],
    careInstructions: 'Appropriate cleaning based on material, weather protection maintained'
  },
  {
    name: 'Blanket Single',
    description: 'Wash & Clean service for single blanket',
    price: 300,
    category: 'home-essentials',
    processingTime: '48 hours',
    tags: ['blanket', 'single', 'home', 'wash', 'clean'],
    careInstructions: 'Gentle wash, air dry, do not bleach'
  },
  {
    name: 'Blanket Double',
    description: 'Wash & Clean service for double blanket',
    price: 400,
    category: 'home-essentials',
    processingTime: '48 hours',
    tags: ['blanket', 'double', 'home', 'wash', 'clean'],
    careInstructions: 'Gentle wash, air dry, do not bleach'
  },
  {
    name: 'Quilt Single',
    description: 'Wash & Clean service for single quilt',
    price: 380,
    category: 'home-essentials',
    processingTime: '48 hours',
    tags: ['quilt', 'single', 'home', 'wash', 'clean'],
    careInstructions: 'Gentle wash, air dry, do not bleach'
  },
  {
    name: 'Bedsheet',
    description: 'Wash & Clean service for bedsheet',
    price: 150,
    category: 'home-essentials',
    processingTime: '24 hours',
    tags: ['bedsheet', 'home', 'wash', 'clean'],
    careInstructions: 'Machine wash, tumble dry low, iron if needed'
  },
  {
    name: 'Pillow Cover',
    description: 'Wash & Clean service for pillow cover',
    price: 50,
    category: 'home-essentials',
    processingTime: '24 hours',
    tags: ['pillow', 'cover', 'home', 'wash', 'clean'],
    careInstructions: 'Machine wash, tumble dry low, iron if needed'
  }
];

async function seedDatabase() {
  try {
    console.log('🌱 Checking Vastram database status...');

    const isForce = process.argv.includes('--force');
    const userCount = await User.countDocuments();
    const serviceCount = await Service.countDocuments();

    if (userCount > 0 || serviceCount > 0) {
      if (!isForce) {
        console.log('✅ Database is already populated. Skipping seed.');
        console.log('💡 Tip: Run `npm run seed:force` if you want to wipe and re-seed the database.');
        return;
      }
      console.log('⚠️ --force flag detected. Wiping existing data...');
      // Clear existing data
      await User.deleteMany({});
      await Service.deleteMany({});
      console.log('🗑️  Cleared existing data');
    }

    // Create users
    console.log('👥 Creating users...');
    for (const userData of users) {
      const user = new User(userData);
      await user.save();
      console.log(`✅ Created user: ${user.name} (${user.email})`);
    }

    // Create services
    console.log('🧺 Creating services...');
    for (const serviceData of services) {
      const service = new Service(serviceData);
      await service.save();
      console.log(`✅ Created service: ${service.name} - ₹${service.price}`);
    }

    console.log('\n🎉 Vastram database seeding completed successfully!');
    console.log('\n📋 Summary:');
    console.log(`👥 Users created: ${users.length}`);
    console.log(`🧺 Services created: ${services.length}`);

    console.log('\n🚀 You can now start the Vastram API server!');

  } catch (error) {
    console.error('❌ Error seeding database:', error);
  } finally {
    mongoose.connection.close();
  }
}

// Handle process termination
process.on('SIGINT', async () => {
  try {
    await mongoose.connection.close();
    console.log('MongoDB connection closed through app termination');
    process.exit(0);
  } catch (error) {
    console.error('Error during application shutdown:', error);
    process.exit(1);
  }
});

// Run the seeding function when connected to MongoDB
mongoose.connection.on('connected', () => {
  console.log('🚀 Starting database seeding...');
  seedDatabase()
    .then(() => {
      console.log('✅ Database seeding completed successfully');
      process.exit(0);
    })
    .catch(error => {
      console.error('❌ Error seeding database:', error);
      process.exit(1);
    });
});
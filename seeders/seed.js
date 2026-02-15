const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('../models/User');
const Product = require('../models/Product');
const MarketPrice = require('../models/MarketPrice');

dotenv.config();

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('MongoDB Connected');
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
};

const users = [
  {
    name: 'Raj Kumar',
    email: 'raj@farmer.com',
    password: 'password123',
    phone: '9876543210',
    role: 'farmer',
    location: {
      address: 'Village Road',
      city: 'Bhubaneswar',
      state: 'Odisha',
      pincode: '751001'
    }
  },
  {
    name: 'Priya Sharma',
    email: 'priya@farmer.com',
    password: 'password123',
    phone: '9876543211',
    role: 'farmer',
    location: {
      address: 'Farm House 123',
      city: 'Cuttack',
      state: 'Odisha',
      pincode: '753001'
    }
  },
  {
    name: 'Amit Buyer',
    email: 'amit@buyer.com',
    password: 'password123',
    phone: '9876543212',
    role: 'buyer',
    location: {
      address: 'City Center',
      city: 'Bhubaneswar',
      state: 'Odisha',
      pincode: '751012'
    }
  }
];

const marketPrices = [
  {
    productName: 'Tomato',
    category: 'Vegetables',
    minPrice: 20,
    maxPrice: 40,
    avgPrice: 30,
    unit: 'kg',
    location: { city: 'Bhubaneswar', state: 'Odisha' },
    source: 'Market Survey'
  },
  {
    productName: 'Potato',
    category: 'Vegetables',
    minPrice: 15,
    maxPrice: 25,
    avgPrice: 20,
    unit: 'kg',
    location: { city: 'Bhubaneswar', state: 'Odisha' },
    source: 'Market Survey'
  },
  {
    productName: 'Onion',
    category: 'Vegetables',
    minPrice: 25,
    maxPrice: 35,
    avgPrice: 30,
    unit: 'kg',
    location: { city: 'Bhubaneswar', state: 'Odisha' },
    source: 'Market Survey'
  },
  {
    productName: 'Rice (Basmati)',
    category: 'Grains',
    minPrice: 60,
    maxPrice: 80,
    avgPrice: 70,
    unit: 'kg',
    location: { city: 'Bhubaneswar', state: 'Odisha' },
    source: 'Market Survey'
  },
  {
    productName: 'Wheat',
    category: 'Grains',
    minPrice: 25,
    maxPrice: 35,
    avgPrice: 30,
    unit: 'kg',
    location: { city: 'Bhubaneswar', state: 'Odisha' },
    source: 'Market Survey'
  },
  {
    productName: 'Milk',
    category: 'Dairy',
    minPrice: 50,
    maxPrice: 65,
    avgPrice: 58,
    unit: 'litre',
    location: { city: 'Bhubaneswar', state: 'Odisha' },
    source: 'Market Survey'
  },
  {
    productName: 'Apple',
    category: 'Fruits',
    minPrice: 120,
    maxPrice: 160,
    avgPrice: 140,
    unit: 'kg',
    location: { city: 'Bhubaneswar', state: 'Odisha' },
    source: 'Market Survey'
  },
  {
    productName: 'Banana',
    category: 'Fruits',
    minPrice: 40,
    maxPrice: 60,
    avgPrice: 50,
    unit: 'dozen',
    location: { city: 'Bhubaneswar', state: 'Odisha' },
    source: 'Market Survey'
  }
];

const importData = async () => {
  try {
    await connectDB();

    // Clear existing data
    await User.deleteMany();
    await Product.deleteMany();
    await MarketPrice.deleteMany();

    console.log('Data cleared...');

    // Insert users
    const createdUsers = await User.insertMany(users);
    console.log(`${createdUsers.length} users created`);

    // Create sample products for farmers
    const farmer1 = createdUsers[0];
    const farmer2 = createdUsers[1];

    const products = [
      {
        farmer: farmer1._id,
        name: 'Fresh Tomatoes',
        category: 'Vegetables',
        description: 'Farm-fresh organic tomatoes',
        price: 35,
        unit: 'kg',
        quantity: 200,
        isOrganic: true,
        status: 'active',
        location: {
          city: 'Bhubaneswar',
          state: 'Odisha'
        }
      },
      {
        farmer: farmer1._id,
        name: 'Basmati Rice',
        category: 'Grains',
        description: 'Premium quality basmati rice',
        price: 75,
        unit: 'kg',
        quantity: 500,
        isOrganic: false,
        status: 'active',
        location: {
          city: 'Bhubaneswar',
          state: 'Odisha'
        }
      },
      {
        farmer: farmer2._id,
        name: 'Fresh Milk',
        category: 'Dairy',
        description: 'Pure cow milk from our farm',
        price: 60,
        unit: 'litre',
        quantity: 100,
        isOrganic: true,
        status: 'active',
        location: {
          city: 'Cuttack',
          state: 'Odisha'
        }
      },
      {
        farmer: farmer2._id,
        name: 'Green Peas',
        category: 'Vegetables',
        description: 'Fresh green peas',
        price: 80,
        unit: 'kg',
        quantity: 50,
        isOrganic: true,
        status: 'active',
        location: {
          city: 'Cuttack',
          state: 'Odisha'
        }
      }
    ];

    const createdProducts = await Product.insertMany(products);
    console.log(`${createdProducts.length} products created`);

    // Insert market prices
    const createdPrices = await MarketPrice.insertMany(marketPrices);
    console.log(`${createdPrices.length} market prices created`);

    console.log('\n=== Seed Data Summary ===');
    console.log('Users created:');
    createdUsers.forEach(user => {
      console.log(`- ${user.name} (${user.email}) - Role: ${user.role}`);
      console.log(`  Password: password123`);
    });

    console.log('\nData import successful!');
    process.exit();
  } catch (error) {
    console.error('Error importing data:', error);
    process.exit(1);
  }
};

const destroyData = async () => {
  try {
    await connectDB();

    await User.deleteMany();
    await Product.deleteMany();
    await MarketPrice.deleteMany();

    console.log('Data destroyed!');
    process.exit();
  } catch (error) {
    console.error('Error destroying data:', error);
    process.exit(1);
  }
};

// Check command line argument
if (process.argv[2] === '-d') {
  destroyData();
} else {
  importData();
}
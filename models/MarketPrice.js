const mongoose = require('mongoose');

const marketPriceSchema = new mongoose.Schema({
  productName: {
    type: String,
    required: [true, 'Please provide product name'],
    trim: true
  },
  category: {
    type: String,
    required: [true, 'Please provide product category'],
    enum: ['Vegetables', 'Fruits', 'Grains', 'Pulses', 'Dairy', 'Poultry', 'Other']
  },
  minPrice: {
    type: Number,
    required: true,
    min: 0
  },
  maxPrice: {
    type: Number,
    required: true,
    min: 0
  },
  avgPrice: {
    type: Number,
    required: true,
    min: 0
  },
  unit: {
    type: String,
    required: [true, 'Please provide unit'],
    enum: ['kg', 'gram', 'litre', 'piece', 'dozen', 'quintal']
  },
  location: {
    city: String,
    state: String
  },
  source: {
    type: String,
    default: 'Market Survey'
  },
  date: {
    type: Date,
    default: Date.now
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('MarketPrice', marketPriceSchema);
const express = require('express');
const router = express.Router();
const {
  getMarketPrices,
  getLatestMarketPrices,
  createMarketPrice,
  getMarketPriceTrends
} = require('../controllers/marketPriceController');
const { protect, authorize } = require('../middleware/auth');
const { body } = require('express-validator');
const validate = require('../middleware/validation');

// Validation rules
const marketPriceValidation = [
  body('productName').trim().notEmpty().withMessage('Product name is required'),
  body('category').isIn(['Vegetables', 'Fruits', 'Grains', 'Pulses', 'Dairy', 'Poultry', 'Other'])
    .withMessage('Invalid category'),
  body('minPrice').isNumeric().withMessage('Min price must be a number'),
  body('maxPrice').isNumeric().withMessage('Max price must be a number'),
  body('avgPrice').isNumeric().withMessage('Average price must be a number'),
  body('unit').isIn(['kg', 'gram', 'litre', 'piece', 'dozen', 'quintal'])
    .withMessage('Invalid unit'),
  validate
];

// Public routes
router.get('/', getMarketPrices);
router.get('/latest', getLatestMarketPrices);
router.get('/trends/:productName', getMarketPriceTrends);

// Admin only route
router.post('/', protect, authorize('admin'), marketPriceValidation, createMarketPrice);

module.exports = router;
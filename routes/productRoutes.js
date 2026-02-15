const express = require('express');
const router = express.Router();
const {
  getProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
  getMyProducts,
  getFarmerStats
} = require('../controllers/productController');
const { protect, authorize } = require('../middleware/auth');
const { body } = require('express-validator');
const validate = require('../middleware/validation');

// Validation rules
const productValidation = [
  body('name').trim().notEmpty().withMessage('Product name is required'),
  body('category').isIn(['Vegetables', 'Fruits', 'Grains', 'Pulses', 'Dairy', 'Poultry', 'Other'])
    .withMessage('Invalid category'),
  body('description').trim().notEmpty().withMessage('Description is required'),
  body('price').isNumeric().withMessage('Price must be a number'),
  body('unit').isIn(['kg', 'gram', 'litre', 'piece', 'dozen', 'quintal'])
    .withMessage('Invalid unit'),
  body('quantity').isNumeric().withMessage('Quantity must be a number'),
  validate
];

// Public routes
router.get('/', getProducts);
router.get('/:id', getProduct);

// Protected routes (Farmer only)
router.use(protect);
router.use(authorize('farmer'));

router.post('/', productValidation, createProduct);
router.put('/:id', updateProduct);
router.delete('/:id', deleteProduct);
router.get('/farmer/my-products', getMyProducts);
router.get('/farmer/stats', getFarmerStats);

module.exports = router;
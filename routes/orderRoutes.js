const express = require('express');
const router = express.Router();
const {
  createOrder,
  getMyOrders,
  getFarmerOrders,
  getOrder,
  updateOrderStatus,
  cancelOrder
} = require('../controllers/orderController');
const { protect, authorize } = require('../middleware/auth');
const { body } = require('express-validator');
const validate = require('../middleware/validation');

// Validation rules
const orderValidation = [
  body('product').notEmpty().withMessage('Product ID is required'),
  body('quantity').isNumeric().withMessage('Quantity must be a number'),
  body('deliveryAddress').notEmpty().withMessage('Delivery address is required'),
  body('paymentMethod').isIn(['cash', 'online', 'upi'])
    .withMessage('Invalid payment method'),
  validate
];

// All routes require authentication
router.use(protect);

// Buyer routes
router.post('/', orderValidation, createOrder);
router.get('/my-orders', getMyOrders);
router.put('/:id/cancel', cancelOrder);

// Farmer routes
router.get('/farmer/orders', authorize('farmer'), getFarmerOrders);
router.put('/:id/status', authorize('farmer'), updateOrderStatus);

// Common routes
router.get('/:id', getOrder);

module.exports = router;
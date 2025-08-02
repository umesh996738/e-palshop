const express = require('express');
const {
  createOrder,
  getOrderById,
  updateOrderToPaid,
  updateOrderToDelivered,
  updateOrderStatus,
  getMyOrders,
  getOrders,
  cancelOrder,
  getOrderStats
} = require('../controllers/orderController');
const { protect, admin } = require('../middleware/auth');

const router = express.Router();

// Protected routes (authenticated users)
router.post('/', protect, createOrder);
router.get('/myorders', protect, getMyOrders);
router.get('/:id', protect, getOrderById);
router.put('/:id/pay', protect, updateOrderToPaid);
router.put('/:id/cancel', protect, cancelOrder);

// Admin only routes
router.get('/', protect, admin, getOrders);
router.get('/stats', protect, admin, getOrderStats);
router.put('/:id/deliver', protect, admin, updateOrderToDelivered);
router.put('/:id/status', protect, admin, updateOrderStatus);

module.exports = router;
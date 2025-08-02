const express = require('express');
const router = express.Router();
const {
  addOrderItems,
  getOrderById,
  updateOrderToPaid,
  updateOrderToDelivered,
  getMyOrders,
  getOrders,
  updateOrderStatus,
  cancelOrder
} = require('../controllers/orderController');
const { protect, authorize } = require('../middleware/auth');

// User routes
router.route('/')
  .post(protect, addOrderItems)
  .get(protect, authorize('admin'), getOrders);

router.get('/myorders', protect, getMyOrders);
router.get('/:id', protect, getOrderById);
router.put('/:id/pay', protect, updateOrderToPaid);
router.put('/:id/cancel', protect, cancelOrder);

// Admin routes
router.put('/:id/deliver', protect, authorize('admin'), updateOrderToDelivered);
router.put('/:id/status', protect, authorize('admin'), updateOrderStatus);

module.exports = router;
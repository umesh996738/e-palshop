const express = require('express');
const {
  createOrder,
  getOrderById,
  updateOrderToPaid,
  updateOrderToDelivered,
  getMyOrders,
  getOrders,
  deleteOrder
} = require('../controllers/orderController');

const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

router.use(protect); // All routes after this middleware are protected

router.route('/')
  .post(createOrder)
  .get(authorize('admin'), getOrders);

router.route('/myorders')
  .get(getMyOrders);

router.route('/:id')
  .get(getOrderById)
  .delete(authorize('admin'), deleteOrder);

router.route('/:id/pay')
  .put(updateOrderToPaid);

router.route('/:id/deliver')
  .put(authorize('admin'), updateOrderToDelivered);

module.exports = router;
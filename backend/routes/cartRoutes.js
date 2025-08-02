const express = require('express');
const {
  getCart,
  addToCart,
  updateCartItem,
  removeFromCart,
  clearCart,
  applyCoupon,
  removeCoupon
} = require('../controllers/cartController');
const { protect } = require('../middleware/auth');

const router = express.Router();

// All routes are protected
router.use(protect);

// Cart routes
router.get('/', getCart);
router.post('/', addToCart);
router.put('/:itemId', updateCartItem);
router.delete('/:itemId', removeFromCart);
router.delete('/', clearCart);

// Coupon routes
router.post('/coupon', applyCoupon);
router.delete('/coupon', removeCoupon);

module.exports = router;
const express = require('express');
const {
  getWishlists,
  getWishlist,
  createWishlist,
  updateWishlist,
  deleteWishlist,
  addToWishlist,
  removeFromWishlist,
  moveToCart,
  getSharedWishlist
} = require('../controllers/wishlistController');

const { protect, optionalAuth } = require('../middleware/auth');

const router = express.Router();

// Public routes
router.get('/shared/:shareId', getSharedWishlist);

// Protected routes
router.use(protect);

// Wishlist operations
router.route('/')
  .get(getWishlists)
  .post(createWishlist);

router.route('/:id')
  .get(getWishlist)
  .put(updateWishlist)
  .delete(deleteWishlist);

// Wishlist item operations
router.route('/:id/items')
  .post(addToWishlist);

router.route('/:id/items/:productId')
  .delete(removeFromWishlist);

router.route('/:id/items/:productId/move-to-cart')
  .post(moveToCart);

module.exports = router;
const express = require('express');
const {
  getProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
  addReview,
  updateReview,
  deleteReview,
  getCategories
} = require('../controllers/productController');
const { protect, admin, optionalAuth } = require('../middleware/auth');

const router = express.Router();

// Public routes
router.get('/', optionalAuth, getProducts);
router.get('/categories', getCategories);
router.get('/:id', getProduct);

// Protected routes (authenticated users)
router.post('/:id/reviews', protect, addReview);
router.put('/:id/reviews/:reviewId', protect, updateReview);
router.delete('/:id/reviews/:reviewId', protect, deleteReview);

// Admin only routes
router.post('/', protect, admin, createProduct);
router.put('/:id', protect, admin, updateProduct);
router.delete('/:id', protect, admin, deleteProduct);

module.exports = router;
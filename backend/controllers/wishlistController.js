const Wishlist = require('../models/Wishlist');
const Product = require('../models/Product');
const asyncHandler = require('../middleware/async');
const ErrorResponse = require('../utils/errorResponse');

// @desc    Get user wishlist
// @route   GET /api/wishlist
// @access  Private
const getWishlist = asyncHandler(async (req, res, next) => {
  let wishlist = await Wishlist.findOne({ user: req.user.id }).populate({
    path: 'items.product',
    select: 'name price images inventory isActive ratings'
  });

  if (!wishlist) {
    wishlist = await Wishlist.create({ user: req.user.id });
  }

  // Filter out inactive products
  wishlist.items = wishlist.items.filter(item => 
    item.product && item.product.isActive
  );

  await wishlist.save();

  res.status(200).json({
    success: true,
    data: wishlist
  });
});

// @desc    Add product to wishlist
// @route   POST /api/wishlist
// @access  Private
const addToWishlist = asyncHandler(async (req, res, next) => {
  const { productId } = req.body;

  // Validate product exists and is active
  const product = await Product.findById(productId);
  if (!product || !product.isActive) {
    return next(new ErrorResponse('Product not found or inactive', 404));
  }

  let wishlist = await Wishlist.findOne({ user: req.user.id });
  if (!wishlist) {
    wishlist = await Wishlist.create({ user: req.user.id });
  }

  // Check if product is already in wishlist
  if (wishlist.hasItem(productId)) {
    return next(new ErrorResponse('Product already in wishlist', 400));
  }

  await wishlist.addItem(productId);

  res.status(200).json({
    success: true,
    data: wishlist,
    message: 'Product added to wishlist successfully'
  });
});

// @desc    Remove product from wishlist
// @route   DELETE /api/wishlist/:productId
// @access  Private
const removeFromWishlist = asyncHandler(async (req, res, next) => {
  const { productId } = req.params;

  const wishlist = await Wishlist.findOne({ user: req.user.id });
  if (!wishlist) {
    return next(new ErrorResponse('Wishlist not found', 404));
  }

  await wishlist.removeItem(productId);

  res.status(200).json({
    success: true,
    data: wishlist,
    message: 'Product removed from wishlist successfully'
  });
});

// @desc    Clear wishlist
// @route   DELETE /api/wishlist
// @access  Private
const clearWishlist = asyncHandler(async (req, res, next) => {
  const wishlist = await Wishlist.findOne({ user: req.user.id });
  if (!wishlist) {
    return next(new ErrorResponse('Wishlist not found', 404));
  }

  await wishlist.clearWishlist();

  res.status(200).json({
    success: true,
    data: wishlist,
    message: 'Wishlist cleared successfully'
  });
});

// @desc    Check if product is in wishlist
// @route   GET /api/wishlist/check/:productId
// @access  Private
const checkWishlistItem = asyncHandler(async (req, res, next) => {
  const { productId } = req.params;

  const wishlist = await Wishlist.findOne({ user: req.user.id });
  if (!wishlist) {
    return res.status(200).json({
      success: true,
      data: { isInWishlist: false }
    });
  }

  const isInWishlist = wishlist.hasItem(productId);

  res.status(200).json({
    success: true,
    data: { isInWishlist }
  });
});

module.exports = {
  getWishlist,
  addToWishlist,
  removeFromWishlist,
  clearWishlist,
  checkWishlistItem
};
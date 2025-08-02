const Cart = require('../models/Cart');
const Product = require('../models/Product');
const asyncHandler = require('../middleware/async');
const ErrorResponse = require('../utils/errorResponse');

// @desc    Get user cart
// @route   GET /api/cart
// @access  Private
const getCart = asyncHandler(async (req, res, next) => {
  let cart = await Cart.findOne({ user: req.user.id }).populate({
    path: 'items.product',
    select: 'name price images inventory isActive'
  });

  if (!cart) {
    cart = await Cart.create({ user: req.user.id });
  }

  // Filter out inactive products
  cart.items = cart.items.filter(item => 
    item.product && item.product.isActive
  );

  await cart.save();

  res.status(200).json({
    success: true,
    data: cart
  });
});

// @desc    Add item to cart
// @route   POST /api/cart
// @access  Private
const addToCart = asyncHandler(async (req, res, next) => {
  const { productId, quantity = 1, options = {} } = req.body;

  // Validate product exists and is active
  const product = await Product.findById(productId);
  if (!product || !product.isActive) {
    return next(new ErrorResponse('Product not found or inactive', 404));
  }

  // Check inventory
  if (product.inventory.quantity < quantity) {
    return next(new ErrorResponse('Insufficient inventory', 400));
  }

  let cart = await Cart.findOne({ user: req.user.id });
  if (!cart) {
    cart = await Cart.create({ user: req.user.id });
  }

  // Add product details to cart item
  const cartItem = {
    product: productId,
    name: product.name,
    image: product.images[0]?.url || '',
    price: product.price,
    quantity,
    selectedOptions: options
  };

  // Check if item already exists with same options
  const existingItemIndex = cart.items.findIndex(item => 
    item.product.toString() === productId.toString() &&
    JSON.stringify(item.selectedOptions) === JSON.stringify(options)
  );

  if (existingItemIndex > -1) {
    cart.items[existingItemIndex].quantity += quantity;
  } else {
    cart.items.push(cartItem);
  }

  await cart.save();

  res.status(200).json({
    success: true,
    data: cart,
    message: 'Item added to cart successfully'
  });
});

// @desc    Update cart item quantity
// @route   PUT /api/cart/:itemId
// @access  Private
const updateCartItem = asyncHandler(async (req, res, next) => {
  const { itemId } = req.params;
  const { quantity } = req.body;

  if (!quantity || quantity < 1) {
    return next(new ErrorResponse('Quantity must be at least 1', 400));
  }

  const cart = await Cart.findOne({ user: req.user.id });
  if (!cart) {
    return next(new ErrorResponse('Cart not found', 404));
  }

  const item = cart.items.find(item => item._id.toString() === itemId);
  if (!item) {
    return next(new ErrorResponse('Item not found in cart', 404));
  }

  // Check inventory
  const product = await Product.findById(item.product);
  if (product.inventory.quantity < quantity) {
    return next(new ErrorResponse('Insufficient inventory', 400));
  }

  item.quantity = quantity;
  await cart.save();

  res.status(200).json({
    success: true,
    data: cart,
    message: 'Cart item updated successfully'
  });
});

// @desc    Remove item from cart
// @route   DELETE /api/cart/:itemId
// @access  Private
const removeFromCart = asyncHandler(async (req, res, next) => {
  const { itemId } = req.params;

  const cart = await Cart.findOne({ user: req.user.id });
  if (!cart) {
    return next(new ErrorResponse('Cart not found', 404));
  }

  cart.items = cart.items.filter(item => item._id.toString() !== itemId);
  await cart.save();

  res.status(200).json({
    success: true,
    data: cart,
    message: 'Item removed from cart successfully'
  });
});

// @desc    Clear cart
// @route   DELETE /api/cart
// @access  Private
const clearCart = asyncHandler(async (req, res, next) => {
  const cart = await Cart.findOne({ user: req.user.id });
  if (!cart) {
    return next(new ErrorResponse('Cart not found', 404));
  }

  await cart.clearCart();

  res.status(200).json({
    success: true,
    data: cart,
    message: 'Cart cleared successfully'
  });
});

// @desc    Apply coupon to cart
// @route   POST /api/cart/coupon
// @access  Private
const applyCoupon = asyncHandler(async (req, res, next) => {
  const { code } = req.body;

  // This is a simplified coupon system
  // In a real application, you would validate against a coupon database
  const validCoupons = {
    'SAVE10': { discount: 10, type: 'percentage' },
    'SAVE20': { discount: 20, type: 'percentage' },
    'FREESHIP': { discount: 5.99, type: 'fixed' }
  };

  const coupon = validCoupons[code];
  if (!coupon) {
    return next(new ErrorResponse('Invalid coupon code', 400));
  }

  const cart = await Cart.findOne({ user: req.user.id });
  if (!cart) {
    return next(new ErrorResponse('Cart not found', 404));
  }

  await cart.applyCoupon(code, coupon.discount, coupon.type);

  res.status(200).json({
    success: true,
    data: cart,
    message: 'Coupon applied successfully'
  });
});

// @desc    Remove coupon from cart
// @route   DELETE /api/cart/coupon
// @access  Private
const removeCoupon = asyncHandler(async (req, res, next) => {
  const cart = await Cart.findOne({ user: req.user.id });
  if (!cart) {
    return next(new ErrorResponse('Cart not found', 404));
  }

  await cart.removeCoupon();

  res.status(200).json({
    success: true,
    data: cart,
    message: 'Coupon removed successfully'
  });
});

module.exports = {
  getCart,
  addToCart,
  updateCartItem,
  removeFromCart,
  clearCart,
  applyCoupon,
  removeCoupon
};
const Product = require('../models/Product');
const { asyncHandler, ErrorResponse } = require('../middleware/errorHandler');

// @desc    Get all products
// @route   GET /api/products
// @access  Public
const getProducts = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  // Build query
  let query = { isActive: true };

  // Search functionality
  if (req.query.search) {
    query.$text = { $search: req.query.search };
  }

  // Category filter
  if (req.query.category) {
    query.category = req.query.category;
  }

  // Subcategory filter
  if (req.query.subcategory) {
    query.subcategory = req.query.subcategory;
  }

  // Brand filter
  if (req.query.brand) {
    query.brand = req.query.brand;
  }

  // Price range filter
  if (req.query.minPrice || req.query.maxPrice) {
    query.price = {};
    if (req.query.minPrice) {
      query.price.$gte = parseFloat(req.query.minPrice);
    }
    if (req.query.maxPrice) {
      query.price.$lte = parseFloat(req.query.maxPrice);
    }
  }

  // Rating filter
  if (req.query.minRating) {
    query['ratings.average'] = { $gte: parseFloat(req.query.minRating) };
  }

  // Sort options
  let sortBy = {};
  if (req.query.sort) {
    switch (req.query.sort) {
      case 'price_asc':
        sortBy.price = 1;
        break;
      case 'price_desc':
        sortBy.price = -1;
        break;
      case 'rating':
        sortBy['ratings.average'] = -1;
        break;
      case 'newest':
        sortBy.createdAt = -1;
        break;
      case 'name':
        sortBy.name = 1;
        break;
      default:
        sortBy.createdAt = -1;
    }
  } else {
    sortBy.createdAt = -1;
  }

  const products = await Product.find(query)
    .populate('createdBy', 'name')
    .sort(sortBy)
    .skip(skip)
    .limit(limit);

  const total = await Product.countDocuments(query);

  res.json({
    success: true,
    count: products.length,
    pagination: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit)
    },
    data: products
  });
});

// @desc    Get single product
// @route   GET /api/products/:id
// @access  Public
const getProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id)
    .populate('createdBy', 'name')
    .populate('reviews.user', 'name');

  if (!product || !product.isActive) {
    throw new ErrorResponse(`Product not found with id of ${req.params.id}`, 404);
  }

  res.json({
    success: true,
    data: product
  });
});

// @desc    Create new product
// @route   POST /api/products
// @access  Private/Admin
const createProduct = asyncHandler(async (req, res) => {
  // Add user to req.body
  req.body.createdBy = req.user.id;

  const product = await Product.create(req.body);

  res.status(201).json({
    success: true,
    data: product
  });
});

// @desc    Update product
// @route   PUT /api/products/:id
// @access  Private/Admin
const updateProduct = asyncHandler(async (req, res) => {
  let product = await Product.findById(req.params.id);

  if (!product) {
    throw new ErrorResponse(`Product not found with id of ${req.params.id}`, 404);
  }

  product = await Product.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });

  res.json({
    success: true,
    data: product
  });
});

// @desc    Delete product
// @route   DELETE /api/products/:id
// @access  Private/Admin
const deleteProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    throw new ErrorResponse(`Product not found with id of ${req.params.id}`, 404);
  }

  // Soft delete - set isActive to false
  product.isActive = false;
  await product.save();

  res.json({
    success: true,
    data: {}
  });
});

// @desc    Add product review
// @route   POST /api/products/:id/reviews
// @access  Private
const addReview = asyncHandler(async (req, res) => {
  const { rating, comment } = req.body;

  const product = await Product.findById(req.params.id);

  if (!product) {
    throw new ErrorResponse(`Product not found with id of ${req.params.id}`, 404);
  }

  // Check if user already reviewed this product
  const alreadyReviewed = product.reviews.find(
    review => review.user.toString() === req.user.id.toString()
  );

  if (alreadyReviewed) {
    throw new ErrorResponse('Product already reviewed', 400);
  }

  const review = {
    name: req.user.name,
    rating: Number(rating),
    comment,
    user: req.user.id
  };

  product.reviews.push(review);
  await product.save();

  res.status(201).json({
    success: true,
    message: 'Review added',
    data: product
  });
});

// @desc    Update product review
// @route   PUT /api/products/:id/reviews/:reviewId
// @access  Private
const updateReview = asyncHandler(async (req, res) => {
  const { rating, comment } = req.body;

  const product = await Product.findById(req.params.id);

  if (!product) {
    throw new ErrorResponse(`Product not found with id of ${req.params.id}`, 404);
  }

  const review = product.reviews.find(
    review => review._id.toString() === req.params.reviewId.toString()
  );

  if (!review) {
    throw new ErrorResponse('Review not found', 404);
  }

  // Check if review belongs to user
  if (review.user.toString() !== req.user.id.toString()) {
    throw new ErrorResponse('Not authorized to update this review', 401);
  }

  review.rating = rating;
  review.comment = comment;

  await product.save();

  res.json({
    success: true,
    message: 'Review updated',
    data: product
  });
});

// @desc    Delete product review
// @route   DELETE /api/products/:id/reviews/:reviewId
// @access  Private
const deleteReview = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    throw new ErrorResponse(`Product not found with id of ${req.params.id}`, 404);
  }

  const review = product.reviews.find(
    review => review._id.toString() === req.params.reviewId.toString()
  );

  if (!review) {
    throw new ErrorResponse('Review not found', 404);
  }

  // Check if review belongs to user or user is admin
  if (review.user.toString() !== req.user.id.toString() && req.user.role !== 'admin') {
    throw new ErrorResponse('Not authorized to delete this review', 401);
  }

  product.reviews = product.reviews.filter(
    review => review._id.toString() !== req.params.reviewId.toString()
  );

  await product.save();

  res.json({
    success: true,
    message: 'Review deleted',
    data: {}
  });
});

// @desc    Get product categories
// @route   GET /api/products/categories
// @access  Public
const getCategories = asyncHandler(async (req, res) => {
  const categories = await Product.aggregate([
    { $match: { isActive: true } },
    { $group: { _id: '$category', count: { $sum: 1 } } },
    { $sort: { _id: 1 } }
  ]);

  res.json({
    success: true,
    data: categories
  });
});

module.exports = {
  getProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
  addReview,
  updateReview,
  deleteReview,
  getCategories
};
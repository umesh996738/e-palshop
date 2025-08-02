const Order = require('../models/Order');
const Product = require('../models/Product');
const { asyncHandler, ErrorResponse } = require('../middleware/errorHandler');

// @desc    Create new order
// @route   POST /api/orders
// @access  Private
const createOrder = asyncHandler(async (req, res) => {
  const {
    orderItems,
    shippingAddress,
    paymentMethod,
    itemsPrice,
    taxPrice,
    shippingPrice,
    totalPrice
  } = req.body;

  if (orderItems && orderItems.length === 0) {
    throw new ErrorResponse('No order items', 400);
  }

  // Verify products exist and have sufficient inventory
  for (let item of orderItems) {
    const product = await Product.findById(item.product);
    if (!product) {
      throw new ErrorResponse(`Product not found: ${item.product}`, 404);
    }
    if (product.inventory.quantity < item.quantity) {
      throw new ErrorResponse(`Insufficient inventory for ${product.name}`, 400);
    }
  }

  const order = new Order({
    orderItems,
    user: req.user._id,
    shippingAddress,
    paymentMethod,
    itemsPrice,
    taxPrice,
    shippingPrice,
    totalPrice
  });

  const createdOrder = await order.save();

  // Update product inventory
  for (let item of orderItems) {
    await Product.findByIdAndUpdate(item.product, {
      $inc: { 'inventory.reserved': item.quantity }
    });
  }

  res.status(201).json({
    success: true,
    data: createdOrder
  });
});

// @desc    Get order by ID
// @route   GET /api/orders/:id
// @access  Private
const getOrderById = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id)
    .populate('user', 'name email')
    .populate('orderItems.product', 'name price images');

  if (!order) {
    throw new ErrorResponse('Order not found', 404);
  }

  // Users can only see their own orders, admins can see all
  if (order.user._id.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
    throw new ErrorResponse('Not authorized to view this order', 401);
  }

  res.json({
    success: true,
    data: order
  });
});

// @desc    Update order to paid
// @route   PUT /api/orders/:id/pay
// @access  Private
const updateOrderToPaid = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);

  if (!order) {
    throw new ErrorResponse('Order not found', 404);
  }

  // Check if user owns the order or is admin
  if (order.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
    throw new ErrorResponse('Not authorized to update this order', 401);
  }

  order.isPaid = true;
  order.paidAt = Date.now();
  order.paymentResult = {
    id: req.body.id,
    status: req.body.status,
    update_time: req.body.update_time,
    email_address: req.body.payer.email_address
  };

  if (order.orderStatus === 'pending') {
    order.orderStatus = 'confirmed';
  }

  const updatedOrder = await order.save();

  // Update product inventory - move from reserved to sold
  for (let item of order.orderItems) {
    await Product.findByIdAndUpdate(item.product, {
      $inc: {
        'inventory.quantity': -item.quantity,
        'inventory.reserved': -item.quantity
      }
    });
  }

  res.json({
    success: true,
    data: updatedOrder
  });
});

// @desc    Update order to delivered
// @route   PUT /api/orders/:id/deliver
// @access  Private/Admin
const updateOrderToDelivered = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);

  if (!order) {
    throw new ErrorResponse('Order not found', 404);
  }

  order.isDelivered = true;
  order.deliveredAt = Date.now();
  order.orderStatus = 'delivered';

  const updatedOrder = await order.save();

  res.json({
    success: true,
    data: updatedOrder
  });
});

// @desc    Update order status
// @route   PUT /api/orders/:id/status
// @access  Private/Admin
const updateOrderStatus = asyncHandler(async (req, res) => {
  const { status, trackingNumber, notes } = req.body;

  const order = await Order.findById(req.params.id);

  if (!order) {
    throw new ErrorResponse('Order not found', 404);
  }

  const validStatuses = ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled', 'refunded'];
  
  if (!validStatuses.includes(status)) {
    throw new ErrorResponse('Invalid order status', 400);
  }

  order.orderStatus = status;
  
  if (trackingNumber) {
    order.trackingNumber = trackingNumber;
  }
  
  if (notes) {
    order.notes = notes;
  }

  if (status === 'delivered') {
    order.isDelivered = true;
    order.deliveredAt = Date.now();
  }

  // If order is cancelled, release reserved inventory
  if (status === 'cancelled' && order.orderStatus !== 'cancelled') {
    for (let item of order.orderItems) {
      await Product.findByIdAndUpdate(item.product, {
        $inc: { 'inventory.reserved': -item.quantity }
      });
    }
  }

  const updatedOrder = await order.save();

  res.json({
    success: true,
    data: updatedOrder
  });
});

// @desc    Get logged in user orders
// @route   GET /api/orders/myorders
// @access  Private
const getMyOrders = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  const orders = await Order.find({ user: req.user._id })
    .populate('orderItems.product', 'name price images')
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);

  const total = await Order.countDocuments({ user: req.user._id });

  res.json({
    success: true,
    count: orders.length,
    pagination: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit)
    },
    data: orders
  });
});

// @desc    Get all orders
// @route   GET /api/orders
// @access  Private/Admin
const getOrders = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 20;
  const skip = (page - 1) * limit;

  // Build query
  let query = {};

  // Filter by status
  if (req.query.status) {
    query.orderStatus = req.query.status;
  }

  // Filter by payment status
  if (req.query.isPaid !== undefined) {
    query.isPaid = req.query.isPaid === 'true';
  }

  // Filter by delivery status
  if (req.query.isDelivered !== undefined) {
    query.isDelivered = req.query.isDelivered === 'true';
  }

  // Date range filter
  if (req.query.startDate || req.query.endDate) {
    query.createdAt = {};
    if (req.query.startDate) {
      query.createdAt.$gte = new Date(req.query.startDate);
    }
    if (req.query.endDate) {
      query.createdAt.$lte = new Date(req.query.endDate);
    }
  }

  const orders = await Order.find(query)
    .populate('user', 'name email')
    .populate('orderItems.product', 'name price')
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);

  const total = await Order.countDocuments(query);

  res.json({
    success: true,
    count: orders.length,
    pagination: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit)
    },
    data: orders
  });
});

// @desc    Cancel order
// @route   PUT /api/orders/:id/cancel
// @access  Private
const cancelOrder = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);

  if (!order) {
    throw new ErrorResponse('Order not found', 404);
  }

  // Check if user owns the order or is admin
  if (order.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
    throw new ErrorResponse('Not authorized to cancel this order', 401);
  }

  // Can only cancel orders that are pending or confirmed
  if (!['pending', 'confirmed'].includes(order.orderStatus)) {
    throw new ErrorResponse('Cannot cancel order at this stage', 400);
  }

  order.orderStatus = 'cancelled';

  // Release reserved inventory
  for (let item of order.orderItems) {
    await Product.findByIdAndUpdate(item.product, {
      $inc: { 'inventory.reserved': -item.quantity }
    });
  }

  const updatedOrder = await order.save();

  res.json({
    success: true,
    data: updatedOrder
  });
});

// @desc    Get order statistics
// @route   GET /api/orders/stats
// @access  Private/Admin
const getOrderStats = asyncHandler(async (req, res) => {
  const stats = await Order.aggregate([
    {
      $group: {
        _id: null,
        totalOrders: { $sum: 1 },
        totalRevenue: { $sum: '$totalPrice' },
        avgOrderValue: { $avg: '$totalPrice' }
      }
    }
  ]);

  const statusStats = await Order.aggregate([
    {
      $group: {
        _id: '$orderStatus',
        count: { $sum: 1 }
      }
    }
  ]);

  const monthlyStats = await Order.aggregate([
    {
      $group: {
        _id: {
          year: { $year: '$createdAt' },
          month: { $month: '$createdAt' }
        },
        orders: { $sum: 1 },
        revenue: { $sum: '$totalPrice' }
      }
    },
    { $sort: { '_id.year': -1, '_id.month': -1 } },
    { $limit: 12 }
  ]);

  res.json({
    success: true,
    data: {
      overview: stats[0] || { totalOrders: 0, totalRevenue: 0, avgOrderValue: 0 },
      statusBreakdown: statusStats,
      monthlyTrends: monthlyStats
    }
  });
});

module.exports = {
  createOrder,
  getOrderById,
  updateOrderToPaid,
  updateOrderToDelivered,
  updateOrderStatus,
  getMyOrders,
  getOrders,
  cancelOrder,
  getOrderStats
};
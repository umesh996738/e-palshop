const User = require('../models/User');
const Product = require('../models/Product');
const Order = require('../models/Order');
const asyncHandler = require('../middleware/async');
const ErrorResponse = require('../utils/errorResponse');

// @desc    Get admin dashboard stats
// @route   GET /api/admin/dashboard
// @access  Private/Admin
const getDashboardStats = asyncHandler(async (req, res, next) => {
  // Get total counts
  const totalUsers = await User.countDocuments();
  const totalProducts = await Product.countDocuments();
  const totalOrders = await Order.countDocuments();
  
  // Get recent orders
  const recentOrders = await Order.find()
    .populate('user', 'name email')
    .sort('-createdAt')
    .limit(5);
  
  // Get revenue stats
  const revenueStats = await Order.aggregate([
    {
      $match: {
        orderStatus: { $in: ['confirmed', 'processing', 'shipped', 'delivered'] }
      }
    },
    {
      $group: {
        _id: null,
        totalRevenue: { $sum: '$totalPrice' },
        averageOrderValue: { $avg: '$totalPrice' }
      }
    }
  ]);
  
  // Get top selling products
  const topProducts = await Order.aggregate([
    { $unwind: '$orderItems' },
    {
      $group: {
        _id: '$orderItems.product',
        totalSold: { $sum: '$orderItems.quantity' },
        totalRevenue: { $sum: { $multiply: ['$orderItems.price', '$orderItems.quantity'] } }
      }
    },
    { $sort: { totalSold: -1 } },
    { $limit: 5 },
    {
      $lookup: {
        from: 'products',
        localField: '_id',
        foreignField: '_id',
        as: 'product'
      }
    },
    { $unwind: '$product' },
    {
      $project: {
        name: '$product.name',
        totalSold: 1,
        totalRevenue: 1
      }
    }
  ]);
  
  // Get order status distribution
  const orderStatusStats = await Order.aggregate([
    {
      $group: {
        _id: '$orderStatus',
        count: { $sum: 1 }
      }
    }
  ]);
  
  res.status(200).json({
    success: true,
    data: {
      totalUsers,
      totalProducts,
      totalOrders,
      recentOrders,
      revenueStats: revenueStats[0] || { totalRevenue: 0, averageOrderValue: 0 },
      topProducts,
      orderStatusStats
    }
  });
});

// @desc    Get all users (admin only)
// @route   GET /api/admin/users
// @access  Private/Admin
const getAllUsers = asyncHandler(async (req, res, next) => {
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 10;
  const startIndex = (page - 1) * limit;
  
  const users = await User.find()
    .select('-password')
    .skip(startIndex)
    .limit(limit)
    .sort('-createdAt');
  
  const total = await User.countDocuments();
  
  const pagination = {
    page,
    limit,
    total,
    pages: Math.ceil(total / limit)
  };
  
  res.status(200).json({
    success: true,
    count: users.length,
    pagination,
    data: users
  });
});

// @desc    Update user role (admin only)
// @route   PUT /api/admin/users/:id/role
// @access  Private/Admin
const updateUserRole = asyncHandler(async (req, res, next) => {
  const { role } = req.body;
  const { id } = req.params;
  
  if (!['admin', 'distributor', 'customer'].includes(role)) {
    return next(new ErrorResponse('Invalid role', 400));
  }
  
  const user = await User.findByIdAndUpdate(
    id,
    { role },
    { new: true, runValidators: true }
  ).select('-password');
  
  if (!user) {
    return next(new ErrorResponse('User not found', 404));
  }
  
  res.status(200).json({
    success: true,
    data: user
  });
});

// @desc    Get sales report
// @route   GET /api/admin/reports/sales
// @access  Private/Admin
const getSalesReport = asyncHandler(async (req, res, next) => {
  const { startDate, endDate } = req.query;
  
  let dateFilter = {};
  if (startDate && endDate) {
    dateFilter = {
      createdAt: {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      }
    };
  }
  
  const salesReport = await Order.aggregate([
    { $match: { ...dateFilter, orderStatus: { $ne: 'cancelled' } } },
    {
      $group: {
        _id: {
          year: { $year: '$createdAt' },
          month: { $month: '$createdAt' },
          day: { $dayOfMonth: '$createdAt' }
        },
        totalSales: { $sum: '$totalPrice' },
        orderCount: { $sum: 1 },
        averageOrderValue: { $avg: '$totalPrice' }
      }
    },
    { $sort: { '_id.year': 1, '_id.month': 1, '_id.day': 1 } }
  ]);
  
  res.status(200).json({
    success: true,
    data: salesReport
  });
});

// @desc    Get inventory report
// @route   GET /api/admin/reports/inventory
// @access  Private/Admin
const getInventoryReport = asyncHandler(async (req, res, next) => {
  const inventoryReport = await Product.aggregate([
    {
      $project: {
        name: 1,
        sku: 1,
        category: 1,
        'inventory.quantity': 1,
        'inventory.reserved': 1,
        available: { $subtract: ['$inventory.quantity', '$inventory.reserved'] },
        lowStock: { $lt: [{ $subtract: ['$inventory.quantity', '$inventory.reserved'] }, 10] }
      }
    },
    { $sort: { available: 1 } }
  ]);
  
  const lowStockItems = inventoryReport.filter(item => item.lowStock);
  const outOfStockItems = inventoryReport.filter(item => item.available <= 0);
  
  res.status(200).json({
    success: true,
    data: {
      inventoryReport,
      lowStockItems,
      outOfStockItems,
      summary: {
        totalProducts: inventoryReport.length,
        lowStockCount: lowStockItems.length,
        outOfStockCount: outOfStockItems.length
      }
    }
  });
});

// @desc    Get user analytics
// @route   GET /api/admin/analytics/users
// @access  Private/Admin
const getUserAnalytics = asyncHandler(async (req, res, next) => {
  const userStats = await User.aggregate([
    {
      $group: {
        _id: '$role',
        count: { $sum: 1 }
      }
    }
  ]);
  
  const recentRegistrations = await User.find()
    .select('name email role createdAt')
    .sort('-createdAt')
    .limit(10);
  
  const activeUsers = await User.countDocuments({ isActive: true });
  const inactiveUsers = await User.countDocuments({ isActive: false });
  
  res.status(200).json({
    success: true,
    data: {
      userStats,
      recentRegistrations,
      activeUsers,
      inactiveUsers
    }
  });
});

module.exports = {
  getDashboardStats,
  getAllUsers,
  updateUserRole,
  getSalesReport,
  getInventoryReport,
  getUserAnalytics
};
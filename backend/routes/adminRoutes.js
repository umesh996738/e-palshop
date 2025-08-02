const express = require('express');
const {
  getDashboardStats,
  getAllUsers,
  updateUserRole,
  getSalesReport,
  getInventoryReport,
  getUserAnalytics
} = require('../controllers/adminController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

// All routes are protected and require admin role
router.use(protect);
router.use(authorize('admin'));

// Dashboard
router.get('/dashboard', getDashboardStats);

// User management
router.get('/users', getAllUsers);
router.put('/users/:id/role', updateUserRole);

// Reports
router.get('/reports/sales', getSalesReport);
router.get('/reports/inventory', getInventoryReport);

// Analytics
router.get('/analytics/users', getUserAnalytics);

module.exports = router;
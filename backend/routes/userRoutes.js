const express = require('express');
const router = express.Router();
const {
  getUsers,
  getUserById,
  updateUser,
  deleteUser,
  getUserStats,
  toggleUserStatus
} = require('../controllers/userController');
const { protect, authorize } = require('../middleware/auth');

// All routes require admin access
router.use(protect, authorize('admin'));

router.route('/')
  .get(getUsers);

router.get('/stats', getUserStats);

router.route('/:id')
  .get(getUserById)
  .put(updateUser)
  .delete(deleteUser);

router.put('/:id/toggle-status', toggleUserStatus);

module.exports = router;
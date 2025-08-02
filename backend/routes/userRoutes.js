const express = require('express');
const {
  getUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
  toggleUserStatus,
  updateUserRole,
  getUserStats
} = require('../controllers/userController');
const { protect, admin } = require('../middleware/auth');

const router = express.Router();

// All routes are admin only
router.use(protect, admin);

router.get('/', getUsers);
router.get('/stats', getUserStats);
router.post('/', createUser);
router.get('/:id', getUserById);
router.put('/:id', updateUser);
router.delete('/:id', deleteUser);
router.put('/:id/toggle-status', toggleUserStatus);
router.put('/:id/role', updateUserRole);

module.exports = router;
const User = require('../models/User');
const { asyncHandler, ErrorResponse } = require('../middleware/errorHandler');

// @desc    Get all users
// @route   GET /api/users
// @access  Private/Admin
const getUsers = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 20;
  const skip = (page - 1) * limit;

  // Build query
  let query = {};

  // Search by name or email
  if (req.query.search) {
    query.$or = [
      { name: { $regex: req.query.search, $options: 'i' } },
      { email: { $regex: req.query.search, $options: 'i' } }
    ];
  }

  // Filter by role
  if (req.query.role) {
    query.role = req.query.role;
  }

  // Filter by active status
  if (req.query.isActive !== undefined) {
    query.isActive = req.query.isActive === 'true';
  }

  const users = await User.find(query)
    .select('-password -resetPasswordToken -resetPasswordExpire')
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);

  const total = await User.countDocuments(query);

  res.json({
    success: true,
    count: users.length,
    pagination: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit)
    },
    data: users
  });
});

// @desc    Get user by ID
// @route   GET /api/users/:id
// @access  Private/Admin
const getUserById = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id).select('-password');

  if (!user) {
    throw new ErrorResponse(`User not found with id of ${req.params.id}`, 404);
  }

  res.json({
    success: true,
    data: user
  });
});

// @desc    Create user
// @route   POST /api/users
// @access  Private/Admin
const createUser = asyncHandler(async (req, res) => {
  const { name, email, password, role } = req.body;

  // Check if user exists
  const userExists = await User.findOne({ email });

  if (userExists) {
    throw new ErrorResponse('User already exists', 400);
  }

  const user = await User.create({
    name,
    email,
    password,
    role: role || 'user'
  });

  res.status(201).json({
    success: true,
    data: user
  });
});

// @desc    Update user
// @route   PUT /api/users/:id
// @access  Private/Admin
const updateUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    throw new ErrorResponse(`User not found with id of ${req.params.id}`, 404);
  }

  const fieldsToUpdate = {
    name: req.body.name,
    email: req.body.email,
    role: req.body.role,
    isActive: req.body.isActive,
    phone: req.body.phone,
    address: req.body.address
  };

  // Remove undefined fields
  Object.keys(fieldsToUpdate).forEach(key => 
    fieldsToUpdate[key] === undefined && delete fieldsToUpdate[key]
  );

  const updatedUser = await User.findByIdAndUpdate(
    req.params.id,
    fieldsToUpdate,
    {
      new: true,
      runValidators: true
    }
  );

  res.json({
    success: true,
    data: updatedUser
  });
});

// @desc    Delete user
// @route   DELETE /api/users/:id
// @access  Private/Admin
const deleteUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    throw new ErrorResponse(`User not found with id of ${req.params.id}`, 404);
  }

  // Prevent deleting the last admin
  if (user.role === 'admin') {
    const adminCount = await User.countDocuments({ role: 'admin', isActive: true });
    if (adminCount <= 1) {
      throw new ErrorResponse('Cannot delete the last admin user', 400);
    }
  }

  // Soft delete - deactivate user instead of removing
  user.isActive = false;
  await user.save();

  res.json({
    success: true,
    data: {}
  });
});

// @desc    Activate/Deactivate user
// @route   PUT /api/users/:id/toggle-status
// @access  Private/Admin
const toggleUserStatus = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    throw new ErrorResponse(`User not found with id of ${req.params.id}`, 404);
  }

  // Prevent deactivating the last admin
  if (user.role === 'admin' && user.isActive) {
    const activeAdminCount = await User.countDocuments({ 
      role: 'admin', 
      isActive: true,
      _id: { $ne: user._id }
    });
    
    if (activeAdminCount === 0) {
      throw new ErrorResponse('Cannot deactivate the last active admin user', 400);
    }
  }

  user.isActive = !user.isActive;
  await user.save();

  res.json({
    success: true,
    data: user
  });
});

// @desc    Update user role
// @route   PUT /api/users/:id/role
// @access  Private/Admin
const updateUserRole = asyncHandler(async (req, res) => {
  const { role } = req.body;

  if (!['user', 'admin'].includes(role)) {
    throw new ErrorResponse('Invalid role', 400);
  }

  const user = await User.findById(req.params.id);

  if (!user) {
    throw new ErrorResponse(`User not found with id of ${req.params.id}`, 404);
  }

  // Prevent changing role of the last admin
  if (user.role === 'admin' && role !== 'admin') {
    const adminCount = await User.countDocuments({ 
      role: 'admin', 
      isActive: true,
      _id: { $ne: user._id }
    });
    
    if (adminCount === 0) {
      throw new ErrorResponse('Cannot change role of the last admin user', 400);
    }
  }

  user.role = role;
  await user.save();

  res.json({
    success: true,
    data: user
  });
});

// @desc    Get user statistics
// @route   GET /api/users/stats
// @access  Private/Admin
const getUserStats = asyncHandler(async (req, res) => {
  const totalUsers = await User.countDocuments();
  const activeUsers = await User.countDocuments({ isActive: true });
  const adminUsers = await User.countDocuments({ role: 'admin', isActive: true });
  const regularUsers = await User.countDocuments({ role: 'user', isActive: true });

  // Users registered in the last 30 days
  const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
  const newUsers = await User.countDocuments({ 
    createdAt: { $gte: thirtyDaysAgo }
  });

  // Monthly user registrations for the last 12 months
  const monthlyRegistrations = await User.aggregate([
    {
      $group: {
        _id: {
          year: { $year: '$createdAt' },
          month: { $month: '$createdAt' }
        },
        count: { $sum: 1 }
      }
    },
    { $sort: { '_id.year': -1, '_id.month': -1 } },
    { $limit: 12 }
  ]);

  res.json({
    success: true,
    data: {
      overview: {
        totalUsers,
        activeUsers,
        adminUsers,
        regularUsers,
        newUsersLast30Days: newUsers
      },
      monthlyRegistrations
    }
  });
});

module.exports = {
  getUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
  toggleUserStatus,
  updateUserRole,
  getUserStats
};
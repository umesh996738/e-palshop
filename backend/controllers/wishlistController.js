const Wishlist = require('../models/Wishlist');
const Product = require('../models/Product');
const Cart = require('../models/Cart');

// @desc    Get user's wishlists
// @route   GET /api/wishlist
// @access  Private
const getWishlists = async (req, res) => {
  try {
    const wishlists = await Wishlist.find({ user: req.user._id })
      .populate({
        path: 'items.product',
        select: 'name price images sku inventory distributorPrice'
      })
      .sort({ isDefault: -1, createdAt: -1 });

    res.json({
      success: true,
      data: wishlists
    });
  } catch (error) {
    console.error('Get wishlists error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching wishlists'
    });
  }
};

// @desc    Get specific wishlist
// @route   GET /api/wishlist/:id
// @access  Private
const getWishlist = async (req, res) => {
  try {
    const wishlist = await Wishlist.findOne({
      _id: req.params.id,
      user: req.user._id
    }).populate({
      path: 'items.product',
      select: 'name price images sku inventory distributorPrice'
    });

    if (!wishlist) {
      return res.status(404).json({
        success: false,
        message: 'Wishlist not found'
      });
    }

    res.json({
      success: true,
      data: wishlist
    });
  } catch (error) {
    console.error('Get wishlist error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching wishlist'
    });
  }
};

// @desc    Create new wishlist
// @route   POST /api/wishlist
// @access  Private
const createWishlist = async (req, res) => {
  try {
    const { name, description, isDefault = false } = req.body;

    if (!name) {
      return res.status(400).json({
        success: false,
        message: 'Wishlist name is required'
      });
    }

    const wishlist = await Wishlist.create({
      user: req.user._id,
      name,
      description,
      isDefault
    });

    res.status(201).json({
      success: true,
      message: 'Wishlist created successfully',
      data: wishlist
    });
  } catch (error) {
    console.error('Create wishlist error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while creating wishlist'
    });
  }
};

// @desc    Update wishlist
// @route   PUT /api/wishlist/:id
// @access  Private
const updateWishlist = async (req, res) => {
  try {
    const { name, description, isDefault, isPublic } = req.body;

    const wishlist = await Wishlist.findOne({
      _id: req.params.id,
      user: req.user._id
    });

    if (!wishlist) {
      return res.status(404).json({
        success: false,
        message: 'Wishlist not found'
      });
    }

    wishlist.name = name || wishlist.name;
    wishlist.description = description !== undefined ? description : wishlist.description;
    wishlist.isDefault = isDefault !== undefined ? isDefault : wishlist.isDefault;
    wishlist.isPublic = isPublic !== undefined ? isPublic : wishlist.isPublic;

    await wishlist.save();

    res.json({
      success: true,
      message: 'Wishlist updated successfully',
      data: wishlist
    });
  } catch (error) {
    console.error('Update wishlist error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while updating wishlist'
    });
  }
};

// @desc    Delete wishlist
// @route   DELETE /api/wishlist/:id
// @access  Private
const deleteWishlist = async (req, res) => {
  try {
    const wishlist = await Wishlist.findOne({
      _id: req.params.id,
      user: req.user._id
    });

    if (!wishlist) {
      return res.status(404).json({
        success: false,
        message: 'Wishlist not found'
      });
    }

    if (wishlist.isDefault) {
      return res.status(400).json({
        success: false,
        message: 'Cannot delete default wishlist'
      });
    }

    await wishlist.deleteOne();

    res.json({
      success: true,
      message: 'Wishlist deleted successfully'
    });
  } catch (error) {
    console.error('Delete wishlist error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while deleting wishlist'
    });
  }
};

// @desc    Add item to wishlist
// @route   POST /api/wishlist/:id/items
// @access  Private
const addToWishlist = async (req, res) => {
  try {
    const { productId, priority = 'medium', notes = '' } = req.body;

    if (!productId) {
      return res.status(400).json({
        success: false,
        message: 'Product ID is required'
      });
    }

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    let wishlist = await Wishlist.findOne({
      _id: req.params.id,
      user: req.user._id
    });

    if (!wishlist) {
      // If no specific wishlist ID provided, use default or create one
      wishlist = await Wishlist.findOne({
        user: req.user._id,
        isDefault: true
      });

      if (!wishlist) {
        wishlist = await Wishlist.create({
          user: req.user._id,
          name: 'My Wishlist',
          isDefault: true
        });
      }
    }

    // Check if item already exists in wishlist
    const existingItem = wishlist.items.find(item => 
      item.product.toString() === productId
    );

    if (existingItem) {
      return res.status(400).json({
        success: false,
        message: 'Item already exists in wishlist'
      });
    }

    wishlist.addItem(productId, priority, notes);
    await wishlist.save();

    await wishlist.populate({
      path: 'items.product',
      select: 'name price images sku inventory distributorPrice'
    });

    res.status(201).json({
      success: true,
      message: 'Item added to wishlist',
      data: wishlist
    });
  } catch (error) {
    console.error('Add to wishlist error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while adding item to wishlist'
    });
  }
};

// @desc    Remove item from wishlist
// @route   DELETE /api/wishlist/:id/items/:productId
// @access  Private
const removeFromWishlist = async (req, res) => {
  try {
    const { id, productId } = req.params;

    const wishlist = await Wishlist.findOne({
      _id: id,
      user: req.user._id
    });

    if (!wishlist) {
      return res.status(404).json({
        success: false,
        message: 'Wishlist not found'
      });
    }

    wishlist.removeItem(productId);
    await wishlist.save();

    res.json({
      success: true,
      message: 'Item removed from wishlist',
      data: wishlist
    });
  } catch (error) {
    console.error('Remove from wishlist error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while removing item from wishlist'
    });
  }
};

// @desc    Move item from wishlist to cart
// @route   POST /api/wishlist/:id/items/:productId/move-to-cart
// @access  Private
const moveToCart = async (req, res) => {
  try {
    const { id, productId } = req.params;
    const { quantity = 1 } = req.body;

    const wishlist = await Wishlist.findOne({
      _id: id,
      user: req.user._id
    });

    if (!wishlist) {
      return res.status(404).json({
        success: false,
        message: 'Wishlist not found'
      });
    }

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    // Check inventory
    if (product.inventory.quantity < quantity) {
      return res.status(400).json({
        success: false,
        message: 'Insufficient inventory'
      });
    }

    // Get or create cart
    let cart = await Cart.findOne({ user: req.user._id });
    if (!cart) {
      cart = new Cart({ user: req.user._id, items: [] });
    }

    // Add to cart
    cart.addItem(productId, quantity, product.price);
    await cart.save();

    // Remove from wishlist
    wishlist.removeItem(productId);
    await wishlist.save();

    res.json({
      success: true,
      message: 'Item moved to cart successfully',
      data: {
        wishlist,
        cart
      }
    });
  } catch (error) {
    console.error('Move to cart error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while moving item to cart'
    });
  }
};

// @desc    Get public wishlist by share ID
// @route   GET /api/wishlist/shared/:shareId
// @access  Public
const getSharedWishlist = async (req, res) => {
  try {
    const { shareId } = req.params;

    const wishlist = await Wishlist.findOne({
      shareId,
      isPublic: true
    })
      .populate({
        path: 'items.product',
        select: 'name price images sku'
      })
      .populate({
        path: 'user',
        select: 'name'
      });

    if (!wishlist) {
      return res.status(404).json({
        success: false,
        message: 'Shared wishlist not found'
      });
    }

    res.json({
      success: true,
      data: wishlist
    });
  } catch (error) {
    console.error('Get shared wishlist error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching shared wishlist'
    });
  }
};

module.exports = {
  getWishlists,
  getWishlist,
  createWishlist,
  updateWishlist,
  deleteWishlist,
  addToWishlist,
  removeFromWishlist,
  moveToCart,
  getSharedWishlist
};
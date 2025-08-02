const mongoose = require('mongoose');

const wishlistItemSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  },
  addedAt: {
    type: Date,
    default: Date.now
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high'],
    default: 'medium'
  },
  notes: {
    type: String,
    maxlength: 200
  }
});

const wishlistSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  name: {
    type: String,
    required: true,
    trim: true,
    maxlength: 50,
    default: 'My Wishlist'
  },
  description: {
    type: String,
    maxlength: 200
  },
  items: [wishlistItemSchema],
  isDefault: {
    type: Boolean,
    default: false
  },
  isPublic: {
    type: Boolean,
    default: false
  },
  shareId: {
    type: String,
    unique: true,
    sparse: true
  }
}, {
  timestamps: true
});

// Generate share ID before saving if wishlist is public
wishlistSchema.pre('save', function(next) {
  if (this.isPublic && !this.shareId) {
    this.shareId = Math.random().toString(36).substr(2, 10);
  } else if (!this.isPublic) {
    this.shareId = undefined;
  }
  next();
});

// Method to add item to wishlist
wishlistSchema.methods.addItem = function(productId, priority = 'medium', notes = '') {
  const existingItem = this.items.find(item => item.product.toString() === productId.toString());
  
  if (!existingItem) {
    this.items.push({
      product: productId,
      priority,
      notes
    });
  }
};

// Method to remove item from wishlist
wishlistSchema.methods.removeItem = function(productId) {
  this.items = this.items.filter(item => item.product.toString() !== productId.toString());
};

// Method to move item to cart
wishlistSchema.methods.moveToCart = function(productId) {
  const item = this.items.find(item => item.product.toString() === productId.toString());
  
  if (item) {
    this.removeItem(productId);
    return item;
  }
  
  return null;
};

// Ensure user has only one default wishlist
wishlistSchema.pre('save', async function(next) {
  if (this.isDefault && this.isModified('isDefault')) {
    await this.constructor.updateMany(
      { user: this.user, _id: { $ne: this._id } },
      { isDefault: false }
    );
  }
  next();
});

// Index for performance
wishlistSchema.index({ user: 1 });
wishlistSchema.index({ shareId: 1 });
wishlistSchema.index({ user: 1, isDefault: 1 });

module.exports = mongoose.model('Wishlist', wishlistSchema);
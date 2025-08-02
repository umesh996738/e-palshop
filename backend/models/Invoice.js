const mongoose = require('mongoose');

const invoiceItemSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  },
  name: {
    type: String,
    required: true
  },
  sku: String,
  quantity: {
    type: Number,
    required: true,
    min: 1
  },
  unitPrice: {
    type: Number,
    required: true,
    min: 0
  },
  totalPrice: {
    type: Number,
    required: true,
    min: 0
  },
  discount: {
    type: Number,
    default: 0,
    min: 0
  }
});

const invoiceSchema = new mongoose.Schema({
  invoiceNumber: {
    type: String,
    unique: true,
    required: true
  },
  order: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Order',
    required: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  status: {
    type: String,
    enum: ['draft', 'sent', 'paid', 'overdue', 'cancelled'],
    default: 'draft'
  },
  issueDate: {
    type: Date,
    default: Date.now
  },
  dueDate: {
    type: Date,
    required: true
  },
  billingAddress: {
    fullName: { type: String, required: true },
    company: String,
    address: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    zipCode: { type: String, required: true },
    country: { type: String, required: true },
    taxId: String
  },
  items: [invoiceItemSchema],
  subtotal: {
    type: Number,
    required: true,
    min: 0
  },
  taxRate: {
    type: Number,
    default: 0,
    min: 0,
    max: 100
  },
  taxAmount: {
    type: Number,
    default: 0,
    min: 0
  },
  discountAmount: {
    type: Number,
    default: 0,
    min: 0
  },
  shippingAmount: {
    type: Number,
    default: 0,
    min: 0
  },
  totalAmount: {
    type: Number,
    required: true,
    min: 0
  },
  paidAmount: {
    type: Number,
    default: 0,
    min: 0
  },
  paymentTerms: {
    type: String,
    default: 'Net 30'
  },
  notes: String,
  termsAndConditions: String,
  currency: {
    type: String,
    default: 'USD'
  },
  paymentHistory: [{
    amount: { type: Number, required: true },
    paymentDate: { type: Date, default: Date.now },
    paymentMethod: String,
    transactionId: String,
    notes: String
  }]
}, {
  timestamps: true
});

// Generate invoice number before saving
invoiceSchema.pre('save', function(next) {
  if (this.isNew && !this.invoiceNumber) {
    const year = new Date().getFullYear();
    const month = String(new Date().getMonth() + 1).padStart(2, '0');
    const random = Math.random().toString(36).substr(2, 6).toUpperCase();
    this.invoiceNumber = `INV-${year}${month}-${random}`;
  }
  next();
});

// Calculate totals before saving
invoiceSchema.pre('save', function(next) {
  // Calculate subtotal
  this.subtotal = this.items.reduce((sum, item) => {
    return sum + (item.totalPrice - (item.discount || 0));
  }, 0);

  // Calculate tax amount
  this.taxAmount = (this.subtotal * this.taxRate) / 100;

  // Calculate total amount
  this.totalAmount = this.subtotal + this.taxAmount + this.shippingAmount - this.discountAmount;

  // Update status based on payment
  if (this.paidAmount >= this.totalAmount) {
    this.status = 'paid';
  } else if (this.paidAmount > 0) {
    this.status = 'partially_paid';
  } else if (this.dueDate < new Date() && this.status !== 'paid') {
    this.status = 'overdue';
  }

  next();
});

// Method to add payment
invoiceSchema.methods.addPayment = function(amount, paymentMethod, transactionId, notes) {
  this.paymentHistory.push({
    amount,
    paymentMethod,
    transactionId,
    notes,
    paymentDate: new Date()
  });
  
  this.paidAmount += amount;
};

// Virtual for balance due
invoiceSchema.virtual('balanceDue').get(function() {
  return Math.max(0, this.totalAmount - this.paidAmount);
});

// Virtual for payment status
invoiceSchema.virtual('paymentStatus').get(function() {
  if (this.paidAmount >= this.totalAmount) {
    return 'paid';
  } else if (this.paidAmount > 0) {
    return 'partially_paid';
  } else {
    return 'unpaid';
  }
});

// Index for performance
invoiceSchema.index({ invoiceNumber: 1 });
invoiceSchema.index({ user: 1, createdAt: -1 });
invoiceSchema.index({ order: 1 });
invoiceSchema.index({ status: 1 });
invoiceSchema.index({ dueDate: 1 });

invoiceSchema.set('toJSON', { virtuals: true });
invoiceSchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('Invoice', invoiceSchema);
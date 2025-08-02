# E-Commerce Platform

A full-stack e-commerce platform built with Node.js, Express, MongoDB, and React with Redux.

## 🚀 Features

### Authentication System
- ✅ User registration with email verification
- ✅ Login/logout functionality
- ✅ JWT-based authentication
- ✅ Role-based access (Admin, Distributor, Customer)
- ✅ Password reset functionality
- ✅ Profile management

### Product Catalog
- ✅ Product listing with search and filters
- ✅ Category management
- ✅ Product details with images
- ✅ Inventory tracking
- ✅ Bulk pricing tiers
- ✅ Product reviews and ratings
- ✅ Advanced search and filtering

### Order Management
- ✅ Shopping cart functionality
- ✅ Order placement and tracking
- ✅ Order history
- ✅ Invoice generation
- ✅ Payment integration placeholder
- ✅ Order status management

### User Dashboard
- ✅ Profile management
- ✅ Order history
- ✅ Wishlist functionality
- ✅ Address book
- ✅ For distributors: special pricing view

### Admin Panel
- ✅ Product management (CRUD)
- ✅ Order management
- ✅ User management
- ✅ Reports and analytics
- ✅ Inventory management
- ✅ Dashboard with key metrics

## 🛠 Tech Stack

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM
- **JWT** - Authentication
- **bcryptjs** - Password hashing
- **Helmet** - Security middleware
- **CORS** - Cross-origin resource sharing

### Frontend
- **React** - UI library
- **Redux Toolkit** - State management
- **React Router** - Navigation
- **Material-UI** - UI components
- **Redux Persist** - State persistence

## 📁 Project Structure

```
├── backend/
│   ├── config/
│   │   └── db.js
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── productController.js
│   │   ├── orderController.js
│   │   ├── userController.js
│   │   ├── cartController.js
│   │   ├── wishlistController.js
│   │   └── adminController.js
│   ├── middleware/
│   │   ├── auth.js
│   │   ├── async.js
│   │   └── errorHandler.js
│   ├── models/
│   │   ├── User.js
│   │   ├── Product.js
│   │   ├── Order.js
│   │   ├── Cart.js
│   │   └── Wishlist.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── productRoutes.js
│   │   ├── orderRoutes.js
│   │   ├── userRoutes.js
│   │   ├── cartRoutes.js
│   │   ├── wishlistRoutes.js
│   │   └── adminRoutes.js
│   ├── utils/
│   │   └── errorResponse.js
│   ├── server.js
│   └── package.json
├── e-palshop/
│   ├── src/
│   │   ├── store/
│   │   │   ├── store.js
│   │   │   └── slices/
│   │   │       ├── authSlice.js
│   │   │       ├── cartSlice.js
│   │   │       ├── productSlice.js
│   │   │       ├── orderSlice.js
│   │   │       └── wishlistSlice.js
│   │   ├── components/
│   │   ├── pages/
│   │   └── App.jsx
│   └── package.json
└── README.md
```

## 🚀 Quick Start

### Prerequisites
- Node.js (v14 or higher)
- MongoDB
- npm or yarn

### Backend Setup

1. **Install dependencies**
   ```bash
   cd backend
   npm install
   ```

2. **Environment Configuration**
   Create a `.env` file in the backend directory:
   ```env
   NODE_ENV=development
   PORT=5000
   MONGO_URI=mongodb://localhost:27017/ecommerce
   JWT_SECRET=your_jwt_secret_key_here_make_it_long_and_secure
   JWT_EXPIRE=30d
   FRONTEND_URL=http://localhost:3000
   
   # Email configuration (for password reset)
   EMAIL_HOST=smtp.gmail.com
   EMAIL_PORT=587
   EMAIL_USER=your_email@gmail.com
   EMAIL_PASS=your_app_password
   
   # Payment configuration
   STRIPE_SECRET_KEY=your_stripe_secret_key
   STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
   
   # File upload (for product images)
   CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
   CLOUDINARY_API_KEY=your_cloudinary_api_key
   CLOUDINARY_API_SECRET=your_cloudinary_api_secret
   ```

3. **Start the server**
   ```bash
   npm run dev
   ```

### Frontend Setup

1. **Install dependencies**
   ```bash
   cd e-palshop
   npm install
   ```

2. **Start the development server**
   ```bash
   npm run dev
   ```

## 📚 API Documentation

### Authentication Endpoints

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| POST | `/api/auth/register` | Register new user | Public |
| POST | `/api/auth/login` | Login user | Public |
| GET | `/api/auth/me` | Get user profile | Private |
| PUT | `/api/auth/profile` | Update profile | Private |
| PUT | `/api/auth/updatepassword` | Update password | Private |
| POST | `/api/auth/forgotpassword` | Forgot password | Public |
| PUT | `/api/auth/resetpassword/:resettoken` | Reset password | Public |

### Product Endpoints

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| GET | `/api/products` | Get all products | Public |
| GET | `/api/products/:id` | Get product by ID | Public |
| POST | `/api/products` | Create product | Admin |
| PUT | `/api/products/:id` | Update product | Admin |
| DELETE | `/api/products/:id` | Delete product | Admin |

### Cart Endpoints

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| GET | `/api/cart` | Get user cart | Private |
| POST | `/api/cart` | Add item to cart | Private |
| PUT | `/api/cart/:itemId` | Update cart item | Private |
| DELETE | `/api/cart/:itemId` | Remove from cart | Private |
| DELETE | `/api/cart` | Clear cart | Private |
| POST | `/api/cart/coupon` | Apply coupon | Private |
| DELETE | `/api/cart/coupon` | Remove coupon | Private |

### Wishlist Endpoints

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| GET | `/api/wishlist` | Get user wishlist | Private |
| POST | `/api/wishlist` | Add to wishlist | Private |
| DELETE | `/api/wishlist/:productId` | Remove from wishlist | Private |
| DELETE | `/api/wishlist` | Clear wishlist | Private |
| GET | `/api/wishlist/check/:productId` | Check if in wishlist | Private |

### Order Endpoints

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| GET | `/api/orders` | Get user orders | Private |
| GET | `/api/orders/:id` | Get order by ID | Private |
| POST | `/api/orders` | Create order | Private |
| PUT | `/api/orders/:id/status` | Update order status | Admin |

### Admin Endpoints

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| GET | `/api/admin/dashboard` | Get dashboard stats | Admin |
| GET | `/api/admin/users` | Get all users | Admin |
| PUT | `/api/admin/users/:id/role` | Update user role | Admin |
| GET | `/api/admin/reports/sales` | Get sales report | Admin |
| GET | `/api/admin/reports/inventory` | Get inventory report | Admin |
| GET | `/api/admin/analytics/users` | Get user analytics | Admin |

## 🗄 Database Schema

### User Schema
```javascript
{
  name: String,
  email: String (unique),
  password: String (hashed),
  role: String (enum: ['admin', 'distributor', 'customer']),
  avatar: String,
  phone: String,
  addresses: [{
    type: String (enum: ['shipping', 'billing']),
    street: String,
    city: String,
    state: String,
    zipCode: String,
    country: String,
    isDefault: Boolean
  }],
  company: {
    name: String,
    taxId: String,
    website: String
  },
  isActive: Boolean,
  resetPasswordToken: String,
  resetPasswordExpire: Date,
  createdAt: Date,
  updatedAt: Date
}
```

### Product Schema
```javascript
{
  name: String,
  description: String,
  price: Number,
  comparePrice: Number,
  bulkPricing: [{
    minQuantity: Number,
    maxQuantity: Number,
    price: Number,
    discount: Number
  }],
  category: String,
  subcategory: String,
  brand: String,
  sku: String (unique),
  images: [{
    url: String,
    alt: String
  }],
  inventory: {
    quantity: Number,
    reserved: Number
  },
  specifications: {
    weight: Number,
    dimensions: {
      length: Number,
      width: Number,
      height: Number
    },
    color: String,
    size: String,
    material: String
  },
  ratings: {
    average: Number,
    count: Number
  },
  reviews: [ReviewSchema],
  tags: [String],
  isActive: Boolean,
  isFeatured: Boolean,
  createdBy: ObjectId (ref: User),
  createdAt: Date,
  updatedAt: Date
}
```

### Order Schema
```javascript
{
  user: ObjectId (ref: User),
  orderItems: [{
    product: ObjectId (ref: Product),
    name: String,
    image: String,
    price: Number,
    quantity: Number
  }],
  shippingAddress: {
    fullName: String,
    address: String,
    city: String,
    state: String,
    zipCode: String,
    country: String,
    phone: String
  },
  paymentMethod: String,
  itemsPrice: Number,
  taxPrice: Number,
  shippingPrice: Number,
  totalPrice: Number,
  discount: {
    amount: Number,
    code: String,
    description: String
  },
  orderStatus: String (enum: ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled', 'refunded']),
  isPaid: Boolean,
  paidAt: Date,
  isDelivered: Boolean,
  deliveredAt: Date,
  trackingNumber: String,
  notes: String,
  statusHistory: [{
    status: String,
    timestamp: Date,
    note: String,
    updatedBy: ObjectId (ref: User)
  }],
  createdAt: Date,
  updatedAt: Date
}
```

## 🔐 Security Features

- JWT-based authentication
- Password hashing with bcrypt
- Role-based access control
- Input validation and sanitization
- Rate limiting
- CORS protection
- Helmet security headers
- Error handling middleware

## 🎨 Frontend Features

- Responsive design with Material-UI
- Redux state management
- Persistent authentication
- Real-time cart updates
- Search and filtering
- Wishlist functionality
- Order tracking
- Admin dashboard

## 🚀 Deployment

### Backend Deployment
1. Set up environment variables
2. Configure MongoDB connection
3. Deploy to your preferred platform (Heroku, AWS, etc.)

### Frontend Deployment
1. Build the project: `npm run build`
2. Deploy the `dist` folder to your hosting service

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support, email support@example.com or create an issue in the repository.

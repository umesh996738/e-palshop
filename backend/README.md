# E-commerce Backend API

A comprehensive Node.js backend for an e-commerce application built with Express.js, MongoDB, and JWT authentication.

## Features

- **User Authentication & Authorization**
  - User registration and login
  - JWT token-based authentication
  - Role-based access control (User/Admin)
  - Password reset functionality
  - Profile management

- **Product Management**
  - CRUD operations for products
  - Product search and filtering
  - Category management
  - Product reviews and ratings
  - Inventory management

- **Order Management**
  - Order creation and tracking
  - Order status updates
  - Payment processing integration
  - Order history
  - Order statistics

- **User Management (Admin)**
  - User CRUD operations
  - User role management
  - User statistics
  - Account activation/deactivation

## Tech Stack

- **Backend**: Node.js, Express.js
- **Database**: MongoDB with Mongoose
- **Authentication**: JWT (JSON Web Tokens)
- **Security**: Helmet, CORS, Rate Limiting
- **Validation**: Mongoose validation, Validator.js
- **Password Hashing**: bcryptjs

## Project Structure

```
backend/
├── controllers/
│   ├── authController.js       # Authentication logic
│   ├── productController.js    # Product management
│   ├── orderController.js      # Order management
│   └── userController.js       # User management (Admin)
├── models/
│   ├── User.js                 # User schema
│   ├── Product.js              # Product schema
│   └── Order.js                # Order schema
├── routes/
│   ├── authRoutes.js           # Auth endpoints
│   ├── productRoutes.js        # Product endpoints
│   ├── orderRoutes.js          # Order endpoints
│   └── userRoutes.js           # User management endpoints
├── middleware/
│   ├── auth.js                 # Authentication middleware
│   └── errorHandler.js         # Error handling
├── config/
│   └── db.js                   # Database connection
├── server.js                   # Main server file
├── package.json                # Dependencies
└── .env                        # Environment variables
```

## Installation & Setup

1. **Clone and Navigate**
   ```bash
   cd backend
   ```

2. **Install Dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   - Copy `.env` file and update the variables:
     ```bash
     cp .env .env.local
     ```
   - Update the following variables in `.env`:
     - `MONGO_URI`: Your MongoDB connection string
     - `JWT_SECRET`: A secure secret key for JWT
     - `FRONTEND_URL`: Your frontend URL for CORS

4. **Database Setup**
   - Ensure MongoDB is running locally or provide a cloud MongoDB URI
   - The application will create the database and collections automatically

5. **Start the Server**
   ```bash
   # Development mode with nodemon
   npm run dev

   # Production mode
   npm start
   ```

6. **Verify Installation**
   - Visit `http://localhost:5000` to see the API welcome message
   - Check health: `http://localhost:5000/api/health`

## API Endpoints

### Authentication (`/api/auth`)
- `POST /register` - Register new user
- `POST /login` - User login
- `GET /me` - Get current user profile
- `PUT /profile` - Update user profile
- `PUT /updatepassword` - Change password
- `POST /forgotpassword` - Request password reset
- `PUT /resetpassword/:token` - Reset password

### Products (`/api/products`)
- `GET /` - Get all products (with filtering, search, pagination)
- `GET /categories` - Get product categories
- `GET /:id` - Get single product
- `POST /` - Create product (Admin only)
- `PUT /:id` - Update product (Admin only)
- `DELETE /:id` - Delete product (Admin only)
- `POST /:id/reviews` - Add product review
- `PUT /:id/reviews/:reviewId` - Update review
- `DELETE /:id/reviews/:reviewId` - Delete review

### Orders (`/api/orders`)
- `POST /` - Create new order
- `GET /myorders` - Get user's orders
- `GET /:id` - Get single order
- `PUT /:id/pay` - Mark order as paid
- `PUT /:id/cancel` - Cancel order
- `GET /` - Get all orders (Admin only)
- `GET /stats` - Get order statistics (Admin only)
- `PUT /:id/deliver` - Mark as delivered (Admin only)
- `PUT /:id/status` - Update order status (Admin only)

### Users (`/api/users`) - Admin Only
- `GET /` - Get all users
- `GET /stats` - Get user statistics
- `POST /` - Create new user
- `GET /:id` - Get user by ID
- `PUT /:id` - Update user
- `DELETE /:id` - Deactivate user
- `PUT /:id/toggle-status` - Toggle user status
- `PUT /:id/role` - Update user role

## Authentication

The API uses JWT tokens for authentication. Include the token in the Authorization header:

```
Authorization: Bearer <your-jwt-token>
```

## Error Handling

The API returns consistent error responses:

```json
{
  "success": false,
  "error": "Error message here"
}
```

## Success Responses

Successful responses follow this format:

```json
{
  "success": true,
  "data": { ... },
  "count": 10,
  "pagination": { ... }
}
```

## Security Features

- **Helmet**: Security headers
- **CORS**: Cross-origin resource sharing
- **Rate Limiting**: API rate limiting
- **Input Validation**: Mongoose and custom validation
- **Password Hashing**: bcryptjs with salt rounds
- **JWT**: Secure token-based authentication

## Development

- Use `npm run dev` for development with nodemon
- MongoDB connection with automatic reconnection
- Comprehensive error handling and logging
- Environment-based configuration

## Production Deployment

1. Set `NODE_ENV=production`
2. Update environment variables for production
3. Ensure MongoDB is accessible
4. Consider using PM2 for process management
5. Set up reverse proxy (nginx) if needed
6. Configure SSL/TLS certificates

## License

ISC License
# Backend API - Node.js, Express, MongoDB

A robust REST API built with Node.js, Express.js, MongoDB (Mongoose), and JWT authentication.

## Features

- **Authentication & Authorization**: JWT-based authentication with role-based access control
- **User Management**: Registration, login, profile management, and admin user management
- **Product Management**: CRUD operations for products with reviews and ratings
- **Order Management**: Complete order lifecycle with status tracking
- **Security**: Password hashing, rate limiting, CORS, and helmet security
- **Error Handling**: Comprehensive error handling and validation
- **Database**: MongoDB with Mongoose ODM

## Project Structure

```
backend/
├── controllers/          # Route controllers
│   ├── authController.js
│   ├── productController.js
│   ├── orderController.js
│   └── userController.js
├── models/              # Database models
│   ├── User.js
│   ├── Product.js
│   └── Order.js
├── routes/              # API routes
│   ├── authRoutes.js
│   ├── productRoutes.js
│   ├── orderRoutes.js
│   └── userRoutes.js
├── middleware/          # Custom middleware
│   ├── auth.js
│   └── errorHandler.js
├── config/             # Configuration files
│   └── db.js
├── server.js           # Main server file
├── .env               # Environment variables
└── package.json
```

## Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   Create a `.env` file in the root directory:
   ```env
   NODE_ENV=development
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/ecommerce
   JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
   JWT_EXPIRE=30d
   BCRYPT_SALT_ROUNDS=12
   ```

4. **Start the server**
   ```bash
   # Development mode
   npm run dev
   
   # Production mode
   npm start
   ```

## API Endpoints

### Authentication Routes
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user profile
- `PUT /api/auth/updatedetails` - Update user details
- `PUT /api/auth/updatepassword` - Update password

### Product Routes
- `GET /api/products` - Get all products (with pagination and search)
- `GET /api/products/:id` - Get single product
- `POST /api/products` - Create product (Admin only)
- `PUT /api/products/:id` - Update product (Admin only)
- `DELETE /api/products/:id` - Delete product (Admin only)
- `POST /api/products/:id/reviews` - Add product review
- `GET /api/products/top` - Get top rated products
- `GET /api/products/featured` - Get featured products

### Order Routes
- `POST /api/orders` - Create new order
- `GET /api/orders/myorders` - Get user orders
- `GET /api/orders/:id` - Get order by ID
- `PUT /api/orders/:id/pay` - Update order to paid
- `PUT /api/orders/:id/cancel` - Cancel order
- `GET /api/orders` - Get all orders (Admin only)
- `PUT /api/orders/:id/deliver` - Update order to delivered (Admin only)
- `PUT /api/orders/:id/status` - Update order status (Admin only)

### User Routes (Admin only)
- `GET /api/users` - Get all users
- `GET /api/users/:id` - Get user by ID
- `PUT /api/users/:id` - Update user
- `DELETE /api/users/:id` - Delete user
- `GET /api/users/stats` - Get user statistics
- `PUT /api/users/:id/toggle-status` - Toggle user active status

## Authentication

The API uses JWT (JSON Web Tokens) for authentication. Include the token in the Authorization header:

```
Authorization: Bearer <your-jwt-token>
```

## Role-Based Access Control

- **User**: Can view products, create orders, manage their profile
- **Admin**: Full access to all endpoints including user and product management

## Database Models

### User Model
- name, email, password (hashed)
- role (user/admin)
- avatar, isActive
- resetPasswordToken, resetPasswordExpire

### Product Model
- name, description, price, category
- images, stock, brand
- rating, numReviews, reviews[]
- isActive, featured, discount

### Order Model
- user (reference), orderItems[]
- shippingAddress, paymentMethod
- itemsPrice, taxPrice, shippingPrice, totalPrice
- isPaid, paidAt, isDelivered, deliveredAt
- status (pending/processing/shipped/delivered/cancelled)

## Error Handling

The API includes comprehensive error handling for:
- Validation errors
- Authentication errors
- Database errors
- 404 Not Found
- Rate limiting

## Security Features

- Password hashing with bcrypt
- JWT token authentication
- Rate limiting
- CORS protection
- Helmet security headers
- Input validation
- Role-based authorization

## Development

### Scripts
- `npm start` - Start production server
- `npm run dev` - Start development server with nodemon

### Environment Variables
- `NODE_ENV` - Environment (development/production)
- `PORT` - Server port
- `MONGODB_URI` - MongoDB connection string
- `JWT_SECRET` - JWT signing secret
- `JWT_EXPIRE` - JWT expiration time
- `BCRYPT_SALT_ROUNDS` - Password hashing rounds

## Testing

The API can be tested using tools like:
- Postman
- Insomnia
- curl
- Thunder Client (VS Code extension)

## Production Deployment

1. Set `NODE_ENV=production`
2. Use a strong `JWT_SECRET`
3. Configure MongoDB Atlas or production database
4. Set up proper CORS origins
5. Use environment variables for sensitive data
6. Implement proper logging
7. Set up monitoring and error tracking

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the ISC License.
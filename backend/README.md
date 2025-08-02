# Backend API

A Node.js backend with Express.js, MongoDB, and JWT Authentication for an e-commerce application.

## Features

- **Authentication**: JWT-based authentication with user registration and login
- **User Management**: Complete user CRUD operations with role-based access
- **Product Management**: Full product catalog with search, filtering, and pagination
- **Order Management**: Complete order lifecycle from creation to delivery
- **Security**: Rate limiting, CORS, Helmet, and input validation
- **Error Handling**: Centralized error handling with custom error responses

## Tech Stack

- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM for MongoDB
- **JWT** - Authentication
- **bcryptjs** - Password hashing
- **Helmet** - Security middleware
- **CORS** - Cross-origin resource sharing
- **express-rate-limit** - Rate limiting

## Project Structure

```
backend/
├── controllers/
│   ├── authController.js
│   ├── productController.js
│   ├── orderController.js
│   └── userController.js
├── models/
│   ├── User.js
│   ├── Product.js
│   └── Order.js
├── routes/
│   ├── authRoutes.js
│   ├── productRoutes.js
│   ├── orderRoutes.js
│   └── userRoutes.js
├── middleware/
│   ├── auth.js
│   └── errorHandler.js
├── config/
│   └── db.js
├── utils/
│   ├── errorResponse.js
│   └── asyncHandler.js
├── server.js
├── package.json
└── .env
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

3. **Environment Setup**
   - Copy `.env.example` to `.env`
   - Update the environment variables:
     ```
     PORT=5000
     MONGODB_URI=mongodb://localhost:27017/ecommerce
     JWT_SECRET=your_jwt_secret_key_here_make_it_long_and_secure
     JWT_EXPIRE=30d
     NODE_ENV=development
     ```

4. **Start the server**
   ```bash
   # Development
   npm run dev
   
   # Production
   npm start
   ```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/logout` - Logout user
- `GET /api/auth/me` - Get current user
- `PUT /api/auth/updatedetails` - Update user details
- `PUT /api/auth/updatepassword` - Update password

### Products
- `GET /api/products` - Get all products (with filtering, sorting, pagination)
- `GET /api/products/:id` - Get single product
- `POST /api/products` - Create product (Admin only)
- `PUT /api/products/:id` - Update product
- `DELETE /api/products/:id` - Delete product
- `PUT /api/products/:id/photo` - Upload product photo

### Orders
- `POST /api/orders` - Create new order
- `GET /api/orders` - Get all orders (Admin only)
- `GET /api/orders/myorders` - Get user's orders
- `GET /api/orders/:id` - Get order by ID
- `PUT /api/orders/:id/pay` - Update order to paid
- `PUT /api/orders/:id/deliver` - Update order to delivered (Admin only)
- `DELETE /api/orders/:id` - Delete order (Admin only)

### Users
- `GET /api/users` - Get all users (Admin only)
- `GET /api/users/:id` - Get single user (Admin only)
- `POST /api/users` - Create user (Admin only)
- `PUT /api/users/:id` - Update user (Admin only)
- `DELETE /api/users/:id` - Delete user (Admin only)
- `GET /api/users/profile` - Get user profile
- `PUT /api/users/profile` - Update user profile

## Authentication

The API uses JWT (JSON Web Tokens) for authentication. Include the token in the Authorization header:

```
Authorization: Bearer <your-jwt-token>
```

## Error Handling

The API returns consistent error responses:

```json
{
  "success": false,
  "error": "Error message"
}
```

## Rate Limiting

The API implements rate limiting to prevent abuse:
- 100 requests per 10 minutes per IP address

## Security Features

- **Password Hashing**: bcryptjs for secure password storage
- **JWT Authentication**: Stateless authentication
- **CORS**: Cross-origin resource sharing protection
- **Helmet**: Security headers
- **Rate Limiting**: Protection against abuse
- **Input Validation**: Request validation and sanitization

## Database Models

### User Model
- name, email, password (required)
- role (user/admin)
- avatar, phone, address
- email verification status
- password reset functionality

### Product Model
- name, description, price, category (required)
- brand, images, stock
- rating and reviews system
- discount and featured flags
- specifications and tags

### Order Model
- user reference
- order items with product details
- shipping address
- payment information
- order status tracking
- delivery tracking

## Development

### Scripts
- `npm start` - Start production server
- `npm run dev` - Start development server with nodemon

### Environment Variables
- `PORT` - Server port (default: 5000)
- `MONGODB_URI` - MongoDB connection string
- `JWT_SECRET` - Secret key for JWT tokens
- `JWT_EXPIRE` - JWT token expiration time
- `NODE_ENV` - Environment (development/production)

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the ISC License.
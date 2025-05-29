# Store Rating App - Backend Server

This is the backend server for the Store Rating Application, providing RESTful APIs for store management and rating functionality.

## Technologies Used

- Node.js
- Express.js
- MySQL2
- JWT for authentication
- bcryptjs for password hashing
- Express Validator for input validation
- CORS for cross-origin resource sharing

## Prerequisites

- Node.js (v14 or higher)
- MySQL Server
- npm or yarn package manager

## Installation

1. Clone the repository
2. Navigate to the server directory:
   ```bash
   cd store-rating-app/server
   ```
3. Install dependencies:
   ```bash
   npm install
   ```
4. Create a `.env` file in the root directory with the following variables:
   ```
   PORT=5000
   DB_HOST=localhost
   DB_USER=your_db_user
   DB_PASSWORD=your_db_password
   DB_NAME=store_rating_db
   JWT_SECRET=your_jwt_secret
   ```

## Available Scripts

- `npm start`: Starts the server in production mode
- `npm run dev`: Starts the server in development mode with nodemon

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - User login

### Store Management
- `GET /api/store` - Get all stores
- `POST /api/store` - Create a new store (Store Owner only)
- `PUT /api/store/:id` - Update store details (Store Owner only)
- `DELETE /api/store/:id` - Delete a store (Store Owner only)

### Ratings
- `POST /api/store-owner/ratings` - Add a rating to a store
- `GET /api/store-owner/ratings/:storeId` - Get ratings for a specific store
- `PUT /api/store-owner/ratings/:id` - Update a rating
- `DELETE /api/store-owner/ratings/:id` - Delete a rating

### Admin Routes
- `GET /api/admin/users` - Get all users (Admin only)
- `GET /api/admin/stores` - Get all stores (Admin only)

## Error Handling

The application includes centralized error handling middleware that processes all errors and returns appropriate HTTP status codes and error messages.

## Security

- Password hashing using bcryptjs
- JWT-based authentication
- Input validation using express-validator
- CORS configuration for secure client-server communication

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the ISC License. 
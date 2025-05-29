# Store Rating App - Frontend Client

This is the frontend React application for the Store Rating System, allowing users to rate stores and store owners to manage their listings.

## Technologies Used

- React.js
- React Router DOM for routing
- Axios for API communication
- Testing Library for React components testing

## Prerequisites

- Node.js (v14 or higher)
- npm or yarn package manager
- Backend server running (see server README)

## Installation

1. Clone the repository
2. Navigate to the client directory:
   ```bash
   cd store-rating-app/client
   ```
3. Install dependencies:
   ```bash
   npm install
   ```

## Available Scripts

- `npm start`: Runs the app in development mode at [http://localhost:3000](http://localhost:3000)
- `npm test`: Launches the test runner in interactive watch mode
- `npm run build`: Builds the app for production to the `build` folder
- `npm run eject`: Ejects the create-react-app configuration (one-way operation)

## Features

- User Authentication
  - Register new account
  - Login with existing account
  - Protected routes for authenticated users

- Store Management (Store Owners)
  - Create new store listings
  - Update store information
  - View store ratings and feedback
  - Respond to customer reviews

- Rating System (Customers)
  - Browse available stores
  - Submit ratings and reviews
  - View store details and average ratings
  - Edit or delete own reviews

- Admin Dashboard
  - Manage users and stores
  - View system statistics
  - Moderate reviews and ratings

## Project Structure

```
src/
├── components/     # Reusable UI components
├── pages/         # Page components
├── context/       # React context providers
├── services/      # API service functions
├── utils/         # Utility functions
├── hooks/         # Custom React hooks
└── styles/        # CSS/SCSS styles
```

## Environment Variables

Create a `.env` file in the root directory with:

```
REACT_APP_API_URL=http://localhost:5000/api
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## Testing

The application uses React Testing Library for component testing. Run tests with:

```bash
npm test
```

## Building for Production

```bash
npm run build
```

This creates an optimized production build in the `build` folder.

## License

This project is licensed under the MIT License.

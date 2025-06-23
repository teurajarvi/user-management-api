# User Management API

A full-stack user management application with a React frontend and Node.js/Express backend. This application allows you to perform CRUD operations on user data with a clean, responsive interface.

## Features

### Backend
- RESTful API endpoints for user management
- File-based storage using JSON
- Input validation
- Error handling
- CORS support

### Frontend
- Responsive design
- Real-time search functionality
- Form validation
- Loading states and error handling
- Clean, modern UI

## Tech Stack

### Backend
- Node.js
- Express
- Express Validator
- CORS
- File System (fs) module

### Frontend
- React
- React Router
- Axios for HTTP requests
- CSS Modules for styling
- Vite for development server and build

## Project Structure

```
user-management-api/
├── backend/               # Backend server
│   ├── data/             # JSON data storage
│   ├── routes/           # API routes
│   ├── app.js            # Express app setup
│   └── package.json      # Backend dependencies
├── frontend/             # Frontend application
│   ├── public/           # Static files
│   ├── src/
│   │   ├── components/   # React components
│   │   ├── services/     # API service
│   │   ├── App.jsx       # Main App component
│   │   └── main.jsx      # Entry point
│   └── package.json      # Frontend dependencies
└── README.md             # This file
```

## Getting Started

### Prerequisites

- Node.js (v14 or later)
- npm (comes with Node.js)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd user-management-api
   ```

2. **Install backend dependencies**
   ```bash
   cd backend
   npm install
   ```

3. **Install frontend dependencies**
   ```bash
   cd ../frontend
   npm install
   ```

## Running the Application

### Start the Backend Server

From the `backend` directory:

```bash
npm start
# or for development with auto-reload
npm run dev
```

The backend server will start on `http://localhost:3000`

### Start the Frontend Development Server

From the `frontend` directory:

```bash
npm run dev
```

The frontend will be available at `http://localhost:5173`

## API Endpoints

| Method | Endpoint          | Description                     |
|--------|------------------|---------------------------------|
| GET    | /users           | Get all users                   |
| GET    | /users/:id       | Get a single user by ID         |
| POST   | /users           | Create a new user               |
| PUT    | /users/:id       | Update an existing user         |
| DELETE | /users/:id       | Delete a user                   |
| GET    | /users/search?q= | Search users by name            |


### Example User Object

```json
{
  "id": 1,
  "name": "Leanne Graham",
  "username": "Bret",
  "email": "Sincere@april.biz",
  "address": {
    "street": "Kulas Light",
    "city": "Gwenborough",
    "zipcode": "92998-3874"
  }
}
```

## Development

### Backend Development

The backend uses a simple file-based JSON storage system. The data is stored in `backend/data/users.json`. This file is automatically created when the server starts if it doesn't exist.

#### Environment Variables

Create a `.env` file in the `backend` directory with the following variables:

```
PORT=3000
NODE_ENV=development
```

### Frontend Development

The frontend is built with React and uses Vite as the build tool. The development server supports hot module replacement for a better development experience.

#### Environment Variables

Create a `.env` file in the `frontend` directory with the following variables:

```
VITE_API_URL=http://localhost:3000
```

## Testing

### Backend Tests

Run the backend tests with:

```bash
cd backend
npm test
```

### Frontend Tests

Run the frontend tests with:

```bash
cd frontend
npm test
```

## Deployment

### Backend

The backend can be deployed to any Node.js hosting service (e.g., Heroku, Render, Railway).

### Frontend

The frontend can be built for production with:

```bash
cd frontend
npm run build
```

This will create a `dist` directory with the production-ready files that can be deployed to any static file hosting service (e.g., Vercel, Netlify, GitHub Pages).

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- Sample user data provided by [JSONPlaceholder](https://jsonplaceholder.typicode.com/)
- Built with [Create React App](https://create-react-app.dev/) and [Express](https://expressjs.com/)

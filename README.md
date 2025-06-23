# User Management System

A full-stack user management application with a React frontend and Node.js/Express backend. This application allows you to perform CRUD operations on user data with a clean, responsive interface.

## Features

### Backend
- RESTful API endpoints for user management
- File-based storage using JSON
- Input validation with Express Validator
- Comprehensive error handling
- CORS support
- Environment configuration

### Frontend
- Responsive, mobile-first design with Tailwind CSS
- Real-time search and filtering
- Client-side form validation
- Loading states and error handling
- Modern UI components
- Optimized build with Vite

## Tech Stack

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Validation**: Express Validator
- **Security**: CORS
- **File System**: Node.js fs module

### Frontend
- **UI Library**: React 18
- **Routing**: React Router v6
- **Styling**: Tailwind CSS 3 with PostCSS
- **HTTP Client**: Axios
- **Build Tool**: Vite
- **Package Manager**: npm

## Project Structure

```
user-management-api/
├── backend/              # Backend server
│   ├── data/             # JSON data storage
│   ├── routes/           # API routes
│   ├── app.js            # Express app setup
│   └── package.json      # Backend dependencies
├── frontend/             # Frontend application
│   ├── public/           # Static files
│   ├── src/
│   │   ├── components/   # React components
│   │   │   ├── common/   # Shared components
│   │   │   ├── UserForm/ # User form component
│   │   │   └── UserList/ # User list component
│   │   ├── services/     # API service
│   │   ├── App.jsx       # Main App component
│   │   ├── App.css       # App-specific styles
│   │   ├── index.css     # Global styles and Tailwind imports
│   │   └── main.jsx      # Entry point
│   └── package.json      # Frontend dependencies
└── README.md             # This file
```

## Getting Started

### Prerequisites

- Node.js (v16 or later)
- npm (v8 or later, comes with Node.js)
- Git (for version control)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/teurajarvi/user-management-api.git
   cd user-management-api
   ```

2. **Set up the backend**
   ```bash
   cd backend
   npm install
   ```

3. **Set up the frontend**
   ```bash
   cd ../frontend
   npm install
   ```
   
4. **Environment Setup**
   - Copy `.env.example` to `.env` in both `backend` and `frontend` directories
   - Update the environment variables as needed

## Running the Application

### Development Mode

#### Backend Server
From the `backend` directory:

```bash
# Start the backend server with auto-reload
npm run dev
```

The backend API will be available at `http://localhost:3000`

#### Frontend Development Server
From the `frontend` directory:

```bash
# Start the Vite development server
npm run dev
```

The frontend will be available at `http://localhost:5173` (default Vite port)

### Production Build

1. **Build the frontend**:
   ```bash
   cd frontend
   npm run build
   ```
   This will create an optimized production build in the `dist` directory.

2. **Start the production server**:
   ```bash
   # From the backend directory
   npm start
   ```

## Working with Tailwind CSS

This project uses Tailwind CSS for styling. Here's how to work with it:

- **Adding new styles**: Use Tailwind's utility classes directly in your components
- **Customizing the theme**: Edit `tailwind.config.js` in the frontend directory
- **Adding custom CSS**: Import your CSS files in `index.css`

Example component with Tailwind classes:
```jsx
function Button({ children }) {
  return (
    <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
      {children}
    </button>
  );
}
```

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

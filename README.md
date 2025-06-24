# User Management System

A full-stack user management application with a React frontend and Node.js/Express backend. This application allows you to perform CRUD operations on user data with a clean, responsive interface.

## ✨ Features

### Backend
- ✅ RESTful API endpoints for user management
- 📁 File-based JSON storage with automatic file creation
- 🔒 Input validation with Express Validator
- 🛡️ Comprehensive error handling and CORS protection
- ⚙️ Environment-based configuration
- 🚦 Graceful startup and shutdown handling

### Frontend
- 📱 Responsive, mobile-first design with Tailwind CSS
- 🔍 Real-time search and filtering
- 📝 Client-side form validation
- ⏳ Loading states and error handling
- 🎨 Modern UI components
- ⚡ Optimized build with Vite

### Improvements needed
- Improve Validation: Consistently apply validation middleware across all routes.
- Add Configuration Management: Use dotenv for environment-specific configurations.
- Enhance Testing: Add more test cases and consider using mocks for file operations.
- Improve Security: Implement rate limiting and enhance input sanitization.
- Add API Documentation: Use Swagger/OpenAPI to document the API.
- Enhance Logging: Implement structured logging with different log levels.


## 🛠️ Tech Stack

### Backend
- **Runtime**: Node.js (v18+)
- **Framework**: Express.js
- **Validation**: Express Validator
- **Security**: CORS, Input sanitization
- **Development**: Nodemon for hot-reloading

### Frontend
- **UI Library**: React 18
- **Styling**: Tailwind CSS with PostCSS
- **Build Tool**: Vite
- **Package Manager**: npm

## 🚀 Getting Started

### Prerequisites

- Node.js (v18 or later)
- npm (comes with Node.js)

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

## 🏃‍♂️ Running the Application

### Start the Backend

```bash
cd backend
npm start
```

The API will be available at `http://localhost:3000`

### Start the Frontend

```bash
cd frontend
npm run dev
```

The frontend will be available at `http://localhost:5173`

## 🌐 API Endpoints

- `GET /api/health` - Health check endpoint
- `GET /api/users` - Get all users
- `GET /api/users/:id` - Get a single user
- `POST /api/users` - Create a new user
- `PUT /api/users/:id` - Update a user
- `DELETE /api/users/:id` - Delete a user

## 🛠 Development

### Backend Development

```bash
cd backend
npm run dev  # Start with nodemon for hot-reloading
```

### Frontend Development

```bash
cd frontend
npm run dev  # Start Vite dev server
```

## Project Structure

```
user-management-api/
├── backend/           # Backend server
│   ├── data/          # JSON data storage
│   ├── routes/        # API route handlers
│   ├── utils/         # Utility functions
│   ├── app.js         # Main application file
│   └── package.json   # Backend dependencies
├── frontend/          # Frontend application
│   ├── components/    # React components
│   │   ├── common/    # Shared components
│   │   ├── UserForm/  # User form component
│   │   └── UserList/  # User list component
│   ├── services/      # API service
│   ├── App.jsx        # Main App component
│   ├── App.css        # App-specific styles
│   ├── index.css      # Global styles and Tailwind imports
│   ├── main.jsx       # Entry point
│   └── package.json   # Frontend dependencies
└── README.md          # This file
```

## Running Tests

The backend includes a comprehensive test suite using Node's built-in test runner and Supertest. The tests cover all API endpoints and include proper setup and teardown.

### Running the Tests

```bash
# Navigate to the backend directory
cd backend

# Install dependencies (if not already installed)
npm install

# Run all tests
npm test

# Run tests in watch mode (auto-rerun on file changes)
npm run test:watch
```

### Test Structure

Tests are located in `node-test.js` and cover:

- **API Endpoints**: All CRUD operations (Create, Read, Update, Delete)
- **Search Functionality**: Case-insensitive search across user fields
- **Error Handling**: Proper error responses for invalid requests
- **Edge Cases**: Testing with various input scenarios

### Writing Tests

Tests are written using Node's built-in `test` module and follow this structure:

```javascript
const { test, describe, before, after } = require('node:test');
const assert = require('node:assert');
const request = require('supertest');
const { app, closeServer } = require('./app');

describe('Feature Name', () => {
  // Setup before tests run
  before(async () => {
    // Test setup code
  });

  // Cleanup after tests complete
  after(async () => {
    await closeServer();
  });

  test('should do something', async () => {
    // Test implementation
  });
});
```

### Test Output

When tests run, you'll see detailed output showing:
- Passing/failing tests
- Execution time for each test
- Any errors or assertions that failed
- Summary of test results

### Debugging Tests

To debug tests:
1. Add `console.log()` statements in your test or application code
2. Run a single test file with `node --inspect-brk node-test.js`
3. Use Chrome DevTools or VS Code's debugger to step through the code

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v18 or later)
- [npm](https://www.npmjs.com/) (v9 or later, comes with Node.js)
- [Git](https://git-scm.com/) (for version control)

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

## 🌐 API Reference

### Base URL
```
http://localhost:3000/api
```

### Authentication
This API doesn't require authentication for demo purposes. In a production environment, consider adding JWT or OAuth2.

### Endpoints

#### Get All Users
```http
GET /users
```
**Response (200 OK)**
```json
[
  {
    "id": "1",
    "name": "Leanne Graham",
    "username": "Bret",
    "email": "Sincere@april.biz",
    "address": {
      "street": "Kulas Light",
      "city": "Gwenborough",
      "zipcode": "92998-3874"
    }
  }
]
```

#### Get User by ID
```http
GET /users/:id
```
**Parameters**
- `id` (string, required): User ID

**Response (200 OK)**
```json
{
  "id": "1",
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

#### Create User
```http
POST /users
Content-Type: application/json

{
  "name": "John Doe",
  "username": "johndoe",
  "email": "john@example.com",
  "address": {
    "street": "123 Main St",
    "city": "Anytown",
    "zipcode": "12345"
  }
}
```
**Response (201 Created)**
```json
{
  "id": "2",
  "name": "John Doe",
  "username": "johndoe",
  "email": "john@example.com",
  "address": {
    "street": "123 Main St",
    "city": "Anytown",
    "zipcode": "12345"
  }
}
```

#### Update User
```http
PUT /users/:id
Content-Type: application/json

{
  "name": "John Updated",
  "email": "john.updated@example.com"
}
```
**Response (200 OK)**
```json
{
  "id": "2",
  "name": "John Updated",
  "username": "johndoe",
  "email": "john.updated@example.com",
  "address": {
    "street": "123 Main St",
    "city": "Anytown",
    "zipcode": "12345"
  }
}
```

#### Delete User
```http
DELETE /users/2
```
**Response (204 No Content)**
```
// No content
```

#### Search Users
```http
GET /users/search?q=john
```
**Query Parameters**
- `q` (string, required): Search query (case-insensitive)

**Response (200 OK)**
```json
[
  {
    "id": "2",
    "name": "John Updated",
    "username": "johndoe",
    "email": "john.updated@example.com"
  }
]
```

### Error Responses

#### 400 Bad Request
```json
{
  "error": "Validation Error",
  "details": [
    {
      "field": "email",
      "message": "Invalid email format"
    }
  ]
}
```

#### 404 Not Found
```json
{
  "error": "User not found"
}
```

#### 409 Conflict
```json
{
  "error": "Username or email already exists"
}
```

#### 500 Internal Server Error
```json
{
  "error": "Internal Server Error",
  "message": "An unexpected error occurred"
}
```

## 🛠 Development

### Backend Development

The backend uses a file-based JSON storage system for simplicity. All data is stored in `backend/data/users.json`.

**File Structure**
   ```
   backend/
   ├── data/          # Data storage (JSON files)
   ├── routes/        # API route handlers
   │   └── users.js   # User-related routes
   ├── middleware/    # Custom middleware
   ├── utils/         # Utility functions
   ├── app.js         # Express application setup
   └── package.json   # Dependencies and scripts
   ```

### Frontend Development

The frontend is a React application built with Vite, featuring hot module replacement for a smooth development experience.


**File Structure**
   ```
   frontend/
   ├── public/          # Static assets
   └── src/
       ├── assets/      # Images, fonts, etc.
       ├── components/  # Reusable components
       ├── contexts/    # React contexts
       ├── hooks/       # Custom hooks
       ├── services/    # API services
       ├── styles/      # Global styles
       ├── utils/       # Utility functions
       ├── App.jsx      # Root component
       └── main.jsx     # Application entry point
   ```

### Code Quality

#### Linting
```bash
# Backend (ESLint)
cd backend
npx eslint .

# Frontend (ESLint + Prettier)
cd frontend
npx eslint .
npx prettier --check .
```

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

```
MIT License

Copyright (c) 2025 Jari-Pekka Teurajärvi

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

## 🙏 Acknowledgments

### Built With
- [Node.js](https://nodejs.org/) - JavaScript runtime
- [Express](https://expressjs.com/) - Web framework
- [React](https://reactjs.org/) - Frontend library
- [Vite](https://vitejs.dev/) - Frontend tooling
- [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS framework
- [JSONPlaceholder](https://jsonplaceholder.typicode.com/) - Sample user data

### Inspiration
- [REST API Best Practices](https://www.freecodecamp.org/news/rest-api-best-practices/)
- [Node.js Best Practices](https://github.com/goldbergyoni/nodebestpractices)
- [React Best Practices](https://reactpatterns.com/)

---

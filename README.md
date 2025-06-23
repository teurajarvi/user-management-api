# User Management System

A full-stack user management application with a React frontend and Node.js/Express backend. This application allows you to perform CRUD operations on user data with a clean, responsive interface.

## ✨ Features

### Backend
- ✅ RESTful API endpoints for user management
- 📁 File-based JSON storage with automatic file creation
- 🔒 Input validation with Express Validator
- 🛡️ Comprehensive error handling and CORS protection
- ⚙️ Environment-based configuration
- 🧪 Comprehensive test coverage with Node's test runner

### Frontend
- 📱 Responsive, mobile-first design with Tailwind CSS
- 🔍 Real-time search and filtering
- 📝 Client-side form validation
- ⏳ Loading states and error handling
- 🎨 Modern UI components with dark mode support
- ⚡ Optimized build with Vite

## 🛠️ Tech Stack

### Backend
- **Runtime**: Node.js (v18+)
- **Framework**: Express.js
- **Validation**: Express Validator
- **Security**: CORS, Input sanitization
- **Testing**: Node.js test runner, Supertest
- **Development**: Nodemon for hot-reloading

### Frontend
- **UI Library**: React 18
- **State Management**: React Context API
- **Styling**: Tailwind CSS 3 with PostCSS
- **Routing**: React Router v6
- **HTTP Client**: Axios
- **Build Tool**: Vite
- **Package Manager**: npm

## Features

### Backend
- RESTful API endpoints for user management
- File-based storage using JSON (Although the initial dataset contains more fields, this application uses a schemaless data store (a JSON file), so the data provided through the API includes fewer fields. The structure is intentionally kept flexible, and only the relevant fields used by the application are included in each entry.)
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
- **Testing**: Jest, Supertest
- **Code Coverage**: Jest coverage reports

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
├── backend/                      # Backend server
│   ├── __tests__/                # Test files
│   │   ├── routes/               # Route tests
│   │   │   ├── users.test.js     # User route tests
│   │   │   └── search.test.js    # Search route tests
│   │   └── utils/                # Utility tests
│   │       └── dataStore.test.js # Data store tests
│   ├── data/                     # JSON data storage
│   ├── routes/                   # API routes
│   ├── utils/                    # Utility functions
│   ├── app.js                    # Express app setup
│   └── package.json              # Backend dependencies
├── frontend/                     # Frontend application
│   ├── public/                   # Static files
│   ├── src/
│   │   ├── components/           # React components
│   │   │   ├── common/           # Shared components
│   │   │   ├── UserForm/         # User form component
│   │   │   └── UserList/         # User list component
│   │   ├── services/             # API service
│   │   ├── App.jsx               # Main App component
│   │   ├── App.css               # App-specific styles
│   │   ├── index.css             # Global styles and Tailwind imports
│   │   └── main.jsx              # Entry point
│   └── package.json              # Frontend dependencies
└── README.md                     # This file
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

### Installation

1. **Clone the repository**
   ```bash
   # Clone the repository
   git clone https://github.com/teurajarvi/user-management-api.git
   
   # Navigate to the project directory
   cd user-management-api
   ```

2. **Set up the backend**
   ```bash
   # Navigate to the backend directory
   cd backend
   
   # Install dependencies
   npm install
   
   # Create a .env file (optional, uses default values if not present)
   cp .env.example .env
   ```

3. **Set up the frontend**
   ```bash
   # Navigate to the frontend directory
   cd ../frontend
   
   # Install dependencies
   npm install
   
   # Create a .env file (optional, uses default values if not present)
   cp .env.example .env
   ```

4. **Start both servers**
   ```bash
   # In the backend directory
   npm run dev
   
   # In a new terminal, from the frontend directory
   npm run dev
   ```
   
   The application should now be running at `http://localhost:5173`

## 🏃 Running the Application

### Development Mode

#### Backend Server

1. **Start the backend server**:
   ```bash
   # From the backend directory
   cd backend
   
   # Start with auto-reload
   npm run dev
   ```
   - API will be available at `http://localhost:3000`
   - API documentation at `http://localhost:3000/api-docs`
   - Auto-reloads on file changes

#### Frontend Development Server

1. **Start the frontend server**:
   ```bash
   # From the frontend directory
   cd frontend
   
   # Start Vite dev server
   npm run dev
   ```
   - Frontend will be available at `http://localhost:5173`
   - Hot Module Replacement (HMR) enabled
   - Includes error overlay in development

### Production Build

1. **Build the frontend**:
   ```bash
   # From the frontend directory
   cd frontend
   
   # Create production build
   npm run build
   ```
   - Creates optimized production build in `dist/`
   - Minifies and optimizes assets
   - Generates source maps

2. **Start the production server**:
   ```bash
   # From the backend directory
   cd backend
   
   # Start in production mode
   npm start
   ```
   - Serves the frontend build from `../frontend/dist`
   - API available at `/api`
   - Runs on port 3000 by default

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
    },
    "createdAt": "2025-06-23T20:00:00.000Z",
    "updatedAt": "2025-06-23T20:00:00.000Z"
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
  },
  "createdAt": "2025-06-23T20:00:00.000Z",
  "updatedAt": "2025-06-23T20:00:00.000Z"
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
  },
  "createdAt": "2025-06-23T21:00:00.000Z",
  "updatedAt": "2025-06-23T21:00:00.000Z"
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
  },
  "createdAt": "2025-06-23T21:00:00.000Z",
  "updatedAt": "2025-06-23T21:30:00.000Z"
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

#### Environment Setup

1. **Environment Variables**
   Create a `.env` file in the `backend` directory:
   ```env
   # Server Configuration
   PORT=3000
   NODE_ENV=development
   
   # CORS (comma-separated origins, or '*' for all)
   ALLOWED_ORIGINS=http://localhost:5173,http://127.0.0.1:5173
   
   # Logging
   LOG_LEVEL=info
   
   # Data File
   DATA_FILE=./data/users.json
   ```

2. **Development Scripts**
   ```bash
   # Install dependencies
   npm install
   
   # Start development server with auto-reload
   npm run dev
   
   # Run tests
   npm test
   
   # Run tests with coverage
   npm run test:coverage
   ```

3. **File Structure**
   ```
   backend/
   ├── data/           # Data storage (JSON files)
   ├── routes/         # API route handlers
   │   └── users.js    # User-related routes
   ├── middleware/     # Custom middleware
   ├── utils/         # Utility functions
   ├── app.js         # Express application setup
   └── package.json   # Dependencies and scripts
   ```

### Frontend Development

The frontend is a React application built with Vite, featuring hot module replacement for a smooth development experience.

#### Environment Setup

1. **Environment Variables**
   Create a `.env` file in the `frontend` directory:
   ```env
   # API Configuration
   VITE_API_URL=http://localhost:3000/api
   
   # App Configuration
   VITE_APP_NAME="User Management"
   VITE_APP_ENV=development
   
   # Feature Flags
   VITE_FEATURE_DARK_MODE=true
   VITE_FEATURE_NOTIFICATIONS=true
   ```

2. **Development Scripts**
   ```bash
   # Install dependencies
   npm install
   
   # Start development server
   npm run dev
   
   # Build for production
   npm run build
   
   # Preview production build
   npm run preview
   ```

3. **File Structure**
   ```
   frontend/
   ├── public/         # Static assets
   └── src/
       ├── assets/      # Images, fonts, etc.
       ├── components/   # Reusable components
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

#### Git Hooks
Pre-commit hooks are set up using Husky to run:
1. Linting
2. Type checking (if using TypeScript)
3. Tests

### Testing

#### Backend Tests
```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Generate coverage report
npm run test:coverage
```

#### Frontend Tests
```bash
# Run unit tests
npm test

# Run component tests
npm run test:components

# Run E2E tests
npm run test:e2e
```

### Debugging

#### VS Code Launch Configurations
Add to `.vscode/launch.json`:
```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "type": "node",
      "request": "launch",
      "name": "Debug Backend",
      "skipFiles": ["<node_internals>/**"],
      "program": "${workspaceFolder}/backend/app.js",
      "outFiles": ["${workspaceFolder}/**/*.js"]
    },
    {
      "type": "chrome",
      "request": "launch",
      "name": "Debug Frontend",
      "url": "http://localhost:5173",
      "webRoot": "${workspaceFolder}/frontend"
    }
  ]
}
```

## 🧪 Testing

### Backend Testing

#### Running Tests
```bash
# From the backend directory
cd backend

# Run all tests
npm test

# Run in watch mode
npm run test:watch

# Generate coverage report
npm run test:coverage
```

#### Test Structure
```
backend/
└── __tests__/
    ├── integration/    # Integration tests
    ├── unit/          # Unit tests
    └── fixtures/      # Test fixtures
```

### Frontend Testing

#### Running Tests
```bash
# From the frontend directory
cd frontend

# Run unit tests
npm test

# Run component tests
npm run test:components

# Run E2E tests
npm run test:e2e
```

#### Test Structure
```
frontend/
└── src/
    ├── __tests__/
    │   ├── components/  # Component tests
    │   ├── hooks/      # Custom hooks tests
    │   └── utils/      # Utility function tests
    └── e2e/            # End-to-end tests
```

#### Testing Libraries
- **Unit Testing**: Jest + React Testing Library
- **Component Testing**: React Testing Library
- **E2E Testing**: Cypress
- **Mocking**: MSW (Mock Service Worker)

## 🚀 Deployment

### Backend Deployment

#### Prerequisites
- Node.js 18+ installed on the server
- PM2 or similar process manager (recommended)
- Nginx or similar reverse proxy (recommended)

#### Deployment Steps

1. **Build the application**
   ```bash
   # Install dependencies
   npm ci --only=production
   
   # Set environment variables
   cp .env.example .env
   # Edit .env with production values
   ```

2. **Start the application**
   ```bash
   # Using PM2
   npm install -g pm2
   pm2 start npm --name "user-management-api" -- start
   
   # Or using Node directly
   NODE_ENV=production node app.js
   ```

3. **Set up process management**
   ```bash
   # Save PM2 process list
   pm2 save
   
   # Generate startup script
   pm2 startup
   ```

#### Deployment Options
- **Docker**: `docker-compose up -d`
- **PM2**: `pm2 start ecosystem.config.js`
- **Systemd**: Create a service file for systemd

### Frontend Deployment

#### Building for Production
```bash
# From the frontend directory
cd frontend

# Install dependencies
npm ci

# Build the application
npm run build
```

#### Deployment Options

1. **Static File Hosting**
   - Deploy the `dist` directory to:
     - Vercel
     - Netlify
     - GitHub Pages
     - AWS S3 + CloudFront

2. **Docker**
   ```dockerfile
   # frontend/Dockerfile
   FROM node:18-alpine as build
   WORKDIR /app
   COPY package*.json ./
   RUN npm ci
   COPY . .
   RUN npm run build

   FROM nginx:alpine
   COPY --from=build /app/dist /usr/share/nginx/html
   COPY nginx.conf /etc/nginx/conf.d/default.conf
   EXPOSE 80
   CMD ["nginx", "-g", "daemon off;"]
   ```

3. **Nginx Configuration**
   ```nginx
   server {
       listen 80;
       server_name yourdomain.com;
       root /var/www/html;
       index index.html;

       location / {
           try_files $uri $uri/ /index.html;
       }

       location /api {
           proxy_pass http://localhost:3000;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_cache_bypass $http_upgrade;
       }
   }
   ```

### CI/CD Pipeline

Example GitHub Actions workflow (`.github/workflows/deploy.yml`):

```yaml
name: Deploy

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Set up Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          
      - name: Install dependencies
        run: |
          cd backend && npm ci
          cd ../frontend && npm ci
          
      - name: Run tests
        run: |
          cd backend && npm test
          cd ../frontend && npm test
          
  deploy:
    needs: test
    if: github.ref == 'refs/heads/main'
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Deploy to production
        run: |
          # Add your deployment commands here
          echo "Deploying to production..."
```

## 🤝 Contributing

We welcome contributions from the community! Here's how you can help:

### How to Contribute

1. **Fork** the repository
2. **Clone** your fork: `git clone https://github.com/your-username/user-management-api.git`
3. **Create a branch** for your feature: `git checkout -b feature/your-feature`
4. **Commit** your changes: `git commit -m 'Add some amazing feature'`
5. **Push** to the branch: `git push origin feature/your-feature`
6. Open a **Pull Request**

### Development Workflow

1. **Create an issue** to discuss the proposed change
2. **Write tests** for new features or bug fixes
3. **Update documentation** (README, inline comments, etc.)
4. **Ensure tests pass** before submitting a PR
5. **Squash commits** into logical units of work

### Code Style
- Follow [JavaScript Standard Style](https://standardjs.com/)
- Use meaningful commit messages (Conventional Commits)
- Keep PRs focused and limited to a single feature/bugfix

### Reporting Issues
When reporting bugs, please include:
- Steps to reproduce
- Expected vs. actual behavior
- Environment details (OS, Node.js version, etc.)
- Any relevant error messages or logs

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

```
MIT License

Copyright (c) 2025 Your Name

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

### Special Thanks
- All contributors who have helped improve this project
- The open-source community for their valuable packages and tools

## 📚 Resources

### Documentation
- [API Documentation](https://documenter.getpostman.com/view/...)
- [Frontend Style Guide](/frontend/STYLE_GUIDE.md)
- [Backend Architecture](/backend/ARCHITECTURE.md)

### Related Projects
- [User Management Frontend](https://github.com/your-org/user-management-frontend)
- [Authentication Service](https://github.com/your-org/auth-service)
- [API Gateway](https://github.com/your-org/api-gateway)

### Community
- [Join our Discord](https://discord.gg/...)
- [Follow us on Twitter](https://twitter.com/...)
- [Read our Blog](https://medium.com/...)

---

<div align="center">
  <sub>Built with ❤️ by <a href="https://github.com/your-username">Your Name</a></sub>
</div>

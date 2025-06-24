const express = require('express');
const cors = require('cors');
const path = require('path');
const usersRouter = require('./routes/users');
const { errorHandler } = require('./utils/errors');

const app = express();

// Raw body logger for debugging POST/PUT to /api/users
/*app.use((req, res, next) => {
  if ((req.method === 'POST' || req.method === 'PUT') && req.url.startsWith('/api/users')) {
    let data = '';
    req.on('data', chunk => { data += chunk; });
    req.on('end', () => {
      console.log('RAW BODY RECEIVED:', data);
      next();
    });
  } else {
    next();
  }
});*/

// Use different port for testing to avoid conflicts
const PORT = process.env.NODE_ENV === 'test' 
  ? 3001 
  : process.env.PORT || 3000;

// CORS configuration
const corsOptions = {
  origin: (origin, callback) => {
    // In development, allow all origins including Vite dev server
    if (process.env.NODE_ENV !== 'production') {
      return callback(null, true);
    }
    
    // In production, only allow specific origins
    const allowedOrigins = [
      'http://localhost:5173', // Vite dev server
      'https://your-production-domain.com',
      'https://www.your-production-domain.com'
    ];
    
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      console.log('CORS blocked for origin:', origin);
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
  optionsSuccessStatus: 200 // Some legacy browsers choke on 204
};

// Middleware
app.use(cors(corsOptions));

// Handle preflight requests
app.options('*', cors(corsOptions));
app.use(express.json());

// Request logging
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.originalUrl}`);
  next();
});

// API Routes
app.use('/api/users', usersRouter);

// Root API status endpoint
app.get('/', (req, res) => {
  res.status(200).json({ status: 'ok', message: 'User Management API' });
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'ok',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// Serve static assets in production
if (process.env.NODE_ENV === 'production') {
  // Set static folder
  app.use(express.static(path.join(__dirname, '../frontend/build')));

  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, '../frontend/build', 'index.html'));
  });
}

// 404 handler
app.use((req, res, next) => {
  res.status(404).json({
    status: 'error',
    message: 'Not Found',
    path: req.originalUrl
  });
});

// Error handling middleware (must be last!)
app.use(errorHandler);

// Create HTTP server
const server = app.listen(PORT, () => {
  if (process.env.NODE_ENV !== 'test') {
    console.log(`Server is running on http://localhost:${PORT}`);
  }
}).on('error', (err) => {
  console.error('Server error:', err);
  process.exit(1);
});

// Handle server close
const closeServer = () => {
  return new Promise((resolve) => {
    server.close(() => {
      console.log('Server closed');
      resolve();
    });
  });
};

// Handle process termination
const shutdown = async () => {
  console.log('Shutting down gracefully...');
  try {
    await closeServer();
    console.log('Server has been shut down');
    process.exit(0);
  } catch (err) {
    console.error('Error during shutdown:', err);
    process.exit(1);
  }
};

process.on('SIGTERM', shutdown);
process.on('SIGINT', shutdown);

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.error('Unhandled Rejection:', err);
  // Close server and exit
  shutdown();
});

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err);
  // Close server and exit
  shutdown();
});

module.exports = { app, server, closeServer };

const express = require('express');
const cors = require('cors');
const usersRouter = require('./routes/users');

const app = express();
// Use different port for testing to avoid conflicts
const PORT = process.env.NODE_ENV === 'test' 
  ? 3001 
  : process.env.PORT || 3000;

// CORS configuration
const corsOptions = {
  origin: (origin, callback) => {
    // In development, allow all origins
    if (process.env.NODE_ENV !== 'production') {
      return callback(null, true);
    }
    
    // In production, only allow specific origins
    const allowedOrigins = [
      'https://your-production-domain.com',
      'https://www.your-production-domain.com'
    ];
    
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
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

// Routes
app.use('/users', usersRouter);

// Health check endpoint
app.get('/', (req, res) => {
  res.json({ status: 'API is running' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// Create HTTP server
const server = app.listen(PORT, () => {
  if (process.env.NODE_ENV !== 'test') {
    console.log(`Server is running on http://localhost:${PORT}`);
  }
});

// Handle server close
const closeServer = () => {
  return new Promise((resolve) => {
    server.close(resolve);
  });
};

// Handle process termination
process.on('SIGTERM', () => {
  console.log('SIGTERM received. Shutting down gracefully');
  closeServer().then(() => {
    console.log('Server closed');
    process.exit(0);
  });
});

module.exports = { app, server, closeServer };

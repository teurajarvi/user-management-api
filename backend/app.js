const express = require('express');
const cors = require('cors');
const usersRouter = require('./routes/users');

const app = express();
// Use different port for testing to avoid conflicts
const PORT = process.env.NODE_ENV === 'test' 
  ? 3001 
  : process.env.PORT || 3000;

// Middleware
app.use(cors());
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

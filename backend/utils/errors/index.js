class AppError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
    this.isOperational = true;
    Error.captureStackTrace(this, this.constructor);
  }
}

class ValidationError extends AppError {
  constructor(errors) {
    super('Validation failed', 400);
    this.errors = errors;
    this.name = 'ValidationError';
  }
}

class NotFoundError extends AppError {
  constructor(resource) {
    super(`${resource || 'Resource'} not found`, 404);
    this.name = 'NotFoundError';
  }
}

class ConflictError extends AppError {
  constructor(message = 'Resource already exists') {
    super(message, 409);
    this.name = 'ConflictError';
  }
}

class UnauthorizedError extends AppError {
  constructor(message = 'Not authorized') {
    super(message, 401);
    this.name = 'UnauthorizedError';
  }
}

class ForbiddenError extends AppError {
  constructor(message = 'Forbidden') {
    super(message, 403);
    this.name = 'ForbiddenError';
  }
}

const errorHandler = (err, req, res, next) => {
  // Default error response
  const errorResponse = {
    status: err.status || 'error',
    message: err.message || 'Something went wrong',
    ...(process.env.NODE_ENV === 'development' && {
      stack: err.stack,
      error: err,
    }),
  };

  // Handle specific error types
  if (err.name === 'ValidationError' || err.name === 'ValidatorError') {
    // Handle Mongoose validation errors
    const errors = Object.values(err.errors).map(el => ({
      field: el.path,
      message: el.message,
    }));
    errorResponse.message = 'Validation failed';
    errorResponse.errors = errors;
    errorResponse.statusCode = 400;
  } else if (err.name === 'JsonWebTokenError') {
    errorResponse.message = 'Invalid token';
    errorResponse.statusCode = 401;
  } else if (err.name === 'TokenExpiredError') {
    errorResponse.message = 'Token expired';
    errorResponse.statusCode = 401;
  } else if (err.code === 11000) {
    // Handle duplicate field error
    const field = Object.keys(err.keyValue)[0];
    errorResponse.message = `${field} already exists`;
    errorResponse.statusCode = 409;
  }

  // Log the error in development
  if (process.env.NODE_ENV === 'development') {
    console.error('Error 💥', {
      error: err,
      message: err.message,
      stack: err.stack,
      url: req.originalUrl,
      method: req.method,
      body: req.body,
      params: req.params,
      query: req.query,
    });
  }

  // Send error response
  res.status(errorResponse.statusCode || 500).json(errorResponse);
};

const catchAsync = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch((err) => next(err));
};

module.exports = {
  AppError,
  ValidationError,
  NotFoundError,
  ConflictError,
  UnauthorizedError,
  ForbiddenError,
  errorHandler,
  catchAsync,
};

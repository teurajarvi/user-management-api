const express = require('express');
const { body, validationResult } = require('express-validator');
const fs = require('fs').promises;
const path = require('path');

const router = express.Router();
const DATA_FILE = process.env.NODE_ENV === 'test' 
  ? path.join(__dirname, '../data/test-users.json')
  : path.join(__dirname, '../data/users.json');

// Helper function to read users
const readUsers = async () => {
  try {
    // Read file and remove BOM if present
    let data = await fs.readFile(DATA_FILE, 'utf8');
    data = data.replace(/^\uFEFF/, ''); // Remove BOM
    
    // If file is empty or contains only whitespace, return empty array
    if (!data.trim()) {
      return [];
    }
    
    return JSON.parse(data);
  } catch (error) {
    if (error.code === 'ENOENT' || error instanceof SyntaxError) {
      // If file doesn't exist or contains invalid JSON, create/overwrite with empty array
      await fs.writeFile(DATA_FILE, JSON.stringify([], null, 2), 'utf8');
      return [];
    }
    throw error;
  }
};

// Helper function to write users
const writeUsers = async (users) => {
  await fs.writeFile(DATA_FILE, JSON.stringify(users, null, 2));
};

// Validation middleware
const validateRequest = (validations) => {
  return async (req, res, next) => {
    await Promise.all(validations.map(validation => validation.run(req)));
    
    const errors = validationResult(req);
    if (errors.isEmpty()) {
      return next();
    }
    
    res.status(400).json({ 
      errors: errors.array().map(err => ({
        param: err.param,
        message: err.msg,
        location: err.location
      })) 
    });
  };
};

// Validation rules
const createUserValidation = [
  body('name')
    .trim()
    .notEmpty().withMessage('Name is required')
    .isLength({ max: 100 }).withMessage('Name must be less than 100 characters'),
    
  body('username')
    .trim()
    .notEmpty().withMessage('Username is required')
    .isLength({ min: 3, max: 30 }).withMessage('Username must be between 3-30 characters')
    .matches(/^[a-zA-Z0-9_.-]+$/).withMessage('Username can only contain letters, numbers, underscores, periods, and hyphens'),
    
  body('email')
    .trim()
    .notEmpty().withMessage('Email is required')
    .isEmail().withMessage('Please provide a valid email')
    .normalizeEmail(),
    
  body('address').optional().isObject().withMessage('Address must be an object'),
  body('address.street').optional().trim().isLength({ max: 200 }).withMessage('Street must be less than 200 characters'),
  body('address.city').optional().trim().isLength({ max: 100 }).withMessage('City must be less than 100 characters'),
  body('address.zipcode').optional().trim().isLength({ max: 20 }).withMessage('Zipcode must be less than 20 characters'),
  
  // Sanitize all string fields to prevent XSS
  body('*').escape()
];

// For updates, all fields are optional but must be valid if provided
const updateUserValidation = [
  body('name')
    .optional()
    .trim()
    .isLength({ max: 100 }).withMessage('Name must be less than 100 characters'),
    
  body('username')
    .optional()
    .trim()
    .isLength({ min: 3, max: 30 }).withMessage('Username must be between 3-30 characters')
    .matches(/^[a-zA-Z0-9_.-]+$/).withMessage('Username can only contain letters, numbers, underscores, periods, and hyphens'),
    
  body('email')
    .optional()
    .trim()
    .isEmail().withMessage('Please provide a valid email')
    .normalizeEmail(),
    
  body('address').optional().isObject().withMessage('Address must be an object'),
  body('address.street').optional().trim().isLength({ max: 200 }).withMessage('Street must be less than 200 characters'),
  body('address.city').optional().trim().isLength({ max: 100 }).withMessage('City must be less than 100 characters'),
  body('address.zipcode').optional().trim().isLength({ max: 20 }).withMessage('Zipcode must be less than 20 characters'),
  
  // Sanitize all string fields to prevent XSS
  body('*').escape()
];

// Get all users
router.get('/', async (req, res, next) => {
  try {
    const users = await readUsers();
    res.json(users);
  } catch (error) {
    next(error);
  }
});

// Search users by name
router.get('/search', async (req, res, next) => {
  try {
    const { q } = req.query;
    if (!q) {
      return res.status(400).json({ error: 'Search query parameter "q" is required' });
    }
    
    const users = await readUsers();
    const filteredUsers = users.filter(user => 
      user.name.toLowerCase().includes(q.toLowerCase())
    );
    
    res.json(filteredUsers);
  } catch (error) {
    next(error);
  }
});

// Get user by ID
router.get('/:id', async (req, res, next) => {
  try {
    const users = await readUsers();
    const userId = req.params.id;
    const user = users.find(u => u.id === userId || u.id === parseInt(userId));
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    res.json(user);
  } catch (error) {
    next(error);
  }
});

// Create a new user
router.post('/', validateRequest(createUserValidation), async (req, res, next) => {
  try {
    const users = await readUsers();
    
    // Check if username or email already exists
    const existingUser = users.find(user => 
      user.username === req.body.username || user.email === req.body.email
    );
    
    if (existingUser) {
      return res.status(400).json({
        error: 'User with this username or email already exists'
      });
    }
    
    const newUser = { 
      id: Date.now().toString(), 
      ...req.body,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    users.push(newUser);
    await writeUsers(users);
    
    res.status(201).json(newUser);
  } catch (error) {
    next(error);
  }
});

// Update a user
router.put('/:id', validateRequest(updateUserValidation), async (req, res, next) => {
  try {
    const users = await readUsers();
    const index = users.findIndex(u => u.id === req.params.id);
    
    if (index === -1) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    // Check if new username or email already exists (excluding current user)
    if (req.body.username || req.body.email) {
      const existingUser = users.find(user => 
        user.id !== req.params.id && 
        (user.username === req.body.username || user.email === req.body.email)
      );
      
      if (existingUser) {
        return res.status(400).json({
          error: 'Username or email is already in use by another user'
        });
      }
    }
    
    const updatedUser = { 
      ...users[index], 
      ...req.body,
      updatedAt: new Date().toISOString()
    };
    
    users[index] = updatedUser;
    await writeUsers(users);
    
    res.json(updatedUser);
  } catch (error) {
    next(error);
  }
});

// Delete user
router.delete('/:id', async (req, res, next) => {
  try {
    const users = await readUsers();
    const userId = req.params.id;
    const index = users.findIndex(u => u.id === userId);
    
    if (index === -1) {
      return res.status(404).json({ error: 'User not found' });
    }

    users.splice(index, 1);
    await writeUsers(users);
    
    res.status(204).end();
  } catch (error) {
    next(error);
  }
});

module.exports = router;

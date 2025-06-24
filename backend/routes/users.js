const express = require('express');
const { body, validationResult } = require('express-validator');
const fs = require('fs').promises;
const path = require('path');
const {
  ValidationError,
  NotFoundError,
  ConflictError,
  catchAsync
} = require('../utils/errors');

const router = express.Router();
const DATA_FILE = process.env.NODE_ENV === 'test' 
  ? path.join(__dirname, '../data/test-users.json')
  : path.join(__dirname, '../data/users.json');

console.log('[users.js] NODE_ENV:', process.env.NODE_ENV, '| DATA_FILE:', DATA_FILE);

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
    try {
      await Promise.all(validations.map(validation => validation.run(req)));
      
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        const errorDetails = errors.array().map(err => ({
          field: err.param,
          message: err.msg,
          location: err.location,
          value: err.value
        }));
        return next(new ValidationError(errorDetails));
      }
      next();
    } catch (error) {
      next(error);
    }
  };
};

// Validation rules
const createUserValidation = [
  body('name').trim().notEmpty().withMessage('Name is required'),
  body('username')
    .trim()
    .notEmpty().withMessage('Username is required')
    .isLength({ min: 3 }).withMessage('Username must be at least 3 characters')
    .matches(/^[a-zA-Z0-9_]+$/).withMessage('Username can only contain letters, numbers, and underscores'),
  body('email')
    .trim()
    .notEmpty().withMessage('Email is required')
    .isEmail().withMessage('Please provide a valid email'),
  body('address.street').optional().trim(),
  body('address.city').optional().trim(),
  body('address.zipcode').optional().trim(),
];

const updateUserValidation = [
  body('name').optional().trim().notEmpty().withMessage('Name cannot be empty'),
  body('username')
    .optional()
    .trim()
    .isLength({ min: 3 }).withMessage('Username must be at least 3 characters')
    .matches(/^[a-zA-Z0-9_]+$/).withMessage('Username can only contain letters, numbers, and underscores'),
  body('email')
    .optional()
    .trim()
    .isEmail().withMessage('Please provide a valid email'),
  body('address.street').optional().trim(),
  body('address.city').optional().trim(),
  body('address.zipcode').optional().trim(),
];

// Search users by query
router.get('/search', catchAsync(async (req, res) => {
  const { q } = req.query;
  if (!q) {
    return res.status(400).json({ error: 'Search query is required' });
  }

  const users = await readUsers();
  const searchTerm = q.toLowerCase();
  
  const results = users.filter(user => 
    user.name.toLowerCase().includes(searchTerm) ||
    user.username.toLowerCase().includes(searchTerm) ||
    user.email.toLowerCase().includes(searchTerm) ||
    (user.address && (
      (user.address.street && user.address.street.toLowerCase().includes(searchTerm)) ||
      (user.address.city && user.address.city.toLowerCase().includes(searchTerm)) ||
      (user.address.zipcode && user.address.zipcode.includes(searchTerm))
    ))
  );

  // Return the results array directly to match frontend expectations
  res.json(results);
}));

// Get all users with optional filtering
router.get('/', catchAsync(async (req, res) => {
  let users = await readUsers();
  
  // Apply filters if query parameters are provided
  if (Object.keys(req.query).length > 0) {
    users = users.filter(user => {
      return Object.entries(req.query).every(([key, value]) => {
        // Skip search query as it's handled by the search endpoint
        if (key === 'q') return true;
        
        // Handle nested properties (e.g., address.city)
        const keys = key.split('.');
        let prop = user;
        for (const k of keys) {
          if (!prop || typeof prop !== 'object' || !(k in prop)) {
            return false;
          }
          prop = prop[k];
        }
        return String(prop).toLowerCase().includes(String(value).toLowerCase());
      });
    });
  }
  
  // Return the users array directly to match frontend expectations
  res.json(users);
}));

// Get user by ID
router.get('/:id', catchAsync(async (req, res) => {
  const users = await readUsers();
  const userId = req.params.id;
  
  // Handle both string and number IDs
  const user = users.find(u => u.id == userId);
  
  if (!user) {
    return res.status(404).json({ status: 'error', message: 'User not found' });
  }
  
  // Return the user object directly to match frontend expectations
  res.json(user);
}));


// Create a new user
router.post('/',
  (req, res, next) => {
    console.log('PRE-VALIDATION req.body:', req.body);
    next();
  },
  validateRequest(createUserValidation),
  catchAsync(async (req, res) => {
  console.log('Received POST /api/users body:', JSON.stringify(req.body, null, 2));
  console.log('Type of req.body.address:', typeof req.body.address);
  console.log('Is req.body.address an array?', Array.isArray(req.body.address));
  console.log('req.body.address:', req.body.address);
  try {
    const users = await readUsers();
    
    // Check if username or email already exists
    const existingUser = users.find(user => 
      user.username === req.body.username || user.email === req.body.email
    );
    
    if (existingUser) {
      const field = existingUser.username === req.body.username ? 'username' : 'email';
      return res.status(409).json({ status: 'fail', message: `User with this ${field} already exists` });
    }
    
    // Create a new user with proper address handling (no timestamps)
    const newUser = { 
      id: Date.now().toString(), 
      name: req.body.name,
      username: req.body.username,
      email: req.body.email,
      address: {
        street: req.body.address?.street || req.body.street || '',
        city: req.body.address?.city || req.body.city || '',
        zipcode: req.body.address?.zipcode || req.body.zipcode || '',
        geo: req.body.address?.geo || { lat: '', lng: '' }
      },
      phone: req.body.phone || '',
      website: req.body.website || '',
      company: req.body.company || { name: '', catchPhrase: '', bs: '' }
    };
    
    users.push(newUser);
    await writeUsers(users);
    
    // Remove unwanted fields from response
    res.status(201).json(newUser);
  } catch (error) {
    console.error('Error creating user:', error);
    res.status(500).json({ status: 'error', message: 'Internal server error' });
  }
}));

// Update a user
router.put('/:id', validateRequest(updateUserValidation), catchAsync(async (req, res) => {
  try {
    console.log('Update user request received:', { params: req.params, body: req.body });
    
    const users = await readUsers();
    const userId = req.params.id;
    const index = users.findIndex(u => u.id == userId);
    
    console.log('Found user at index:', index, 'with ID:', userId);
    
    if (index === -1) {
      console.log('User not found with ID:', userId);
      return res.status(404).json({ status: 'error', message: 'User not found' });
    }
    
    console.log('Checking for duplicate username or email...');
    // Check for duplicate username or email
    const duplicateUser = users.find(
      (user, i) => 
        i !== index && 
        (user.username === req.body.username || user.email === req.body.email)
    );
    
    if (duplicateUser) {
      console.log('Duplicate user found:', { 
        existingUser: { id: duplicateUser.id, username: duplicateUser.username, email: duplicateUser.email },
        newData: { username: req.body.username, email: req.body.email }
      });
      return res.status(409).json({ status: 'fail', message: 'Username or email already in use' });
    }
    
    console.log('Updating user...');
    // Create a clean update object with only the fields we want to update
    // Helper to ensure address is a plain object
    function safeAddress(val) {
      return val && typeof val === "object" && !Array.isArray(val) ? val : {};
    }

    const updateData = {
      name: req.body.name,
      username: req.body.username,
      email: req.body.email,
      phone: req.body.phone || users[index].phone,
      website: req.body.website || users[index].website,
      company: req.body.company || users[index].company || {},
      // Handle address updates properly
      address: {
        ...(users[index].address || {}), // Keep existing address fields
        ...safeAddress(req.body.address) // Only merge if address is a plain object
      }
    };
    
    // Create a clean user object with only the properties we want
    const { id } = users[index];
    const updatedUser = {
      id,
      name: updateData.name,
      username: updateData.username,
      email: updateData.email,
      phone: updateData.phone,
      website: updateData.website,
      company: updateData.company,
      address: updateData.address
    };
    
    users[index] = updatedUser;
    
    console.log('Writing updated users to file...');
    await writeUsers(users);
    
    console.log('User updated successfully:', { userId, updatedUser });
    // Return the updated user directly
    res.json(updatedUser);
  } catch (error) {
    console.error('Error in update user route:', error);
    res.status(500).json({ status: 'error', message: 'Internal server error' });
  }
}));

// Delete a user
router.delete('/:id', catchAsync(async (req, res) => {
  const users = await readUsers();
  const userId = req.params.id;
  const index = users.findIndex(u => u.id == userId);
  
  if (index === -1) {
    return res.status(404).json({ status: 'error', message: 'User not found' });
  }
  
  users.splice(index, 1);
  await writeUsers(users);
  
  res.status(204).end();
}));

module.exports = router;

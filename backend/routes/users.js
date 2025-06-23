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

// Validation rules
const userValidationRules = [
  body('name').trim().notEmpty().withMessage('Name is required'),
  body('username').trim().notEmpty().withMessage('Username is required'),
  body('email').isEmail().withMessage('Valid email is required'),
  body('address.street').optional().trim(),
  body('address.city').optional().trim(),
  body('address.zipcode').optional().trim()
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
    const user = users.find(u => u.id === parseInt(req.params.id));
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    res.json(user);
  } catch (error) {
    next(error);
  }
});

// Create new user
router.post('/', userValidationRules, async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const users = await readUsers();
    const newUser = {
      id: users.length > 0 ? Math.max(...users.map(u => u.id)) + 1 : 1,
      ...req.body,
      address: req.body.address || {}
    };

    users.push(newUser);
    await writeUsers(users);
    
    res.status(201).json(newUser);
  } catch (error) {
    next(error);
  }
});

// Update user
router.put('/:id', userValidationRules, async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const users = await readUsers();
    const index = users.findIndex(u => u.id === parseInt(req.params.id));
    
    if (index === -1) {
      return res.status(404).json({ error: 'User not found' });
    }

    const updatedUser = {
      ...users[index],
      ...req.body,
      id: users[index].id, // Prevent ID change
      address: { ...users[index].address, ...(req.body.address || {}) }
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
    const index = users.findIndex(u => u.id === parseInt(req.params.id));
    
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

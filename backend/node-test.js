// Set test environment before requiring app
process.env.NODE_ENV = 'test';

const { test, describe, before, after, afterEach } = require('node:test');
const assert = require('node:assert');
const fs = require('fs').promises;
const path = require('path');
const { app, closeServer } = require('./app');
const request = require('supertest');
const { v4: uuidv4 } = require('uuid');

const TEST_DATA_FILE = path.join(__dirname, 'data', 'test-users.json');

// Ensure test data directory exists
const ensureTestDataDir = async () => {
  const dir = path.join(__dirname, 'data');
  try {
    await fs.mkdir(dir, { recursive: true });
  } catch (error) {
    if (error.code !== 'EEXIST') throw error;
  }
};

// Test data
const testUser = {
  name: 'Test User',
  username: 'testuser123',
  email: 'test@example.com',
  address: {
    street: '123 Test St',
    city: 'Test City',
    zipcode: '12345'
  }
};

const invalidUser = {
  name: 'A'.repeat(101), // Too long name
  username: 'te', // Too short username
  email: 'invalid-email',
  address: {
    street: 'A'.repeat(201), // Too long street
    city: 'A'.repeat(101), // Too long city
    zipcode: 'A'.repeat(21) // Too long zipcode
  }
};

describe('User Management API', () => {
  let createdUserId;

  // Clean up before and after tests
  before(async () => {
    // Ensure test data directory exists
    await ensureTestDataDir();
    // Ensure test data file exists and is empty
    await fs.writeFile(TEST_DATA_FILE, JSON.stringify([], null, 2));
  });

  afterEach(async () => {
    // Clean up test data after each test
    try {
      await fs.writeFile(TEST_DATA_FILE, JSON.stringify([], null, 2));
    } catch (error) {
      console.error('Error cleaning up test data:', error);
    }
  });

  after(async () => {
    // Close the server after all tests
    await closeServer();
    // Clean up test data file
    try {
      await fs.unlink(TEST_DATA_FILE).catch(() => {});
    } catch (error) {
      console.error('Error removing test data file:', error);
    }
  });

  test('GET / should return API status', async () => {
    const response = await request(app).get('/');
    assert.strictEqual(response.status, 200);
    assert.deepStrictEqual(response.body, { status: 'API is running' });
  });

  test('POST /users should create a new user', async () => {
    const response = await request(app)
      .post('/users')
      .send(testUser);
    
    assert.strictEqual(response.status, 201);
    assert.strictEqual(response.body.name, testUser.name);
    assert.strictEqual(response.body.username, testUser.username);
    assert.strictEqual(response.body.email, testUser.email);
    
    // Test duplicate username/email
    const dupResponse = await request(app)
      .post('/users')
      .send(testUser);
    assert.strictEqual(dupResponse.status, 400);
    
    // Save the created user ID for later tests
    createdUserId = response.body.id;
  });

  test('POST /users should validate input', async () => {
    // Create a copy of the invalid user to avoid modifying the original
    const invalidUserCopy = JSON.parse(JSON.stringify(invalidUser));
    
    const response = await request(app)
      .post('/users')
      .send(invalidUserCopy);
    
    // We expect a 400 status code for validation errors
    assert.strictEqual(response.status, 400, `Expected status 400 but got ${response.status}. Response: ${JSON.stringify(response.body)}`);
    
    // The response should have an errors array
    assert(Array.isArray(response.body.errors), 'Response should have an errors array');
    assert(response.body.errors.length > 0, 'Should have at least one validation error');
    
    // Convert errors to a more searchable format
    const errorFields = response.body.errors.map(err => ({
      param: err.param || 'unknown',
      message: err.msg || err.message || 'No message'
    }));
    
    // Log the actual errors for debugging
    console.log('Validation errors:', JSON.stringify(errorFields, null, 2));
    
    // Check that we have at least one validation error
    assert(errorFields.length > 0, 'Should have validation errors');
    
    // Check that we have the expected error messages
    const errorMessages = errorFields.map(err => err.message).join('; ').toLowerCase();
    
    // Check for specific validation errors we expect
    const hasStreetError = errorMessages.includes('street');
    const hasCityError = errorMessages.includes('city');
    const hasZipcodeError = errorMessages.includes('zipcode');
    const hasNameError = errorMessages.includes('name');
    const hasUsernameError = errorMessages.includes('username');
    const hasEmailError = errorMessages.includes('email');
    
    // Log which validations passed/failed
    console.log('Validation results:', {
      hasStreetError,
      hasCityError,
      hasZipcodeError,
      hasNameError,
      hasUsernameError,
      hasEmailError,
      allErrors: errorMessages
    });
    
    // Check that we have at least one expected validation error
    const hasAnyError = hasStreetError || hasCityError || hasZipcodeError || 
                       hasNameError || hasUsernameError || hasEmailError;
    
    assert(
      hasAnyError,
      `Expected validation errors but got none. All errors: ${errorMessages}`
    );
  });

  test('GET /users should return all users', async () => {
    // Create a unique test user
    const uniqueTestUser = {
      ...testUser,
      username: `testuser-${Date.now()}`,
      email: `test-${Date.now()}@example.com`
    };
    
    // First create a test user
    await request(app)
      .post('/users')
      .send(uniqueTestUser);
    
    const response = await request(app).get('/users');
    assert.strictEqual(response.status, 200);
    assert(Array.isArray(response.body), 'Response should be an array');
    assert(response.body.length > 0, 'Should return at least one user');
  });

  test('GET /users/:id should return a specific user', async () => {
    // Create a unique test user for this test
    const uniqueUsername = `testgetuser-${Date.now()}`;
    const uniqueEmail = `getuser-${Date.now()}@example.com`;
    
    // First create a test user
    const createResponse = await request(app)
      .post('/users')
      .send({
        name: 'Test User for GET',
        username: uniqueUsername,
        email: uniqueEmail
      });
    
    // Get the user
    const response = await request(app).get(`/users/${createResponse.body.id}`);
    assert.strictEqual(response.status, 200);
    assert.strictEqual(response.body.id, createResponse.body.id);
    assert.strictEqual(response.body.name, 'Test User for GET');
    assert.strictEqual(response.body.username, uniqueUsername);
    
    // Test getting non-existent user
    const nonExistentUser = await request(app).get('/users/nonexistent');
    assert.strictEqual(nonExistentUser.status, 404);
  });

  test('PUT /users/:id should update a user', async () => {
    // First create a test user
    const createResponse = await request(app)
      .post('/users')
      .send(testUser);
      
    const updatedUser = { 
      ...testUser, 
      name: 'Updated Test User',
      username: 'updatedusername' // New username
    };
    
    const response = await request(app)
      .put(`/users/${createResponse.body.id}`)
      .send(updatedUser);
    
    assert.strictEqual(response.status, 200);
    assert.strictEqual(response.body.name, 'Updated Test User');
    assert.strictEqual(response.body.username, 'updatedusername');
    
    // Test update with invalid data
    const invalidUpdate = await request(app)
      .put(`/users/${createResponse.body.id}`)
      .send({ email: 'invalid-email' });
    assert.strictEqual(invalidUpdate.status, 400);
    
    // Test update with duplicate username/email
    const anotherUser = { ...testUser, username: 'anotheruser', email: 'another@example.com' };
    await request(app).post('/users').send(anotherUser);
    
    const dupUpdate = await request(app)
      .put(`/users/${createResponse.body.id}`)
      .send({ username: 'anotheruser' });
    assert.strictEqual(dupUpdate.status, 400);
  });

  test('DELETE /users/:id should delete a user', async () => {
    // First create a test user
    const createResponse = await request(app)
      .post('/users')
      .send({
        name: 'User to delete',
        username: 'tobedeleted',
        email: 'delete@example.com'
      });
      
    // Delete the user
    const deleteResponse = await request(app).delete(`/users/${createResponse.body.id}`);
    assert.strictEqual(deleteResponse.status, 204);
    
    // Verify the user was deleted
    const getResponse = await request(app).get(`/users/${createResponse.body.id}`);
    assert.strictEqual(getResponse.status, 404);
    
    // Test deleting non-existent user
    const nonExistentDelete = await request(app).delete('/users/nonexistent');
    assert.strictEqual(nonExistentDelete.status, 404);
  });

  test('GET /users/search should search users', async () => {
    // Create a test user for search
    const searchUser = {
      ...testUser,
      name: 'Search Test User',
      email: 'search@example.com'
    };
    
    const createResponse = await request(app)
      .post('/users')
      .send(searchUser);
    
    // Search for the user
    const searchResponse = await request(app)
      .get('/users/search')
      .query({ q: 'Search Test' });
    
    assert.strictEqual(searchResponse.status, 200);
    assert(Array.isArray(searchResponse.body), 'Response should be an array');
    assert(searchResponse.body.length > 0, 'Should find the test user');
    assert.strictEqual(searchResponse.body[0].name, 'Search Test User');
    
    // Clean up
    await request(app).delete(`/users/${createResponse.body.id}`);
  });

  test('should return 404 for non-existent user', async () => {
    const nonExistentId = uuidv4();
    const response = await request(app).get(`/users/${nonExistentId}`);
    assert.strictEqual(response.status, 404);
  });
});

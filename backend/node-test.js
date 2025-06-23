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
  username: 'testuser',
  email: 'test@example.com',
  address: {
    street: '123 Test St',
    suite: 'Apt 1',
    city: 'Test City',
    zipcode: '12345'
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
    
    // Save the created user ID for later tests
    createdUserId = response.body.id;
  });

  test('GET /users should return all users', async () => {
    // First create a test user
    const createResponse = await request(app)
      .post('/users')
      .send(testUser);
    
    const response = await request(app).get('/users');
    assert.strictEqual(response.status, 200);
    assert(Array.isArray(response.body), 'Response should be an array');
    assert(response.body.length > 0, 'Should return at least one user');
  });

  test('GET /users/:id should return a specific user', async () => {
    // First create a test user
    const createResponse = await request(app)
      .post('/users')
      .send(testUser);
      
    const response = await request(app).get(`/users/${createResponse.body.id}`);
    assert.strictEqual(response.status, 200);
    assert.strictEqual(response.body.id, createResponse.body.id);
    assert.strictEqual(response.body.name, testUser.name);
  });

  test('PUT /users/:id should update a user', async () => {
    // First create a test user
    const createResponse = await request(app)
      .post('/users')
      .send(testUser);
      
    const updatedUser = { ...testUser, name: 'Updated Test User' };
    const response = await request(app)
      .put(`/users/${createResponse.body.id}`)
      .send(updatedUser);
    
    assert.strictEqual(response.status, 200);
    assert.strictEqual(response.body.name, 'Updated Test User');
    
    // Verify the update
    const getResponse = await request(app).get(`/users/${createResponse.body.id}`);
    assert.strictEqual(getResponse.body.name, 'Updated Test User');
  });

  test('DELETE /users/:id should delete a user', async () => {
    // First create a test user
    const createResponse = await request(app)
      .post('/users')
      .send(testUser);
      
    const response = await request(app).delete(`/users/${createResponse.body.id}`);
    assert.strictEqual(response.status, 204);
    
    // Verify the user was deleted
    const getResponse = await request(app).get(`/users/${createResponse.body.id}`);
    assert.strictEqual(getResponse.status, 404);
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

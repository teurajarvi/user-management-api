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
  let createdUserId = null; // Ensure initialized


  // Clean up before and after tests
  before(async () => {
    console.log('[TEST HOOK] before: wiping test data file');
    // Ensure test data directory exists
    await ensureTestDataDir();
    // Ensure test data file exists and is empty
    await fs.writeFile(TEST_DATA_FILE, JSON.stringify([], null, 2));
  });

  afterEach(async () => {
    console.log('[TEST HOOK] afterEach: wiping test data file');
    // Clean up test data after each test
    try {
      await fs.writeFile(TEST_DATA_FILE, JSON.stringify([], null, 2));
    } catch (error) {
      console.error('Error cleaning up test data:', error);
    }
  });

  after(async () => {
    console.log('[TEST HOOK] after: closing server and removing test data file');
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
    if (response.status !== 200) {
      console.error('Root endpoint response:', response.status, response.body);
    }
    assert.strictEqual(response.status, 200);
    assert.deepStrictEqual(response.body, { status: 'ok', message: 'User Management API' });
  });

  test('POST /api/users should create a new user', async () => {
    const uniqueUser = {
      ...testUser,
      username: `testuser${Date.now()}`,
      email: `test${Date.now()}@example.com`
    };
    const response = await request(app).post('/api/users').send(uniqueUser);
    assert.strictEqual(response.status, 201);
    assert.strictEqual(response.body.name, uniqueUser.name);
    assert.strictEqual(response.body.username, uniqueUser.username);
    assert.strictEqual(response.body.email, uniqueUser.email);
    createdUserId = response.body.id;
  });

  test('POST /api/users should validate input', async () => {
    const response = await request(app).post('/api/users').send(invalidUser);
    assert.strictEqual(response.status, 400);
  });

  test('GET /api/users should return all users', async () => {
    // Create a unique test user first
    const uniqueUser = {
      ...testUser,
      name: 'Test User', // ensure not too long
      username: `testallusers_${Date.now()}`, // valid and at least 3 chars
      email: `allusers_${Date.now()}@example.com`
    };
    const createRes = await request(app).post('/api/users').send(uniqueUser);
    console.log('POST /api/users (all users test) status:', createRes.status, 'body:', createRes.body);
    assert.strictEqual(createRes.status, 201, 'User creation should succeed');
    // Wait to ensure file write completes
    await new Promise(res => setTimeout(res, 50));
    const response = await request(app).get('/api/users');
    console.log('GET /api/users (all users test) response body:', response.body);
    assert.strictEqual(response.status, 200);
    assert.ok(Array.isArray(response.body));
    assert(response.body.length > 0, 'Should return at least one user');
  });

  test('GET /api/users/:id should return a specific user', async () => {
    // Create a unique test user for this test
    const uniqueUsername = `testgetuser_${Date.now()}`;
    const uniqueEmail = `getuser_${Date.now()}@example.com`;
    const createRes = await request(app).post('/api/users').send({
      name: 'Test User',
      username: uniqueUsername,
      email: uniqueEmail,
      address: { street: '123 Test St', city: 'Test City', zipcode: '12345' }
    });
    console.log('POST /api/users (get by id test) status:', createRes.status, 'body:', createRes.body);
    assert.strictEqual(createRes.status, 201, 'User creation should succeed');
    const userId = createRes.body && createRes.body.id;
    assert.ok(userId, 'User ID should be defined');
    // Wait a bit longer to ensure file write completes
    await new Promise(res => setTimeout(res, 50));
    const response = await request(app).get(`/api/users/${userId}`);
    if (response.status !== 200) {
      console.error('GET /api/users/:id failed:', response.status, response.body, 'userId:', userId);
    }
    assert.strictEqual(response.status, 200);
    assert.strictEqual(response.body.username, uniqueUsername);
  });

  test('PUT /api/users/:id should update a user', async () => {
    // Create a unique test user
    const uniqueUsername = `testupdateuser_${Date.now()}`;
    const uniqueEmail = `updateuser_${Date.now()}@example.com`;
    const createRes = await request(app).post('/api/users').send({
      name: 'Test User',
      username: uniqueUsername,
      email: uniqueEmail,
      address: { street: '123 Test St', city: 'Test City', zipcode: '12345' }
    });
    console.log('POST /api/users (update test) status:', createRes.status, 'body:', createRes.body);
    assert.strictEqual(createRes.status, 201, 'User creation should succeed');
    const userId = createRes.body.id;
    // Wait a moment to ensure file write completes
    await new Promise(res => setTimeout(res, 10));
    const updateRes = await request(app).put(`/api/users/${userId}`).send({
      name: 'Updated Name',
      username: uniqueUsername,
      email: uniqueEmail,
      address: { street: '123 Test St', city: 'Test City', zipcode: '12345' }
    });
    console.log('PUT /api/users/:id (update test) status:', updateRes.status, 'body:', updateRes.body);
    if (updateRes.status !== 200) {
      console.error('PUT /api/users/:id failed:', updateRes.status, updateRes.body, 'userId:', userId);
    }
    assert.strictEqual(updateRes.status, 200);
    assert.strictEqual(updateRes.body.name, 'Updated Name');
  });

  test('DELETE /api/users/:id should delete a user', async () => {
    // Create a unique test user
    const uniqueUsername = `testdeleteuser_${Date.now()}`;
    const uniqueEmail = `deleteuser_${Date.now()}@example.com`;
    const createRes = await request(app).post('/api/users').send({
      name: 'Test User',
      username: uniqueUsername,
      email: uniqueEmail,
      address: { street: '123 Test St', city: 'Test City', zipcode: '12345' }
    });
    console.log('POST /api/users (delete test) status:', createRes.status, 'body:', createRes.body);
    assert.strictEqual(createRes.status, 201, 'User creation should succeed');
    const userId = createRes.body.id;
    const deleteRes = await request(app).delete(`/api/users/${userId}`);
    assert.strictEqual(deleteRes.status, 204);
  });

  test('GET /api/users/search should search users', async () => {
    // Create a test user
    await request(app).post('/api/users').send({ ...testUser, username: 'searchuser', email: 'search@example.com' });
    const response = await request(app).get('/api/users/search?q=searchuser');
    assert.strictEqual(response.status, 200);
    assert.ok(Array.isArray(response.body));
  });

  test('GET /api/users/:id should return 404 for non-existent user', async () => {
    const response = await request(app).get(`/api/users/nonexistentid123`);
    assert.strictEqual(response.status, 404);
  });

  test('POST /api/users should create a new user', async () => {
    const response = await request(app)
      .post('/api/users')
      .send(testUser);
    
    assert.strictEqual(response.status, 201);
    assert.strictEqual(response.body.name, testUser.name);
    assert.strictEqual(response.body.username, testUser.username);
    assert.strictEqual(response.body.email, testUser.email);
    
    // Test duplicate username/email
    const dupResponse = await request(app)
      .post('/api/users')
      .send(testUser);
    assert.strictEqual(dupResponse.status, 409);
    
    // Save the created user ID for later tests
    createdUserId = response.body.id;
  });

  test('POST /api/users should validate input', async () => {
    // Create a copy of the invalid user to avoid modifying the original
    const invalidUserCopy = JSON.parse(JSON.stringify(invalidUser));
    
    const response = await request(app)
      .post('/api/users')
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

  test('GET /api/users should return all users (empty)', async () => {
    // No users created in this test, should return empty array
    const response = await request(app).get('/api/users');
    assert.strictEqual(response.status, 200);
    assert(Array.isArray(response.body), 'Response should be an array');
    assert.strictEqual(response.body.length, 0, 'Should return zero users when none exist');
  });

  test('GET /api/users/:id should return a specific user', async () => {
    // Create a unique test user for this test
    const uniqueUsername = `testgetuser2_${Date.now()}`;
    const uniqueEmail = `getuser2_${Date.now()}@example.com`;
    // First create a test user
    const createResponse = await request(app)
      .post('/api/users')
      .send({
        name: 'Test User for GET',
        username: uniqueUsername,
        email: uniqueEmail,
        address: { street: '123 Test St', city: 'Test City', zipcode: '12345' }
      });
    console.log('POST /api/users (get by id test 2) status:', createResponse.status, 'body:', createResponse.body);
    assert.strictEqual(createResponse.status, 201, 'User creation should succeed');
    const userId = createResponse.body && createResponse.body.id;
    assert.ok(userId, 'User ID should be defined');
    // Get the user
    const response = await request(app).get(`/api/users/${userId}`);
    assert.strictEqual(response.status, 200);
    assert.strictEqual(response.body.id, userId);
    assert.strictEqual(response.body.name, 'Test User for GET');
    assert.strictEqual(response.body.username, uniqueUsername);
    // Test getting non-existent user
    const nonExistentUser = await request(app).get('/api/users/nonexistent');
    assert.strictEqual(nonExistentUser.status, 404);
  });

  test('PUT /api/users/:id should update a user', async () => {
    // First create a test user
    const createResponse = await request(app)
      .post('/api/users')
      .send(testUser);
      
    const updatedUser = { 
      ...testUser, 
      name: 'Updated Test User',
      username: 'updatedusername' // New username
    };
    
    const response = await request(app)
      .put(`/api/users/${createResponse.body.id}`)
      .send(updatedUser);
    
    assert.strictEqual(response.status, 200);
    assert.strictEqual(response.body.name, 'Updated Test User');
    assert.strictEqual(response.body.username, 'updatedusername');
    
    // Test update with invalid data
    const invalidUpdate = await request(app)
      .put(`/api/users/${createResponse.body.id}`)
      .send({ email: 'invalid-email' });
    assert.strictEqual(invalidUpdate.status, 400);
    
    // Test update with duplicate username/email
    const anotherUser = { ...testUser, username: 'anotheruser', email: 'another@example.com' };
    await request(app).post('/api/users').send(anotherUser);
    
    const dupUpdate = await request(app)
      .put(`/api/users/${createResponse.body.id}`)
      .send({ username: 'anotheruser' });
    assert.strictEqual(dupUpdate.status, 409);
  });

  test('DELETE /api/users/:id should delete a user', async () => {
    // First create a test user
    const createResponse = await request(app)
      .post('/api/users')
      .send({
        name: 'User to delete',
        username: 'tobedeleted',
        email: 'delete@example.com'
      });
      
    // Delete the user
    const deleteResponse = await request(app).delete(`/api/users/${createResponse.body.id}`);
    assert.strictEqual(deleteResponse.status, 204);
    
    // Verify the user was deleted
    const getResponse = await request(app).get(`/api/users/${createResponse.body.id}`);
    assert.strictEqual(getResponse.status, 404);
    
    // Test deleting non-existent user
    const nonExistentDelete = await request(app).delete('/api/users/nonexistent');
    assert.strictEqual(nonExistentDelete.status, 404);
  });

  test('GET /api/users/search should search users', async () => {
    // Create a test user for search
    const searchUser = {
      ...testUser,
      name: 'Search Test User',
      email: 'search@example.com'
    };
    
    const createResponse = await request(app)
      .post('/api/users')
      .send(searchUser);
    
    // Search for the user
    const searchResponse = await request(app)
      .get('/api/users/search')
      .query({ q: 'Search Test' });
    
    assert.strictEqual(searchResponse.status, 200);
    assert(Array.isArray(searchResponse.body), 'Response should be an array');
    assert(searchResponse.body.length > 0, 'Should find the test user');
    assert.strictEqual(searchResponse.body[0].name, 'Search Test User');
    
    // Clean up
    await request(app).delete(`/api/users/${createResponse.body.id}`);
  });

  test('should return 404 for non-existent user', async () => {
    const nonExistentId = uuidv4();
    const response = await request(app).get(`/api/users/${nonExistentId}`);
    assert.strictEqual(response.status, 404);
  });
});

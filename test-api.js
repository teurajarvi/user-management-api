const axios = require('axios');
const { v4: uuidv4 } = require('uuid');

const API_BASE_URL = 'http://localhost:3000/api';

// Helper function to make API requests
async function testEndpoint(method, endpoint, data = null, expectedStatus = 200) {
  try {
    const config = {
      method,
      url: `${API_BASE_URL}${endpoint}`,
      headers: { 'Content-Type': 'application/json' },
      validateStatus: () => true // Don't throw on HTTP error status
    };

    if (data) {
      config.data = data;
    }

    const response = await axios(config);
    
    console.log(`[${method.toUpperCase()}] ${endpoint} - Status: ${response.status}`);
    
    if (response.status !== expectedStatus) {
      console.error('Unexpected status code:', response.status);
      console.error('Response:', response.data);
      return null;
    }
    
    return response.data;
  } catch (error) {
    console.error('Error:', error.message);
    return null;
  }
}

// Test cases
async function runTests() {
  console.log('Starting API tests...\n');
  
  // Test 1: Health check
  console.log('1. Testing health check endpoint...');
  const health = await testEndpoint('get', '/health');
  console.log(health);
  
  // Test 2: Get all users (should be empty)
  console.log('\n2. Getting all users...');
  const users = await testEndpoint('get', '/users');
  console.log(users);
  
  // Test 3: Create a new user
  console.log('\n3. Creating a new user...');
  const newUser = {
    name: 'Test User',
    username: 'testuser',
    email: 'test@example.com',
    address: {
      street: '123 Test St',
      city: 'Test City',
      zipcode: '12345'
    }
  };
  
  const createdUser = await testEndpoint('post', '/users', newUser, 201);
  console.log(createdUser);
  
  if (!createdUser) {
    console.error('Failed to create user');
    return;
  }
  
  const userId = createdUser.data.user.id;
  
  // Test 4: Get user by ID
  console.log(`\n4. Getting user with ID: ${userId}`);
  const retrievedUser = await testEndpoint('get', `/users/${userId}`);
  console.log(retrievedUser);
  
  // Test 5: Update user
  console.log('\n5. Updating user...');
  const updatedUser = await testEndpoint('put', `/users/${userId}`, {
    name: 'Updated Test User',
    address: {
      city: 'Updated City'
    }
  });
  console.log(updatedUser);
  
  // Test 6: Search users
  console.log('\n6. Searching for users...');
  const searchResults = await testEndpoint('get', '/users/search?q=test');
  console.log(searchResults);
  
  // Test 7: Test validation errors
  console.log('\n7. Testing validation errors...');
  const invalidUser = { username: 'a' }; // Invalid: name is required
  const validationError = await testEndpoint('post', '/users', invalidUser, 400);
  console.log(validationError);
  
  // Test 8: Test not found error
  console.log('\n8. Testing not found error...');
  const notFound = await testEndpoint('get', '/users/nonexistent', null, 404);
  console.log(notFound);
  
  // Test 9: Delete user
  console.log('\n9. Deleting user...');
  const deleteResult = await testEndpoint('delete', `/users/${userId}`, null, 204);
  console.log('User deleted successfully');
  
  console.log('\nAll tests completed!');
}

// Run the tests
runTests().catch(console.error);

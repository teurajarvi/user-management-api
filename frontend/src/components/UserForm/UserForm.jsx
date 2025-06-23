import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getUserById, createUser, updateUser } from '../../services/api';

const UserForm = ({ onUserSaved }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditMode = !!id;

  const [formData, setFormData] = useState({
    name: '',
    username: '',
    email: '',
    address: {
      street: '',
      city: '',
      zipcode: ''
    }
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formErrors, setFormErrors] = useState({});

  useEffect(() => {
    if (isEditMode) {
      const fetchUser = async () => {
        try {
          setLoading(true);
          const user = await getUserById(id);
          setFormData({
            name: user.name || '',
            username: user.username || '',
            email: user.email || '',
            address: {
              street: user.address?.street || '',
              city: user.address?.city || '',
              zipcode: user.address?.zipcode || ''
            }
          });
        } catch (err) {
          setError('Failed to fetch user data');
          console.error('Error fetching user:', err);
        } finally {
          setLoading(false);
        }
      };

      fetchUser();
    }
  }, [id, isEditMode]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const validateForm = () => {
    const errors = {};
    
    // Validate name
    if (!formData.name.trim()) {
      errors.name = 'Name is required';
    }
    
    // Validate username
    if (!formData.username.trim()) {
      errors.username = 'Username is required';
    }
    
    // Validate email
    if (!formData.email.trim()) {
      errors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = 'Please enter a valid email address';
    }
    
    // Validate address fields
    if (!formData.address.street.trim()) {
      errors['address.street'] = 'Street is required';
    }
    
    if (!formData.address.city.trim()) {
      errors['address.city'] = 'City is required';
    }
    
    if (!formData.address.zipcode.trim()) {
      errors['address.zipcode'] = 'Zipcode is required';
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setLoading(true);
    setError('');

    try {
      if (isEditMode) {
        await updateUser(id, formData);
      } else {
        await createUser(formData);
      }
      
      // Call the onUserSaved callback if provided
      if (onUserSaved) {
        await onUserSaved();
      }
      
      navigate('/');
    } catch (err) {
      setError('Failed to save user. Please try again.');
      console.error('Error saving user:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading && isEditMode) {
    return <div>Loading user data...</div>;
  }

  return (
    <div className="container">
      <h1>{isEditMode ? 'Edit User' : 'Add New User'}</h1>
      
      <div className="card">
        {error && <div className="error-message">{error}</div>}
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="name">Name</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 ${
                formErrors.name ? 'border-red-500' : ''
              }`}
              required
            />
            {formErrors.name && (
              <p className="mt-1 text-sm text-red-600">{formErrors.name}</p>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="username">Username</label>
            <input
              type="text"
              id="username"
              name="username"
              value={formData.username}
              onChange={handleChange}
              className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 ${
                formErrors.username ? 'border-red-500' : ''
              }`}
              required
            />
            {formErrors.username && (
              <p className="mt-1 text-sm text-red-600">{formErrors.username}</p>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 ${
                formErrors.email ? 'border-red-500' : ''
              }`}
              required
            />
            {formErrors.email && (
              <p className="mt-1 text-sm text-red-600">{formErrors.email}</p>
            )}
          </div>

          <h3>Address</h3>
          
          <div className="form-group">
            <label htmlFor="street">Street</label>
            <input
              type="text"
              id="street"
              name="address.street"
              value={formData.address.street}
              onChange={handleChange}
              className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 ${
                formErrors['address.street'] ? 'border-red-500' : ''
              }`}
              required
            />
            {formErrors['address.street'] && (
              <p className="mt-1 text-sm text-red-600">{formErrors['address.street']}</p>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="city">City</label>
            <input
              type="text"
              id="city"
              name="address.city"
              value={formData.address.city}
              onChange={handleChange}
              className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 ${
                formErrors['address.city'] ? 'border-red-500' : ''
              }`}
              required
            />
            {formErrors['address.city'] && (
              <p className="mt-1 text-sm text-red-600">{formErrors['address.city']}</p>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="zipcode">Zip Code</label>
            <input
              type="text"
              id="zipcode"
              name="address.zipcode"
              value={formData.address.zipcode}
              onChange={handleChange}
              className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 ${
                formErrors['address.zipcode'] ? 'border-red-500' : ''
              }`}
              required
            />
            {formErrors['address.zipcode'] && (
              <p className="mt-1 text-sm text-red-600">{formErrors['address.zipcode']}</p>
            )}
          </div>

          <div className="form-actions">
            <button type="button" onClick={() => navigate('/')} className="mr-2">
              Cancel
            </button>
            <button type="submit" disabled={loading}>
              {loading ? 'Saving...' : 'Save'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UserForm;

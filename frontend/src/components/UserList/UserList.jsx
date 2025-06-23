import React from 'react';
import { Link } from 'react-router-dom';

const UserList = ({ users, onDelete, searchTerm, onSearchChange }) => {
  return (
    <div className="container">
      <h1>User Management</h1>
      
      <div className="card mb-4">
        <div className="flex">
          <input
            type="text"
            placeholder="Search by name..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="flex-grow"
          />
          <Link 
            to="/users/new" 
            className="button"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              padding: '0.5rem 1rem',
              height: '38px',
              backgroundColor: '#3498db',
              color: 'white',
              textDecoration: 'none',
              borderRadius: '4px',
              fontWeight: '500',
              textAlign: 'center',
              transition: 'background-color 0.2s',
              whiteSpace: 'nowrap',
              fontSize: '0.875rem',
              lineHeight: '1.25'
            }}
            onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#2980b9'}
            onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#3498db'}
          >
            Add New User
          </Link>
        </div>
      </div>

      <div className="card p-0">
        {users.length === 0 ? (
          <div className="p-6 text-center">
            <p className="text-gray-600">No users found</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {users.map((user) => (
              <div 
                key={user.id} 
                className="p-4 hover:bg-gray-50 transition-colors duration-150"
              >
                <div className="flex items-center justify-between">
                  <div className="min-w-0 flex-1">
                    <h3 className="text-lg font-medium text-gray-900 truncate">{user.name}</h3>
                    <p className="text-sm text-gray-600 truncate">{user.email}</p>
                    <p className="text-sm text-gray-500 truncate">
                      {user.address?.street && (
                        <span>{user.address.street}{user.address?.city ? ', ' : ''}</span>
                      )}
                      {user.address?.city && (
                        <span>{user.address.city}{user.address?.zipcode ? ' ' : ''}</span>
                      )}
                      {user.address?.zipcode}
                    </p>
                  </div>
                  <div className="ml-4 flex-shrink-0 flex space-x-2">
                    <Link 
                      to={`/users/${user.id}`}
                      className="button"
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        padding: '0.5rem 1rem',
                        height: '38px',
                        backgroundColor: '#3498db',
                        color: 'white',
                        textDecoration: 'none',
                        borderRadius: '4px',
                        fontWeight: '500',
                        textAlign: 'center',
                        transition: 'background-color 0.2s',
                        whiteSpace: 'nowrap',
                        fontSize: '0.875rem',
                        lineHeight: '1.25',
                        border: 'none',
                        cursor: 'pointer',
                        fontFamily: 'inherit'
                      }}
                      onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#2980b9'}
                      onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#3498db'}
                    >
                      Edit
                    </Link>
                    <button 
                      onClick={() => onDelete(user.id)}
                      className="px-4 py-2 border border-transparent rounded-md text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors duration-150"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default UserList;

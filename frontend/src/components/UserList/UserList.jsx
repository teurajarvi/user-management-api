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
          <Link to="/users/new" className="button">
            Add New User
          </Link>
        </div>
      </div>

      <div className="card">
        {users.length === 0 ? (
          <p>No users found</p>
        ) : (
          <div className="user-list">
            {users.map((user) => (
              <div key={user.id} className="user-item mb-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3>{user.name}</h3>
                    <p className="text-gray-600">{user.email}</p>
                    <p className="text-sm text-gray-500">
                      {user.address?.street}, {user.address?.city} {user.address?.zipcode}
                    </p>
                  </div>
                  <div>
                    <Link to={`/users/${user.id}`} className="mr-2">
                      Edit
                    </Link>
                    <button 
                      onClick={() => onDelete(user.id)}
                      className="danger"
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

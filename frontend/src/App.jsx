import { useState, useEffect } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import UserList from './components/UserList/UserList';
import UserForm from './components/UserForm/UserForm';
import { getUsers, searchUsers, deleteUser } from './services/api';

function App() {
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    if (searchTerm) {
      const timer = setTimeout(() => {
        handleSearch(searchTerm);
      }, 300);
      return () => clearTimeout(timer);
    } else {
      fetchUsers();
    }
  }, [searchTerm]);

  const fetchUsers = async () => {
    try {
      setIsLoading(true);
      const data = await getUsers();
      setUsers(data);
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = async (query) => {
    if (!query.trim()) {
      fetchUsers();
      return;
    }
    
    try {
      setIsLoading(true);
      const results = await searchUsers(query);
      setUsers(results);
    } catch (error) {
      console.error('Error searching users:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (userId) => {
    try {
      await deleteUser(userId);
      setUsers(users.filter(user => user.id !== userId));
    } catch (error) {
      console.error('Error deleting user:', error);
      alert('Failed to delete user');
    }
  };

  if (isLoading && !searchTerm) {
    return <div className="container">Loading users...</div>;
  }

  return (
    <Routes>
      <Route 
        path="/" 
        element={
          <UserList 
            users={users} 
            onDelete={handleDelete}
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
          />
        } 
      />
      <Route 
        path="/users/new" 
        element={
          <UserForm 
            onUserSaved={() => fetchUsers()} 
          />
        } 
      />
      <Route 
        path="/users/:id" 
        element={
          <UserForm 
            onUserSaved={() => fetchUsers()} 
          />
        } 
      />
    </Routes>
  );
}

export default App;

import React, { useState, useEffect } from 'react';
import axios from 'axios';

const UserList = () => {
  const [users, setUsers] = useState([]);
  const [filters, setFilters] = useState({ search: '', role: '' });
  const [loading, setLoading] = useState(true);

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get('http://localhost:5000/api/admin/users', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUsers(res.data.users);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching users:', err);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const filteredUsers = users.filter(user => {
    const matchesSearch = (
      user.name.toLowerCase().includes(filters.search.toLowerCase()) ||
      user.email.toLowerCase().includes(filters.search.toLowerCase()) ||
      user.address.toLowerCase().includes(filters.search.toLowerCase())
    );
    const matchesRole = !filters.role || user.role === filters.role;
    return matchesSearch && matchesRole;
  });

  return (
    <div className="user-list">
      <div className="filters">
        <input
          type="text"
          placeholder="Search by name, email, or address..."
          value={filters.search}
          onChange={e => setFilters(prev => ({ ...prev, search: e.target.value }))}
        />
        <select
          value={filters.role}
          onChange={e => setFilters(prev => ({ ...prev, role: e.target.value }))}
        >
          <option value="">All Roles</option>
          <option value="user">Normal User</option>
          <option value="admin">Admin</option>
          <option value="store_owner">Store Owner</option>
        </select>
      </div>

      {loading ? (
        <div className="loading">Loading users...</div>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Address</th>
              <th>Role</th>
              <th>Rating</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map(user => (
              <tr key={user.id}>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td>{user.address}</td>
                <td>{user.role}</td>
                <td>{user.role === 'store_owner' ? user.rating || 'No ratings' : '-'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <style>{`
        .user-list {
          padding: 1rem;
        }

        .filters {
          display: flex;
          gap: 1rem;
          margin-bottom: 1rem;
        }

        .filters input,
        .filters select {
          padding: 0.5rem;
          border: 1px solid #ddd;
          border-radius: 4px;
        }

        .filters input {
          flex: 1;
        }

        table {
          width: 100%;
          border-collapse: collapse;
          background: white;
          box-shadow: 0 1px 3px rgba(0,0,0,0.1);
        }

        th, td {
          padding: 1rem;
          text-align: left;
          border-bottom: 1px solid #ddd;
        }

        th {
          background: #f8f9fa;
          font-weight: 600;
        }

        tr:hover {
          background: #f5f5f5;
        }

        .loading {
          text-align: center;
          padding: 2rem;
          color: #666;
        }
      `}</style>
    </div>
  );
};

export default UserList;

import React, { useEffect, useState } from 'react';
import axios from 'axios';

const ViewUsers = () => {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState('');

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get(`http://localhost:5000/api/admin/users?search=${search}`, {
        headers: { Authorization: token }
      });
      setUsers(res.data.users);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [search]);

  return (
    <div className="table-container">
      <h2>All Users</h2>
      <input
        placeholder="Search by name, email, address, or role"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="search-box"
      />
      <table>
        <thead>
          <tr>
            <th>Name</th><th>Email</th><th>Address</th><th>Role</th><th>Avg Rating</th>
          </tr>
        </thead>
        <tbody>
          {users.length > 0 ? users.map(user => (
            <tr key={user.id}>
              <td>{user.name}</td><td>{user.email}</td><td>{user.address}</td>
              <td>{user.role}</td><td>{user.averageRating || '-'}</td>
            </tr>
          )) : <tr><td colSpan="5">No users found</td></tr>}
        </tbody>
      </table>
      <style>{`
      .table-container {
  padding: 20px;
}

.search-box {
  padding: 8px;
  margin-bottom: 10px;
  width: 100%;
  max-width: 400px;
}

table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 10px;
}

th, td {
  padding: 12px;
  border: 1px solid #ccc;
  text-align: left;
}

thead {
  background-color: #f2f2f2;
}

      `}</style>
    </div>
  );
};

export default ViewUsers;

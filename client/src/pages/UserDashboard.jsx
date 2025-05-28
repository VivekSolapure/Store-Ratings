// src/pages/UserDashboard.js
import React from 'react';

const UserDashboard = () => {
  const user = JSON.parse(localStorage.getItem('user'));

  return (
    <div style={{ padding: '2rem' }}>
      <h1>User Dashboard</h1>
      <p>Welcome, {user.name}!</p>

      <ul>
        <li>🏬 Browse stores</li>
        <li>⭐ Submit/Update ratings</li>
        <li>🔍 Search stores by Name / Address</li>
        <li>🔐 Update your password</li>
      </ul>
    </div>
  );
};

export default UserDashboard;

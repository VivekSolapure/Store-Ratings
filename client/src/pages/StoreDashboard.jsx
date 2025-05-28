// src/pages/OwnerDashboard.js
import React from 'react';

const OwnerDashboard = () => {
  const user = JSON.parse(localStorage.getItem('user'));

  return (
    <div style={{ padding: '2rem' }}>
      <h1>Store Owner Dashboard</h1>
      <p>Welcome, {user.name}!</p>

      <ul>
        <li>📈 View list of users who rated your store</li>
        <li>⭐ View average store rating</li>
        <li>🔐 Update your password</li>
      </ul>
    </div>
  );
};

export default OwnerDashboard;

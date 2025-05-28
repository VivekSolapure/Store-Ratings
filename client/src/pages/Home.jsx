// src/pages/Home.js
import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
  const user = JSON.parse(localStorage.getItem('user'));

  if (!user) return <p>Please <Link to="/login">login</Link> to continue.</p>;

  return (
    <div style={{ padding: '2rem' }}>
      <h1>Welcome, {user.name}!</h1>
      <p>Your role: {user.role}</p>

      {user.role === 'System Administrator' && <Link to="/admin">Go to Admin Dashboard</Link>}
      {user.role === 'Normal User' && <Link to="/user">Go to User Dashboard</Link>}
      {user.role === 'Store Owner' && <Link to="/owner">Go to Store Owner Dashboard</Link>}
    </div>
  );
};

export default Home;

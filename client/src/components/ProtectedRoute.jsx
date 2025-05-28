// src/components/ProtectedRoute.js
import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children, role }) => {
  const user = JSON.parse(localStorage.getItem('user'));
  console.log(user);
  

  if (!user) return <Navigate to="/login" />;

  if (role && user.role !== role) {
    return <Navigate to={`/${user.role}`} />;
  }

  return children;
};

export default ProtectedRoute;

// src/pages/UserDashboard.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import StoreList from './StoreList';
import ChangePassword from './ChangePassword';

const UserDashboard = () => {
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <div className="user-dashboard">
      <nav className="dashboard-nav">
        <h2>User Dashboard</h2>
        <div className="nav-actions">
          <button onClick={() => setShowPasswordModal(true)} className="change-pwd-btn">
            Change Password
          </button>
          <button onClick={handleLogout} className="logout-btn">
            Logout
          </button>
        </div>
      </nav>

      <div className="dashboard-content">
        <StoreList userView={true} />
      </div>

      {showPasswordModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <button className="close-btn" onClick={() => setShowPasswordModal(false)}>×</button>
            <ChangePassword onSuccess={() => setShowPasswordModal(false)} />
          </div>
        </div>
      )}

      <style>{`
        .user-dashboard {
          min-height: 100vh;
          background: #f5f6fa;
        }

        .dashboard-nav {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 1rem 2rem;
          background: white;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }

        .nav-actions {
          display: flex;
          gap: 1rem;
        }

        .change-pwd-btn {
          padding: 0.5rem 1rem;
          background: #28a745;
          color: white;
          border: none;
          border-radius: 4px;
          cursor: pointer;
        }

        .logout-btn {
          padding: 0.5rem 1rem;
          background: #dc3545;
          color: white;
          border: none;
          border-radius: 4px;
          cursor: pointer;
        }

        .dashboard-content {
          padding: 2rem;
        }

        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0,0,0,0.5);
          display: flex;
          justify-content: center;
          align-items: center;
          z-index: 1000;
        }

        .modal-content {
          background: white;
          padding: 2rem;
          border-radius: 8px;
          position: relative;
          width: 90%;
          max-width: 400px;
        }

        .close-btn {
          position: absolute;
          right: 1rem;
          top: 1rem;
          border: none;
          background: none;
          font-size: 1.5rem;
          cursor: pointer;
        }
      `}</style>
    </div>
  );
};

export default UserDashboard;

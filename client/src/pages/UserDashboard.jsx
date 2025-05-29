// src/pages/UserDashboard.js
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import StoreList from './StoreList';
import ChangePassword from './ChangePassword';

const UserDashboard = () => {
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem('user'));
    if (!userData) {
      navigate('/login');
      return;
    }
    setUser(userData);
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  if (!user) return <div className="loading">Loading...</div>;

  return (
    <div className="user-dashboard">
      <nav className="dashboard-nav">
        <div className="nav-left">
          <h2>Welcome, {user.name}</h2>
          <span className="user-email">{user.email}</span>
        </div>
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
        <div className="content-header">
          <h3>Available Stores</h3>
          <p>Rate and review stores below</p>
        </div>
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
          padding: 1.5rem 2rem;
          background: white;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }

        .nav-left {
          display: flex;
          flex-direction: column;
          gap: 0.25rem;
        }

        .nav-left h2 {
          margin: 0;
          color: #2c3e50;
          font-size: 1.5rem;
        }

        .user-email {
          color: #666;
          font-size: 0.9rem;
        }

        .nav-actions {
          display: flex;
          gap: 1rem;
        }

        .change-pwd-btn, .logout-btn {
          padding: 0.6rem 1.2rem;
          border: none;
          border-radius: 6px;
          cursor: pointer;
          font-weight: 500;
          transition: transform 0.2s;
        }

        .change-pwd-btn:hover, .logout-btn:hover {
          transform: translateY(-1px);
        }

        .change-pwd-btn {
          background: #3498db;
          color: white;
        }

        .logout-btn {
          background: #e74c3c;
          color: white;
        }

        .dashboard-content {
          padding: 2rem;
          max-width: 1200px;
          margin: 0 auto;
        }

        .content-header {
          margin-bottom: 2rem;
          text-align: center;
        }

        .content-header h3 {
          color: #2c3e50;
          margin: 0;
          font-size: 1.8rem;
        }

        .content-header p {
          color: #666;
          margin-top: 0.5rem;
        }

        .loading {
          display: flex;
          justify-content: center;
          align-items: center;
          height: 100vh;
          font-size: 1.2rem;
          color: #666;
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
          color: #666;
        }

        .close-btn:hover {
          color: #333;
        }
      `}</style>
    </div>
  );
};

export default UserDashboard;
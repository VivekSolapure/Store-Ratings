import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import UserList from './UserList';
import StoreList from './StoreList';
import AddUserOrStore from './AddUserOrStore';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [stats, setStats] = useState({ total_users: 0, total_stores: 0, total_ratings: 0 });
  const [showUserModal, setShowUserModal] = useState(false);
  const navigate = useNavigate();

  const fetchStats = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/admin/stats`, {
        headers: { authorization: `Bearer ${token}` }
      });
      setStats(res.data);
    } catch (err) {
      console.error('Error fetching stats:', err);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <div className="admin-dashboard">
      <nav className="dashboard-nav">
        <div className="nav-links">
          <button 
            className={`nav-btn ${activeTab === 'dashboard' ? 'active' : ''}`}
            onClick={() => setActiveTab('dashboard')}
          >
            Dashboard
          </button>
          <button 
            className={`nav-btn ${activeTab === 'users' ? 'active' : ''}`}
            onClick={() => setActiveTab('users')}
          >
            Users
          </button>
          <button 
            className={`nav-btn ${activeTab === 'stores' ? 'active' : ''}`}
            onClick={() => setActiveTab('stores')}
          >
            Stores
          </button>
        </div>
        <button className="logout-btn" onClick={handleLogout}>Logout</button>
      </nav>

      <div className="dashboard-content">
        {activeTab === 'dashboard' && (
          <div className="dashboard-overview">
            <h2>System Overview</h2>
            <div className="stats-container">
              <div className="stat-card">
                <h3>Total Users</h3>
                <p>{stats.total_users}</p>
              </div>
              <div className="stat-card">
                <h3>Total Stores</h3>
                <p>{stats.total_stores}</p>
              </div>
              <div className="stat-card">
                <h3>Total Ratings</h3>
                <p>{stats.total_ratings}</p>
              </div>
            </div>
            <div className="action-buttons">
              <button onClick={() => setShowUserModal(true)}>Add New User</button>
            </div>
          </div>
        )}

        {activeTab === 'users' && <UserList />}
        {activeTab === 'stores' && <StoreList />}
      </div>

      {showUserModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <button className="close-btn" onClick={() => setShowUserModal(false)}>×</button>
            <AddUserOrStore onSuccess={() => {
              setShowUserModal(false);
              fetchStats();
            }} />
          </div>
        </div>
      )}

      <style>{`
        .admin-dashboard {
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

        .nav-links {
          display: flex;
          gap: 1rem;
        }

        .nav-btn {
          padding: 0.5rem 1rem;
          border: none;
          background: none;
          cursor: pointer;
          font-size: 1rem;
          color: #666;
        }

        .nav-btn.active {
          color: #007bff;
          border-bottom: 2px solid #007bff;
        }

        .logout-btn {
          padding: 0.5rem 1rem;
          border: none;
          background: #dc3545;
          color: white;
          border-radius: 4px;
          cursor: pointer;
        }

        .dashboard-content {
          padding: 2rem;
        }

        .dashboard-overview {
          max-width: 1200px;
          margin: 0 auto;
        }

        .stats-container {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 2rem;
          margin: 2rem 0;
        }

        .stat-card {
          background: white;
          padding: 1.5rem;
          border-radius: 8px;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
          text-align: center;
        }

        .stat-card h3 {
          color: #666;
          margin-bottom: 0.5rem;
        }

        .stat-card p {
          font-size: 2rem;
          color: #007bff;
          font-weight: bold;
        }

        .action-buttons {
          display: flex;
          gap: 1rem;
          justify-content: center;
          margin-top: 2rem;
        }

        .action-buttons button {
          padding: 0.75rem 1.5rem;
          border: none;
          border-radius: 4px;
          background: #007bff;
          color: white;
          cursor: pointer;
          font-size: 1rem;
        }

        .action-buttons button:hover {
          background: #0056b3;
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
          max-width: 500px;
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

export default AdminDashboard;
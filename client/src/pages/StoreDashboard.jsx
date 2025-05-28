// src/pages/OwnerDashboard.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import ChangePassword from './ChangePassword';

const StoreDashboard = () => {
  const [storeData, setStoreData] = useState(null);
  const [ratings, setRatings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchStoreData();
  }, []);

  const fetchStoreData = async () => {
    try {
      const token = localStorage.getItem('token');
      const [storeRes, ratingsRes] = await Promise.all([
        axios.get('http://localhost:5000/api/store-owner/details', {
          headers: { Authorization: `Bearer ${token}` }
        }),
        axios.get('http://localhost:5000/api/store-owner/ratings', {
          headers: { Authorization: `Bearer ${token}` }
        })
      ]);

      setStoreData(storeRes.data.store);
      setRatings(ratingsRes.data.ratings);
    } catch (err) {
      console.error('Error fetching store data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  if (loading) return <div className="loading">Loading...</div>;

  return (
    <div className="store-dashboard">
      <nav className="dashboard-nav">
        <h2>{storeData?.name || 'Store Dashboard'}</h2>
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
        <div className="store-stats">
          <div className="stat-card">
            <h3>Average Rating</h3>
            <p className="rating">{storeData?.averageRating || 'No ratings'} ★</p>
            <p className="total">Total Ratings: {ratings.length}</p>
          </div>
        </div>

        <div className="ratings-section">
          <h3>User Ratings</h3>
          <div className="ratings-table">
            <table>
              <thead>
                <tr>
                  <th>User Name</th>
                  <th>Email</th>
                  <th>Rating</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {ratings.map(rating => (
                  <tr key={rating.id}>
                    <td>{rating.userName}</td>
                    <td>{rating.userEmail}</td>
                    <td>{rating.rating} ★</td>
                    <td>{new Date(rating.created_at).toLocaleDateString()}</td>
                  </tr>
                ))}
                {ratings.length === 0 && (
                  <tr>
                    <td colSpan="4" className="no-data">No ratings yet</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
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
        .store-dashboard {
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

        .change-pwd-btn, .logout-btn {
          padding: 0.5rem 1rem;
          border: none;
          border-radius: 4px;
          cursor: pointer;
        }

        .change-pwd-btn {
          background: #28a745;
          color: white;
        }

        .logout-btn {
          background: #dc3545;
          color: white;
        }

        .dashboard-content {
          padding: 2rem;
          max-width: 1200px;
          margin: 0 auto;
        }

        .store-stats {
          margin-bottom: 2rem;
        }

        .stat-card {
          background: white;
          padding: 2rem;
          border-radius: 8px;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
          text-align: center;
        }

        .rating {
          font-size: 2.5rem;
          color: #ffc107;
          margin: 1rem 0;
        }

        .total {
          color: #666;
        }

        .ratings-section {
          background: white;
          padding: 2rem;
          border-radius: 8px;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }

        table {
          width: 100%;
          border-collapse: collapse;
          margin-top: 1rem;
        }

        th, td {
          padding: 1rem;
          text-align: left;
          border-bottom: 1px solid #eee;
        }

        th {
          background: #f8f9fa;
          font-weight: 600;
        }

        .no-data {
          text-align: center;
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

export default StoreDashboard;

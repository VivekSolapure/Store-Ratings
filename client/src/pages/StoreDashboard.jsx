// src/pages/StoreDashboard.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const StoreDashboard = () => {
  const [storeData, setStoreData] = useState(null);
  const [ratings, setRatings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchStoreData();
  }, []);

  const fetchStoreData = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }

      setLoading(true);
      setError(null);

      const [storeRes, ratingsRes] = await Promise.all([
        axios.get('http://localhost:5000/api/store-owner/details', {
          headers: { Authorization: `Bearer ${token}` }
        }),
        axios.get('http://localhost:5000/api/store-owner/ratings', {
          headers: { Authorization: `Bearer ${token}` }
        })
      ]);

      setStoreData(storeRes.data.store);
      setRatings(ratingsRes.data.ratings || []);
    } catch (err) {
      console.error('Error fetching store data:', err);
      setError(err.response?.data?.message || 'Error fetching store data');
      if (err.response?.status === 401) {
        navigate('/login');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading store data...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container">
        <div className="error-icon">⚠️</div>
        <h3>Error Loading Data</h3>
        <p>{error}</p>
        <button onClick={fetchStoreData} className="retry-btn">Retry</button>
      </div>
    );
  }

  const getRatingColor = (rating) => {
    if (rating >= 4) return '#4CAF50';
    if (rating >= 3) return '#FFC107';
    return '#FF5722';
  };

  return (
    <div className="store-dashboard">
      <nav className="dashboard-nav">
        <div className="nav-left">
          <h2>{storeData?.name || 'Store Dashboard'}</h2>
          <span className="store-address">{storeData?.email}</span>
        </div>
        <div className="nav-actions">
          <button onClick={handleLogout} className="logout-btn">
            Logout
          </button>
        </div>
      </nav>

      <div className="dashboard-content">
        <div className="stats-container">
          <div className="stat-card">
            <div className="stat-header">
              <h3>Average Rating</h3>
              <span className="stat-icon">⭐</span>
            </div>
            <div className="stat-value" style={{ color: getRatingColor(storeData?.averageRating || 0) }}>
              {storeData?.averageRating || 'N/A'}
            </div>
            <div className="stat-footer">
              Based on {ratings.length} {ratings.length === 1 ? 'rating' : 'ratings'}
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-header">
              <h3>Total Reviews</h3>
              <span className="stat-icon">📊</span>
            </div>
            <div className="stat-value">{ratings.length}</div>
            <div className="stat-footer">
              All time reviews
            </div>
          </div>
        </div>

        <div className="ratings-section">
          <div className="section-header">
            <h3>Recent Ratings & Reviews</h3>
            <button onClick={fetchStoreData} className="refresh-btn">
              ↻ Refresh
            </button>
          </div>
          
          <div className="ratings-table-container">
            <table className="ratings-table">
              <thead>
                <tr>
                  <th>User</th>
                  <th>Rating</th>
                  <th>Email</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {ratings.map(rating => (
                  <tr key={rating.id}>
                    <td className="user-cell">{rating.userName}</td>
                    <td>
                      <span className="rating-badge" style={{ backgroundColor: getRatingColor(rating.rating) }}>
                        {rating.rating} ★
                      </span>
                    </td>
                    <td>{rating.userEmail}</td>
                    <td>{new Date(rating.created_at).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric'
                    })}</td>
                  </tr>
                ))}
                {ratings.length === 0 && (
                  <tr>
                    <td colSpan="4" className="no-data">
                      <div className="no-data-content">
                        <span className="no-data-icon">📝</span>
                        <p>No ratings yet</p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <style>{`
        .store-dashboard {
          min-height: 100vh;
          background: #f8f9fa;
          color: #333;
        }

        .dashboard-nav {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 1.5rem 2rem;
          background: white;
          box-shadow: 0 2px 8px rgba(0,0,0,0.1);
        }

        .nav-left {
          display: flex;
          flex-direction: column;
        }

        .nav-left h2 {
          margin: 0;
          color: #2c3e50;
          font-size: 1.5rem;
        }

        .store-address {
          color: #666;
          font-size: 0.9rem;
          margin-top: 0.25rem;
        }

        .logout-btn {
          padding: 0.6rem 1.2rem;
          background: #e74c3c;
          color: white;
          border: none;
          border-radius: 6px;
          cursor: pointer;
          font-weight: 500;
          transition: all 0.2s;
        }

        .logout-btn:hover {
          background: #c0392b;
          transform: translateY(-1px);
        }

        .dashboard-content {
          max-width: 1200px;
          margin: 2rem auto;
          padding: 0 2rem;
        }

        .stats-container {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 1.5rem;
          margin-bottom: 2rem;
        }

        .stat-card {
          background: white;
          padding: 1.5rem;
          border-radius: 10px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.1);
        }

        .stat-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1rem;
        }

        .stat-header h3 {
          margin: 0;
          color: #2c3e50;
          font-size: 1.1rem;
        }

        .stat-icon {
          font-size: 1.5rem;
        }

        .stat-value {
          font-size: 2.5rem;
          font-weight: bold;
          margin: 1rem 0;
        }

        .stat-footer {
          color: #666;
          font-size: 0.9rem;
        }

        .ratings-section {
          background: white;
          border-radius: 10px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.1);
          padding: 1.5rem;
        }

        .section-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1.5rem;
        }

        .section-header h3 {
          margin: 0;
          color: #2c3e50;
        }

        .refresh-btn {
          padding: 0.5rem 1rem;
          border: 1px solid #ddd;
          background: white;
          border-radius: 6px;
          cursor: pointer;
          transition: all 0.2s;
        }

        .refresh-btn:hover {
          background: #f8f9fa;
          transform: rotate(180deg);
        }

        .ratings-table-container {
          overflow-x: auto;
        }

        .ratings-table {
          width: 100%;
          border-collapse: collapse;
          white-space: nowrap;
        }

        .ratings-table th {
          background: #f8f9fa;
          padding: 1rem;
          text-align: left;
          font-weight: 600;
          color: #2c3e50;
        }

        .ratings-table td {
          padding: 1rem;
          border-bottom: 1px solid #eee;
        }

        .rating-badge {
          padding: 0.3rem 0.6rem;
          border-radius: 20px;
          color: white;
          font-weight: 500;
        }

        .no-data {
          text-align: center;
          padding: 3rem !important;
        }

        .no-data-content {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.5rem;
        }

        .no-data-icon {
          font-size: 2rem;
        }

        .loading-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          height: 100vh;
          gap: 1rem;
        }

        .loading-spinner {
          width: 40px;
          height: 40px;
          border: 4px solid #f3f3f3;
          border-top: 4px solid #3498db;
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }

        .error-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          height: 100vh;
          gap: 1rem;
          text-align: center;
          padding: 2rem;
        }

        .error-icon {
          font-size: 3rem;
        }

        .retry-btn {
          padding: 0.6rem 1.2rem;
          background: #3498db;
          color: white;
          border: none;
          border-radius: 6px;
          cursor: pointer;
          transition: all 0.2s;
        }

        .retry-btn:hover {
          background: #2980b9;
          transform: translateY(-1px);
        }

        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        @media (max-width: 768px) {
          .dashboard-nav {
            padding: 1rem;
          }

          .dashboard-content {
            padding: 1rem;
          }

          .stats-container {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
};

export default StoreDashboard;
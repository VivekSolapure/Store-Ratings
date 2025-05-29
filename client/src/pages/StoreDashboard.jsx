// src/pages/StoreDashboard.js
import React, { useState, useEffect } from 'react';
import { getStoreDetails } from '../services/api';
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

      const response = await getStoreDetails();
      setStoreData(response.data);
      setRatings(response.data.ratings || []);
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

  if (!storeData) {
    return <div>No store data found</div>;
  }

  const getRatingColor = (rating) => {
    if (rating >= 4) return '#4CAF50';
    if (rating >= 3) return '#FFC107';
    return '#FF5722';
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Store Dashboard</h1>
      
      <div className="bg-white shadow rounded-lg p-6 mb-6">
        <h2 className="text-2xl font-semibold mb-4">Store Information</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p className="text-gray-600">Name</p>
            <p className="font-medium">{storeData.name}</p>
          </div>
          <div>
            <p className="text-gray-600">Address</p>
            <p className="font-medium">{storeData.address}</p>
          </div>
          <div>
            <p className="text-gray-600">Average Rating</p>
            <p className="font-medium">{storeData.averageRating || 'No ratings yet'}</p>
          </div>
          <div>
            <p className="text-gray-600">Total Ratings</p>
            <p className="font-medium">{storeData.totalRatings || 0}</p>
          </div>
        </div>
      </div>

      {storeData.ratings && storeData.ratings.length > 0 ? (
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-2xl font-semibold mb-4">Recent Ratings</h2>
          <div className="space-y-4">
            {storeData.ratings.map((rating, index) => (
              <div key={index} className="border-b pb-4 last:border-b-0 last:pb-0">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-medium">{rating.userName}</p>
                    <p className="text-gray-600 text-sm">{rating.userEmail}</p>
                  </div>
                  <div className="flex items-center">
                    <span className="text-yellow-400 mr-1">★</span>
                    <span className="font-medium">{rating.rating}</span>
                  </div>
                </div>
                {rating.comment && (
                  <p className="text-gray-700 mt-2">{rating.comment}</p>
                )}
                <p className="text-gray-500 text-sm mt-2">
                  {new Date(rating.created_at).toLocaleDateString()}
                </p>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="bg-white shadow rounded-lg p-6">
          <p className="text-gray-600 text-center">No ratings yet</p>
        </div>
      )}

      <style>{`
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
      `}</style>
    </div>
  );
};

export default StoreDashboard;
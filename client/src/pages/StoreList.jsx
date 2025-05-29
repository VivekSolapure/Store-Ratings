import React, { useState, useEffect } from 'react';
import axios from 'axios';

const RatingStars = ({ rating, onRate }) => {
  const [hover, setHover] = useState(0);

  return (
    <div className="rating-stars">
      {[1, 2, 3, 4, 5].map((star) => (
        <span
          key={star}
          className={`star ${star <= (hover || rating) ? 'filled' : ''}`}
          onClick={() => onRate(star)}
          onMouseEnter={() => setHover(star)}
          onMouseLeave={() => setHover(0)}
        >
          ★
        </span>
      ))}
      <style>{`
        .rating-stars {
          display: inline-flex;
          gap: 4px;
        }
        .star {
          cursor: pointer;
          font-size: 24px;
          color: #ddd;
          transition: color 0.2s;
        }
        .star.filled {
          color: #ffc107;
        }
        .star:hover {
          transform: scale(1.1);
        }
      `}</style>
    </div>
  );
};

const StoreList = ({ userView = false }) => {
  const [stores, setStores] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userRatings, setUserRatings] = useState({});
  const [ratingInProgress, setRatingInProgress] = useState(null);

  const fetchStores = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      
      // Fetch stores and user's ratings in parallel
      const [storesRes, ratingsRes] = await Promise.all([
        axios.get('http://localhost:5000/api/stores'),
        userView ? axios.get('http://localhost:5000/api/user/ratings', {
          headers: { Authorization: `Bearer ${token}` }
        }) : Promise.resolve({ data: { ratings: [] } })
      ]);

      // Create a map of store ratings
      const ratingsMap = ratingsRes.data.ratings.reduce((acc, curr) => {
        acc[curr.store_id] = curr.rating;
        return acc;
      }, {});

      setStores(storesRes.data.stores);
      setUserRatings(ratingsMap);
      setError(null);
    } catch (err) {
      setError('Failed to load stores and ratings');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStores();
  }, [userView]);

  const handleRating = async (storeId, rating) => {
    try {
      const token = localStorage.getItem('token');
      await axios.post(`http://localhost:5000/api/stores/${storeId}/rate`, 
        { rating },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // Update local state
      setUserRatings(prev => ({
        ...prev,
        [storeId]: rating
      }));

      // Refresh stores to get updated average
      fetchStores();

      // Show success message
      alert('Rating updated successfully!');
    } catch (err) {
      alert(err.response?.data?.message || 'Error updating rating');
    } finally {
      setRatingInProgress(null);
    }
  };

  const filteredStores = stores.filter(store => 
    store.name.toLowerCase().includes(search.toLowerCase()) ||
    store.address.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) return <div className="loading">Loading stores...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="store-list">
      <div className="search-container">
        <input
          type="text"
          placeholder="Search stores by name or address..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="search-input"
        />
      </div>

      <div className="stores-grid">
        {filteredStores.map(store => (
          <div key={store.id} className="store-card">
            <h3>{store.name}</h3>
            <p className="address">{store.address}</p>
            <div className="rating-section">
              <div className="average-rating">
                <span>Average Rating:</span>
                <div className="rating-display">
                  {store.averageRating ? 
                    `${store.averageRating} ★` : 
                    'No ratings yet'}
                </div>
              </div>
              <div className="user-rating">
                <span>Your Rating:</span>
                {ratingInProgress === store.id ? (
                  <div className="rating-input">
                    <RatingStars
                      rating={userRatings[store.id] || 0}
                      onRate={(rating) => handleRating(store.id, rating)}
                    />
                    <button 
                      className="cancel-btn"
                      onClick={() => setRatingInProgress(null)}
                    >
                      Cancel
                    </button>
                  </div>
                ) : (
                  <div className="rating-display">
                    {userRatings[store.id] ? (
                      <>
                        <span>{userRatings[store.id]} ★</span>
                        <button 
                          className="edit-btn"
                          onClick={() => setRatingInProgress(store.id)}
                        >
                          Edit
                        </button>
                      </>
                    ) : (
                      <button 
                        className="rate-btn"
                        onClick={() => setRatingInProgress(store.id)}
                      >
                        Rate Now
                      </button>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      <style>{`
        .store-list {
          padding: 20px;
          max-width: 1200px;
          margin: 0 auto;
        }

        .search-container {
          margin-bottom: 20px;
        }

        .search-input {
          width: 100%;
          padding: 12px;
          border: 1px solid #ddd;
          border-radius: 6px;
          font-size: 16px;
        }

        .stores-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
          gap: 20px;
        }

        .store-card {
          background: white;
          border-radius: 8px;
          padding: 20px;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }

        .store-card h3 {
          margin: 0 0 10px 0;
          color: #333;
        }

        .address {
          color: #666;
          margin-bottom: 15px;
        }

        .rating-section {
          border-top: 1px solid #eee;
          padding-top: 15px;
        }

        .average-rating,
        .user-rating {
          margin: 10px 0;
        }

        .rating-display {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-top: 5px;
        }

        .rate-btn,
        .edit-btn {
          padding: 6px 12px;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          font-size: 14px;
        }

        .rate-btn {
          background: #28a745;
          color: white;
        }

        .edit-btn {
          background: #007bff;
          color: white;
        }

        .cancel-btn {
          padding: 6px 12px;
          border: none;
          border-radius: 4px;
          background: #dc3545;
          color: white;
          cursor: pointer;
          margin-left: 10px;
        }

        .loading,
        .error {
          text-align: center;
          padding: 20px;
          font-size: 18px;
        }

        .error {
          color: #dc3545;
        }
      `}</style>
    </div>
  );
};

export default StoreList;
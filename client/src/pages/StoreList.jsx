import React, { useState, useEffect } from 'react';
import { getAllStores, getUserRatings, rateStore } from '../services/api';

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
  const [error, setError] = useState('');
  const [userRatings, setUserRatings] = useState({});
  const [ratingInProgress, setRatingInProgress] = useState(null);

  useEffect(() => {
    fetchData();
  }, [userView]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [storesRes, ratingsRes] = await Promise.all([
        getAllStores(),
        userView ? getUserRatings() : Promise.resolve({ data: [] })
      ]);

      setStores(storesRes.data);
      
      if (userView) {
        const ratingsMap = {};
        ratingsRes.data.forEach(rating => {
          ratingsMap[rating.store_id] = rating.rating;
        });
        setUserRatings(ratingsMap);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Error fetching data');
    } finally {
      setLoading(false);
    }
  };

  const handleRating = async (storeId, rating) => {
    try {
      await rateStore(storeId, rating);
      await fetchData(); // Refresh data
    } catch (err) {
      setError(err.response?.data?.message || 'Error submitting rating');
    }
  };

  const filteredStores = stores.filter(store => 
    store.name.toLowerCase().includes(search.toLowerCase()) ||
    store.address.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) return <div className="loading">Loading stores...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Stores</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredStores.map(store => (
          <div key={store.id} className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-2">{store.name}</h2>
            <p className="text-gray-600 mb-4">{store.address}</p>
            <div className="flex items-center mb-4">
              <span className="text-gray-700 mr-2">Average Rating:</span>
              <span className="font-semibold">{store.averageRating || 'No ratings'}</span>
              <span className="text-gray-500 ml-2">({store.totalRatings || 0} reviews)</span>
            </div>
            {userView && (
              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Your Rating
                </label>
                <select
                  value={userRatings[store.id] || ''}
                  onChange={(e) => handleRating(store.id, e.target.value)}
                  className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                >
                  <option value="">Select rating</option>
                  {[1, 2, 3, 4, 5].map(num => (
                    <option key={num} value={num}>{num} Star{num !== 1 ? 's' : ''}</option>
                  ))}
                </select>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default StoreList;
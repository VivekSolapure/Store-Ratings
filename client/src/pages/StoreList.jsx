import React, { useEffect, useState } from 'react';
import axios from 'axios';

const StoreList = () => {
  const [stores, setStores] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchStores = async () => {
    try {
      setLoading(true);
      const res = await axios.get('http://localhost:5000/api/stores');
      const filteredStores = res.data.stores.filter(store => 
        store.name.toLowerCase().includes(search.toLowerCase()) ||
        store.email.toLowerCase().includes(search.toLowerCase()) ||
        store.address.toLowerCase().includes(search.toLowerCase())
      );
      setStores(filteredStores);
      setError(null);
    } catch (err) {
      setError('Error fetching stores');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const debounceSearch = setTimeout(() => {
      fetchStores();
    }, 300);

    return () => clearTimeout(debounceSearch);
  }, [search]);

  if (loading) return <div className="loading">Loading stores...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="table-container">
      <h2>Registered Stores</h2>
      <input
        type="text"
        placeholder="Search by name, email, or address"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="search-box"
      />
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Address</th>
            <th>Rating</th>
            <th>Total Reviews</th>
          </tr>
        </thead>
        <tbody>
          {stores.length > 0 ? (
            stores.map(store => (
              <tr key={store.id}>
                <td>{store.name}</td>
                <td>{store.email}</td>
                <td>{store.address}</td>
                <td>{store.averageRating || 'No ratings'}</td>
                <td>{store.totalRatings}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="5" className="no-data">No stores found</td>
            </tr>
          )}
        </tbody>
      </table>

      <style>{`
        .table-container {
          padding: 20px;
          max-width: 1200px;
          margin: 0 auto;
        }

        .search-box {
          width: 100%;
          padding: 12px;
          margin: 20px 0;
          border: 1px solid #ddd;
          border-radius: 4px;
          font-size: 16px;
        }

        table {
          width: 100%;
          border-collapse: collapse;
          margin-top: 20px;
          background: white;
          box-shadow: 0 1px 3px rgba(0,0,0,0.1);
        }

        th, td {
          padding: 15px;
          text-align: left;
          border-bottom: 1px solid #ddd;
        }

        th {
          background-color: #f8f9fa;
          font-weight: 600;
        }

        tr:hover {
          background-color: #f5f5f5;
        }

        .loading, .error, .no-data {
          text-align: center;
          padding: 20px;
          color: #666;
        }

        .error {
          color: #dc3545;
        }
      `}</style>
    </div>
  );
};

export default StoreList;
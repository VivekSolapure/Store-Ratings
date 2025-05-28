import React, { useEffect, useState } from 'react';
import axios from 'axios';
import AddUser from './AddUser';
import AddStore from './AddStore';
import StoreList from './StoreList';

const AdminDashboard = () => {
    const [stats, setStats] = useState({ total_users: 0, total_stores: 0, total_ratings: 0 });
    const [showUserModal, setShowUserModal] = useState(false);
    const [showStoreModal, setShowStoreModal] = useState(false);

    const fetchStats = async () => {
        try {
            const token = localStorage.getItem('token');
            const res = await axios.get('http://localhost:5000/api/admin/stats', {
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


    return (
        <div className="dashboard">
            <h2>Admin Dashboard</h2>
            <div className="stats-container">
                <div className="card">Total Users: {stats.total_users}</div>
                <div className="card">Total Stores: {stats.total_stores}</div>
                <div className="card">Total Ratings: {stats.total_ratings}</div>
            </div>

            <div className="actions-container">
                <button className="action-btn" onClick={() => setShowUserModal(true)}>Add User</button>
                <button className="action-btn" onClick={() => setShowStoreModal(true)}>Add Store</button>
            </div>

            {/* Modal for Add User */}
            {showUserModal && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <button className="close-btn" onClick={() => setShowUserModal(false)}>×</button>
                        <AddUser onSuccess={() => {
                            setShowUserModal(false);
                            // Refresh stats after adding user
                            fetchStats();
                        }} />
                    </div>
                </div>
            )}

            {/* Modal for Add Store */}
            {showStoreModal && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <button className="close-btn" onClick={() => setShowStoreModal(false)}>×</button>
                        <AddStore onSuccess={() => {
                            setShowStoreModal(false);
                            // Refresh stats after adding store
                            fetchStats();
                        }} />
                    </div>
                </div>
            )}
            <StoreList />
            <style>{`
        .dashboard {
          padding: 30px;
          font-family: Arial, sans-serif;
        }

        .stats-container {
          display: flex;
          gap: 20px;
          margin-top: 20px;
          margin-bottom: 30px;
        }

        .card {
          padding: 20px;
          border-radius: 8px;
          background-color: #f2f2f2;
          box-shadow: 0px 2px 6px rgba(0, 0, 0, 0.1);
          font-size: 18px;
          width: 200px;
          text-align: center;
        }

        .actions-container {
          display: flex;
          gap: 15px;
          margin-top: 20px;
        }

        .action-btn {
          padding: 12px 24px;
          border: none;
          border-radius: 6px;
          background-color: #007bff;
          color: white;
          font-size: 16px;
          cursor: pointer;
          transition: background-color 0.2s;
        }

        .action-btn:hover {
          background-color: #0056b3;
        }

        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-color: rgba(0, 0, 0, 0.5);
          display: flex;
          justify-content: center;
          align-items: center;
          z-index: 1000;
        }

        .modal-content {
          background: white;
          padding: 20px;
          border-radius: 8px;
          position: relative;
          max-width: 500px;
          width: 90%;
          max-height: 90vh;
          overflow-y: auto;
        }

        .close-btn {
          position: absolute;
          right: 15px;
          top: 10px;
          border: none;
          background: none;
          font-size: 24px;
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

export default AdminDashboard;
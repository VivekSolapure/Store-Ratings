import React, { useState } from 'react';
import axios from 'axios';

const ChangePassword = ({ onSuccess }) => {
  const [form, setForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [message, setMessage] = useState({ text: '', type: '' });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.newPassword !== form.confirmPassword) {
      setMessage({ text: 'New passwords do not match', type: 'error' });
      return;
    }

    try {
      const token = localStorage.getItem('token');
      await axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/user/change-password`, 
        { currentPassword: form.currentPassword, newPassword: form.newPassword },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setMessage({ text: 'Password updated successfully', type: 'success' });
      if (onSuccess) setTimeout(onSuccess, 1500);
    } catch (err) {
      setMessage({ 
        text: err.response?.data?.message || 'Error updating password', 
        type: 'error' 
      });
    }
  };

  return (
    <div className="change-password">
      <h2>Change Password</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="password"
          placeholder="Current Password"
          value={form.currentPassword}
          onChange={e => setForm({ ...form, currentPassword: e.target.value })}
          required
        />
        <input
          type="password"
          placeholder="New Password"
          value={form.newPassword}
          onChange={e => setForm({ ...form, newPassword: e.target.value })}
          required
        />
        <input
          type="password"
          placeholder="Confirm New Password"
          value={form.confirmPassword}
          onChange={e => setForm({ ...form, confirmPassword: e.target.value })}
          required
        />
        <button type="submit">Update Password</button>
      </form>
      {message.text && (
        <div className={`message ${message.type}`}>
          {message.text}
        </div>
      )}

      <style>{`
        .change-password {
          padding: 1rem;
        }

        form {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        input {
          padding: 0.75rem;
          border: 1px solid #ddd;
          border-radius: 4px;
          font-size: 1rem;
        }

        button {
          padding: 0.75rem;
          background: #007bff;
          color: white;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          font-size: 1rem;
        }

        button:hover {
          background: #0056b3;
        }

        .message {
          margin-top: 1rem;
          padding: 0.75rem;
          border-radius: 4px;
          text-align: center;
        }

        .message.success {
          background: #d4edda;
          color: #155724;
        }

        .message.error {
          background: #f8d7da;
          color: #721c24;
        }
      `}</style>
    </div>
  );
};

export default ChangePassword;

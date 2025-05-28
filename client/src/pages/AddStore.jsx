import React, { useState } from 'react';
import axios from 'axios';

const AddStore = ({ onSuccess }) => {
  const [form, setForm] = useState({ name: '', email: '', address: '' });
  const [message, setMessage] = useState('');

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const res = await axios.post('http://localhost:5000/api/admin/add-store', form, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setMessage(res.data.message);
      setForm({ name: '', email: '', address: '' });
      if (onSuccess) onSuccess();
    } catch (err) {
      setMessage(err.response?.data?.message || 'Failed to add store');
    }
  };

  return (
    <div className="form-container">
      <h2>Add New Store</h2>
      <form onSubmit={handleSubmit}>
        <input name="name" placeholder="Store Name" value={form.name} onChange={handleChange} required minLength={20} maxLength={60} />
        <input name="email" type="email" placeholder="Email" value={form.email} onChange={handleChange} required />
        <input name="address" placeholder="Address" value={form.address} onChange={handleChange} required maxLength={400} />
        <button type="submit">Add Store</button>
      </form>
      {message && <p className="message">{message}</p>}
      <style>{`
        .form-container {
          padding: 20px;
        }

        form input {
          width: 100%;
          margin: 10px 0;
          padding: 12px;
          border: 1px solid #ddd;
          border-radius: 4px;
          font-size: 14px;
        }

        form button {
          width: 100%;
          padding: 12px;
          background-color: #28a745;
          color: white;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          font-size: 16px;
          margin-top: 10px;
        }

        form button:hover {
          background-color: #218838;
        }

        .message {
          margin-top: 10px;
          padding: 10px;
          border-radius: 4px;
          color: #155724;
          background-color: #d4edda;
          border: 1px solid #c3e6cb;
        }
      `}</style>
    </div>
  );
};

export default AddStore;
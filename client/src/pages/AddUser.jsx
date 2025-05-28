import React, { useState } from 'react';
import axios from 'axios';

const AddUser = ({ onSuccess }) => {
  const [form, setForm] = useState({ name: '', email: '', password: '', address: '', role: 'user' });
  const [message, setMessage] = useState('');

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const res = await axios.post('http://localhost:5000/api/admin/add-user', form, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setMessage(res.data.message);
      setForm({ name: '', email: '', password: '', address: '', role: 'user' });
      if (onSuccess) onSuccess();
    } catch (err) {
      setMessage(err.response?.data?.message || 'Error adding user');
    }
  };

  return (
    <div className="form-container">
      <h2>Add New User</h2>
      <form onSubmit={handleSubmit}>
        <input name="name" placeholder="Name" value={form.name} onChange={handleChange} required minLength={3} maxLength={60} />
        <input name="email" type="email" placeholder="Email" value={form.email} onChange={handleChange} required />
        <input name="password" type="password" placeholder="Password" value={form.password} onChange={handleChange} required />
        <input name="address" placeholder="Address" value={form.address} onChange={handleChange} required maxLength={400} />
        <select name="role" value={form.role} onChange={handleChange}>
          <option value="user">User</option>
          <option value="admin">Admin</option>
        </select>
        <button type="submit">Add User</button>
      </form>
      {message && <p className="message">{message}</p>}
      <style>{`
        .form-container {
          padding: 20px;
        }

        form input, form select {
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
          background-color: #007bff;
          color: white;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          font-size: 16px;
          margin-top: 10px;
        }

        form button:hover {
          background-color: #0056b3;
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

export default AddUser;
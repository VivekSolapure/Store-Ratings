import React, { useState } from 'react';
import axios from 'axios';
import { validateForm } from '../utils/validations';

const AddUserOrStore = ({ onSuccess }) => {
  const [form, setForm] = useState({
    name: '', 
    email: '', 
    password: '', 
    address: '', 
    role: 'user',  // This should match exactly with what your backend expects
    storeName: '', 
    storeEmail: '', 
    storeAddress: ''
  });
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  const [addedUser, setAddedUser] = useState(null);

  const validateField = (name, value) => {
    return validateForm[name](value);
  };

  const handleChange = e => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
    if (isSuccess) {
      setIsSuccess(false);
      setMessage('');
      setAddedUser(null);
    }
    setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    // Validate all fields before submit
    setIsSuccess(true);

    const newErrors = {};
    Object.keys(form).forEach(key => {
      if (validateForm[key]) {
        const error = validateField(key, form[key]);
        if (error) newErrors[key] = error;
      }
    });
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setIsSuccess(false);
      setMessage('Please fix the errors above.');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      console.log("Token:", token); // Check if token exists
      
      // 1. Add user
      console.log("Attempting to create user...");
      const userRes = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/admin/add-user`, form, {
        headers: { Authorization: `Bearer ${token}` }
      });
      console.log("User created successfully:", userRes.data);
      
      if (form.role === 'store_owner') {
        console.log("Preparing store data...");
        const storeData = {
          name: form.storeName,
          email: form.storeEmail,
          address: form.storeAddress,
          owner_id: userRes.data.userId
        };
        console.log("Store data prepared:", storeData);

        console.log("Attempting to create store...");
        const storeRes = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/admin/add-store`, storeData, {
          headers: { Authorization: `Bearer ${token}` }
        });
        console.log('Store created successfully:', storeRes.data);
      }

      setMessage(`${form.role.charAt(0).toUpperCase() + form.role.slice(1).replace('_', ' ')} Successfully added`);
      setAddedUser({ name: form.name, email: form.email, role: form.role });
      setForm({ name: '', email: '', password: '', address: '', role: 'user', storeName: '', storeEmail: '', storeAddress: '' });
      if (onSuccess) onSuccess();
    } catch (err) {
      // More detailed error logging
      console.error('Error details:', {
        message: err.message,
        response: err.response?.data,
        status: err.response?.status,
        statusText: err.response?.statusText
      });
      setIsSuccess(false);
      setAddedUser(null);
      setMessage(err.response?.data?.message || 'Error adding user/store');
    }
  };

  return (
    <div className="form-container">
      <h2>Add New User</h2>
      {message && (
        <div className={`alert ${isSuccess ? 'alert-success' : 'alert-error'}`}>
          {message}
        </div>
      )}
      {isSuccess && addedUser && (
        <div className="added-user">
          <span style={{ fontSize: '1.2em', color: '#28a745', marginRight: '8px' }}>✔</span>
          <strong>User Added:</strong> {addedUser.name} ({addedUser.email}) as <em>{addedUser.role}</em>
        </div>
      )}
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <input
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="Name"
            className={errors.name ? 'error' : ''}
            required
            minLength={3}
            maxLength={60}
          />
          {errors.name && <span className="error-message">{errors.name}</span>}
        </div>
        <div className="form-group">
          <input
            name="email"
            type="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            className={errors.email ? 'error' : ''}
            required
          />
          {errors.email && <span className="error-message">{errors.email}</span>}
        </div>
        <div className="form-group">
          <input
            name="password"
            type="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            className={errors.password ? 'error' : ''}
            required
            minLength={8}
            maxLength={16}
          />
          {errors.password && <span className="error-message">{errors.password}</span>}
        </div>
        <div className="form-group">
          <input
            name="address"
            placeholder="Address"
            value={form.address}
            onChange={handleChange}
            className={errors.address ? 'error' : ''}
            required
            maxLength={400}
          />
          {errors.address && <span className="error-message">{errors.address}</span>}
        </div>
        <div className="form-group">
          <select name="role" value={form.role} onChange={handleChange}>
            <option value="user">User</option>
            <option value="admin">Admin</option>
            <option value="store_owner">Store Owner</option>
          </select>
        </div>
        {form.role === 'store_owner' && (
          <>
            <div className="form-group">
              <input
                name="storeName"
                placeholder="Store Name"
                value={form.storeName}
                onChange={handleChange}
                className={errors.storeName ? 'error' : ''}
                required
                maxLength={60}
              />
              {errors.storeName && <span className="error-message">{errors.storeName}</span>}
            </div>
            <div className="form-group">
              <input
                name="storeEmail"
                type="email"
                placeholder="Store Email"
                value={form.storeEmail}
                onChange={handleChange}
                className={errors.storeEmail ? 'error' : ''}
                required
              />
              {errors.storeEmail && <span className="error-message">{errors.storeEmail}</span>}
            </div>
            <div className="form-group">
              <input
                name="storeAddress"
                placeholder="Store Address"
                value={form.storeAddress}
                onChange={handleChange}
                className={errors.storeAddress ? 'error' : ''}
                required
                maxLength={400}
              />
              {errors.storeAddress && <span className="error-message">{errors.storeAddress}</span>}
            </div>
          </>
        )}
        <button
          type="submit"
          disabled={isSuccess}
          style={{
            width: '100%',
            padding: '12px',
            backgroundColor: isSuccess ? '#fff' : '#007bff',
            color: isSuccess ? '#28a745' : '#fff',
            border: isSuccess ? '2px solid #28a745' : 'none',
            borderRadius: '4px',
            cursor: isSuccess ? 'not-allowed' : 'pointer',
            fontSize: '16px',
            marginTop: '10px',
            fontWeight: isSuccess ? 'bold' : 'normal'
          }}
        >
          {isSuccess ? 'User added' : 'Add User'}
        </button>
      </form>
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
        .alert {
          margin-top: 10px;
          padding: 10px;
          border-radius: 4px;
          font-weight: 500;
        }
        .alert-success {
          color: #155724;
          background-color: #d4edda;
          border: 1px solid #c3e6cb;
        }
        .alert-error {
          color: #721c24;
          background-color: #f8d7da;
          border: 1px solid #f5c6cb;
        }
        .form-group {
          position: relative;
        }
        .error-message {
          position: absolute;
          top: 90%;
          left: 0;
          color: red;
          font-size: 0.8em;
        }
        .added-user {
          margin: 10px 0;
          padding: 10px;
          background: #e9f7ef;
          border: 1px solid #b7e1cd;
          border-radius: 4px;
          color: #155724;
        }
      `}</style>
    </div>
  );
};

export default AddUserOrStore;
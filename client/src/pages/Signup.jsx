import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Signup() {
    const [form, setForm] = useState({
        name: '',
        email: '',
        password: '',
        address: '',
    });
    const [errMsg, setErrMsg] = useState('');
    const [successMsg, setSuccessMsg] = useState('');
    const navigate = useNavigate();

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
        setErrMsg('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrMsg('');
        setSuccessMsg('');

        try {
            const response = await axios.post('http://localhost:5000/api/auth/signup', {
                ...form,
                role: 'Normal User', // enforced for now
            });

            setSuccessMsg('Signup successful! Redirecting to login...');
            setTimeout(() => {
                navigate('/login');
            }, 2000);
        } catch (err) {
            setErrMsg(err.response?.data?.message || 'Signup failed');
        }
    };

    return (
        <div className="signup-container">
            <form className="signup-box" onSubmit={handleSubmit}>
                <h2>Signup</h2>
                {errMsg && <p className="error">{errMsg}</p>}
                {successMsg && <p className="success">{successMsg}</p>}
                <input
                    type="text"
                    name="name"
                    placeholder="Full Name"
                    value={form.name}
                    onChange={handleChange}
                    required
                />
                <input
                    type="email"
                    name="email"
                    placeholder="Email"
                    value={form.email}
                    onChange={handleChange}
                    required
                />
                <input
                    type="password"
                    name="password"
                    placeholder="Password"
                    value={form.password}
                    onChange={handleChange}
                    required
                />
                <textarea
                    name="address"
                    placeholder="Address"
                    value={form.address}
                    onChange={handleChange}
                    required
                />
                <button type="submit">Register</button>
                <p>Already have an account? <a href="/login">Login</a></p>
            </form>
            <style>{`
      .signup-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: #f5f5f5;
}

.signup-box {
  background: white;
  padding: 30px;
  width: 400px;
  border-radius: 10px;
  box-shadow: 0px 0px 12px rgba(0, 0, 0, 0.1);
}

.signup-box h2 {
  text-align: center;
  margin-bottom: 20px;
}

.signup-box input,
.signup-box textarea {
  width: 100%;
  padding: 10px;
  margin: 8px 0;
  border-radius: 5px;
  border: 1px solid #ccc;
  resize: vertical;
}

.signup-box button {
  width: 100%;
  padding: 10px;
  background-color: #28a745;
  color: white;
  border: none;
  margin-top: 10px;
  font-weight: bold;
  border-radius: 6px;
  cursor: pointer;
}

.signup-box button:hover {
  background-color: #218838;
}

.signup-box p {
  text-align: center;
  margin-top: 15px;
}

.signup-box .error {
  color: red;
  font-size: 14px;
  margin-bottom: 10px;
  text-align: center;
}

.signup-box .success {
  color: green;
  font-size: 14px;
  margin-bottom: 10px;
  text-align: center;
}

      `}</style>
        </div>
    );
}

export default Signup;

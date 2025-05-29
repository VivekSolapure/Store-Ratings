import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errMsg, setErrMsg] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setErrMsg('');

    try {
      const response = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/auth/login`, {
        email,
        password
      });

      const { token, user } = response.data;

      // Save token & user to localStorage
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      console.log(token, user);
      
      // Redirect based on role
      if (user.role === 'super admin') navigate('/superadmin');
      else if (user.role === 'user') navigate('/user');
      else if (user.role === 'admin') navigate('/admin');
      else if (user.role === 'store_owner') navigate('/store');
      else setErrMsg('Invalid role');
    } catch (err) {
      setErrMsg(err.response?.data?.message || 'Login failed');
    }
  };

  return (
    <div className="login-container">
      <form className="login-box" onSubmit={handleLogin}>
        <h2>Login</h2>
        {errMsg && <p className="error">{errMsg}</p>}
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit">Login</button>
        <p>Don't have an account? <a href="/signup">Sign up</a></p>
      </form>
      <style>{`
.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: #f0f2f5;
}

.login-box {
  background-color: #fff;
  padding: 30px;
  width: 350px;
  border-radius: 10px;
  box-shadow: 0px 0px 15px rgba(0, 0, 0, 0.1);
}

.login-box h2 {
  text-align: center;
  margin-bottom: 20px;
}

.login-box input {
  width: 100%;
  padding: 10px;
  margin: 8px 0;
  border: 1px solid #ccc;
  border-radius: 6px;
}

.login-box button {
  width: 100%;
  padding: 10px;
  background-color: #007bff;
  color: white;
  border: none;
  margin-top: 10px;
  border-radius: 6px;
  cursor: pointer;
  font-weight: bold;
}

.login-box button:hover {
  background-color: #0056b3;
}

.login-box p {
  text-align: center;
  margin-top: 15px;
}

.login-box .error {
  color: red;
  font-size: 14px;
  margin-bottom: 10px;
  text-align: center;
}

`}</style>
    </div>
  );
}

export default Login;

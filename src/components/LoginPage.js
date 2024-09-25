import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
const apiUrl = process.env.REACT_APP_API_URL;

function LoginPage() {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    try {
      const response = await fetch(`${apiUrl}login/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });
      if (response.ok) {
        // Handle successful login
        const data = await response.json(); // Parse JSON data from the response
        localStorage.setItem('token', data.token); // Store token if available
        navigate('/dashboard'); // Redirect to the dashboard
        } else {
        // Handle login failure
        console.log('Response:', response);
        alert(`${apiUrl}login/`)
        alert('Login failed: invalid credentials.');
      }
    } 
    catch (error) {
      console.error('Error:', error);
      // display error message
      alert(`${apiUrl}login/`)
      alert(error);
    }
  };
  
  const handleForgotPassword = () => {
    navigate('/forgot-password');
  };

  const handleRegister = () => {
    navigate('/register');
  };

  return (
    <div style={{ textAlign: 'center', marginTop: '50px' }}>
      <h1>Login Page</h1>
      <div style={{ marginBottom: '20px' }}>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          style={{ padding: '10px', margin: '10px', width: '200px' }}
        />
      </div>
      <div style={{ marginBottom: '20px' }}>
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={{ padding: '10px', margin: '10px', width: '200px' }}
        />
      </div>
      <button onClick={handleLogin} style={{ padding: '10px 20px', margin: '10px' }}>
        Login
      </button>
      <div>
        <button onClick={handleForgotPassword} style={{ padding: '10px 20px', margin: '10px' }}>
          Forgot your password?
        </button>
        <button onClick={handleRegister} style={{ padding: '10px 20px', margin: '10px' }}>
          Register
        </button>
      </div>
    </div>
  );
}

export default LoginPage;

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { renderLoadingMask } from './shared';
const apiUrl = process.env.REACT_APP_API_URL;

function LoginPage() {
  const [loading, setLoading] = useState(false); // Loading state
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    setLoading(true); // Set loading to true when login starts
    try {
      const response = await fetch(`${apiUrl}/login/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });
      setLoading(false); // Stop loading once the response is received
      if (response.ok) {
        // Handle successful login
        const data = await response.json(); // Parse JSON data from the response
        localStorage.setItem('token', data.token); // Store token if available
        navigate('/dashboard'); // Redirect to the dashboard
        } else {
        // Handle login failure
        console.log('Response:', response);
        alert(`${apiUrl}/login/`)
        alert('Login failed: invalid credentials.');
      }
    } 
    catch (error) {
      setLoading(false); // Stop loading on error
      console.error('Error:', error);
      alert('An error occurred during login.');
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
      <button onClick={handleLogin} disabled={loading} className="login-btn">
        {loading ? 'Logging in...' : 'Login'} {/* Show "Logging in..." during loading */}
      </button>
      <div>
        <button onClick={handleForgotPassword} style={{ padding: '10px 20px', margin: '10px' }}>
          Forgot your password?
        </button>
        <button onClick={handleRegister} style={{ padding: '10px 20px', margin: '10px' }}>
          Register
        </button>
      </div>
      {loading && renderLoadingMask()} {/* Render loading mask */}
    </div>
  );
}

export default LoginPage;

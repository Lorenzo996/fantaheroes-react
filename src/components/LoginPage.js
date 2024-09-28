import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { renderLoadingMask } from './shared';
import { renderPageHeader } from './shared';

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
    <div className="page-layout">
      {/* Main Content */}
      <div className="page-content">

        {/* Page header */}
        {renderPageHeader("Homepage", `/`, navigate)}

        <div style={{ textAlign: 'center', marginTop: '50px' }} >
          {/* Page title */}
          <h1 className="page-content-title" style={{fontSize:'32px'}}>Login page</h1>

          {/* Page body */}
          <div style={{ marginBottom: '20px' }}>
            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              style={{ padding: '10px', margin: '10px', width: '200px', backgroundColor: 'transparent', border: '1px solid #ccc', color: '#ccc' }}
            />
          </div>
          <div>
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={{ padding: '10px', margin: '0px', width: '200px', backgroundColor: 'transparent', border: '1px solid #ccc', color: '#ccc' }}
            />
          </div>
          <p onClick={handleForgotPassword} style={{ cursor: 'pointer', fontSize: '14px', color: '#007bff' }}>
            Forgot Password
          </p>
          <button onClick={handleLogin} disabled={loading} style={{ padding: '10px 20px', margin: '10px', backgroundColor: 'transparent', border: '0px solid #ccc', color: '#ccc', cursor: 'pointer', fontSize: '24px' }}>
            {loading ? 'Logging in...' : 'Login'} {/* Show "Logging in..." during loading */}
          </button>
          <p>or</p>
          <button onClick={handleRegister} style={{ padding: '0', margin: '0', backgroundColor: 'transparent', border: '0px solid #ccc', color: '#ccc', cursor: 'pointer', fontSize: '16px' }}>
            Register a new account
          </button>
          {loading && renderLoadingMask()} {/* Render loading mask */}
        </div>
      </div>
    </div>
  );
}

export default LoginPage;

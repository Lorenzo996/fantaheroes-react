import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Updated import
import { renderPageHeader } from './shared'; // Updated import
import { sendAPIrequest } from './shared'; // Updated import
const apiUrl = process.env.REACT_APP_API_URL;


function RegisterPage() {
  const [username, setUsername] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate(); // Updated hook
  const handleNavigate = (path) => {
    navigate(path);
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      alert('Passwords do not match');
      return;
    }
    // Send the registration data to the backend
    const data = {
      username: username,
      first_name: firstName,
      last_name: lastName,
      email: email,
      password: password,
    };
    const response_data = await sendAPIrequest( `${apiUrl}/register/`, "POST", "Registration failed", setLoading, data); 
    console.log("Response data:", response_data);
    if (response_data === null) {
      return;
    }

    // Show confirmation message to the user and reset
    setMessage(`Account created for ${username}. See your email for confirmation.`);
    setUsername('');
    setFirstName('');
    setLastName('');
    setEmail('');
    setPassword('');
    setConfirmPassword('');
  };

  return (
    <div className="page-layout">
      {/* Main Content */}
      <div className="page-content">

        {/* Page header */}
        {renderPageHeader("Login", `/`, handleNavigate)}

        {/* Page title */}
        <h1 className="page-content-title">Register</h1>
        
        {/* Registration form */}
        <form onSubmit={handleRegister}>
          <div>
            <span className="form-label">Username</span>
            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              className="form-input"
            />
          </div>
          <div>
            <span className="form-label">First name</span>
            <input
              type="text"
              placeholder="First name"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              required
              className="form-input"
            />
          </div>
          <div>
            <span className="form-label">Last name</span>
            <input
              type="text"
              placeholder="Last name"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              required
              className="form-input"
            />
          </div>
          <div>
            <span className="form-label">Email</span>
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="form-input"
            />
          </div>
          <div>
            <span className="form-label">Password</span>
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="form-input"
            />
          </div>
          <div>
            <span className="form-label">Confirm Password</span>
            <input
              type="password"
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              className="form-input"
            />
          </div>
          <button type="submit" style={{ padding: '10px 20px', margin: '5px' }}>
            Register
          </button>
        </form>

        {/* Display message after form submission */}
        {message && <p>{message}</p>}
      </div>
    </div>
  );
}

export default RegisterPage;

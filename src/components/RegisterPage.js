import React, { useState } from 'react';

function RegisterPage() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');

  const handleRegister = (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setMessage('Passwords do not match');
    } else {
      // Simulate a registration process
      setMessage(`Account created for ${username}`);
      setUsername('');
      setEmail('');
      setPassword('');
      setConfirmPassword('');
    }
  };

  return (
    <div style={{ textAlign: 'center', marginTop: '50px' }}>
      <h1>Register</h1>
      <form onSubmit={handleRegister}>
        <div style={{ marginBottom: '10px' }}>
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            style={{ padding: '10px', margin: '5px', width: '250px' }}
          />
        </div>
        <div style={{ marginBottom: '10px' }}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={{ padding: '10px', margin: '5px', width: '250px' }}
          />
        </div>
        <div style={{ marginBottom: '10px' }}>
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={{ padding: '10px', margin: '5px', width: '250px' }}
          />
        </div>
        <div style={{ marginBottom: '20px' }}>
          <input
            type="password"
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            style={{ padding: '10px', margin: '5px', width: '250px' }}
          />
        </div>
        <button type="submit" style={{ padding: '10px 20px', margin: '5px' }}>
          Register
        </button>
      </form>

      {/* Display message after form submission */}
      {message && <p>{message}</p>}
    </div>
  );
}

export default RegisterPage;

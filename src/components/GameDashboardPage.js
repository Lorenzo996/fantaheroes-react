import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { renderPageHeader } from './shared';
const apiUrl = process.env.REACT_APP_API_URL;

function GameDashboardPage() {
  const { gameId } = useParams(); // Get game ID from URL
  const navigate = useNavigate(); // Updated hook


  // Handlers for navigating to different sections
  const handleNavigate = (path) => {
    navigate(path);
  };

  // Handler for leaving the game
  const handleLeaveGame = async () => {
    const token = localStorage.getItem('token');
    try {
        const response = await fetch(`${apiUrl}games/${gameId}/leave/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Token ${token}`, // Send token in header
            },
        });
        if (!response.ok) {
            throw new Error('Failed to leave game');
        }
        // Redirect to the user dashboard after leaving the game
        navigate('/dashboard');
    } catch (error) {
        console.error('Error leaving game:', error);
    }
};

// Fetch user role from the backend
  const [userRole, setUserRole] = useState('');
  const fetch_user_role = async () => {
    const response = await fetch(`${apiUrl}games/${gameId}/role/`, {
      headers: { Authorization: `Token ${localStorage.getItem('token')}` },
    });
    if (!response.ok) {
      console.error('Failed to fetch user role');
      return;
    }
    setUserRole(await response.json());
  }
  fetch_user_role()
  // Subpages for the game dashboard to navigate to
  let subpages = [
    { name: 'Game Rules', image: '/images/rules.png', path: 'rules' },
    { name: 'Players', image: '/images/players.png', path: 'players' },
    { name: 'Podium', image: '/images/podium.png', path: 'podium' },
    { name: 'Events', image: '/images/events.png', path: 'events' },
    ,
  ];
  if (userRole === 'owner' || userRole === 'admin') {
    subpages.push({ name: 'Settings', image: '/images/settings.png', path: 'settings' });
  }

  return (
    <div className="page-layout">

      {/* Main Content */}
      <div className="page-content">
        {/* Page header */}
        {renderPageHeader("Home", "/dashboard", handleNavigate)}

        {/* Page Title */}
        <h1 className="page-content-title">Game Dashboard </h1>
        
        {/* Show Settings drop-down if the user is NOT an owner or admin */}
        {userRole !== 'owner' && userRole !== 'admin' && (
          <div className="dropdown">
            <span style={{width: '100%'}}></span>
            <button style={{ backgroundColor: 'transparent', color: 'rgb(223, 230, 230)', border: 'none', position: 'fixed', right: '20px', top: '70px'}}>
              <i className="fa fa-cog"></i>
            </button>
            <div className="dropdown-content" style={{position: 'fixed', right: '20px', top: '100px'}}>
              <button onClick={handleLeaveGame}>Leave game</button>
            </div>
          </div>
        )}

        <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
          {subpages.map((subpage) => (
            <div
              key={subpage.name}
              onClick={() => navigate(`/game/${gameId}/${subpage.path}`)} // Clickable box
              className="dashboard-card" 
            >
              <img
                src={subpage.image}
                alt={subpage.name}
                className="dashboard-card-image"
              />
              <h3 className='dashboard-card-title'>{subpage.name}</h3>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// Reusable style for dashboard boxes
const boxStyle = {
  width: '150px',
  padding: '10px',
  backgroundColor: 'white',
  borderRadius: '8px',
  boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
  textAlign: 'center',
  cursor: 'pointer',
};

export default GameDashboardPage;

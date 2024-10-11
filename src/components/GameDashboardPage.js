import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { renderPageHeader } from './shared';
import { renderPage } from './shared';
import { sendAPIrequest } from './shared';

const apiUrl = process.env.REACT_APP_API_URL;

function GameDashboardPage() {
  const [loading, setLoading] = useState(false); // Loading state
  const { gameId } = useParams(); // Get game ID from URL
  const navigate = useNavigate(); // Updated hook


  // Handlers for navigating to different sections
  const handleNavigate = (path) => {
    navigate(path);
  };

  // Handler for leaving the game
  const handleLeaveGame = async () => {
    sendAPIrequest(`${apiUrl}/games/${gameId}/leave/`, "POST", "Failed to leave game", setLoading, {})
    // Redirect to the user dashboard after leaving the game
    navigate('/dashboard');
};

// Fetch user role from the backend
  const [userRole, setUserRole] = useState('');
  useEffect(() => {
    sendAPIrequest(`${apiUrl}/games/${gameId}/role/`, "GET", "Failed to fetch user role", setLoading, {})
    .then((data) => {
      setUserRole(data);
    })
    .catch((error) => {
        console.error('Error fetching user role:', error);
    });
    }, [gameId]);

  
  

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


  const renderPageContent = () => {
    return (
      <>
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
      </>
    )
  };

  return (
    renderPage("Game Dashboard", `/dashboard`, "Home", handleNavigate, renderPageContent(), loading)
  );
}


export default GameDashboardPage;

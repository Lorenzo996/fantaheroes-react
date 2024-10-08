import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // Updated import
const apiUrl = process.env.REACT_APP_API_URL;

function DashboardPage() {
  const [games, setGames] = useState([]);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [username, setUsername] = useState(''); // State for storing user info
  const [profileImage, setProfileImage] = useState(''); // State for storing user info
  const navigate = useNavigate(); // Updated hook

  // Fetch active games from the database
  const fetchGames = async () => {
    // try {
      const token = localStorage.getItem('token'); // Get the token from local storage
      const response = await fetch(`${apiUrl}games/`, {
        headers: {
          'Authorization': `Token ${token}`,  // Attach the token in the request headers
        },
      });
      const data = await response.json();
      setGames(data);
    // } catch (error) {
    //   console.error('Error:', error);
    // }
  };

  // Fetch user profile info
  const fetchUserProfile = async () => {
    const token = localStorage.getItem('token'); // Get the token from local storage
    const response = await fetch(`${apiUrl}user-profile/`, {
      headers: {
        'Authorization': `Token ${token}`,  // Attach the token in the request headers
      },
    });
    const userProfile = await response.json();
    setUsername(userProfile.username); // Store user data
    setProfileImage(userProfile.profile_image); // Store user data
  };

  useEffect(() => {
    fetchGames();
    fetchUserProfile(); // Fetch user info when component mounts
  }, []);

  // Function to create a new game
  const [newGameWindowShow, setNewGameWindowShow] = useState(false);
  const [newGameName, setNewGameName] = useState('');
  const [newGameDefaultRules, setNewGameDefaultRules] = useState('Custom');
  const handleNewGame = async () => {

    try {
      const data = {
        name: newGameName, // Game name
        default_rules: newGameDefaultRules, // Default rules
      };
      const response = await fetch(`${apiUrl}create_game/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Token ${localStorage.getItem('token')}`, // Send token in header
        },
        body: JSON.stringify(data),
      });
      if (response.ok) {
        const result = await response.json();

        // Close the modal
        setNewGameWindowShow(false);

        // Optionally, fetch games again to show the new game
        const updatedGames = await fetch(`${apiUrl}games/`, {
          headers: {
            'Authorization': `Token ${localStorage.getItem('token')}`,  // Attach the token in the request headers
          },
        });
        const data = await updatedGames.json();
        setGames(data);
      } else {
        alert('Failed to create a new game. Bad response from the server: ' + response.status);
      }
    } catch (error) {
      console.error('Error creating a new game:', error);
      alert('Error creating a new game: ' + error);
    }
  };

  // Function to join an existing game
  const handleJoinGame = async () => {
    const invitation_code = prompt('Enter the invitation code:');

    if (invitation_code) {
      // Call the backend API to join the game
      const response = await fetch(`${apiUrl}join_game/${invitation_code}/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Token ${localStorage.getItem('token')}`, // Send token in header
        },
      });

      if (!response.ok) {
        alert('Failed to join the game. Please check the invitation code.');
      }

      // Optionally, fetch games again to show the new game
      fetchGames()
    }
  };

  // Function to logout the user
  const handleLogout = () => {
    localStorage.removeItem('token'); // Remove the token from local storage
    // TODO: call logout api
    navigate('/'); // Navigate to the login page
  };

  // Toggle sidebar visibility
  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  // Function to navigate to the specific game's dashboard
  const handleGameClick = (gameId) => {
    navigate(`/game/${gameId}`); // Updated navigation
  };


  return (
    <div className="page-layout" style={{flexDirection: 'row'}}>
      {/* Sidebar */}
      <div
        style={{
          width: sidebarOpen ? '250px' : '0',
          transition: 'width 0.3s',
          backgroundColor: 'trasparent',
          padding: sidebarOpen ? '10px 0px 10px 10px' : '0',
          overflow: 'hidden',
        }}
      >
        {/* User Profile */}
        <div style={{ display: 'flex', alignItems: 'center', padding: '10px 0px 20px 0px'}}>
          <img
            src={profileImage} 
            alt="Profile"
            style={{ width: '40px', height: '40px', borderRadius: '50%', marginRight: '10px' }}
          />
          <span style={{overflow:'hidden', width:'100%'}}>{username}</span> {/* Display the user's nickname */}
          <button
            style={{
              position: 'relative',
              right: '0px',
              marginLeft: '10px',
              backgroundColor: 'transparent',
              color: 'red',
              border: 'none',
              cursor: 'pointer',
            }}
            onClick={toggleSidebar}
            >
            &times;
          </button>
        </div>
        <ul style={{ listStyle: 'none', padding: '0' }}>
        <li style={{ marginBottom: '10px' }}>
          <button onClick={() => { toggleSidebar(); setNewGameWindowShow(true) }} className="sidebar-list-button">New Game</button>
        </li>
          <li style={{ marginBottom: '10px' }}>
            <button onClick={handleJoinGame} className="sidebar-list-button">Join Game</button>
          </li>
          <li style={{ marginBottom: '10px' }}>
            <button onClick={() => navigate('/howitworks')} className="sidebar-list-button">How it works</button>
          </li>
          <li style={{ marginBottom: '10px' }}>
            <button onClick={() => navigate('/settings')} className="sidebar-list-button">Settings</button>
          </li>
          <li style={{ marginBottom: '10px' }}>
            <button onClick={handleLogout} className="sidebar-list-button">Logout</button>
          </li>
        </ul>
      </div>

      {/* Main Content */}
      <div className="page-content" style={{width: sidebarOpen ? '0' : '100%'}}>
        <div className="page-header">
          <button
            onClick={toggleSidebar}
            style={{
              marginBottom: '5px',
              marginRight: '10px',
              backgroundColor: 'transparent',
              color: 'white',
              border: 'none',
              padding: '0',
              cursor: 'pointer',
              verticalAlign: 'middle',
            }}
          >
            {sidebarOpen ? (
              <></>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-list" viewBox="0 0 16 16">
                <path fillRule="evenodd" d="M3 2.5a.5.5 0 0 1 .5-.5h11a.5.5 0 0 1 0 1h-11a.5.5 0 0 1-.5-.5zm0 5a.5.5 0 0 1 .5-.5h11a.5.5 0 0 1 0 1h-11a.5.5 0 0 1-.5-.5zm0 5a.5.5 0 0 1 .5-.5h11a.5.5 0 0 1 0 1h-11a.5.5 0 0 1-.5-.5z"/>
              </svg>
            )}
          </button>
          <span className="text">Dashboard</span>
        </div>
        <h1 className="page-content-title">Your Active Games</h1>
        <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
          {games.map((game) => (
            <div
              key={game.id}
              onClick={() => handleGameClick(game.id)} // Clickable box
              className="dashboard-card"
            >
              <img
                src={game.image}
                alt={game.name}
                className="dashboard-card-image"
              />
              <h3 className="dashboard-card-title">{game.name}</h3>
            </div>
          ))}
        </div>
      </div>

      {/* New Game Modal */}
      <div className="loading-mask" 
        style={{
          display: newGameWindowShow ? 'block' : 'none',
          }}>
        <div className="modal-window">
          <span className="close" onClick={() => setNewGameWindowShow(false)}>&times;</span>
          <h2>Create a New Game</h2>
          <p className="form-label">Game Name: 
            <input type="text" className="form-input" placeholder="Enter game name" onChange={(e) => setNewGameName(e.target.value)} value={newGameName} />
          </p>
          <p className="form-label">Game rules: 
            <select className="form-input" onChange={(e) => setNewGameDefaultRules(e.target.value)} value={newGameDefaultRules}>
              <option value="FantaWorking">Custom</option>
              <option value="FantaParty">FantaParty</option>
              <option value="FantaWeRoad">FantaWeRoad</option>
              <option value="FantaCoding">FantaCoding</option>
              <option value="FantaWorking">FantaWorking</option>
            </select>
          </p>
          <button onClick={handleNewGame}>Create Game</button>
        </div>
      </div>

    </div>
  );
}

export default DashboardPage;

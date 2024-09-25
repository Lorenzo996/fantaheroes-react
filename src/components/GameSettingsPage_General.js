// GameSettingsPage_General.js
import React, { useState } from 'react';
import { Accordion, Card } from 'react-bootstrap';
import { useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
const apiUrl = process.env.REACT_APP_API_URL;

function GameSettingsPage_General() {
    const { gameId } = useParams(); // Get game ID from URL
    const navigate = useNavigate(); // Updated hook

    const toggleCard = (uniqueIndex) => {
        const cardBody = document.getElementById(`card-body-${uniqueIndex}`);
        if (cardBody.style.display === 'none' || cardBody.style.display === '') {
            cardBody.style.display = 'block';
        } else {
            cardBody.style.display = 'none';
        }
    };

    // Handlers for navigating to different sections
    const handleNavigate = (path) => {
        navigate(path);
    };


    const handleDeleteGame = async () => {
        const token = localStorage.getItem('token');
        try {
            const response = await fetch(`${apiUrl}games/${gameId}/delete/`, {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                  'Authorization': `Token ${token}`, // Send token in header
                },
              });

            if (!response.ok) {
                throw new Error('Failed to delete game');
            }
            // Redirect to the user dashboard after deleting the game
            navigate('/dashboard');
        } catch (error) {
            console.error('Error deleting game:', error);
        }
    };

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

    const components = [ /* TODO: not used yet */
        { title: 'Game Timeline', content: [
            {type:'date', label:'Activation Date', tooltip:'The date when the game will start.', value:'2022-01-01'},
        ]},
    ];

    // Get game details from the backend
    const [game, setGame] = useState([]); // Initialize game state with an empty object
    const [tempGame, setTempGame] = useState({}); // Initialize tempEditedGame state with an empty object
    const [gameImage, setGameImage] = useState(''); // Initialize game image state with an empty string
    useEffect(() => {
        fetchGameRules()
          .then((data) => {
            setGame(data);
            setTempGame(data);
            setGameImage(data.image);
          })
          .catch((error) => {
            console.error('Error fetching game:', error);
          });
        }, 
        [gameId]
    );
    const fetchGameRules = async () => {
    // try {
        const token = localStorage.getItem('token');
        const response = await fetch(`${apiUrl}games/${gameId}/`, {
            headers: {
              'Authorization': `Token ${token}`, // Send token in header
            },
          });
        const data = await response.json();
        return data;
    // } catch (error) {
    //   throw new Error('Failed to fetch game rules');
    // }
    };
    // Edit the game settings in the backend
    const setEditedGame = (value, key) => {
        // Send the updated value to the backend
        const token = localStorage.getItem('token');
        fetch(`${apiUrl}games/${gameId}/edit-settings/${key}/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Token ${token}`, // Send token in header
            },
            body: JSON.stringify({ [key]: value }),
        });

        // Update the game state with the new value
        setGame((prevGame) => {
            return {
                ...prevGame,
                [key]: value,
            };
        });
        setTempGame((prevGame) => {
            return {
                ...prevGame,
                [key]: value,
            };
        });
    };

    const setTempEditedGame = (value, key) => {
        setTempGame((prevGame) => {
            return {
                ...prevGame,
                [key]: value,
            };
        });
    };

    // Handle image selection and upload
    const handleImageChange = async (event) => {
        const file = event.target.files[0];
        const formData = new FormData();
    
        if (file) {
            // Load image as base64
            const reader = new FileReader();
            reader.onload = (event) => {
                setGameImage(event.target.result);
            };
            reader.readAsDataURL(file);

            reader.onloadend = async (event) => {
                formData.append('image', reader.result);  // Append the file to the FormData
                try {
                    const response = await fetch(`${apiUrl}games/${gameId}/edit-settings/image/`, {
                        method: 'POST',
                        headers: {
                            'Authorization': `Token ${localStorage.getItem('token')}`,
                        },
                        body: formData,
                    });
                    console.log('Response:', response);
                    if (!response.ok) {
                        throw new Error('Failed to update game image');
                    }
                } catch (error) {
                    console.error('Error updating game image:', error);
                }
            }
        }
    };
    
    return (
        <div className="page-layout">
            {/* Page header */}
            <div className="page-header">
                <button className="back-button" onClick={() => handleNavigate(`/game/${gameId}/settings`)}>
                    &lt; Game settings {/* Arrow icon for going back */}
                </button>
            </div>

            {/* Main Content */}
            
            <div className="page-content">
                <h1 className="page-content-title">General</h1>
                
                {/* Game Properties Section */}
                <Card key={'game-properties'} className="expandable-card">
                    <Card.Header className="expandable-card-header">
                        <span onClick={() => toggleCard('game-properties')} className="expandable-card-title" >
                            Game properties
                        </span>
                    </Card.Header>
                    <Card.Body id={`card-body-game-properties`} className="expandable-card-body">
                        <div className="form-label">Game Name
                            <input type="text" className="form-input" value={game.name || ''} onChange={(e) => setEditedGame(e.target.value, "name")}/>
                        </div>
                        <div className="form-label">Game Description
                            <input type="text" className="form-input" value={tempGame.description || ''} 
                            onChange={(e) => (setTempEditedGame(e.target.value, "description"))} 
                            onBlur={(e) => setEditedGame(e.target.value, "description")} // Trigger onBlur when the input loses focus
                            />
                        </div>
                        <div className="form-label">Game Image</div>
                        <div>
                            <img src={gameImage} className="edit-settings-image" onError={(e) => e.target.src = 'https://via.placeholder.com/150'} />
                            <input
                                type="file"
                                id="imageInput"
                                accept="image/*"
                                style={{ display: 'none' }}
                                onChange={handleImageChange}
                            />
                            <button className="edit-settings-image-button" onClick={() => document.getElementById('imageInput').click()}>
                                <i className="fas fa-edit"></i>
                            </button>
                        </div>

                        <div className="form-label">Invitation Code: <span className="text">{game.invitation_code}</span></div>
                    </Card.Body>
                </Card>

                {/* Game Timeline Section */}
                <Card key={'game-timeline'} className="expandable-card">
                    <Card.Header className="expandable-card-header">
                        <span onClick={() => toggleCard('game-timeline')} className="expandable-card-title" >
                            Game Timeline
                        </span>
                    </Card.Header>
                    <Card.Body id={`card-body-game-timeline`} className="expandable-card-body">
                        <div className="text">Activation Date
                            <input type="date" className="form-control" value={game.activation_date || ''} onChange={(e) => setEditedGame(e.target.value, "activation_date")}/>
                        </div>
                        <div className="text">Termination Date
                            <input type="date" className="form-control" value={game.termination_date || ''} onChange={(e) => setEditedGame(e.target.value, "termination_date")}/>
                        </div>
                    </Card.Body>
                </Card>

                {/* Players Section */}
                <Card key={'players'} className="expandable-card">
                    <Card.Header className="expandable-card-header">
                        <span onClick={() => toggleCard('players')} className="expandable-card-title" >
                            Players
                        </span>
                    </Card.Header>
                    <Card.Body id={`card-body-players`} className="expandable-card-body">
                        <div>Add Player</div>
                        <div>Remove Player</div>
                        <div>Disable Player</div>
                    </Card.Body>
                </Card>

            
                {/* Leave game button */}
                <button className="btn btn-danger mt-3" onClick={() => handleLeaveGame()}>
                    Leave Game
                </button>
                {/* Delete game button */}
                <button className="btn btn-danger mt-3" onClick={() => handleDeleteGame()}>
                    Delete Game
                </button>
            </div>
        </div>
    );
}

export default GameSettingsPage_General;

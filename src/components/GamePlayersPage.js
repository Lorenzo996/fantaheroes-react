import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { Card } from 'react-bootstrap';
import { toggleCard, renderPageHeader } from './shared';
const apiUrl = process.env.REACT_APP_API_URL;

function GamePlayersPage() {
    const { gameId } = useParams(); // Get game ID from URL
    const navigate = useNavigate(); // Updated hook
    
    // Handlers for navigating to different sections
    const handleNavigate = (path) => {
        navigate(path);
    };

    // Fetch game players from the backend
    const [players, setPlayers] = useState([]); // Initialize players state with an empty object
    useEffect(() => {
        fetchGamePlayers()
        .then((data) => {
            setPlayers(data);
        })
        .catch((error) => {
            console.error('Error fetching game players:', error);
        });
        }, [gameId]);
    const fetchGamePlayers = async () => {
        // try {
        const response = await fetch(`${apiUrl}games/${gameId}/players/`, {
            headers: {'Authorization': `Token ${localStorage.getItem('token')}`},
        });
        const data = await response.json();
        return data;
        // } catch (error) {
        //   throw new Error('Failed to fetch game rules');
        // }
    };

    // Render the players list
    const renderPlayers = () => {
        if (players.length === 0) {
            return <p>No players found</p>;
        }
        // TODO: check if it is necessary to pass the player id (better keep it hidden in the frontend)
        return players.map((player) => {
            return (
              <Card key={player["id"]} className="expandable-card">
                <Card.Header className='expandable-card-header'>
                    {/* Title that can toggle the card body */}
                    <span onClick={() => toggleCard(player["id"])} className="expandable-card-title">
                      {player["nickname"]}
                    </span>
                </Card.Header>
        
                <Card.Body id={`card-body-${player["id"]}`} className="expandable-card-body">
                    {/* Points */}
                    <p className="text">Points: {player["points"]}</p>
                    {/* Completed challenges */}
                    <p className="text">Completed challenges: {player["points"]}</p>
                </Card.Body>
              </Card>
            );
          });
    }
    
    // Render the page
    return (
        <div className="page-layout">
            {/* Main Content */}
            <div className="page-content">
        
                {/* Page header */}
                {renderPageHeader("Dashboard", `/game/${gameId}`, handleNavigate)}

                {/* Page title */}
                <h1 className="page-content-title">Players</h1>
                {/* Players list */}
                {renderPlayers()}
            </div>
        </div>
    );
}

export default GamePlayersPage;

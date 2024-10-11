import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { Card } from 'react-bootstrap';
import { toggleCard, renderPageHeader } from './shared';
import { renderPage } from './shared';
import { sendAPIrequest } from './shared';

const apiUrl = process.env.REACT_APP_API_URL;

function GamePlayersPage() {
    const [loading, setLoading] = useState(false); // Loading state
    const { gameId } = useParams(); // Get game ID from URL
    const navigate = useNavigate(); // Updated hook
    
    // Handlers for navigating to different sections
    const handleNavigate = (path) => {
        navigate(path);
    };

    // Fetch game players from the backend
    const [players, setPlayers] = useState([]); // Initialize players state with an empty object
    useEffect(() => {
        sendAPIrequest(`${apiUrl}/games/${gameId}/players/`, "GET", "Failed to fetch game players", setLoading, {})
        .then((data) => {
            setPlayers(data);
        })
        .catch((error) => {
            console.error('Error fetching game players:', error);
        });
        }, [gameId]);

    // Render the players list
    const renderPlayers = () => {
        if (players.length === 0) {
            return <p> </p>;
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
        renderPage("Players", `/game/${gameId}`, "Dashboard", handleNavigate, renderPlayers(), loading)        
    );
}

export default GamePlayersPage;

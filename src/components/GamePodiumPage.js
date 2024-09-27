import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { Card } from 'react-bootstrap';
import { toggleCard, renderPageHeader } from './shared';
const apiUrl = process.env.REACT_APP_API_URL;

function GamePodiumPage() {
    const { gameId } = useParams(); // Get game ID from URL
    const navigate = useNavigate(); // Updated hook
    
    // Handlers for navigating to different sections
    const handleNavigate = (path) => {
        navigate(path);
    };

    // Fetch game podium from the backend
    const [podium, setPodium] = useState([]); // Initialize podium state with an empty object
    useEffect(() => {
        fetchGamePodium()
        .then((data) => {
            setPodium(data);
        })
        .catch((error) => {
            console.error('Error fetching game podium:', error);
        });
        }, [gameId]);
    const fetchGamePodium = async () => {
        // try {
        const response = await fetch(`${apiUrl}/games/${gameId}/podium/`, {
            headers: {'Authorization': `Token ${localStorage.getItem('token')}`},
        });
        const data = await response.json();
        return data;
        // } catch (error) {
        //   throw new Error('Failed to fetch game rules');
        // }
    };

    // Render the podium list
    const renderPodium = () => {
        if (podium.length === 0) {
            return <p>No podium found</p>;
        }
        
        return podium.players.map((player, index) => {
            let color = '';
            if (index === 0) {
                color = '-gold';
            } else if (index === 1) {
                color = '-silver';
            } else if (index === 2) {
                color = '-bronze';
            }
            return (
              <Card key={player.nickname} className={`expandable-card${color}`}>
                <Card.Header className='expandable-card-header'>
                    {/* Title that can toggle the card body */}
                    <span onClick={() => toggleCard(player.nickname)} className="expandable-card-title">
                      {player.nickname}
                    </span>
                </Card.Header>
        
                <Card.Body id={`card-body-${player.nickname}`} className="expandable-card-body">
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
                <h1 className="page-content-title">Podium </h1>
                {/* Players list */}
                {renderPodium()}
            </div>
        </div>
    );
}

export default GamePodiumPage;

import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { Card } from 'react-bootstrap';
import { toggleCard, setEditedGameSettings, fetchGameSettings } from './shared';

const apiUrl = process.env.REACT_APP_API_URL;

function GameSettingsPage_Rules() {
    const { gameId } = useParams(); // Get game ID from URL
    const navigate = useNavigate(); // Updated hook

    const handleNavigate = (path) => {
        navigate(path);
    };

    // Get game settings details from the backend
    const [gameSettings, setGameSettings] = useState([]); // Initialize game state with an empty object
    useEffect(() => {
        fetchGameSettings(apiUrl, gameId)
          .then((data) => {
            setGameSettings(data);
          })
          .catch((error) => {
            console.error('Error fetching game settings:', error);
          });
        }, 
        []
    );

    const cards = [
        { title: "Challenges", fields: [
            { label: "Max Number of Challenges", key: "max_number_of_challenges" },
            { label: "Max Challenge Value", key: "max_challenge_value" },
            { label: "Max Challenge Value with Bonus", key: "max_challenge_value_with_bonus" },
            { label: "Min Challenge Value", key: "min_challenge_value" },
            { label: "Min Challenge Value with Malus", key: "min_challenge_value_with_malus" },
        ]},
        { title: "Bonus", fields: [
            { label: "Max Number of Bonus", key: "max_number_of_bonus" },
            { label: "Max Bonus Value", key: "max_bonus_value" },
            { label: "Max Bonus Multiplier", key: "max_bonus_multiplier" },
        ]},
        { title: "Malus", fields: [
            { label: "Max Number of Malus", key: "max_number_of_malus" },
            { label: "Min Malus Value", key: "min_malus_value" },
            { label: "Max Malus Divider", key: "max_malus_divider" },
        ]},
    ];
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
                <h1 className="page-content-title">Game Rules Settings</h1>
                
                {/* Challenges, bonu and malus section */}
                {cards.map((card, index) => (
                    <Card key={`${card.title}-card`} className="expandable-card">
                        <Card.Header className="expandable-card-header">
                            <span onClick={() => toggleCard(card.title)} className="expandable-card-title" >{card.title} </span>
                        </Card.Header>
                        <Card.Body id={`card-body-${card.title}`} className="expandable-card-body">
                            {card.fields.map((field, index) => (
                                <div key={index}>
                                    <span className="form-label">{field.label}</span>
                                    <input type="number" className="form-input-number-70" value={gameSettings[field.key] || ''} 
                                    onChange={(e) => setEditedGameSettings(apiUrl, gameId, setGameSettings, e.target.value, field.key)}
                                    />
                                </div>
                            ))}
                        </Card.Body>
                    </Card>
                ))}
            </div>
        </div>
    );
}

export default GameSettingsPage_Rules;





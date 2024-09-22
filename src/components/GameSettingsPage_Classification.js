import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { Card } from 'react-bootstrap';
import { toggleCard, setEditedGameSettings, fetchGameSettings, renderGameSettingsCard} from './shared';
import { type } from '@testing-library/user-event/dist/type';

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
        { title: "Round", fields: [
            { label: "Round duration", key: "round_duration", type: "duration"},
            { label: "Round start time", key: "rank_ref_time", type: "datetime"},
        ]},
        { title: "Cumulative ranking", fields: [
            { label: "Start time", key: "overall_rank_start_time", type: "datetime"},
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
                {renderGameSettingsCard(cards, gameSettings, setGameSettings, apiUrl, gameId)}
            </div>
        </div>
    );
}

export default GameSettingsPage_Rules;

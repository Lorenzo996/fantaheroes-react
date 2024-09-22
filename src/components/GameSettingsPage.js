// GameSettingsPage.js
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useParams } from 'react-router-dom';
import { Card, Button } from 'react-bootstrap';

function GameSettingsPage() {
    const { gameId } = useParams(); // Get game ID from URL
    const navigate = useNavigate();

    // Handlers for navigating to different sections
    const handleNavigate = (path) => {
        navigate(path);
    };

    const subpages = [
        { title: 'General', path: 'general', subtitle: 'Manage game timeline, players, and other game-wide settings.' },
        { title: 'Game Rules', path: 'rules', subtitle: 'Define the rules of the game and how points are awarded.' },
        { title: 'Leagues', path: 'leagues', subtitle: 'Create and manage leagues for the game.' },
        { title: 'FantaCoins', path: 'fantacoins', subtitle: 'Manage the virtual currency used in the game.' },
        { title: 'Classification', path: 'classification', subtitle: 'Set up the classification system for the game.' },
        { title: 'Rules Respectfulness', path: 'rules-respectfulness', subtitle: 'Manage rules respectfulness settings.' },
    ];

    return (
        <div className="page-layout">
            {/* Page header */}
            <div className="page-header">
                <button className="back-button" onClick={() => handleNavigate(`/game/${gameId}`)}>
                    &lt; Dashboard {/* Arrow icon for going back */}
                </button>
            </div>
  
            {/* Main Content */}
            <div className="page-content">
                <h1 className="page-content-title">Game Settings</h1>
                <div className="row">
                    {subpages.map((subpage, index) => (
                        <div key={index} className="col-md-4 mb-3">
                            <Card onClick={() => handleNavigate(`/game/${gameId}/settings/${subpage.path}`)}>
                                <Card.Body style={{backgroundColor: 'rgb(43, 46, 51)', color: 'white', cursor: 'pointer'}}>
                                    <Card.Title>{subpage.title}</Card.Title>
                                    <Card.Text>
                                        {subpage.subtitle}
                                    </Card.Text>
                                </Card.Body>
                            </Card>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default GameSettingsPage;

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useParams } from 'react-router-dom';
import { Card, Button } from 'react-bootstrap';

function UserSettingsPage() {
    const { gameId } = useParams(); // Get game ID from URL
    const navigate = useNavigate();

    // Handlers for navigating to different sections
    const handleNavigate = (path) => {
        navigate(path);
    };

    const subpages = [
        { title: 'Profile', path: 'profile', subtitle: 'Update your profile information.' },
        { title: 'Account', path: 'account', subtitle: 'Change your account settings and password.' },
        { title: 'Notifications', path: 'leagues', subtitle: 'Manage your email and push notification settings.' },
    ];

    return (
        <div className="page-layout">
            {/* Page header */}
            <div className="page-header">
                <button className="back-button" onClick={() => handleNavigate('/dashboard')}>
                    &lt; Home {/* Arrow icon for going back */}
                </button>
            </div>
  
            {/* Main Content */}
            <div className="page-content">
                <h1 className="page-content-title">Settings</h1>
                <div className="row">
                    {subpages.map((subpage, index) => (
                        <div key={index} className="col-md-4 mb-3">
                            <Card onClick={() => handleNavigate(`/settings/${subpage.path}`)}>
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

export default UserSettingsPage;

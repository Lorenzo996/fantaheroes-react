// GameSettingsPage_Leagues.js
import React, { useState } from 'react';
import { Accordion, Card } from 'react-bootstrap';

function GameSettingsPage_Leagues() {
    const [activeKey, setActiveKey] = useState('0');

    return (
        <div className="container">
            <h1 className="mt-4">Game Settings - Leagues</h1>

            <Accordion activeKey={activeKey} onSelect={(key) => setActiveKey(key)}>
                {/* League Properties Section */}
                <Card>
                    <Accordion.Toggle as={Card.Header} eventKey="0">
                        Leagues Properties
                    </Accordion.Toggle>
                    <Accordion.Collapse eventKey="0">
                        <Card.Body>
                            <div>Number of Leagues</div>
                            <div>Name of the Leagues</div>
                        </Card.Body>
                    </Accordion.Collapse>
                </Card>

                {/* Players in Leagues Section */}
                <Card>
                    <Accordion.Toggle as={Card.Header} eventKey="1">
                        Players in Leagues
                    </Accordion.Toggle>
                    <Accordion.Collapse eventKey="1">
                        <Card.Body>
                            <div>Manage Players in Each League</div>
                        </Card.Body>
                    </Accordion.Collapse>
                </Card>

                {/* Player Event Authorization Section */}
                <Card>
                    <Accordion.Toggle as={Card.Header} eventKey="2">
                        Player Event Authorization
                    </Accordion.Toggle>
                    <Accordion.Collapse eventKey="2">
                        <Card.Body>
                            <div>Player “Add Event” Authorization Settings</div>
                        </Card.Body>
                    </Accordion.Collapse>
                </Card>
            </Accordion>
        </div>
    );
}

export default GameSettingsPage_Leagues;

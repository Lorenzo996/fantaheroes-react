// GameSettingsPage_RulesRespectfulness.js
import React, { useState } from 'react';
import { Accordion, Card } from 'react-bootstrap';

function GameSettingsPage_RulesRespectfulness() {
    const [activeKey, setActiveKey] = useState('0');

    return (
        <div className="container">
            <h1 className="mt-4">Game Settings - Rules Respectfulness</h1>

            <Accordion activeKey={activeKey} onSelect={(key) => setActiveKey(key)}>
                {/* Event Claiming Section */}
                <Card>
                    <Accordion.Toggle as={Card.Header} eventKey="0">
                        Event Claiming
                    </Accordion.Toggle>
                    <Accordion.Collapse eventKey="0">
                        <Card.Body>
                            <div>Start From</div>
                            <div>Show in Real-Time</div>
                        </Card.Body>
                    </Accordion.Collapse>
                </Card>

                {/* Event Publishing Section */}
                <Card>
                    <Accordion.Toggle as={Card.Header} eventKey="1">
                        Check Events Before Publishing
                    </Accordion.Toggle>
                    <Accordion.Collapse eventKey="1">
                        <Card.Body>
                            <div>Rules for Event Verification</div>
                        </Card.Body>
                    </Accordion.Collapse>
                </Card>

                {/* Guardians and Notifications Section */}
                <Card>
                    <Accordion.Toggle as={Card.Header} eventKey="2">
                        Guardians and Notifications
                    </Accordion.Toggle>
                    <Accordion.Collapse eventKey="2">
                        <Card.Body>
                            <div>Set Guardian Roles</div>
                            <div>Set Notification Settings</div>
                        </Card.Body>
                    </Accordion.Collapse>
                </Card>
            </Accordion>
        </div>
    );
}

export default GameSettingsPage_RulesRespectfulness;

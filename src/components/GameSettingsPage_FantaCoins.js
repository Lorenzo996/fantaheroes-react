// GameSettingsPage_FantaCoins.js
import React, { useState } from 'react';
import { Accordion, Card } from 'react-bootstrap';
import { renderPageHeader } from './shared';


function GameSettingsPage_FantaCoins() {
    const [activeKey, setActiveKey] = useState('0');

    return (
        <div className="container">
            <h1 className="mt-4">Game Settings - FantaCoins</h1>

            <Accordion activeKey={activeKey} onSelect={(key) => setActiveKey(key)}>
                {/* FantaCoin Prize Section */}
                <Card>
                    <Accordion.Toggle as={Card.Header} eventKey="0">
                        Prize
                    </Accordion.Toggle>
                    <Accordion.Collapse eventKey="0">
                        <Card.Body>
                            <div>Set FantaCoins Prize</div>
                        </Card.Body>
                    </Accordion.Collapse>
                </Card>

                {/* Initial Amount Section */}
                <Card>
                    <Accordion.Toggle as={Card.Header} eventKey="1">
                        Initial Players Amount
                    </Accordion.Toggle>
                    <Accordion.Collapse eventKey="1">
                        <Card.Body>
                            <div>Set Admin Initial Amount</div>
                            <div>Set Players Initial Amount</div>
                        </Card.Body>
                    </Accordion.Collapse>
                </Card>
            </Accordion>
        </div>
    );
}

export default GameSettingsPage_FantaCoins;

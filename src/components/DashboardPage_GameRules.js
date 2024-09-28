import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from 'react-bootstrap';
import { renderPageHeader, toggleCard } from './shared';

function DashboardPage_GameRules() {
    const navigate = useNavigate();
    // Render the page
    return (
        <div className="page-layout">
            {/* Main Content */}
            <div className="page-content">
                {/* Page Header */}
                {renderPageHeader("Home", "/dashboard", navigate)}

                {/* Page Title */}
                <h1 className="page-content-title">FantaHeroes Game Rules</h1>

                {/* Game rules */}
                <Card className="expandable-card" key='0'>
                    <Card.Header className="expandable-card-header">
                        <span onClick={() => toggleCard("Overview")} className="expandable-card-title">📜 Game Overview</span>
                    </Card.Header>
                    <Card.Body id="card-body-Overview" className="expandable-card-body">
                        <p className="text">🚀 Welcome to FantaHeroes, the ultimate fantasy championship where players score points by completing challenges! </p>
                        <p className="text">💥 Each player accumulate points by completing challenges. Who will rise to the top? 🏆</p>
                    </Card.Body>
                </Card>
                <Card className="expandable-card" key='1'>
                    <Card.Header className="expandable-card-header">
                        <span onClick={() => toggleCard("Structure")} className="expandable-card-title">📅 Game Structure</span>
                    </Card.Header>
                    <Card.Body id="card-body-Structure" className="expandable-card-body">
                        <p className="text">🔥 The game is divided into period rounds, each lasting one or more days. </p>
                        <p className="text">📆 During round, players can complete challenges to earn points. </p>
                        <p className="text">🏁 At the end of the round, the player with the most points wins! </p>
                        <p className="text">🎉 The game continues with new rounds until the end of the season. </p>

                        <p className="text">Periodically, a leaderboard is calculated, ranking players based on points accumulated during the most recent game period. There’s also a global leaderboard that tracks all challenges from the start of the game! 🌍
                        Players earn points by completing challenges, but beware—some challenges have negative scores! 😱
                        Additionally, bonuses and maluses can boost or reduce the value of a completed challenge, so play your cards wisely! 💡

                        Each game lasts until the conclusion of a specific event or activity (like a trip, a party, or a workday). The rules can also be adjusted mid-game using the famous FantaCoins! 💰
                        </p>
                    </Card.Body>
                </Card>
                <Card className="expandable-card">
                    <Card.Header className="expandable-card-header">
                        <span onClick={() => toggleCard("Scoring")} className="expandable-card-title" >🏆 Scoring System </span>
                    </Card.Header>
                    <Card.Body id="card-body-Scoring" className="expandable-card-body">
                        <p className="text">🎯 Players earn points by completing challenges. </p>
                        <p className="text">🔢 Each challenge has a score, which can be positive or negative. </p>
                        <p className="text">🎉 Players can also earn bonuses and maluses, which can boost or reduce the value of a completed challenge. </p>
                        <p className="text">🏁 At the end of the round, the player with the most points wins! </p>
                    </Card.Body>
                </Card>
                <Card className="expandable-card">
                    <Card.Header className="expandable-card-header" >
                        <span onClick={() => toggleCard("NewGame")} className="expandable-card-title">🎲 Starting a New Game</span>
                    </Card.Header>
                    <Card.Body id="card-body-NewGame" className="expandable-card-body">
                        <p className="text">To create a new game, head to the sidebar in your user dashboard and hit the New Game button! 🔥 You can either start the game without any rules, or choose a pre-set based on the category you select. The choice is yours! 🎮</p>
                        <p className="text">Once the new game is created, it is possible to invite new players by sharing the invitation code form the settings page - general settings. </p>
                        <p className="text">Also, it is possible to customize the deltails (e.g. description, image) and rules of the specific game (e.g., max number of active challenges, max challenge value, etc.).</p>

                    </Card.Body>
                </Card>


            </div>
        </div>
    );

}


export default DashboardPage_GameRules;

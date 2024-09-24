import logo from './logo.svg';
import './App.css';

import React from 'react';
import { HashRouter as Router, Route, Routes } from 'react-router-dom'; // switch to using HashRouter instead of BrowserRouter to ensure that your routing works correctly with GitHub Pages
import LoginPage from './components/LoginPage';
import ForgotPasswordPage from './components/ForgotPasswordPage';
import RegisterPage from './components/RegisterPage';
import DashboardPage from './components/DashboardPage';
import GameDashboard from './components/GameDashboardPage';
import GameRulesPage from './components/GameRulesPage';
import GamePlayersPage from './components/GamePlayersPage';
import GamePodiumPage from './components/GamePodiumPage';
import GameEventsPage from './components/GameEventsPage';
import GameEventsPage_New from './components/GameEventsPage_New';
import GameSettingsPage from './components/GameSettingsPage';
import GameSettingsPage_General from './components/GameSettingsPage_General';
import GameSettingsPage_GameRules from './components/GameSettingsPage_GameRules';
import GameSettingsPage_FantaCoins from './components/GameSettingsPage_FantaCoins';
import GameSettingsPage_Classification from './components/GameSettingsPage_Classification';
import GameSettingsPage_Leagues from './components/GameSettingsPage_Leagues';
import GameSettingsPage_RulesRespectfulness from './components/GameSettingsPage_RulesRespectfulness';
import UserSettingsPage from './components/UserSettingsPage';
import UserSettingsPage_Profile from './components/UserSettingsPage_Profile';


function App() {
  return (
    <Router>

      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/game/:gameId" element={<GameDashboard />} />
        <Route path="/game/:gameId/rules" element={<GameRulesPage />} />
        <Route path="/game/:gameId/players" element={<GamePlayersPage />} />
        <Route path="/game/:gameId/podium" element={<GamePodiumPage />} />
        <Route path="/game/:gameId/events" element={<GameEventsPage />} />
        <Route path="/game/:gameId/events/new" element={<GameEventsPage_New />} />
        <Route path="/game/:gameId/settings" element={<GameSettingsPage />} />
        <Route path="/game/:gameId/settings/general" element={<GameSettingsPage_General />} />
        <Route path="/game/:gameId/settings/rules" element={<GameSettingsPage_GameRules />} />
        <Route path="/game/:gameId/settings/fanta-coins" element={<GameSettingsPage_FantaCoins />} />
        <Route path="/game/:gameId/settings/classification" element={<GameSettingsPage_Classification />} />
        <Route path="/game/:gameId/settings/leagues" element={<GameSettingsPage_Leagues />} />
        <Route path="/game/:gameId/settings/rules-respectfulness" element={<GameSettingsPage_RulesRespectfulness />} />
        <Route path="/settings" element={<UserSettingsPage />} />
        <Route path="/settings/profile" element={<UserSettingsPage_Profile />} />
      </Routes>

    </Router>
  );
}


export default App;

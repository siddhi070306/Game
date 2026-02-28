import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { SettingsProvider } from './context/SettingsContext';
import TopActions from './components/TopActions';
import EntryPage from './pages/EntryPage';
import ScannerPage from './pages/ScannerPage';
import ChallengePage from './pages/ChallengePage';
import LeaderboardPage from './pages/LeaderboardPage';
import ProfilePage from './pages/ProfilePage';
import './App.css';

function App() {
  return (
    <SettingsProvider>
      <Router>
        <div className="App">
          <TopActions />
          <Routes>
            <Route path="/" element={<EntryPage />} />
            <Route path="/scan" element={<ScannerPage />} />
            <Route path="/challenge" element={<ChallengePage />} />
            <Route path="/leaderboard" element={<LeaderboardPage />} />
            <Route path="/profile" element={<ProfilePage />} />
          </Routes>
        </div>
      </Router>
    </SettingsProvider>
  );
}

export default App;

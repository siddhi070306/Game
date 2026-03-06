import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { SettingsProvider } from './context/SettingsContext';
import TopActions from './components/TopActions';
import EntryPage from './pages/EntryPage';
import ScannerPage from './pages/ScannerPage';
import ChallengePage from './pages/ChallengePage';
import LeaderboardPage from './pages/LeaderboardPage';
import ProfilePage from './pages/ProfilePage';
import SplashCursor from './components/SplashCursor';
import AdminDashboard from './pages/AdminDashboard';
import VaultAdmin from './pages/VaultAdmin';
import VaultPlayer from './pages/VaultPlayer';
import './App.css';

function App() {
  React.useEffect(() => {
    const existingPlayer = localStorage.getItem('player');
    if (!existingPlayer) {
      const guestName = `GUEST_${Math.floor(1000 + Math.random() * 9000)}`;
      localStorage.setItem('player', JSON.stringify({ username: guestName }));
      console.log(`Auto-generated profile: ${guestName}`);
    }
  }, []);

  return (
    <SettingsProvider>
      <Router>
        <div className="App">
          <SplashCursor
            SIM_RESOLUTION={128}
            DYE_RESOLUTION={1440}
            DENSITY_DISSIPATION={3.5}
            VELOCITY_DISSIPATION={2}
            PRESSURE={0.1}
            CURL={3}
            SPLAT_RADIUS={0.2}
            SPLAT_FORCE={6000}
            COLOR_UPDATE_SPEED={10}
          />
          <TopActions />
          <Routes>
            <Route path="/" element={<EntryPage />} />
            <Route path="/scan" element={<ScannerPage />} />
            <Route path="/challenge" element={<ChallengePage />} />
            <Route path="/leaderboard" element={<LeaderboardPage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/vault" element={<VaultAdmin />} />
            <Route path="/vault-player" element={<VaultPlayer />} />
          </Routes>
        </div>
      </Router>
    </SettingsProvider>
  );
}

export default App;

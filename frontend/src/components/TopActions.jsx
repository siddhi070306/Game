import React, { useState } from 'react';
import { Settings, HelpCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import SettingsModal from './SettingsModal';
import './TopActions.css';

const TopActions = () => {
    const navigate = useNavigate();
    const [isSettingsOpen, setIsSettingsOpen] = useState(false);

    return (
        <>
            <div className="top-actions-container">
                <div className="desktop-nav">
                    <button className="nav-link" onClick={() => navigate('/')}>Lobby</button>
                    <button className="nav-link" onClick={() => navigate('/leaderboard')}>Standings</button>
                </div>
                <div className="action-icons">
                    <button className="icon-btn-ghost" onClick={() => setIsSettingsOpen(true)}>
                        <Settings size={20} />
                    </button>
                    <button className="icon-btn-ghost">
                        <HelpCircle size={20} />
                    </button>
                </div>
            </div>

            <SettingsModal
                isOpen={isSettingsOpen}
                onClose={() => setIsSettingsOpen(false)}
            />
        </>
    );
};

export default TopActions;

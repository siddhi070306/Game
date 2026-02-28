import React from 'react';
import { Timer, Zap, User, ChevronRight, Home, Trophy, BarChart2, User as UserIcon } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import './EntryPage.css';

const EntryPage = () => {
    const navigate = useNavigate();
    const [username, setUsername] = React.useState('');

    const handleStart = () => {
        if (!username.trim()) return alert("IDENTIFY YOURSELF, HUNTER!");
        localStorage.setItem('player', JSON.stringify({ username: username.trim() }));
        navigate('/scan');
    };

    return (
        <div className="entry-container animate-fade">
            {/* Header */}
            <header className="entry-header">
                <div className="logo-section">
                    <Timer className="logo-icon" size={24} />
                    <span className="logo-text">PRESSURE</span>
                </div>
            </header>

            {/* Hero Section */}
            <main className="entry-content">
                <div className="hero-circle">
                    <div className="inner-circle">
                        <Zap className="hero-icon" size={48} />
                        <span className="hero-timer">60s</span>
                    </div>
                </div>

                <h1 className="main-title">
                    PRESSURE <br />
                    <span className="subtitle">COOKER</span>
                </h1>

                <p className="description">
                    The clock is ticking. Enter your name <br /> to join the hunt.
                </p>

                {/* Input Form */}
                <div className="input-group">
                    <label className="input-label">PLAYER NAME</label>
                    <div className="input-wrapper">
                        <User size={18} className="field-icon" />
                        <input
                            type="text"
                            placeholder="e.g. ShadowHunter"
                            className="player-input"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                        />
                    </div>
                </div>

                <button
                    className="btn-primary start-btn"
                    onClick={handleStart}
                >
                    START GAME <ChevronRight size={20} />
                </button>

                {/* Quick Stats */}
                <div className="quick-stats">
                    <div className="stat-item">
                        <span className="stat-value">1.2k</span>
                        <span className="stat-label">ACTIVE HUNTERS</span>
                    </div>
                    <div className="stat-divider"></div>
                    <div className="stat-item">
                        <span className="stat-value">48s</span>
                        <span className="stat-label">AVG. SURVIVE</span>
                    </div>
                </div>
            </main>

            {/* Bottom Nav */}
            <nav className="bottom-nav glass">
                <button className="nav-item active" onClick={() => navigate('/')}>
                    <Home size={22} />
                    <span>Home</span>
                </button>
                <button className="nav-item" onClick={() => navigate('/leaderboard')}>
                    <Trophy size={22} />
                    <span>Trophy</span>
                </button>
                <button className="nav-item">
                    <BarChart2 size={22} />
                    <span>Stats</span>
                </button>
                <button className="nav-item" onClick={() => navigate('/profile')}>
                    <UserIcon size={22} />
                    <span>Profile</span>
                </button>
            </nav>
        </div>
    );
};

export default EntryPage;

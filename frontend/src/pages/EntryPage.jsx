import React from 'react';
import { Timer, Zap, User, ChevronRight, Home, Trophy, BarChart2, User as UserIcon } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useSettings } from '../context/SettingsContext';
import { translations } from '../utils/translations';
import './EntryPage.css';

const EntryPage = () => {
    const navigate = useNavigate();
    const { language } = useSettings();
    const t = translations[language];
    const [username, setUsername] = React.useState('');

    React.useEffect(() => {
        const existingPlayer = localStorage.getItem('player');
        if (existingPlayer) {
            navigate('/scan');
        }
    }, [navigate]);

    const handleStart = () => {
        if (!username.trim()) return alert(t.identify_yourself);
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
                    {t.pressure_cooker.split(' ')[0]} <br />
                    <span className="subtitle">{t.pressure_cooker.split(' ')[1] || ''}</span>
                </h1>

                <p className="description">
                    {t.description}
                </p>

                {/* Input Form */}
                <div className="input-group">
                    <label className="input-label">{t.player_name}</label>
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
                    {t.start_game} <ChevronRight size={20} />
                </button>

                {/* Quick Stats */}
                <div className="quick-stats">
                    <div className="stat-item">
                        <span className="stat-value">1.2k</span>
                        <span className="stat-label">{t.active_hunters}</span>
                    </div>
                    <div className="stat-divider"></div>
                    <div className="stat-item">
                        <span className="stat-value">48s</span>
                        <span className="stat-label">{t.avg_survive}</span>
                    </div>
                </div>
            </main>

            {/* Bottom Nav */}
            <nav className="bottom-nav glass">
                <button className="nav-item active" onClick={() => navigate('/')}>
                    <Home size={22} />
                    <span>{t.home}</span>
                </button>
                <button className="nav-item" onClick={() => navigate('/leaderboard')}>
                    <Trophy size={22} />
                    <span>{t.trophy}</span>
                </button>
                <button className="nav-item">
                    <BarChart2 size={22} />
                    <span>{t.stats}</span>
                </button>
                <button className="nav-item" onClick={() => navigate('/profile')}>
                    <UserIcon size={22} />
                    <span>{t.profile}</span>
                </button>
            </nav>
        </div>
    );
};

export default EntryPage;

import React from 'react';
import { Timer, Zap, User, ChevronRight, Home, Trophy, BarChart2, User as UserIcon, Lock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useSettings } from '../context/SettingsContext';
import { translations } from '../utils/translations';
import API_BASE_URL from '../utils/api';
import './EntryPage.css';

const EntryPage = () => {
    const navigate = useNavigate();
    const { language } = useSettings();
    const t = translations[language];
    const [username, setUsername] = React.useState('');
    const [pin, setPin] = React.useState('');
    const [gameMode, setGameMode] = React.useState('1v1');
    const [errorMsg, setErrorMsg] = React.useState('');
    const [isSubmitting, setIsSubmitting] = React.useState(false);

    // Removed the auto-redirect to allow users to change names if they want
    React.useEffect(() => {
        const player = localStorage.getItem('player');
        if (player) {
            const parsed = JSON.parse(player);
            if (parsed.username) setUsername(parsed.username);
        }
    }, []);

    const handleStart = async () => {
        if (!username.trim() || !pin.trim()) return setErrorMsg('Username and PIN are required');
        if (pin.length !== 4) return setErrorMsg('PIN must be exactly 4 digits');

        setErrorMsg('');
        setIsSubmitting(true);

        try {
            const response = await fetch(`${API_BASE_URL}/api/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username: username.trim(), pin: pin.trim(), gameMode })
            });

            const data = await response.json();

            if (response.ok) {
                localStorage.setItem('player', JSON.stringify({
                    username: data.username,
                    userId: data.userId
                }));
                navigate('/scan');
            } else {
                setErrorMsg(data.message || 'Username taken or incorrect PIN.');
            }
        } catch (err) {
            console.error(err);
            setErrorMsg('Connection error. Is the server running?');
        } finally {
            setIsSubmitting(false);
        }
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

                {/* Game Mode Selection */}
                <div className="game-mode-section">
                    <label className="input-label" style={{ textAlign: 'center', display: 'block' }}>Select Mode</label>
                    <div className="mode-selector">
                        {['1v1', 'Solo', 'Squad'].map(mode => (
                            <button
                                key={mode}
                                className={`mode-btn ${gameMode === mode ? 'active' : ''}`}
                                onClick={() => setGameMode(mode)}
                            >
                                {mode}
                            </button>
                        ))}
                    </div>
                </div>

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

                <div className="input-group" style={{ marginTop: '15px' }}>
                    <label className="input-label">4-Digit Secret PIN</label>
                    <div className="input-wrapper">
                        <Lock size={18} className="field-icon" />
                        <input
                            type="password"
                            maxLength={4}
                            inputMode="numeric"
                            placeholder="****"
                            className="player-input"
                            value={pin}
                            onChange={(e) => setPin(e.target.value.replace(/\D/g, ''))}
                        />
                    </div>
                    <span style={{ fontSize: '0.65rem', color: '#94a3b8', display: 'block', marginTop: '5px', textAlign: 'center' }}>
                        * This PIN securely locks your hunt progress to you.
                    </span>
                </div>

                {errorMsg && (
                    <div className="error-message" style={{ color: '#ef4444', fontSize: '0.85rem', fontWeight: 'bold', margin: '15px 0 0', textAlign: 'center' }}>
                        {errorMsg}
                    </div>
                )}

                <button
                    className="btn-primary start-btn"
                    onClick={handleStart}
                    disabled={isSubmitting}
                    style={{ marginTop: errorMsg ? '10px' : '20px' }}
                >
                    {isSubmitting ? 'CONNECTING...' : t.start_game} <ChevronRight size={20} />
                </button>

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

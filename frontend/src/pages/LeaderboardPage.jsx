import React from 'react';
import { ChevronLeft, RotateCcw, Home, Trophy, BarChart2, User, Gamepad2, ShoppingBag } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { io } from 'socket.io-client';
import { useSettings } from '../context/SettingsContext';
import { translations } from '../utils/translations';
import API_BASE_URL from '../utils/api';
import './LeaderboardPage.css';

const LeaderboardPage = () => {
    const navigate = useNavigate();
    const { language } = useSettings();
    const t = translations[language];
    const [players, setPlayers] = React.useState([]);
    const [myUsername, setMyUsername] = React.useState('');

    const fetchLeaderboard = async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/api/leaderboard`);
            if (response.ok) {
                const data = await response.json();

                const formatted = data.map((p, index) => {
                    const score = p.score || 0;
                    return {
                        rank: index + 1,
                        name: p.username || 'Anonymous',
                        title: score > 50 ? t.grandmaster : score > 20 ? t.pro_rank : t.elite,
                        points: score.toString(),
                        isTop: index === 0,
                        isCurrent: p.username === myUsername
                    };
                });
                // If there were many more, we might filter or show a specific slice
                setPlayers(formatted);
            }
        } catch (err) {
            console.error("Leaderboard fetch error:", err);
        }
    };

    React.useEffect(() => {
        const playerStr = localStorage.getItem('player');
        if (playerStr) {
            const player = JSON.parse(playerStr);
            setMyUsername(player.username);
        }

        fetchLeaderboard();

        const socket = io(API_BASE_URL);
        socket.on('leaderboard_update', () => {
            console.log("Leaderboard update event received");
            fetchLeaderboard();
        });

        return () => socket.disconnect();
    }, [myUsername, language]);

    return (
        <div className="leaderboard-page animate-fade">
            {/* Header */}
            <header className="leaderboard-header">
                <button className="icon-btn" onClick={() => navigate(-1)}>
                    <ChevronLeft size={24} />
                </button>
                <h2 className="header-title">{t.live_standings}</h2>
                <button className="icon-btn" onClick={fetchLeaderboard}>
                    <RotateCcw size={20} color="#3b82f6" className="refresh-icon" />
                </button>
            </header>

            {/* Tabs */}
            <div className="tabs-container">
                <button className="tab-item active">Global</button>
                <button className="tab-item">Friends</button>
                <button className="tab-item">Local</button>
            </div>

            <div className="tab-underline">
                <div className="underline-indicator"></div>
            </div>

            {/* List */}
            <main className="leaderboard-content">
                <div className="player-list">
                    {players.map((player, index) => (
                        <div
                            key={player.rank}
                            className={`player-card animate-slide-up stagger-${(index % 5) + 1} ${player.isCurrent ? 'current' : ''} ${player.isTop ? 'first' : ''}`}
                            style={{ opacity: 0 }}
                        >
                            <div className="rank-section">
                                <span className={`rank-num ${player.isTop ? 'gold' : ''}`}>{player.rank}</span>
                            </div>

                            <div className="avatar-section">
                                <div className="avatar-placeholder">
                                    {player.name ? player.name.charAt(0) : '?'}
                                </div>
                            </div>

                            <div className="info-section">
                                <h4 className="player-name">{player.name || 'Anonymous'}</h4>
                                <span className="player-title">{player.title}</span>
                            </div>

                            <div className="points-section">
                                <span className="points-value">{player.points}</span>
                                <span className="points-label">{t.points}</span>
                            </div>
                        </div>
                    ))}
                </div>
            </main>

            {/* Bottom Nav */}
            <nav className="bottom-nav glass">
                <button className="nav-item" onClick={() => navigate('/')}>
                    <Home size={22} />
                    <span>{t.home}</span>
                </button>
                <button className="nav-item" onClick={() => navigate('/scan')}>
                    <Gamepad2 size={22} />
                    <span>{t.hunt}</span>
                </button>
                <button className="nav-item active">
                    <BarChart2 size={22} />
                    <span>{t.rankings}</span>
                </button>
                <button className="nav-item" onClick={() => navigate('/profile')}>
                    <User size={22} />
                    <span>{t.profile}</span>
                </button>
            </nav>
        </div>
    );
};

export default LeaderboardPage;

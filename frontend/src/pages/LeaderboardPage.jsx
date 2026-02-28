import React from 'react';
import { ChevronLeft, RotateCcw, Home, Trophy, BarChart2, User, Gamepad2, ShoppingBag } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { io } from 'socket.io-client';
import API_BASE_URL from '../utils/api';
import './LeaderboardPage.css';

const LeaderboardPage = () => {
    const navigate = useNavigate();
    const [players, setPlayers] = React.useState([]);
    const [myUsername, setMyUsername] = React.useState('');

    const fetchLeaderboard = async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/api/leaderboard`);
            if (response.ok) {
                const data = await response.json();

                // Map API data to UI structure
                const formatted = data.map((p, index) => ({
                    rank: index + 1,
                    name: p.username,
                    title: p.score > 50 ? "GRANDMASTER" : p.score > 20 ? "PRO RANK" : "ELITE",
                    points: p.score.toString(),
                    isTop: index === 0,
                    isCurrent: p.username === myUsername
                }));
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
    }, [myUsername]);

    return (
        <div className="leaderboard-page animate-fade">
            {/* Header */}
            <header className="leaderboard-header">
                <button className="icon-btn" onClick={() => navigate(-1)}>
                    <ChevronLeft size={24} />
                </button>
                <h2 className="header-title">Live Standings</h2>
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
                    {players.map((player) => (
                        <div
                            key={player.rank}
                            className={`player-card ${player.isCurrent ? 'current' : ''} ${player.isTop ? 'first' : ''}`}
                        >
                            <div className="rank-section">
                                <span className={`rank-num ${player.isTop ? 'gold' : ''}`}>{player.rank}</span>
                            </div>

                            <div className="avatar-section">
                                <div className="avatar-placeholder">
                                    {player.name.charAt(0)}
                                </div>
                            </div>

                            <div className="info-section">
                                <h4 className="player-name">{player.name}</h4>
                                <span className="player-title">{player.title}</span>
                            </div>

                            <div className="points-section">
                                <span className="points-value">{player.points}</span>
                                <span className="points-label">POINTS</span>
                            </div>
                        </div>
                    ))}
                </div>
            </main>

            {/* Bottom Nav */}
            <nav className="bottom-nav glass">
                <button className="nav-item" onClick={() => navigate('/')}>
                    <Home size={22} />
                    <span>Home</span>
                </button>
                <button className="nav-item" onClick={() => navigate('/scan')}>
                    <Gamepad2 size={22} />
                    <span>Hunt</span>
                </button>
                <button className="nav-item active">
                    <BarChart2 size={22} />
                    <span>Leaderboard</span>
                </button>
                <button className="nav-item">
                    <User size={22} />
                    <span>Profile</span>
                </button>
            </nav>
        </div>
    );
};

export default LeaderboardPage;

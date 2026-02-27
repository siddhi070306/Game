import React from 'react';
import { ChevronLeft, RotateCcw, Home, Trophy, BarChart2, User, Gamepad2, ShoppingBag } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import './LeaderboardPage.css';

const LeaderboardPage = () => {
    const navigate = useNavigate();

    const players = [
        { rank: 1, name: "Alex Storm", title: "GRANDMASTER", points: "12,450", isTop: true },
        { rank: 2, name: "Neon Knight", title: "PRO RANK", points: "11,820" },
        { rank: 3, name: "Sarah Blade", title: "PRO RANK", points: "11,105" },
        { rank: 42, name: "You (Current)", title: "CHALLENGER", points: "8,240", isCurrent: true },
        { rank: 4, name: "Pixel Master", title: "ELITE", points: "10,900" },
        { rank: 5, name: "Cyber Queen", title: "ELITE", points: "10,420" },
        { rank: 6, name: "Void Runner", title: "ELITE", points: "8,850" },
    ];

    return (
        <div className="leaderboard-page animate-fade">
            {/* Header */}
            <header className="leaderboard-header">
                <button className="icon-btn" onClick={() => navigate(-1)}>
                    <ChevronLeft size={24} />
                </button>
                <h2 className="header-title">Live Standings</h2>
                <button className="icon-btn">
                    <RotateCcw size={20} color="#3b82f6" />
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
                <button className="nav-item">
                    <Gamepad2 size={24} />
                    <span>Play</span>
                </button>
                <button className="nav-item active">
                    <BarChart2 size={24} />
                    <span>Leaderboard</span>
                </button>
                <button className="nav-item">
                    <User size={24} />
                    <span>Profile</span>
                </button>
                <button className="nav-item">
                    <ShoppingBag size={24} />
                    <span>Store</span>
                </button>
            </nav>
        </div>
    );
};

export default LeaderboardPage;

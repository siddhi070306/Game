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
    const [allPlayers, setAllPlayers] = React.useState([]);
    const [activeTab, setActiveTab] = React.useState('Solo');
    const [myUsername, setMyUsername] = React.useState('');

    const fetchLeaderboard = async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/api/leaderboard`);
            if (response.ok) {
                const data = await response.json();
                setAllPlayers(data);
            }
        } catch (err) {
            console.error("Leaderboard fetch error:", err);
        }
    };

    const players = React.useMemo(() => {
        const filtered = allPlayers.filter(p => (p.gameMode || 'Solo') === activeTab);

        const pairCounts = {};
        if (activeTab === '1v1') {
            filtered.forEach(p => {
                const key = p.activeQrId || (p.answeredQuestions && p.answeredQuestions.length > 0 ? p.answeredQuestions.join('-') : null);
                if (key) {
                    pairCounts[key] = (pairCounts[key] || 0) + 1;
                }
            });
        }

        const getColorForPair = (key, lightness = '60%') => {
            let hash = 0;
            for (let i = 0; i < key.length; i++) {
                hash = key.charCodeAt(i) + ((hash << 5) - hash);
            }
            return `hsl(${Math.abs(hash) % 360}, 100%, ${lightness})`;
        };

        return filtered.map((p, index) => {
            const score = p.score || 0;
            const key = p.activeQrId || (p.answeredQuestions && p.answeredQuestions.length > 0 ? p.answeredQuestions.join('-') : null);
            const isPaired = activeTab === '1v1' && key && pairCounts[key] >= 2;
            const pairColor = isPaired ? getColorForPair(key) : null;
            const pairGlow = isPaired ? getColorForPair(key, '20%') : null;

            return {
                rank: index + 1,
                name: p.username || 'Anonymous',
                title: score > 50 ? t.grandmaster : score > 20 ? t.pro_rank : t.elite,
                points: score.toString(),
                isTop: index === 0,
                isCurrent: p.username === myUsername,
                pairColor,
                pairGlow
            };
        });
    }, [allPlayers, activeTab, myUsername, t]);


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

            {/* Mode Tabs */}
            <div className="leaderboard-tabs" style={{ display: 'flex', gap: '8px', padding: '0 20px', marginBottom: '20px', marginTop: '10px' }}>
                {['1v1', 'Solo', 'Squad'].map(tab => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        style={{
                            flex: 1, padding: '10px', borderRadius: '8px', border: 'none',
                            background: activeTab === tab ? '#3b82f6' : 'rgba(255,255,255,0.05)',
                            color: activeTab === tab ? '#fff' : '#94a3b8',
                            fontWeight: 'bold', cursor: 'pointer', transition: 'all 0.3s',
                            fontSize: '0.9rem'
                        }}
                    >
                        {tab}
                    </button>
                ))}
            </div>


            {/* List */}
            <main className="leaderboard-content">
                <div className="player-list">
                    {players.map((player, index) => (
                        <div
                            key={player.rank}
                            className={`player-card animate-slide-up stagger-${(index % 5) + 1} ${player.isCurrent ? 'current' : ''} ${player.isTop ? 'first' : ''}`}
                            style={{
                                opacity: 0,
                                ...(player.pairColor ? { borderLeft: `4px solid ${player.pairColor}`, borderRight: `4px solid ${player.pairColor}`, backgroundColor: player.pairGlow } : {})
                            }}
                        >
                            <div className="rank-section">
                                <span className={`rank-num ${player.isTop ? 'gold' : ''}`}>{player.rank}</span>
                            </div>

                            <div className="avatar-section">
                                <div className="avatar-placeholder" style={player.pairColor ? { borderColor: player.pairColor, color: player.pairColor } : {}}>
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
                    {players.length === 0 && (
                        <div style={{ textAlign: 'center', padding: '2rem', color: '#94a3b8' }}>
                            No players found in {activeTab} mode.
                        </div>
                    )}
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

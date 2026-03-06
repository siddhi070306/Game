import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { io } from 'socket.io-client';
import { Users, AlertTriangle, ShieldAlert, Timer, ChevronRight } from 'lucide-react';
import API_BASE_URL from '../utils/api';
import './VaultAdmin.css';

const VaultAdmin = () => {
    const navigate = useNavigate();
    const [socket, setSocket] = useState(null);
    const [lobbyCode, setLobbyCode] = useState('');
    const [players, setPlayers] = useState([]);
    const [gameStatus, setGameStatus] = useState('waiting'); // waiting, playing, finished
    const [timeLeft, setTimeLeft] = useState(60);
    const [flashingColor, setFlashingColor] = useState(null);
    const [pattern, setPattern] = useState([]);
    const [targetIndex, setTargetIndex] = useState(0);
    const [stats, setStats] = useState([]);
    const [weakestLink, setWeakestLink] = useState('');

    useEffect(() => {
        const newSocket = io(API_BASE_URL, { transports: ['websocket', 'polling'] });
        setSocket(newSocket);

        newSocket.on('connect', () => {
            newSocket.emit('host_vault');
        });

        newSocket.on('vault_created', ({ lobbyCode }) => {
            setLobbyCode(lobbyCode);
        });

        newSocket.on('vault_player_joined', (updatedPlayers) => {
            setPlayers(updatedPlayers);
        });

        newSocket.on('vault_started', () => {
            setGameStatus('playing');
            setTimeLeft(60);
            setPattern([]);
            setTargetIndex(0);
        });

        newSocket.on('vault_flash', ({ color, pattern }) => {
            setFlashingColor(color);
            setPattern(pattern);
            setTimeout(() => setFlashingColor(null), 300);
        });

        newSocket.on('vault_tap_success', ({ color, currentIndex }) => {
            setTargetIndex(currentIndex);
            // Flash a small green success ring?
        });

        newSocket.on('vault_tap_mistake', ({ tapped, expectedColor }) => {
            // Flash the screen red to indicate a mistake
            const el = document.getElementById('vault-bg-overlay');
            if (el) {
                el.style.backgroundColor = 'rgba(255, 0, 0, 0.4)';
                setTimeout(() => el.style.backgroundColor = 'transparent', 200);
            }
        });

        newSocket.on('vault_tick', ({ timeLeft }) => {
            setTimeLeft(timeLeft);
        });

        newSocket.on('vault_game_over', ({ stats, weakestLink }) => {
            setGameStatus('finished');
            setStats(stats);
            setWeakestLink(weakestLink);
        });

        return () => newSocket.disconnect();
    }, []);

    const startGame = () => {
        if (socket && players.length >= 2) {
            socket.emit('start_vault', { lobbyCode });
        }
    };

    const colorMap = {
        'Red': '#ef4444',
        'Blue': '#3b82f6',
        'Green': '#22c55e',
        'Yellow': '#eab308'
    };

    return (
        <div className="vault-admin-container">
            <div id="vault-bg-overlay" className="vault-overlay"></div>

            {gameStatus === 'waiting' && (
                <div className="vault-waiting">
                    <ShieldAlert size={64} className="vault-icon pulse" />
                    <h1 className="vault-title">THE VAULT</h1>
                    <p className="vault-subtitle">Squad Mode Activation Required</p>

                    <div className="lobby-code-box">
                        <span className="code-label">JOIN CODE</span>
                        <div className="code-value">{lobbyCode || '----'}</div>
                    </div>

                    <div className="players-list">
                        {players.map(p => (
                            <div key={p.userId} className="player-badge" style={{ borderColor: colorMap[p.color], color: colorMap[p.color] }}>
                                {p.username}
                                <span className="color-indicator" style={{ backgroundColor: colorMap[p.color] }}></span>
                            </div>
                        ))}
                    </div>

                    <button
                        className={`start-vault-btn ${players.length >= 2 ? 'ready' : ''}`}
                        onClick={startGame}
                        disabled={players.length < 2}
                    >
                        {players.length < 2 ? 'Waiting for Squad (Min 2)...' : 'INITIATE VAULT DECRYPTION'}
                    </button>
                    <button className="back-btn" onClick={() => navigate('/admin')}>Exit to Admin</button>
                </div>
            )}

            {gameStatus === 'playing' && (
                <div className="vault-playing">
                    <div className="timer-header">
                        <Timer size={32} />
                        <span className="time-left">{timeLeft}s</span>
                    </div>

                    <div className="vault-core">
                        {/* 4 Color Quadrants that flash */}
                        <div className={`vault-quadrant red ${flashingColor === 'Red' ? 'flash' : ''}`}></div>
                        <div className={`vault-quadrant blue ${flashingColor === 'Blue' ? 'flash' : ''}`}></div>
                        <div className={`vault-quadrant green ${flashingColor === 'Green' ? 'flash' : ''}`}></div>
                        <div className={`vault-quadrant yellow ${flashingColor === 'Yellow' ? 'flash' : ''}`}></div>

                        <div className="vault-center-core">
                            <span className="sequence-progress">{targetIndex} / {pattern.length}</span>
                        </div>
                    </div>

                    <div className="incoming-sequence">
                        {pattern.slice(targetIndex, targetIndex + 5).map((col, idx) => (
                            <div key={idx} className="seq-dot" style={{ backgroundColor: colorMap[col] }}></div>
                        ))}
                        <div className="seq-dot hidden">...</div>
                    </div>
                </div>
            )}

            {gameStatus === 'finished' && (
                <div className="vault-finished">
                    <h2 className="game-over-title">DECRYPTION COMPLETE</h2>

                    <div className="stats-board">
                        <h3 className="stats-header">THE WEAKEST LINK: <span className="blame-name">{weakestLink}</span></h3>

                        <div className="stats-grid">
                            {stats.map((s, idx) => (
                                <div key={idx} className="stat-card" style={{ borderTop: `4px solid ${colorMap[s.color]}` }}>
                                    <h4 style={{ color: colorMap[s.color] }}>{s.username}</h4>
                                    <div className="mistakes-count">
                                        <span className="num">{s.mistakes}</span>
                                        <span className="label">Mistakes</span>
                                    </div>
                                    <div className="stat-comment">
                                        {s.mistakes === 0 ? 'Flawless Carrier' : s.mistakes > 5 ? 'Ruined the Game' : 'Did Okay'}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="finished-actions">
                        <button className="btn-primary" onClick={() => navigate('/leaderboard')}>View Leaderboard <ChevronRight /></button>
                        <button className="btn-secondary" onClick={() => setGameStatus('waiting')}>Play Again</button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default VaultAdmin;

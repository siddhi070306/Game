import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { io } from 'socket.io-client';
import { AlertCircle, ChevronLeft } from 'lucide-react';
import API_BASE_URL from '../utils/api';
import './VaultPlayer.css';

const VaultPlayer = () => {
    const navigate = useNavigate();
    const [socket, setSocket] = useState(null);
    const [status, setStatus] = useState('joining'); // joining, waiting, playing, finished
    const [lobbyCode, setLobbyCode] = useState('');
    const [color, setColor] = useState('');
    const [errorMsg, setErrorMsg] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [myMistakes, setMyMistakes] = useState(0);

    const colorMap = {
        'Red': { bg: '#ef4444', shadow: 'rgba(239, 68, 68, 0.6)' },
        'Blue': { bg: '#3b82f6', shadow: 'rgba(59, 130, 246, 0.6)' },
        'Green': { bg: '#22c55e', shadow: 'rgba(34, 197, 94, 0.6)' },
        'Yellow': { bg: '#eab308', shadow: 'rgba(234, 179, 8, 0.6)' }
    };

    useEffect(() => {
        const newSocket = io(API_BASE_URL, { transports: ['websocket', 'polling'] });
        setSocket(newSocket);

        newSocket.on('vault_joined', (data) => {
            setColor(data.color);
            setStatus('waiting');
            setErrorMsg('');
        });

        newSocket.on('vault_error', (data) => {
            setErrorMsg(data.message);
            setIsSubmitting(false);
        });

        newSocket.on('vault_started', () => {
            setStatus('playing');
            setMyMistakes(0);
        });

        newSocket.on('vault_tap_mistake', (data) => {
            // Flash red on phone if they tapped wrong or missed
            if (data.tapped === color) {
                navigator.vibrate?.(200); // give haptic feedback on mobile
                setMyMistakes(prev => prev + 1);
            }
        });

        newSocket.on('vault_game_over', () => {
            setStatus('finished');
        });

        return () => newSocket.disconnect();
    }, [color]);

    const handleJoin = () => {
        if (lobbyCode.length !== 4) return setErrorMsg('Code must be 4 digits');

        const player = localStorage.getItem('player');
        if (!player) return navigate('/');
        const { userId } = JSON.parse(player);

        setIsSubmitting(true);
        socket.emit('join_vault', { lobbyCode, userId });
    };

    const handleTap = () => {
        if (status !== 'playing' || !socket) return;

        // Haptic feedback for tap
        navigator.vibrate?.(50);

        const player = localStorage.getItem('player');
        if (!player) return;
        const { userId } = JSON.parse(player);

        socket.emit('vault_tap', { lobbyCode, color, userId });

        // Visual click effect
        const btn = document.getElementById('vault-main-btn');
        if (btn) {
            btn.classList.add('clicked');
            setTimeout(() => btn.classList.remove('clicked'), 100);
        }
    };

    return (
        <div className="vault-player-container">
            {status === 'joining' && (
                <div className="vault-join-screen animate-fade">
                    <button className="back-btn" onClick={() => navigate('/scan')}><ChevronLeft /> Back</button>
                    <h2>ENTER THE VAULT</h2>
                    <p className="desc">Enter the 4-digit code shown on the Laptop to join the Squad.</p>

                    <input
                        type="text"
                        maxLength={4}
                        inputMode="numeric"
                        placeholder="----"
                        value={lobbyCode}
                        onChange={(e) => setLobbyCode(e.target.value.replace(/\D/g, ''))}
                        className="lobby-input"
                    />

                    {errorMsg && <div className="error-msg"><AlertCircle size={16} /> {errorMsg}</div>}

                    <button
                        className="btn-primary join-btn"
                        onClick={handleJoin}
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? 'CONNECTING...' : 'CONNECT'}
                    </button>
                </div>
            )}

            {status === 'waiting' && (
                <div className="vault-wait-screen animate-fade">
                    <h3 className="color-label" style={{ color: colorMap[color]?.bg || '#fff' }}>YOU ARE {color}</h3>
                    <div className="pulse-circle" style={{ backgroundColor: colorMap[color]?.bg, boxShadow: `0 0 50px ${colorMap[color]?.shadow}` }}></div>
                    <p className="wait-text">Waiting for Vault to Initiate...</p>
                    <p className="instruction-text">When the game starts, tap your big button only when it's your turn in the sequence!</p>
                </div>
            )}

            {status === 'playing' && (
                <div className="vault-play-screen" style={{ backgroundColor: '#000' }}>
                    <div className="mistakes-tracker">Mistakes: <span style={{ color: '#ef4444' }}>{myMistakes}</span></div>

                    <button
                        id="vault-main-btn"
                        className="vault-main-btn"
                        style={{
                            backgroundColor: colorMap[color]?.bg || '#333',
                            boxShadow: `0 0 60px ${colorMap[color]?.shadow || '#000'}`
                        }}
                        onClick={handleTap}
                    ></button>
                </div>
            )}

            {status === 'finished' && (
                <div className="vault-finish-screen animate-fade">
                    <h2>DECRYPTION COMPLETE</h2>
                    <p>Check the Laptop screen for the Squad Stats!</p>
                    <p style={{ margin: '20px 0', fontSize: '1.2rem' }}>You made {myMistakes} mistakes.</p>
                    <button className="btn-primary" onClick={() => navigate('/leaderboard')}>View Leaderboard</button>
                </div>
            )}
        </div>
    );
};

export default VaultPlayer;

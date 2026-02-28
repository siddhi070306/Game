import React, { useEffect, useState } from 'react';
import { X, Delete, Home, Trophy, History, User } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import API_BASE_URL from '../utils/api';
import './ScannerPage.css';

const ScannerPage = () => {
    const navigate = useNavigate();
    const [code, setCode] = useState("");
    const [error, setError] = useState(false);

    // Session Check
    useEffect(() => {
        const player = localStorage.getItem('player');
        if (!player) navigate('/');
    }, [navigate]);

    // Mock Database for Testing
    const mockDatabase = {
        "412": "What does HTML stand for?",
        "789": "What is the capital of France?"
    };

    const validateCode = async (inputCode) => {
        const playerStr = localStorage.getItem('player');
        if (!playerStr) return navigate('/');
        const player = JSON.parse(playerStr);

        try {
            const response = await fetch(`${API_BASE_URL}/api/scan`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    username: player.username,
                    qrId: inputCode
                })
            });

            const data = await response.json();

            if (response.ok) {
                console.log('Success - Station Activated on Server');
                navigate('/challenge', {
                    state: {
                        question: data.questionText,
                        qrId: inputCode
                    }
                });
            } else {
                setError(true);
                alert(data.message || "Invalid Station Code");
                if (navigator.vibrate) navigator.vibrate(200);
                setTimeout(() => {
                    setError(false);
                    setCode("");
                }, 1000);
            }
        } catch (err) {
            console.error("Scan error:", err);
            alert("Connection error. Is the server running?");
            setError(true);
            setTimeout(() => {
                setError(false);
                setCode("");
            }, 2000);
        }
    };

    useEffect(() => {
        if (code.length === 3) {
            validateCode(code);
        }
    }, [code]);

    const handleNumpadClick = (num) => {
        if (code.length < 3 && !error) {
            setCode(prev => prev + num);
        }
    };

    const handleBackspace = () => {
        if (!error) {
            setCode(prev => prev.slice(0, -1));
        }
    };

    return (
        <div className={`scanner-page station-entry animate-fade ${error ? 'error-flash' : ''}`}>
            {/* Header */}
            <header className="scanner-header">
                <button className="icon-btn" onClick={() => navigate(-1)}>
                    <X size={24} />
                </button>
                <h2 className="header-text">Enter Station Code</h2>
                <div style={{ width: 40 }}></div>
            </header>

            {/* Code Placeholders */}
            <main className="scanner-body">
                <div className="code-placeholders">
                    {[0, 1, 2].map((idx) => (
                        <div key={idx} className={`code-circle ${code[idx] ? 'filled' : ''}`}>
                            {code[idx] || ""}
                        </div>
                    ))}
                </div>

                {error && <p className="error-message">INVALID CODE</p>}

                {/* Custom Numpad */}
                <div className="numpad-container">
                    <div className="numpad-grid">
                        {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
                            <button
                                key={num}
                                className="numpad-btn"
                                onClick={() => handleNumpadClick(num.toString())}
                            >
                                {num}
                            </button>
                        ))}
                        <div className="numpad-btn empty"></div>
                        <button
                            className="numpad-btn"
                            onClick={() => handleNumpadClick("0")}
                        >
                            0
                        </button>
                        <button
                            className="numpad-btn backspace"
                            onClick={handleBackspace}
                        >
                            <Delete size={28} />
                        </button>
                    </div>
                </div>
            </main>

            {/* Bottom Nav */}
            <nav className="bottom-nav glass">
                <button className="nav-item" onClick={() => navigate('/')}>
                    <Home size={22} />
                    <span>Lobby</span>
                </button>
                <button className="nav-item active">
                    <Trophy size={22} />
                    <span>Hunt</span>
                </button>
                <button className="nav-item" onClick={() => navigate('/leaderboard')}>
                    <History size={22} />
                    <span>Rankings</span>
                </button>
                <button className="nav-item" onClick={() => navigate('/profile')}>
                    <User size={22} />
                    <span>Profile</span>
                </button>
            </nav>
        </div>
    );
};

export default ScannerPage;

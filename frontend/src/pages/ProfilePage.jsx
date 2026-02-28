import React, { useEffect, useState } from 'react';
import { ChevronLeft, User, Trophy, Clock, CheckCircle, Home, BarChart2, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useSettings } from '../context/SettingsContext';
import { translations } from '../utils/translations';
import API_BASE_URL from '../utils/api';
import './ProfilePage.css';

const ProfilePage = () => {
    const navigate = useNavigate();
    const { language } = useSettings();
    const t = translations[language];
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProfile = async () => {
            const playerStr = localStorage.getItem('player') || JSON.stringify({ username: "Anonymous" });
            const player = JSON.parse(playerStr);

            try {
                const response = await fetch(`${API_BASE_URL}/api/user/${player.username}`);
                if (response.ok) {
                    const data = await response.json();
                    setUserData(data);
                }
            } catch (err) {
                console.error("Profile fetch error:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchProfile();
    }, [navigate]);

    const handleLogout = () => {
        if (window.confirm("ARE YOU SURE YOU WANT TO SIGN OUT, OPERATOR?")) {
            localStorage.removeItem('player');
            navigate('/');
        }
    };

    const handleBack = () => {
        if (window.history.length > 1) {
            navigate(-1);
        } else {
            navigate('/');
        }
    };

    const [expandedStation, setExpandedStation] = useState(null);

    const toggleStation = (id) => {
        if (expandedStation === id) setExpandedStation(null);
        else setExpandedStation(id);
    };

    if (loading) return (
        <div className="profile-page loading">
            <div className="loader"></div>
            <p>ACCESSING PROFILE...</p>
        </div>
    );

    if (!userData && !loading) return (
        <div className="profile-page animate-fade">
            <header className="profile-header">
                <button className="icon-btn-ghost" onClick={handleBack}>
                    <ChevronLeft size={24} />
                </button>
                <h2 className="header-title">{t.operator_profile}</h2>
                <div style={{ width: 40 }} />
            </header>
            <main className="profile-content">
                <div className="profile-hero">
                    <div className="profile-avatar"><User size={48} /></div>
                    <h1 className="profile-name">NEW OPERATOR</h1>
                    <span className="profile-rank">Scan a station to begin tracking</span>
                </div>
            </main>
        </div>
    );

    return (
        <div className="profile-page animate-fade">
            <header className="profile-header">
                <button className="icon-btn-ghost" onClick={handleBack}>
                    <ChevronLeft size={24} />
                </button>
                <h2 className="header-title">{t.operator_profile}</h2>
                <div style={{ width: 40 }} />
            </header>

            <main className="profile-content">
                <div className="profile-hero">
                    <div className="profile-avatar">
                        <User size={48} />
                    </div>
                    <h1 className="profile-name">{userData.username}</h1>
                    <span className="profile-rank">{t.active_operator}</span>
                </div>

                <div className="stats-grid">
                    <div className="profile-stat-card glint-container">
                        <Trophy className="stat-icon blue" size={24} />
                        <div className="stat-info">
                            <span className="stat-label">{t.total_score}</span>
                            <span className="stat-value">{userData.score} XP</span>
                        </div>
                    </div>

                    <div className="profile-stat-card glint-container">
                        <Clock className="stat-icon orange" size={24} />
                        <div className="stat-info">
                            <span className="stat-label">{t.total_time}</span>
                            <span className="stat-value">{Math.round(userData.totalActiveTime)}s</span>
                        </div>
                    </div>
                </div>

                <div className="achievements-section">
                    <h3 className="section-title">{t.stations_summary}</h3>
                    <div className="achievements-list">
                        {(userData.submissionHistory && userData.submissionHistory.length > 0) ? (
                            userData.submissionHistory.map((sub, index) => (
                                <div
                                    key={index}
                                    className={`achievement-wrapper ${expandedStation === sub.qrId ? 'active' : ''}`}
                                    onClick={() => toggleStation(sub.qrId)}
                                >
                                    <div
                                        className={`achievement-item animate-slide-up stagger-${(index % 5) + 1}`}
                                        style={{ opacity: 1, borderLeft: sub.isCorrect ? '4px solid #10b981' : '4px solid #ef4444' }}
                                    >
                                        <div className="station-main-info">
                                            <CheckCircle size={18} className={sub.isCorrect ? "check-icon" : "wrong-icon"} />
                                            <span>STATION: {sub.qrId}</span>
                                        </div>
                                        <div className="status-badge" style={{ color: sub.isCorrect ? '#10b981' : '#ef4444' }}>
                                            {sub.isCorrect ? 'PASSED' : 'FAILED'}
                                        </div>
                                    </div>

                                    {expandedStation === sub.qrId && (
                                        <div className="station-details animate-expand">
                                            <div className="detail-row">
                                                <span className="detail-label">YOUR ANSWER:</span>
                                                <span className="detail-value">{sub.userAnswer || "N/A"}</span>
                                            </div>
                                            <div className="detail-row">
                                                <span className="detail-label">CORRECT:</span>
                                                <span className="detail-value highlight">{sub.correctAnswer}</span>
                                            </div>
                                            <div className="detail-row">
                                                <span className="detail-label">TIME:</span>
                                                <span className="detail-value">{Math.round(sub.timeTaken)}s</span>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ))
                        ) : (
                            <p className="no-data">No data recorded yet. Get hunting!</p>
                        )}
                    </div>
                </div>

                <button className="logout-btn" onClick={handleLogout}>
                    <LogOut size={18} />
                    <span>{t.sign_out}</span>
                </button>
            </main>

            {/* Bottom Nav */}
            <nav className="bottom-nav glass">
                <button className="nav-item" onClick={() => navigate('/')}>
                    <Home size={22} />
                    <span>{t.home}</span>
                </button>
                <button className="nav-item" onClick={() => navigate('/scan')}>
                    <Trophy size={22} />
                    <span>{t.hunt}</span>
                </button>
                <button className="nav-item" onClick={() => navigate('/leaderboard')}>
                    <BarChart2 size={22} />
                    <span>{t.rankings}</span>
                </button>
                <button className="nav-item active">
                    <User size={22} />
                    <span>{t.profile}</span>
                </button>
            </nav>
        </div>
    );
};

export default ProfilePage;

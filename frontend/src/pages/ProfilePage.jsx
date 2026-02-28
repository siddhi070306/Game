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
            const playerStr = localStorage.getItem('player');
            if (!playerStr) return navigate('/');
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

    if (loading) return (
        <div className="profile-page loading">
            <div className="loader"></div>
            <p>ACCESSING PROFILE...</p>
        </div>
    );

    if (!userData) return (
        <div className="profile-page error">
            <p>USER NOT FOUND</p>
            <button className="btn-primary" onClick={() => navigate('/')}>RETURN TO LOBBY</button>
        </div>
    );

    return (
        <div className="profile-page animate-fade">
            <header className="profile-header">
                <button className="icon-btn-ghost" onClick={() => navigate(-1)}>
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
                    <h3 className="section-title">{t.stations_cleared}</h3>
                    <div className="achievements-list">
                        {userData.answeredQuestions.length > 0 ? (
                            userData.answeredQuestions.map((qId, index) => (
                                <div
                                    key={index}
                                    className={`achievement-item animate-slide-up stagger-${(index % 5) + 1}`}
                                    style={{ opacity: 0 }}
                                >
                                    <CheckCircle size={18} className="check-icon" />
                                    <span>{t.station} ID: {qId}</span>
                                </div>
                            ))
                        ) : (
                            <p className="no-data">No stations cleared yet. Get hunting!</p>
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

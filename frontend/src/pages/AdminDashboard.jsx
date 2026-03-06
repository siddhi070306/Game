import React, { useEffect, useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Home, RefreshCw, CheckCircle, XCircle, Clock, Lightbulb, Zap } from 'lucide-react';
import API_BASE_URL from '../utils/api';
import './AdminDashboard.css';

const AdminDashboard = () => {
    const navigate = useNavigate();
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [expandedUserId, setExpandedUserId] = useState(null);
    const [activeTab, setActiveTab] = useState('1v1');

    const fetchUsers = async () => {
        setLoading(true);
        setError('');
        try {
            const response = await fetch(`${API_BASE_URL}/api/admin/users`);
            if (!response.ok) {
                throw new Error('Failed to fetch data');
            }
            const data = await response.json();
            setUsers(data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const toggleExpand = (userId) => {
        if (expandedUserId === userId) {
            setExpandedUserId(null);
        } else {
            setExpandedUserId(userId);
        }
    };

    const active1v1Matches = useMemo(() => {
        const activeUsers = users.filter(u => u.activeQrId && u.gameMode === '1v1');
        const groups = {};
        activeUsers.forEach(u => {
            if (!groups[u.activeQrId]) groups[u.activeQrId] = [];
            groups[u.activeQrId].push(u);
        });
        // Filtering for exactly 2 users at the same station indicating a 1v1
        return Object.entries(groups).filter(([qrId, splitUsers]) => splitUsers.length === 2);
    }, [users]);

    const filteredUsers = useMemo(() => {
        return users.filter(user => (user.gameMode || 'Solo') === activeTab);
    }, [users, activeTab]);

    const handleSabotage = async (userId, username, isCurrentlySabotaged) => {
        const actionText = isCurrentlySabotaged ? 'unsabotage' : 'sabotage';
        if (!window.confirm(`Are you sure you want to ${actionText} ${username}?`)) return;

        try {
            const response = await fetch(`${API_BASE_URL}/api/admin/sabotage`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId })
            });

            if (!response.ok) {
                const errData = await response.json();
                throw new Error(errData.message || 'Failed to sabotage player');
            }

            alert(`${username} was successfully sabotaged!`);
            fetchUsers(); // Refresh the data to reflect changes
        } catch (err) {
            alert('Error: ' + err.message);
        }
    };

    return (
        <div className="admin-dashboard animate-fade">
            <header className="admin-header">
                <button className="icon-btn" onClick={() => navigate('/')}>
                    <Home size={24} />
                </button>
                <h2>Admin Dashboard</h2>
                <button className={`icon-btn ${loading ? 'spin' : ''}`} onClick={fetchUsers}>
                    <RefreshCw size={24} />
                </button>
            </header>

            <main className="admin-content">
                {error && <div className="error-message">{error}</div>}

                {loading ? (
                    <div className="loading-state">Loading users...</div>
                ) : (
                    <>
                        <div className="admin-tabs" style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
                            {['1v1', 'Solo', 'Squad'].map(tab => (
                                <button
                                    key={tab}
                                    onClick={() => setActiveTab(tab)}
                                    style={{
                                        flex: 1, padding: '12px', borderRadius: '8px', border: 'none',
                                        background: activeTab === tab ? '#3b82f6' : 'rgba(255,255,255,0.05)',
                                        color: activeTab === tab ? '#fff' : '#94a3b8',
                                        fontWeight: 'bold', cursor: 'pointer', transition: 'all 0.3s'
                                    }}
                                >
                                    {tab} Mode
                                </button>
                            ))}
                        </div>

                        {activeTab === 'Squad' && (
                            <div style={{ marginBottom: '20px', textAlign: 'center' }}>
                                <button
                                    onClick={() => navigate('/vault')}
                                    style={{
                                        backgroundColor: '#ef4444', color: 'white', border: 'none',
                                        padding: '15px 30px', borderRadius: '8px', fontWeight: 'bold',
                                        fontSize: '1.2rem', cursor: 'pointer', boxShadow: '0 0 15px rgba(239, 68, 68, 0.5)'
                                    }}
                                >
                                    <Zap size={20} style={{ marginRight: '8px', verticalAlign: 'middle' }} />
                                    Launch The Vault Mode
                                </button>
                            </div>
                        )}

                        {activeTab === '1v1' && active1v1Matches.length > 0 && (
                            <div className="live-matches-section">
                                <h3 className="section-title" style={{ marginBottom: '1rem', color: '#fbbf24', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                    <Zap size={20} /> Live 1v1 Matches
                                </h3>
                                <div className="matches-grid" style={{ display: 'grid', gap: '1rem', marginBottom: '2rem' }}>
                                    {active1v1Matches.map(([qrId, matchUsers]) => (
                                        <div key={qrId} className="match-card glass" style={{ padding: '1rem', borderLeft: '4px solid #ef4444' }}>
                                            <h4 style={{ marginBottom: '1rem', color: '#94a3b8' }}>Station ID: <span style={{ color: '#fff' }}>{qrId}</span></h4>
                                            <div className="match-players" style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                                                {matchUsers.map(user => (
                                                    <div key={user._id} className="match-player" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: 'rgba(255,255,255,0.05)', padding: '0.75rem', borderRadius: '8px' }}>
                                                        <span className="player-name" style={{ fontWeight: '600' }}>
                                                            {user.username} <span style={{ color: '#10b981', fontSize: '0.9rem', marginLeft: '0.5rem' }}>(Score: {user.score})</span>
                                                        </span>
                                                        <button
                                                            className="sabotage-btn"
                                                            style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', padding: '0.4rem 0.8rem', backgroundColor: user.isSabotaged ? '#10b981' : '#ef4444', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}
                                                            onClick={() => handleSabotage(user._id, user.username, user.isSabotaged)}
                                                            title={user.isSabotaged ? "Unsabotage this player (resume)" : "Sabotage this player (pause)"}
                                                        >
                                                            <Zap size={16} /> {user.isSabotaged ? 'Unsabotage' : 'Sabotage'}
                                                        </button>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                        <div className="users-list">
                            <h3 className="section-title" style={{ marginBottom: '1rem' }}>All {activeTab} Users</h3>
                            {filteredUsers.map((user, index) => (
                                <div key={user._id} className="user-card glass">
                                    <div className="user-card-header" onClick={() => toggleExpand(user._id)}>
                                        <div className="user-info">
                                            <h3>
                                                #{index + 1} {user.username}
                                                {user.gameMode && (
                                                    <span style={{ fontSize: '0.7rem', padding: '2px 6px', borderRadius: '4px', background: 'rgba(255,255,255,0.1)', marginLeft: '10px', verticalAlign: 'middle' }}>
                                                        {user.gameMode}
                                                    </span>
                                                )}
                                            </h3>
                                            <div className="user-stats">
                                                <span className="score">Score: {user.score}</span>
                                                <span className="time">Time: {user.totalActiveTime.toFixed(1)}s</span>
                                            </div>
                                        </div>
                                        <div className="expand-indicator">
                                            {expandedUserId === user._id ? '▲' : '▼'}
                                        </div>
                                    </div>

                                    {expandedUserId === user._id && (
                                        <div className="user-submissions">
                                            <h4>Submission History</h4>
                                            {user.submissionHistory && user.submissionHistory.length > 0 ? (
                                                <ul className="submission-list">
                                                    {user.submissionHistory.map((sub, i) => (
                                                        <li key={i} className={`submission-item ${sub.isCorrect ? 'correct' : 'wrong'}`}>
                                                            <div className="sub-header">
                                                                <span className="qr-id">
                                                                    Station: {sub.qrId}
                                                                    {sub.usedHint && <Lightbulb size={12} color="#f59e0b" style={{ marginLeft: '6px', verticalAlign: 'middle' }} />}
                                                                </span>
                                                                <span className="sub-time">
                                                                    <Clock size={12} /> {sub.timeTaken.toFixed(1)}s
                                                                </span>
                                                            </div>
                                                            <div className="sub-answers">
                                                                <div className="user-ans">
                                                                    <strong style={sub.userAnswer && sub.userAnswer.includes("ANTI-CHEAT") ? { color: '#ef4444' } : {}}>Ans:</strong>
                                                                    <span style={sub.userAnswer && sub.userAnswer.includes("ANTI-CHEAT") ? { color: '#ef4444', fontWeight: 'bold', marginLeft: '4px' } : { marginLeft: '4px' }}>
                                                                        {sub.userAnswer}
                                                                    </span>
                                                                </div>
                                                                {!sub.isCorrect && (
                                                                    <div className="correct-ans">
                                                                        <strong>Correct:</strong> {sub.correctAnswer}
                                                                    </div>
                                                                )}
                                                                <div style={{ fontSize: '0.75rem', color: '#94a3b8', marginTop: '4px' }}>
                                                                    {sub.submittedAt ? new Date(sub.submittedAt).toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', second: 'numeric', hour12: true, month: 'short', day: 'numeric' }) : "N/A"}
                                                                </div>
                                                            </div>
                                                            <div className="sub-status">
                                                                {sub.isCorrect ? <CheckCircle size={16} /> : <XCircle size={16} />}
                                                            </div>
                                                        </li>
                                                    ))}
                                                </ul>
                                            ) : (
                                                <p className="no-submissions">No submissions yet.</p>
                                            )}
                                        </div>
                                    )}
                                </div>
                            ))}
                            {filteredUsers.length === 0 && <p className="no-users">No users found in {activeTab} mode.</p>}
                        </div>
                    </>
                )}
            </main>
        </div>
    );
};

export default AdminDashboard;

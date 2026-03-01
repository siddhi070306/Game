import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Home, RefreshCw, CheckCircle, XCircle, Clock, Lightbulb } from 'lucide-react';
import API_BASE_URL from '../utils/api';
import './AdminDashboard.css';

const AdminDashboard = () => {
    const navigate = useNavigate();
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [expandedUserId, setExpandedUserId] = useState(null);

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
                    <div className="users-list">
                        {users.map((user, index) => (
                            <div key={user._id} className="user-card glass">
                                <div className="user-card-header" onClick={() => toggleExpand(user._id)}>
                                    <div className="user-info">
                                        <h3>#{index + 1} {user.username}</h3>
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
                        {users.length === 0 && <p className="no-users">No users found.</p>}
                    </div>
                )}
            </main>
        </div>
    );
};

export default AdminDashboard;

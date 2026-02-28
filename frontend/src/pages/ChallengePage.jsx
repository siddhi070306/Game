import React from 'react';
import { X, ChevronRight } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import API_BASE_URL from '../utils/api';
import './ChallengePage.css';

const ChallengePage = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { question, qrId } = location.state || { question: "No question loaded.", qrId: "" };

    const [timeLeft, setTimeLeft] = React.useState(60);
    const [answer, setAnswer] = React.useState('');
    const [isSubmitting, setIsSubmitting] = React.useState(false);

    React.useEffect(() => {
        if (!qrId) navigate('/scan');

        const timer = setInterval(() => {
            setTimeLeft((prev) => {
                if (prev <= 1) {
                    clearInterval(timer);
                    handleSubmit(true);
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(timer);
    }, [qrId, navigate]);

    const handleSubmit = async (isTimeout = false) => {
        if (isSubmitting) return;
        setIsSubmitting(true);

        const playerStr = localStorage.getItem('player');
        if (!playerStr) return navigate('/');
        const player = JSON.parse(playerStr);

        try {
            const response = await fetch(`${API_BASE_URL}/api/submit`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    username: player.username,
                    qrId,
                    answer: isTimeout ? "" : answer
                })
            });

            if (response.ok) {
                navigate('/scan');
            } else {
                const data = await response.json();
                alert(data.message || "Submission failed");
                navigate('/scan');
            }
        } catch (error) {
            console.error("Submit error:", error);
            navigate('/scan');
        }
    };

    return (
        <div className="challenge-page animate-fade">
            {/* Header */}
            <header className="challenge-header">
                <button className="icon-btn" onClick={() => navigate(-1)}>
                    <X size={24} />
                </button>
                <div className="phase-info">
                    <span className="phase-subtitle">STATION: {qrId}</span>
                    <h3 className="question-count">PRESSURE COOKER</h3>
                </div>
                <div style={{ width: 40 }} />
            </header>

            {/* Main Content */}
            <main className="challenge-body">
                {/* Circular Timer */}
                <div className={`timer-container ${timeLeft < 15 ? 'pulse-primary' : ''}`}>
                    <div className="timer-ring">
                        <svg viewBox="0 0 100 100">
                            <circle className="bg" cx="50" cy="50" r="45" />
                            <circle
                                className="progress"
                                cx="50" cy="50" r="45"
                                style={{ strokeDashoffset: `${283 * (1 - timeLeft / 60)}` }}
                            />
                        </svg>
                        <div className="time-display">
                            <span className="time-value">{timeLeft}</span>
                            <span className="time-unit">SECONDS</span>
                        </div>
                    </div>
                </div>

                {/* Question Section */}
                <div className="question-section">
                    <p className="current-challenge-label">CURRENT CHALLENGE</p>
                    <h1 className="question-text">
                        {question}
                    </h1>
                </div>

                {/* Answer Input */}
                <div className="input-section">
                    <label className="input-label">Your Answer</label>
                    <div className="answer-box">
                        <textarea
                            placeholder="Type quickly..."
                            className="answer-textarea"
                            value={answer}
                            onChange={(e) => setAnswer(e.target.value)}
                            disabled={isSubmitting}
                        />
                    </div>
                </div>

                {/* Bottom Button */}
                <div className="action-footer">
                    <button
                        className="submit-btn"
                        onClick={() => handleSubmit()}
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? 'LOCKING IN...' : 'SUBMIT ANSWER'} <ChevronRight size={20} />
                    </button>
                </div>
            </main>
        </div>
    );
};

export default ChallengePage;

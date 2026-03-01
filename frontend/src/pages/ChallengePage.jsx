import React from 'react';
import { X, ChevronRight, Lightbulb } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import API_BASE_URL from '../utils/api';
import { useSettings } from '../context/SettingsContext';
import { translations } from '../utils/translations';
import './ChallengePage.css';

const ChallengePage = () => {
    const navigate = useNavigate();
    const { language } = useSettings();
    const t = translations[language];
    const location = useLocation();
    const { question, qrId, startTime, options } = location.state || { question: "No question loaded.", qrId: "", startTime: null, options: [] };

    const [timeLeft, setTimeLeft] = React.useState(null);
    const [answer, setAnswer] = React.useState('');
    const [isSubmitting, setIsSubmitting] = React.useState(false);
    const [hint, setHint] = React.useState(null);
    const [isRequestingHint, setIsRequestingHint] = React.useState(false);
    const isConfirmingRef = React.useRef(false);

    const handleGetHint = async () => {
        if (hint || isRequestingHint) return;

        isConfirmingRef.current = true;
        const confirmHint = window.confirm("Use a hint? This will cost you 5 points!");
        setTimeout(() => { isConfirmingRef.current = false; }, 300);

        if (!confirmHint) return;

        setIsRequestingHint(true);
        const playerStr = localStorage.getItem('player') || JSON.stringify({ username: "Anonymous" });
        const player = JSON.parse(playerStr);

        try {
            const response = await fetch(`${API_BASE_URL}/api/hint`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId: player.userId, qrId })
            });
            const data = await response.json();
            if (response.ok) {
                setHint(data.hint);
            } else {
                alert(data.message || "Failed to get hint");
            }
        } catch (error) {
            console.error("Hint error:", error);
        } finally {
            setIsRequestingHint(false);
        }
    };

    React.useEffect(() => {
        if (!qrId) return navigate('/scan');

        // Initial Calculation
        if (startTime) {
            const serverStart = new Date(startTime).getTime();
            const elapsed = (Date.now() - serverStart) / 1000;
            const remaining = Math.max(0, Math.floor(60 - elapsed));
            setTimeLeft(remaining);

            if (remaining <= 0) {
                handleSubmit(true);
            }
        } else {
            // Fallback for unexpected missing startTime
            setTimeLeft(60);
        }

        const timer = setInterval(() => {
            setTimeLeft((prev) => {
                if (prev === null) return null;
                if (prev <= 1) {
                    clearInterval(timer);
                    handleSubmit(true);
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(timer);
    }, [qrId, navigate, startTime]);

    const answerRef = React.useRef(answer);
    const isSubmittingRef = React.useRef(isSubmitting);

    React.useEffect(() => {
        answerRef.current = answer;
        isSubmittingRef.current = isSubmitting;
    }, [answer, isSubmitting]);

    const handleSubmit = async (isTimeout = false, forcedAnswer = null, isCheat = false) => {
        if (isSubmittingRef.current) return;
        setIsSubmitting(true);
        isSubmittingRef.current = true;

        const playerStr = localStorage.getItem('player') || JSON.stringify({ username: "Anonymous" });
        const player = JSON.parse(playerStr);

        let finalAnswer = answerRef.current;
        if (isTimeout) finalAnswer = "TIMEOUT";
        else if (isCheat) finalAnswer = "ANTI-CHEAT: TAB SWITCHED";
        else if (forcedAnswer !== null) finalAnswer = forcedAnswer;

        try {
            const response = await fetch(`${API_BASE_URL}/api/submit`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    userId: player.userId,
                    qrId,
                    answer: finalAnswer
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

    React.useEffect(() => {
        const handleAntiCheat = () => {
            // If already submitting or time is out, or confirming hint, do nothing
            if (isSubmittingRef.current || isConfirmingRef.current) return;

            // Auto submit their current typed answer
            alert("ANTI-CHEAT TRIGGERED: You left the app or switched tabs. Your challenge has been failed.");
            handleSubmit(false, null, true);
        };

        const handleVisibilityChange = () => {
            if (document.hidden) handleAntiCheat();
        };

        document.addEventListener('visibilitychange', handleVisibilityChange);
        window.addEventListener('blur', handleAntiCheat);

        return () => {
            document.removeEventListener('visibilitychange', handleVisibilityChange);
            window.removeEventListener('blur', handleAntiCheat);
        };
    }, []);

    return (
        <div className="challenge-page animate-fade">
            {/* Header */}
            <header className="challenge-header">
                <button className="icon-btn" onClick={() => navigate(-1)}>
                    <X size={24} />
                </button>
                <div className="phase-info">
                    <span className="phase-subtitle">{t.station}: {qrId}</span>
                    <h3 className="question-count">{t.pressure_cooker}</h3>
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
                            <span className="time-unit">{t.seconds}</span>
                        </div>
                    </div>
                </div>

                {/* Question Section */}
                <div className="question-section">
                    <p className="current-challenge-label">{t.current_challenge}</p>
                    <h1 className="question-text">
                        {question}
                    </h1>
                </div>

                {/* Answer Input */}
                <div className="input-section">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '12px' }}>
                        <label className="input-label" style={{ marginBottom: 0 }}>{t.your_answer}</label>
                        {!hint && (
                            <button className="hint-btn" onClick={handleGetHint} disabled={isRequestingHint}>
                                <Lightbulb size={14} /> {isRequestingHint ? '...' : 'Hint (-5 pts)'}
                            </button>
                        )}
                    </div>

                    {hint && (
                        <div className="hint-display">
                            <Lightbulb size={16} /> <span><strong>Hint:</strong> {hint}</span>
                        </div>
                    )}

                    {options && options.length > 0 ? (
                        <div className="options-grid">
                            {options.map((opt, idx) => (
                                <button
                                    key={idx}
                                    className={`option-btn ${answer === opt ? 'selected' : ''}`}
                                    onClick={() => setAnswer(opt)}
                                    disabled={isSubmitting}
                                >
                                    {opt}
                                </button>
                            ))}
                        </div>
                    ) : (
                        <div className="answer-box">
                            <textarea
                                placeholder="Type quickly..."
                                className="answer-textarea"
                                value={answer}
                                onChange={(e) => setAnswer(e.target.value)}
                                disabled={isSubmitting}
                            />
                        </div>
                    )}
                </div>

                {/* Bottom Button */}
                <div className="action-footer">
                    <button
                        className="submit-btn"
                        onClick={() => handleSubmit()}
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? t.locking_in : t.submit_answer} <ChevronRight size={20} />
                    </button>
                </div>
            </main>
        </div>
    );
};

export default ChallengePage;

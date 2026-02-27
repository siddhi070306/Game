import React from 'react';
import { X, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import './ChallengePage.css';

const ChallengePage = () => {
    const navigate = useNavigate();

    return (
        <div className="challenge-page animate-fade">
            {/* Header */}
            <header className="challenge-header">
                <button className="icon-btn" onClick={() => navigate(-1)}>
                    <X size={24} />
                </button>
                <div className="phase-info">
                    <span className="phase-subtitle">PHASE 2: SPEED ROUND</span>
                    <h3 className="question-count">Question 01/10</h3>
                </div>
                <div style={{ width: 40 }} /> {/* Spacer to keep title centered */}
            </header>

            {/* Main Content */}
            <main className="challenge-body">
                {/* Circular Timer */}
                <div className="timer-container">
                    <div className="timer-ring">
                        <svg viewBox="0 0 100 100">
                            <circle className="bg" cx="50" cy="50" r="45" />
                            <circle className="progress" cx="50" cy="50" r="45" />
                        </svg>
                        <div className="time-display">
                            <span className="time-value">60</span>
                            <span className="time-unit">SECONDS</span>
                        </div>
                    </div>
                </div>

                {/* Question Section */}
                <div className="question-section">
                    <p className="current-challenge-label">CURRENT CHALLENGE</p>
                    <h1 className="question-text">
                        What is the capital of <br /> France?
                    </h1>
                </div>

                {/* Answer Input */}
                <div className="input-section">
                    <label className="input-label">Your Answer</label>
                    <div className="answer-box">
                        <textarea
                            placeholder="Type quickly..."
                            className="answer-textarea"
                        />
                    </div>
                </div>

                {/* Bottom Button */}
                <div className="action-footer">
                    <button
                        className="submit-btn"
                        onClick={() => navigate('/leaderboard')}
                    >
                        SUBMIT ANSWER <ChevronRight size={20} />
                    </button>
                </div>
            </main>
        </div>
    );
};

export default ChallengePage;

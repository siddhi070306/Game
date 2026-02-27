import React from 'react';
import { X, Flashlight, QrCode, Image as ImageIcon, Home, Trophy, History, User } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import './ScannerPage.css';

const ScannerPage = () => {
    const navigate = useNavigate();

    return (
        <div className="scanner-page animate-fade">
            {/* Background Camera Mockup */}
            <div className="camera-view">
                <img src="/cafe-bg.png" alt="Camera Preview" className="camera-img" />
                <div className="vignette"></div>
            </div>

            {/* Header */}
            <header className="scanner-header">
                <button className="icon-btn" onClick={() => navigate(-1)}>
                    <X size={24} />
                </button>
                <h2 className="header-text">Scan a Table QR</h2>
                <div style={{ width: 40 }}></div>
            </header>

            {/* Frame Area */}
            <main className="scanner-body">
                <div className="frame-container">
                    <div className="scanner-brackets">
                        <div className="corner tr" />
                        <div className="corner tl" />
                        <div className="corner br" />
                        <div className="corner bl" />
                        <div className="laser-line" />
                    </div>
                    <p className="scanner-info">Align QR code within frame</p>
                </div>

                <div className="action-row">
                    <button className="action-btn">
                        <Flashlight size={20} />
                    </button>
                    <button className="qr-main-btn" onClick={() => navigate('/challenge')}>
                        <QrCode size={32} />
                    </button>
                    <button className="action-btn">
                        <ImageIcon size={20} />
                    </button>
                </div>

                <div className="bottom-text">
                    <p>Find a table and scan the code to start your challenge.</p>
                    <button className="manual-btn">Enter Code Manually</button>
                </div>
            </main>

            {/* Bottom Nav */}
            <nav className="bottom-nav glass">
                <button className="nav-item">
                    <Home size={22} />
                </button>
                <button className="nav-item active">
                    <QrCode size={22} />
                </button>
                <button className="nav-item">
                    <History size={22} />
                </button>
                <button className="nav-item">
                    <User size={22} />
                </button>
            </nav>
        </div>
    );
};

export default ScannerPage;

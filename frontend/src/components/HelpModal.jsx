import React from 'react';
import { X, BookOpen, Hash, Award, Lightbulb, Zap } from 'lucide-react';
import { useSettings } from '../context/SettingsContext';
import { translations } from '../utils/translations';
import './SettingsModal.css'; // Reuse the excellent glassmorphism overlay CSS

const HelpModal = ({ isOpen, onClose }) => {
    const { language } = useSettings();
    const t = translations[language];

    if (!isOpen) return null;

    return (
        <div className="settings-overlay animate-fade">
            <div className="settings-panel glass">
                <header className="settings-header">
                    <h3>{t.rules_title || "How to Play"}</h3>
                    <button className="close-icon-btn" onClick={onClose}>
                        <X size={20} />
                    </button>
                </header>

                <div className="settings-body">
                    {/* Rules Section */}
                    <section className="setting-section">
                        <div className="section-title">
                            <BookOpen size={16} /> <span>{t.rules_title}</span>
                        </div>
                        <ul style={{
                            listStyleType: 'none',
                            padding: 0,
                            margin: 0,
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '12px',
                            color: '#e2e8f0',
                            fontSize: '0.95rem',
                            lineHeight: '1.5'
                        }}>
                            <li style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                                <Hash size={18} style={{ color: 'var(--primary-color)', flexShrink: 0, marginTop: '2px' }} />
                                <span>{t.rule_1}</span>
                            </li>
                            <li style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                                <Award size={18} style={{ color: 'var(--primary-color)', flexShrink: 0, marginTop: '2px' }} />
                                <span>{t.rule_2}</span>
                            </li>
                            <li style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                                <Lightbulb size={18} style={{ color: 'var(--primary-color)', flexShrink: 0, marginTop: '2px' }} />
                                <span>{t.rule_3}</span>
                            </li>
                            <li style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                                <Zap size={18} style={{ color: 'var(--primary-color)', flexShrink: 0, marginTop: '2px' }} />
                                <span>{t.rule_4}</span>
                            </li>
                        </ul>
                    </section>
                </div>

                <footer className="settings-footer">
                    <button className="btn-primary" style={{ width: '100%' }} onClick={onClose}>
                        {t.close_btn || "Close"}
                    </button>
                </footer>
            </div>
        </div>
    );
};

export default HelpModal;

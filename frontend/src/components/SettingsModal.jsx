import React from 'react';
import { X, Moon, Sun, Globe, Palette, Check } from 'lucide-react';
import { useSettings } from '../context/SettingsContext';
import './SettingsModal.css';

const SettingsModal = ({ isOpen, onClose }) => {
    const { theme, setTheme, primaryColor, setPrimaryColor, language, setLanguage } = useSettings();

    if (!isOpen) return null;

    const colors = [
        { name: 'Blue', value: '#3b82f6' },
        { name: 'Purple', value: '#8b5cf6' },
        { name: 'Emerald', value: '#10b981' },
        { name: 'Rose', value: '#f43f5e' },
        { name: 'Amber', value: '#f59e0b' },
    ];

    const languages = [
        { code: 'en', name: 'English' },
        { code: 'hi', name: 'Hindi (हिंदी)' },
        { code: 'mr', name: 'Marathi (मराठी)' },
    ];

    return (
        <div className="settings-overlay animate-fade">
            <div className="settings-panel glass">
                <header className="settings-header">
                    <h3>Settings</h3>
                    <button className="close-icon-btn" onClick={onClose}>
                        <X size={20} />
                    </button>
                </header>

                <div className="settings-body">
                    {/* Theme Section */}
                    <section className="setting-section">
                        <div className="section-title">
                            <Sun size={16} /> <span>Appearance</span>
                        </div>
                        <div className="theme-toggle">
                            <button
                                className={`toggle-option ${theme === 'dark' ? 'active' : ''}`}
                                onClick={() => setTheme('dark')}
                            >
                                <Moon size={14} /> Dark
                            </button>
                            <button
                                className={`toggle-option ${theme === 'light' ? 'active' : ''}`}
                                onClick={() => setTheme('light')}
                            >
                                <Sun size={14} /> Light
                            </button>
                        </div>
                    </section>

                    {/* Color Section */}
                    <section className="setting-section">
                        <div className="section-title">
                            <Palette size={16} /> <span>Theme Color</span>
                        </div>
                        <div className="color-grid">
                            {colors.map((c) => (
                                <button
                                    key={c.value}
                                    className="color-circle"
                                    style={{ backgroundColor: c.value }}
                                    onClick={() => setPrimaryColor(c.value)}
                                >
                                    {primaryColor === c.value && <Check size={14} color="white" />}
                                </button>
                            ))}
                        </div>
                    </section>

                    {/* Language Section */}
                    <section className="setting-section">
                        <div className="section-title">
                            <Globe size={16} /> <span>Language</span>
                        </div>
                        <select
                            className="lang-select"
                            value={language}
                            onChange={(e) => setLanguage(e.target.value)}
                        >
                            {languages.map((l) => (
                                <option key={l.code} value={l.code}>{l.name}</option>
                            ))}
                        </select>
                    </section>
                </div>

                <footer className="settings-footer">
                    <button className="btn-primary" style={{ width: '100%' }} onClick={onClose}>
                        Done
                    </button>
                </footer>
            </div>
        </div>
    );
};

export default SettingsModal;

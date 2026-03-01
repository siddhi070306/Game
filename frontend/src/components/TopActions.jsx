import React, { useState } from 'react';
import { Settings, HelpCircle } from 'lucide-react';
import SettingsModal from './SettingsModal';
import HelpModal from './HelpModal';
import './TopActions.css';

const TopActions = () => {
    const [isSettingsOpen, setIsSettingsOpen] = useState(false);
    const [isHelpOpen, setIsHelpOpen] = useState(false);

    return (
        <>
            <div className="top-actions-container">
                <div className="action-icons">
                    <button className="icon-btn-ghost" onClick={() => setIsSettingsOpen(true)}>
                        <Settings size={20} />
                    </button>
                    <button className="icon-btn-ghost" onClick={() => setIsHelpOpen(true)}>
                        <HelpCircle size={20} />
                    </button>
                </div>
            </div>

            <SettingsModal
                isOpen={isSettingsOpen}
                onClose={() => setIsSettingsOpen(false)}
            />

            <HelpModal
                isOpen={isHelpOpen}
                onClose={() => setIsHelpOpen(false)}
            />
        </>
    );
};

export default TopActions;

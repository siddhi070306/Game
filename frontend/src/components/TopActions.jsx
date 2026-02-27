import React, { useState } from 'react';
import { Settings, HelpCircle } from 'lucide-react';
import SettingsModal from './SettingsModal';
import './TopActions.css';

const TopActions = () => {
    const [isSettingsOpen, setIsSettingsOpen] = useState(false);

    return (
        <>
            <div className="top-actions-container">
                <button className="icon-btn-ghost" onClick={() => setIsSettingsOpen(true)}>
                    <Settings size={20} />
                </button>
                <button className="icon-btn-ghost">
                    <HelpCircle size={20} />
                </button>
            </div>

            <SettingsModal
                isOpen={isSettingsOpen}
                onClose={() => setIsSettingsOpen(false)}
            />
        </>
    );
};

export default TopActions;

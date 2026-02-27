import React, { createContext, useContext, useState, useEffect } from 'react';

const SettingsContext = createContext();

export const useSettings = () => {
    const context = useContext(SettingsContext);
    if (!context) {
        throw new Error('useSettings must be used within a SettingsProvider');
    }
    return context;
};

export const SettingsProvider = ({ children }) => {
    const [theme, setTheme] = useState(localStorage.getItem('app-theme') || 'dark');
    const [primaryColor, setPrimaryColor] = useState(localStorage.getItem('app-color') || '#3b82f6');
    const [language, setLanguage] = useState(localStorage.getItem('app-lang') || 'en');

    useEffect(() => {
        localStorage.setItem('app-theme', theme);
        document.documentElement.setAttribute('data-theme', theme);
    }, [theme]);

    useEffect(() => {
        localStorage.setItem('app-color', primaryColor);
        document.documentElement.style.setProperty('--primary', primaryColor);
        // Also update glows
        const r = parseInt(primaryColor.slice(1, 3), 16);
        const g = parseInt(primaryColor.slice(3, 5), 16);
        const b = parseInt(primaryColor.slice(5, 7), 16);
        document.documentElement.style.setProperty('--primary-glow', `rgba(${r}, ${g}, ${b}, 0.4)`);
    }, [primaryColor]);

    useEffect(() => {
        localStorage.setItem('app-lang', language);
    }, [language]);

    const value = {
        theme,
        setTheme,
        primaryColor,
        setPrimaryColor,
        language,
        setLanguage,
    };

    return (
        <SettingsContext.Provider value={value}>
            {children}
        </SettingsContext.Provider>
    );
};

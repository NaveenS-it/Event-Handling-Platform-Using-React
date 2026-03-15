import { createContext, useContext, useEffect, useState } from 'react';

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
    // Read saved preference, or fall back to 'system'
    const [theme, setTheme] = useState(() => {
        return localStorage.getItem('eventsphere-theme') || 'system';
    });

    // Resolve the effective theme ('light' or 'dark')
    const getEffective = (t) => {
        if (t === 'system') {
            return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
        }
        return t;
    };

    const [effective, setEffective] = useState(() => getEffective(
        localStorage.getItem('eventsphere-theme') || 'system'
    ));

    // Apply to <html> element
    const apply = (t) => {
        const eff = getEffective(t);
        document.documentElement.setAttribute('data-theme', eff);
        setEffective(eff);
    };

    // On mount: apply current theme & listen for system changes
    useEffect(() => {
        apply(theme);

        const mq = window.matchMedia('(prefers-color-scheme: dark)');
        const handler = () => {
            if (theme === 'system') apply('system');
        };
        mq.addEventListener('change', handler);
        return () => mq.removeEventListener('change', handler);
    }, [theme]);

    const setAndSave = (newTheme) => {
        localStorage.setItem('eventsphere-theme', newTheme);
        setTheme(newTheme);
        apply(newTheme);
    };

    // Cycle: light → dark → system
    const toggle = () => {
        const cycle = { light: 'dark', dark: 'system', system: 'light' };
        setAndSave(cycle[theme]);
    };

    return (
        <ThemeContext.Provider value={{ theme, effective, toggle, setTheme: setAndSave }}>
            {children}
        </ThemeContext.Provider>
    );
};

export const useTheme = () => useContext(ThemeContext);

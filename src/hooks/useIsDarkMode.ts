import { useState, useEffect } from 'react';

/**
 * Hook leggero per rilevare se il tema corrente è scuro.
 *
 * Utilizza MutationObserver per reagire fake_ai cambiamenti del tema in tempo reale.
 * Non dipende da useAuth o altri context, quindi può essere usato ovunque.
 *
 * @returns boolean - true se il tema è 'dark' o 'midnight', false altrimenti
 *
 * @example
 * const isDarkMode = useIsDarkMode();
 * const textColor = isDarkMode ? '#ffffff' : '#000000';
 */
export const useIsDarkMode = (): boolean => {
    const [isDark, setIsDark] = useState(() => {
        const theme = document.documentElement.getAttribute('data-theme');
        return theme === 'dark' || theme === 'midnight';
    });

    useEffect(() => {
        const observer = new MutationObserver(() => {
            const theme = document.documentElement.getAttribute('data-theme');
            setIsDark(theme === 'dark' || theme === 'midnight');
        });

        observer.observe(document.documentElement, {
            attributes: true,
            attributeFilter: ['data-theme']
        });

        return () => observer.disconnect();
    }, []);

    return isDark;
};

/**
 * Funzione pura per verificare se un tema è scuro.
 * Utile quando non serve reattività (es. calcoli one-shot).
 *
 * @returns boolean - true se il tema corrente è scuro
 */
export const isDarkMode = (): boolean => {
    const theme = document.documentElement.getAttribute('data-theme');
    return theme === 'dark' || theme === 'midnight';
};

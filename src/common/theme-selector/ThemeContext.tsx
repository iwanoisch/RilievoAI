import { useState, useLayoutEffect, useCallback, ReactNode } from 'react';
import {
    ThemeType,
    BackgroundMode,
    ThemeContextValue,
    ThemeOption,
    ThemeContext,
    THEME_STORAGE_KEY,
    BG_MODE_STORAGE_KEY,
    USER_THEME_PREFIX,
    USER_BG_MODE_PREFIX,
    THEME_OPTIONS,
    isLightTheme
} from './theme.types';

// ============================================
// Utils
// ============================================

const getSavedTheme = (): ThemeType => {
    const saved = localStorage.getItem(THEME_STORAGE_KEY) as ThemeType | null;
    return saved && THEME_OPTIONS.some(t => t.id === saved) ? saved : 'default';
};

const getSavedBackgroundMode = (): BackgroundMode => {
    const saved = localStorage.getItem(BG_MODE_STORAGE_KEY);
    return saved === 'neutral' ? 'neutral' : 'themed';
};

const applyThemeToDOM = (theme: ThemeType) => {
    if (theme === 'default') {
        document.documentElement.removeAttribute('data-theme');
    } else {
        document.documentElement.setAttribute('data-theme', theme);
    }
};

const applyBackgroundModeToDOM = (mode: BackgroundMode, theme: ThemeType) => {
    if (mode === 'neutral' && isLightTheme(theme)) {
        document.documentElement.setAttribute('data-bg', 'neutral');
    } else {
        document.documentElement.removeAttribute('data-bg');
    }
};

// ============================================
// Provider
// ============================================

interface ThemeProviderProps {
    children: ReactNode;
}

export const ThemeProvider = ({ children }: ThemeProviderProps) => {
    const [currentTheme, setCurrentTheme] = useState<ThemeType>(getSavedTheme);
    const [backgroundMode, setBackgroundModeState] = useState<BackgroundMode>(getSavedBackgroundMode);

    // Applica al DOM prima del paint
    useLayoutEffect(() => {
        applyThemeToDOM(currentTheme);
        applyBackgroundModeToDOM(backgroundMode, currentTheme);
    }, [currentTheme, backgroundMode]);

    const setTheme = useCallback((theme: ThemeType, userId?: string) => {
        localStorage.setItem(THEME_STORAGE_KEY, theme);
        setCurrentTheme(theme);

        // Salva anche per l'utente specifico se fornito
        if (userId) {
            localStorage.setItem(`${USER_THEME_PREFIX}${userId}`, theme);
        }

        if (!isLightTheme(theme)) {
            localStorage.setItem(BG_MODE_STORAGE_KEY, 'themed');
            setBackgroundModeState('themed');
            if (userId) {
                localStorage.setItem(`${USER_BG_MODE_PREFIX}${userId}`, 'themed');
            }
        }
    }, []);

    const setBackgroundMode = useCallback((mode: BackgroundMode, userId?: string) => {
        localStorage.setItem(BG_MODE_STORAGE_KEY, mode);
        setBackgroundModeState(mode);

        // Salva anche per l'utente specifico se fornito
        if (userId) {
            localStorage.setItem(`${USER_BG_MODE_PREFIX}${userId}`, mode);
        }
    }, []);

    // Reset al tema default (per logout)
    const resetTheme = useCallback(() => {
        localStorage.setItem(THEME_STORAGE_KEY, 'default');
        localStorage.setItem(BG_MODE_STORAGE_KEY, 'themed');
        setCurrentTheme('default');
        setBackgroundModeState('themed');
    }, []);

    // Carica il tema salvato per un utente specifico (per login)
    const loadUserTheme = useCallback((userId: string) => {
        const savedTheme = localStorage.getItem(`${USER_THEME_PREFIX}${userId}`) as ThemeType | null;
        const savedBgMode = localStorage.getItem(`${USER_BG_MODE_PREFIX}${userId}`);

        const theme = savedTheme && THEME_OPTIONS.some(t => t.id === savedTheme) ? savedTheme : 'default';
        const bgMode: BackgroundMode = savedBgMode === 'neutral' ? 'neutral' : 'themed';

        localStorage.setItem(THEME_STORAGE_KEY, theme);
        localStorage.setItem(BG_MODE_STORAGE_KEY, bgMode);
        setCurrentTheme(theme);
        setBackgroundModeState(bgMode);
    }, []);

    const getCurrentThemeInfo = useCallback((): ThemeOption => {
        return THEME_OPTIONS.find(t => t.id === currentTheme) || THEME_OPTIONS[0];
    }, [currentTheme]);

    const value: ThemeContextValue = {
        currentTheme,
        setTheme,
        backgroundMode,
        setBackgroundMode,
        isCurrentThemeLight: isLightTheme(currentTheme),
        themeOptions: THEME_OPTIONS,
        getCurrentThemeInfo,
        resetTheme,
        loadUserTheme
    };

    return (
        <ThemeContext.Provider value={value}>
            {children}
        </ThemeContext.Provider>
    );
};


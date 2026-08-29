import { createContext } from 'react';

// ============================================
// Types
// ============================================

export type ThemeType = 'default' | 'green' | 'blue' | 'indigo' | 'slate' | 'rose' | 'teal' | 'dark' | 'midnight';
export type BackgroundMode = 'themed' | 'neutral';

export interface ThemeOption {
    id: ThemeType;
    name: string;
    description: string;
    color: string;
    isDark?: boolean;
}

export interface ThemeContextValue {
    currentTheme: ThemeType;
    setTheme: (theme: ThemeType, userId?: string) => void;
    backgroundMode: BackgroundMode;
    setBackgroundMode: (mode: BackgroundMode, userId?: string) => void;
    isCurrentThemeLight: boolean;
    themeOptions: ThemeOption[];
    getCurrentThemeInfo: () => ThemeOption;
    resetTheme: () => void;
    loadUserTheme: (userId: string) => void;
}

// ============================================
// Constants
// ============================================

export const THEME_STORAGE_KEY = 'app_theme';
export const BG_MODE_STORAGE_KEY = 'app_bg_mode';
export const USER_THEME_PREFIX = 'user_theme_';
export const USER_BG_MODE_PREFIX = 'user_bg_mode_';

export const LIGHT_THEMES: ThemeOption[] = [
    { id: 'default', name: 'Arancione', description: 'Tema predefinito', color: '#f97316' },
    { id: 'blue', name: 'Blu', description: 'Professionale', color: '#3b82f6' },
    { id: 'green', name: 'Verde', description: 'Natura', color: '#22c55e' },
    { id: 'indigo', name: 'Indaco', description: 'Elegante', color: '#6366f1' },
    { id: 'teal', name: 'Teal', description: 'Fresco', color: '#14b8a6' },
    { id: 'rose', name: 'Rosa', description: 'Caldo', color: '#f43f5e' },
    { id: 'slate', name: 'Grigio', description: 'Minimalista', color: '#64748b' }
];

export const DARK_THEMES: ThemeOption[] = [
    { id: 'dark', name: 'Dark', description: 'Classico scuro', color: '#06b6d4', isDark: true },
    { id: 'midnight', name: 'Midnight', description: 'Blu notte', color: '#3b82f6', isDark: true }
];

export const THEME_OPTIONS: ThemeOption[] = [...LIGHT_THEMES, ...DARK_THEMES];

// ============================================
// Utils
// ============================================

export const isLightTheme = (theme: ThemeType): boolean => {
    return LIGHT_THEMES.some(t => t.id === theme);
};

// ============================================
// Context
// ============================================

export const ThemeContext = createContext<ThemeContextValue | null>(null);

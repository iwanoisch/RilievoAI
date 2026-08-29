import { useContext } from 'react';
import { ThemeContext } from './theme.types';
import type { ThemeContextValue } from './theme.types';

export const useTheme = (): ThemeContextValue => {
    const context = useContext(ThemeContext);
    if (!context) {
        throw new Error('useTheme deve essere usato dentro ThemeProvider');
    }
    return context;
};

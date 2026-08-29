import { useContext } from 'react';
import { LanguageContext } from './language.types';
import type { LanguageContextValue } from './language.types';

export const useLanguage = (): LanguageContextValue => {
    const context = useContext(LanguageContext);
    if (!context) {
        throw new Error('useLanguage deve essere usato dentro LanguageProvider');
    }
    return context;
};

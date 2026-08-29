import { useState, useLayoutEffect, useCallback, ReactNode } from 'react';
import i18n from '../../i18n';
import {
    LanguageType,
    LanguageContextValue,
    LanguageContext,
    LANGUAGE_STORAGE_KEY,
    USER_LANGUAGE_PREFIX,
    DEFAULT_LANGUAGE,
    LANGUAGE_OPTIONS,
    isValidLanguage
} from './language.types';

// ============================================
// Utils
// ============================================

const getSavedLanguage = (): LanguageType => {
    const saved = localStorage.getItem(LANGUAGE_STORAGE_KEY);
    return isValidLanguage(saved) ? saved : DEFAULT_LANGUAGE;
};

// ============================================
// Provider
// ============================================

interface LanguageProviderProps {
    children: ReactNode;
}

export const LanguageProvider = ({ children }: LanguageProviderProps) => {
    const [currentLanguage, setCurrentLanguage] = useState<LanguageType>(getSavedLanguage);

    // Sincronizza i18n con la lingua corrente
    useLayoutEffect(() => {
        if (i18n.language !== currentLanguage) {
            i18n.changeLanguage(currentLanguage);
        }
    }, [currentLanguage]);

    const setLanguage = useCallback((language: LanguageType, userId?: string) => {
        localStorage.setItem(LANGUAGE_STORAGE_KEY, language);
        setCurrentLanguage(language);
        i18n.changeLanguage(language);

        // Salva anche per l'utente specifico se fornito
        if (userId) {
            localStorage.setItem(`${USER_LANGUAGE_PREFIX}${userId}`, language);
        }
    }, []);

    // Reset alla lingua default (per logout)
    const resetLanguage = useCallback(() => {
        localStorage.setItem(LANGUAGE_STORAGE_KEY, DEFAULT_LANGUAGE);
        setCurrentLanguage(DEFAULT_LANGUAGE);
        i18n.changeLanguage(DEFAULT_LANGUAGE);
    }, []);

    // Carica la lingua salvata per un utente specifico (per login)
    const loadUserLanguage = useCallback((userId: string) => {
        const savedLanguage = localStorage.getItem(`${USER_LANGUAGE_PREFIX}${userId}`);
        const language = isValidLanguage(savedLanguage) ? savedLanguage : DEFAULT_LANGUAGE;

        localStorage.setItem(LANGUAGE_STORAGE_KEY, language);
        setCurrentLanguage(language);
        i18n.changeLanguage(language);
    }, []);

    const value: LanguageContextValue = {
        currentLanguage,
        setLanguage,
        languageOptions: LANGUAGE_OPTIONS,
        resetLanguage,
        loadUserLanguage
    };

    return (
        <LanguageContext.Provider value={value}>
            {children}
        </LanguageContext.Provider>
    );
};


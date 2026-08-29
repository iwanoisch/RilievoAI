import i18n from 'i18next'
import {initReactI18next} from 'react-i18next'
import HttpBackend from 'i18next-http-backend';

i18n
    .use(HttpBackend) // carica i file JSON
    //.use(LanguageDetector) // rileva la lingua da browser o localStorage
    .use(initReactI18next) // integra con React
    .init({
        debug: true,
        lng: 'it',
        fallbackLng: 'it',
        supportedLngs: ['it', 'en', 'ar'],
        interpolation: {
            escapeValue: false, // React fa già l'escaping
        },
        detection: {
            order: ['localStorage', 'navigator'],
            caches: ['localStorage']
        },
        backend: {
            loadPath: '/locales/{{lng}}/translation.json', // <-- AGGIUNGI QUESTO
        },
    });

export default i18n;

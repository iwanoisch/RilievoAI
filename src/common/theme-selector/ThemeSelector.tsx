import {CheckIcon, SunIcon, MoonIcon, SwatchIcon} from '@heroicons/react/24/solid';
import {useTheme} from './useTheme';
import {LIGHT_THEMES, DARK_THEMES} from './theme.types';
import type {ThemeType, ThemeOption} from './theme.types';
import {useTranslation} from 'react-i18next';
import {Switch} from '@headlessui/react';
import {useSelector} from 'react-redux';
import {RootState} from '../../store/store';

const ThemeButton = ({
    theme,
    isSelected,
    onClick
}: {
    theme: ThemeOption;
    isSelected: boolean;
    onClick: () => void;
}) => {
    return (
        <button
            onClick={onClick}
            className={`
                relative flex flex-col items-center p-4 rounded-xl border-2 transition-all duration-200
                ${isSelected
                    ? 'border-primary-500 bg-primary-50 shadow-md'
                    : theme.isDark
                        ? 'border-slate-600 bg-slate-800 hover:border-slate-500 hover:shadow-sm'
                        : 'border-slate-200 bg-white hover:border-slate-300 hover:shadow-sm'
                }
            `}
        >
            {/* Anteprima colore */}
            <div
                className={`w-12 h-12 rounded-full shadow-md mb-3 ring-2 ${theme.isDark ? 'ring-slate-700' : 'ring-white'}`}
                style={{backgroundColor: theme.color}}
            />

            {/* Nome tema */}
            <span className={`text-sm font-semibold ${
                isSelected
                    ? 'text-primary-700'
                    : theme.isDark
                        ? 'text-slate-200'
                        : 'text-slate-700'
            }`}>
                {theme.name}
            </span>

            {/* Descrizione */}
            <span className={`text-xs text-center mt-1 ${theme.isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                {theme.description}
            </span>

            {/* Indicatore selezione */}
            {isSelected && (
                <div className="absolute top-2 right-2 w-5 h-5 bg-primary-500 rounded-full flex items-center justify-center">
                    <CheckIcon className="w-3 h-3 text-white"/>
                </div>
            )}
        </button>
    );
};

export const ThemeSelector = () => {
    const {t} = useTranslation();
    const {currentTheme, setTheme, backgroundMode, setBackgroundMode, isCurrentThemeLight} = useTheme();
    const userId = useSelector((state: RootState) => state.auth.user?.id);

    const handleThemeChange = (themeId: ThemeType) => {
        setTheme(themeId, userId);
    };

    const handleBackgroundModeChange = (useNeutral: boolean) => {
        setBackgroundMode(useNeutral ? 'neutral' : 'themed', userId);
    };

    return (
        <div className="space-y-8">
            {/* Sezione Temi Chiari */}
            <div>
                <div className="flex items-center gap-2 mb-4">
                    <SunIcon className="w-5 h-5 text-amber-500"/>
                    <h4 className="text-sm font-semibold text-slate-700 uppercase tracking-wide">
                        {t('settings.light_themes', 'Temi Chiari')}
                    </h4>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                    {LIGHT_THEMES.map((theme) => (
                        <ThemeButton
                            key={theme.id}
                            theme={theme}
                            isSelected={currentTheme === theme.id}
                            onClick={() => handleThemeChange(theme.id)}
                        />
                    ))}
                </div>

                {/* Toggle sfondo neutro - solo per temi chiari */}
                {isCurrentThemeLight && (
                    <div className="mt-6 p-4 rounded-xl bg-slate-50 border border-slate-200">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <SwatchIcon className="w-5 h-5 text-slate-500"/>
                                <div>
                                    <p className="text-sm font-medium text-slate-700">
                                        {t('settings.neutral_background', 'Sfondo neutro')}
                                    </p>
                                    <p className="text-xs text-slate-500">
                                        {t('settings.neutral_background_desc', 'Usa uno sfondo grigio sobrio invece del colore del tema')}
                                    </p>
                                </div>
                            </div>
                            <Switch
                                checked={backgroundMode === 'neutral'}
                                onChange={handleBackgroundModeChange}
                                className={`
                                    relative inline-flex h-6 w-11 items-center rounded-full transition-colors
                                    focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2
                                    ${backgroundMode === 'neutral' ? 'bg-primary-500' : 'bg-slate-300'}
                                `}
                            >
                                <span className="sr-only">{t('settings.neutral_background', 'Sfondo neutro')}</span>
                                <span
                                    className={`
                                        inline-block h-4 w-4 transform rounded-full bg-white shadow-sm transition-transform
                                        ${backgroundMode === 'neutral' ? 'translate-x-6' : 'translate-x-1'}
                                    `}
                                />
                            </Switch>
                        </div>
                    </div>
                )}
            </div>

            {/* Sezione Temi Scuri */}
            <div>
                <div className="flex items-center gap-2 mb-4">
                    <MoonIcon className="w-5 h-5 text-indigo-400"/>
                    <h4 className="text-sm font-semibold text-slate-700 uppercase tracking-wide">
                        {t('settings.dark_themes', 'Temi Scuri')}
                    </h4>
                    <span className="text-xs text-slate-500 ml-2">
                        {t('settings.eye_comfort', 'Per riposare gli occhi')}
                    </span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                    {DARK_THEMES.map((theme) => (
                        <ThemeButton
                            key={theme.id}
                            theme={theme}
                            isSelected={currentTheme === theme.id}
                            onClick={() => handleThemeChange(theme.id)}
                        />
                    ))}
                </div>
            </div>

            {/* Info aggiuntive */}
            <p className="text-xs text-slate-500 text-center">
                {t('settings.theme_info', 'Il tema selezionato verrà salvato per il tuo account')}
            </p>
        </div>
    );
};
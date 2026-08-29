import {PageTitle} from "../../common/page-title/PageTitle.tsx";
import {SwatchIcon, GlobeAltIcon} from "@heroicons/react/24/outline";
import {useTranslation} from "react-i18next";
import {ThemeSelector} from "../../common/theme-selector/ThemeSelector.tsx";
import LanguageSelector from "../../common/language-selector/LanguageSelector.tsx";

export const UserSettings = () => {
    const {t} = useTranslation();

    return (
        <div className="w-full px-4 sm:px-6 lg:px-8 py-6 bg-gradient-to-br from-primary-50/50 via-primary-100/30 to-slate-50 min-h-screen">
            <div className="mx-auto w-full max-w-7xl">
                <PageTitle
                    title={t('settings.title', 'Impostazioni')}
                    subtitle={t('settings.subtitle', 'Personalizza la tua esperienza')}
                />

                <div className="mt-8 space-y-6">
                    {/* Sezione Tema */}
                    <section className="group relative backdrop-blur-xl bg-white/90 rounded-xl p-6 shadow-sm border border-slate-200/60 hover:shadow-md hover:bg-white transition-all duration-300">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-primary-700 shadow-lg shadow-primary-500/20">
                                <SwatchIcon className="h-5 w-5 text-white"/>
                            </div>
                            <div>
                                <h3 className="text-sm font-bold text-slate-800 tracking-wide uppercase">
                                    {t('settings.theme_section', 'Tema colore')}
                                </h3>
                                <p className="text-xs text-slate-500 mt-0.5">
                                    {t('settings.theme_description', 'Scegli il colore principale dell\'interfaccia')}
                                </p>
                            </div>
                        </div>

                        <ThemeSelector/>
                    </section>

                    {/* Sezione Lingua */}
                    <section className="group relative backdrop-blur-xl bg-white/90 rounded-xl p-6 shadow-sm border border-slate-200/60 hover:shadow-md hover:bg-white transition-all duration-300">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 shadow-lg shadow-emerald-500/20">
                                <GlobeAltIcon className="h-5 w-5 text-white"/>
                            </div>
                            <div>
                                <h3 className="text-sm font-bold text-slate-800 tracking-wide uppercase">
                                    {t('settings.language_section', 'Lingua')}
                                </h3>
                                <p className="text-xs text-slate-500 mt-0.5">
                                    {t('settings.language_description', 'Seleziona la lingua dell\'applicazione')}
                                </p>
                            </div>
                        </div>

                        <div className="max-w-xs">
                            <LanguageSelector id="language-selector"/>
                        </div>
                    </section>
                </div>
            </div>
        </div>
    );
};
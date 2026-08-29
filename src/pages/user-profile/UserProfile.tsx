import {PageTitle} from "../../common/page-title/PageTitle.tsx";
import {useState} from "react"
import {useAuth} from "../../features/auth/hooks/useAuth.ts";
import {useTranslation} from "react-i18next";
import {
    UserCircleIcon,
    ClockIcon,
} from "@heroicons/react/24/outline";

export const UserProfile = () => {
    const {user} = useAuth();
    const {t} = useTranslation();
    const [userLogged] = useState(user);

    return (
        <div className="w-full px-4 sm:px-6 lg:px-8 py-6 bg-gradient-to-br from-primary-50/50 via-primary-100/30 to-slate-50 min-h-screen">
            <div className="mx-auto w-full max-w-7xl">
                <PageTitle
                    title={t('user_profile.title')}
                    subtitle={t('user_profile.subtitle')}
                />

                <div className="mt-8 space-y-6">
                    {/* Section 1: Account Info */}
                    <section className="group relative backdrop-blur-xl bg-white/90 rounded-xl p-6 shadow-sm border border-slate-200/60 hover:shadow-md hover:bg-white transition-all duration-300">
                        {/* Profile Picture */}
                        <div className="mb-6">
                            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
                                {t('user_profile.profile_photo')}
                            </label>
                            <div className="flex items-center gap-x-4">
                                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center">
                                    <UserCircleIcon className="w-12 h-12 text-slate-400"/>
                                </div>
                            </div>
                        </div>

                        {/* Account Fields */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
                                    {t('user_profile.email')}
                                </label>
                                <p className="text-sm font-medium text-slate-900 bg-slate-50/80 rounded-lg px-4 py-3 border border-slate-100">
                                    {userLogged?.email || '-'}
                                </p>
                            </div>
                            <div>
                                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
                                    {t('user_profile.role')}
                                </label>
                                <p className="text-sm font-medium text-slate-900 bg-slate-50/80 rounded-lg px-4 py-3 border border-slate-100">
                                    {userLogged?.role || '-'}
                                </p>
                            </div>
                        </div>
                    </section>

                    {/* Section 2: Personal Data */}
                    <section className="group relative backdrop-blur-xl bg-white/90 rounded-xl p-6 shadow-sm border border-slate-200/60 hover:shadow-md hover:bg-white transition-all duration-300">
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            <div>
                                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
                                    {t('user_profile.name')}
                                </label>
                                <p className="text-sm font-medium text-slate-900 bg-slate-50/80 rounded-lg px-4 py-3 border border-slate-100">
                                    {userLogged?.first_name || '-'}
                                </p>
                            </div>
                            <div>
                                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
                                    {t('user_profile.surname')}
                                </label>
                                <p className="text-sm font-medium text-slate-900 bg-slate-50/80 rounded-lg px-4 py-3 border border-slate-100">
                                    {userLogged?.last_name || '-'}
                                </p>
                            </div>
                            <div>
                                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
                                    {t('user_profile.phone')}
                                </label>
                                <p className="text-sm font-medium text-slate-900 bg-slate-50/80 rounded-lg px-4 py-3 border border-slate-100">
                                    {userLogged?.phone || '-'}
                                </p>
                            </div>
                        </div>
                    </section>

                    {/* Footer info */}
                    <div className="flex items-center gap-2 text-slate-500 justify-end">
                        <ClockIcon className="h-5 w-5"/>
                        <span className="text-xs font-medium">
                            {t('general.last_update')}: {' '}
                            <span className="text-slate-700">
                                {userLogged?.updated_at
                                    ? new Date(userLogged.updated_at).toLocaleDateString('it-IT', {
                                        day: '2-digit',
                                        month: '2-digit',
                                        year: 'numeric',
                                    })
                                    : '-'
                                }
                            </span>
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
};

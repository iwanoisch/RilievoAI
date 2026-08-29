import {PageTitle} from "../../common/page-title/PageTitle.tsx";
import {StatCard} from "../../common/stat-card/StatCard.tsx";
import {
    FolderIcon,
    ClockIcon,
    CheckCircleIcon,
    UserGroupIcon,
} from "@heroicons/react/24/solid";
import {useAuth} from "../../features/auth/hooks/useAuth.ts";
import {useTranslation} from "react-i18next";

export const Dashboard = () => {
    const {t} = useTranslation();
    const {user} = useAuth();

    return (
        <div
            className="w-full px-4 sm:px-6 lg:px-8 py-6 bg-gradient-to-br from-primary-50/50 via-primary-100/30 to-slate-50 min-h-screen">
            <div className="mx-auto w-full max-w-7xl">
                <PageTitle title={t("menu.dashboard")}
                           subtitle={`${t("dashboard.paragraph")} - ${user?.first_name || 'Utente'}`}/>
                <div className="my-8"></div>

                {/* Statistiche rapide - placeholder */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-3">
                    <StatCard
                        icon={FolderIcon}
                        label={t('dashboard.totalProjects')}
                        value={0}
                        color="text-primary-600"
                        bgColor="bg-primary-50"
                    />
                    <StatCard
                        icon={ClockIcon}
                        label={t('dashboard.inProgress')}
                        value={0}
                        color="text-amber-600"
                        bgColor="bg-amber-50"
                    />
                    <StatCard
                        icon={CheckCircleIcon}
                        label={t('dashboard.completedProjects')}
                        value={0}
                        color="text-emerald-600"
                        bgColor="bg-emerald-50"
                    />
                    <StatCard
                        icon={UserGroupIcon}
                        label="Team"
                        value={1}
                        color="text-blue-600"
                        bgColor="bg-blue-50"
                    />
                </div>

                {/* Contenuto placeholder */}
                <div className="mt-10">
                    <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-8 text-center">
                        <FolderIcon className="h-12 w-12 text-slate-300 mx-auto mb-3"/>
                        <h3 className="text-lg font-semibold text-slate-700 mb-2">Boilerplate Pronto</h3>
                        <p className="text-slate-500">
                            La dashboard e pronta per essere personalizzata con i tuoi contenuti.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}

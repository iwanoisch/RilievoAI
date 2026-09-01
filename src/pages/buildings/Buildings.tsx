import {FC, useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";
import {useTranslation} from "react-i18next";
import {PlusIcon, BuildingOffice2Icon, ExclamationTriangleIcon, CalendarDaysIcon} from "@heroicons/react/24/outline";
import {PageTitle} from "../../common/page-title/PageTitle.tsx";
import {useBuildings} from "../../features/buildings/useBuildings.ts";
import {BUILDING_STATUS_BADGE, BUILDING_STATUS_LABEL} from "../../constants/buildings.constant.ts";
import {CreateBuildingModal} from "./modals/CreateBuildingModal.tsx";
import type {BuildingCardData} from "../../features/buildings/buildings.type.ts";

export const Buildings: FC = () => {
    const {t, i18n} = useTranslation();
    const navigate = useNavigate();
    const {buildings, getBuildings} = useBuildings();
    const [showCreateModal, setShowCreateModal] = useState(false);

    useEffect(() => {
        getBuildings();
    }, []);

    const handleCardClick = (building: BuildingCardData) => {
        navigate(`/buildings/${building.id}`);
    };

    const getCompletionColor = (percent: number): string => {
        if (percent >= 85) return 'text-white bg-primary-500';
        if (percent >= 70) return 'text-white bg-primary-400';
        return 'text-white bg-warning';
    };

    return (
        <>
        <div className="w-full px-4 sm:px-6 lg:px-8 py-6 bg-gradient-to-br from-primary-50/50 via-primary-100/30 to-slate-50 min-h-screen">
            <div className="mx-auto w-full max-w-6xl">
                <div className="flex items-center justify-between">
                    <PageTitle
                        title={t('buildings.title')}
                        subtitle={t('buildings.subtitle')}
                    />
                    <button
                        className="btn btn-primary flex items-center gap-2 min-h-[44px]"
                        aria-label={t('buildings.new_building')}
                        onClick={() => setShowCreateModal(true)}
                    >
                        <PlusIcon className="h-5 w-5"/>
                        <span className="hidden sm:inline">{t('buildings.new_building')}</span>
                    </button>
                </div>

                <div className="mt-6">
                    {buildings.length === 0 ? (
                        <div className="card flex flex-col items-center justify-center py-16 text-center">
                            <BuildingOffice2Icon className="h-16 w-16 text-text-muted mb-4"/>
                            <p className="text-base font-semibold text-text-primary">{t('buildings.no_buildings')}</p>
                            <p className="text-sm text-text-muted mt-1">{t('buildings.no_buildings_desc')}</p>
                            <button
                                className="btn btn-primary flex items-center gap-2 mt-6 min-h-[44px]"
                                aria-label={t('buildings.new_building')}
                                onClick={() => setShowCreateModal(true)}
                            >
                                <PlusIcon className="h-5 w-5"/>
                                {t('buildings.new_building')}
                            </button>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                            {buildings.map((building) => (
                                <button
                                    key={building.id}
                                    onClick={() => handleCardClick(building)}
                                    className="card p-0 overflow-hidden text-left w-full hover:shadow-md transition-shadow focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:outline-none"
                                    aria-label={building.name}
                                >
                                    {/* Immagine o placeholder con badge completamento */}
                                    <div className="relative h-36 bg-gradient-to-br from-slate-200 to-slate-300 flex items-center justify-center">
                                        {building.imageUrl ? (
                                            <img src={building.imageUrl} alt={building.name} className="w-full h-full object-cover"/>
                                        ) : (
                                            <BuildingOffice2Icon className="h-16 w-16 text-slate-400"/>
                                        )}
                                        <div className={`absolute top-2 right-2 px-2.5 py-1 rounded-full text-xs font-bold ${getCompletionColor(building.completionPercent)}`}>
                                            {building.completionPercent}%
                                        </div>
                                    </div>

                                    {/* Contenuto */}
                                    <div className="p-3 flex flex-col gap-2">
                                        <h3 className="text-sm font-bold text-text-primary leading-tight line-clamp-2">
                                            {building.name}
                                        </h3>
                                        <p className="text-xs text-text-muted truncate">
                                            {building.address}, {building.city}
                                        </p>

                                        {/* Tag tipo + status */}
                                        <div className="flex flex-wrap items-center gap-1.5">
                                            <span className="text-[11px] px-1.5 py-0.5 rounded bg-slate-100 text-text-muted">
                                                {building.buildingType}
                                            </span>
                                            <span className={BUILDING_STATUS_BADGE[building.status]}>
                                                {t(BUILDING_STATUS_LABEL[building.status])}
                                            </span>
                                        </div>

                                        {/* Criticità e scadenza */}
                                        <div className="flex items-center justify-between text-xs text-text-muted pt-1 border-t border-border-light">
                                            {building.criticalityCount > 0 ? (
                                                <span className="flex items-center gap-1 text-warning-dark">
                                                    <ExclamationTriangleIcon className="h-3.5 w-3.5"/>
                                                    {building.criticalityCount} {t('buildings.criticality')}
                                                </span>
                                            ) : (
                                                <span className="flex items-center gap-1 text-success-dark">
                                                    0 {t('buildings.criticality')}
                                                </span>
                                            )}

                                            {building.deadline && (
                                                <span className="flex items-center gap-1">
                                                    <CalendarDaysIcon className="h-3.5 w-3.5"/>
                                                    {new Date(building.deadline).toLocaleDateString(i18n.language)}
                                                </span>
                                            )}
                                        </div>

                                        {/* Piani */}
                                        <div className="flex items-center gap-3 text-xs text-text-muted">
                                            <span>{t('buildings.floors')}: {building.floorsCount}</span>
                                        </div>
                                    </div>
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>

        {showCreateModal && (
            <CreateBuildingModal
                onClose={() => setShowCreateModal(false)}
                onCreated={(id) => {
                    setShowCreateModal(false);
                    navigate(`/buildings/${id}`);
                }}
            />
        )}
        </>
    );
};

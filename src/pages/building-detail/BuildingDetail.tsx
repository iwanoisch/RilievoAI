import {FC, useEffect, useState} from "react";
import {useNavigate, useParams} from "react-router-dom";
import {useTranslation} from "react-i18next";
import {
    ArrowLeftIcon,
    BuildingOffice2Icon,
    PencilIcon,
    MapPinIcon,
    ExclamationTriangleIcon,
    CalendarDaysIcon,
    ChartBarIcon,
    FolderOpenIcon,
    CubeIcon,
    ClipboardDocumentCheckIcon,
} from "@heroicons/react/24/outline";
import {useBuildings} from "../../features/buildings/useBuildings.ts";
import {useAppDispatch} from "../../store/store.ts";
import {setActiveBuildingId} from "../../features/ai/aiSlice.ts";
import {setRilievoActiveBuildingId} from "../../features/rilievo/rilievoSlice.ts";
import {AnagraficaTab} from "./anagrafica-tab/AnagraficaTab.tsx";
import {DocumentazioneTab} from "./documentazione-tab/DocumentazioneTab.tsx";
import {RilievoTab} from "./rilievo-tab/RilievoTab.tsx";
import {BUILDING_STATUS_LABEL} from "../../constants/buildings.constant.ts";
import {EditBuildingModal} from "./modals/EditBuildingModal.tsx";

export const BuildingDetail: FC = () => {
    const {t, i18n} = useTranslation();
    const navigate = useNavigate();
    const {id} = useParams<{id: string}>();
    const dispatch = useAppDispatch();
    const {buildings} = useBuildings();
    useEffect(() => {
        if (id) {
            dispatch(setActiveBuildingId(id));
            dispatch(setRilievoActiveBuildingId(id));
        }
    }, [id, dispatch]);

    const [showEditModal, setShowEditModal] = useState(false);
    const [activeTab, setActiveTab] = useState<'planimetria' | 'anagrafica' | 'rilievo'>('planimetria');

    const building = buildings.find(b => b.id === id);

    if (!building) {
        return (
            <div className="w-full px-4 sm:px-6 lg:px-8 py-6 min-h-screen bg-gradient-to-br from-primary-50/50 via-primary-100/30 to-slate-50 flex flex-col items-center justify-center">
                <BuildingOffice2Icon className="h-16 w-16 text-text-muted mb-4"/>
                <p className="text-base text-text-muted">{t('buildings.not_found')}</p>
                <button onClick={() => navigate('/buildings')} className="btn btn-primary mt-4 min-h-[44px]">
                    {t('general.back')}
                </button>
            </div>
        );
    }

    const getCompletionColor = (percent: number): string => {
        if (percent >= 85) return 'text-primary-600';
        if (percent >= 60) return 'text-primary-400';
        return 'text-warning-dark';
    };

    return (
        <div className="w-full px-4 sm:px-6 lg:px-8 py-6 bg-gradient-to-br from-primary-50/50 via-primary-100/30 to-slate-50 min-h-screen">
            <div className="w-full">

                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => navigate('/buildings')}
                            className="btn btn-ghost p-2 -ml-2 min-h-[44px] min-w-[44px]"
                            aria-label={t('buildings.back_to_list')}
                        >
                            <ArrowLeftIcon className="h-5 w-5"/>
                        </button>
                        <div className="flex-1 min-w-0">
                            <h1 className="text-xl sm:text-3xl uppercase font-bold text-slate-900 tracking-tight truncate">
                                {building.name}
                            </h1>
                            <div className="flex items-center gap-1 mt-1 text-sm sm:text-base text-slate-500">
                                <MapPinIcon className="h-4 w-4 flex-shrink-0"/>
                                <span>{building.address} - {building.city}</span>
                            </div>
                            {building.description && (
                                <p className="text-xs text-text-muted mt-0.5 italic">{building.description}</p>
                            )}
                        </div>
                    </div>
                    <button onClick={() => setShowEditModal(true)} className="btn btn-primary flex items-center gap-2 min-h-[44px]">
                        <PencilIcon className="h-4 w-4"/>
                        {t('common.edit')}
                    </button>
                </div>

                {/* Card */}
                <div className="card">
                    <div className="flex flex-col md:flex-row gap-6">
                        {/* Immagine */}
                        <div className="md:w-56 flex-shrink-0">
                            <div className="aspect-[4/3] rounded-xl bg-gradient-to-br from-slate-200 to-slate-300 flex items-center justify-center overflow-hidden">
                                {building.imageUrl ? (
                                    <img src={building.imageUrl} alt={building.name} className="w-full h-full object-cover"/>
                                ) : (
                                    <BuildingOffice2Icon className="h-16 w-16 text-slate-400"/>
                                )}
                            </div>
                        </div>

                        {/* Info */}
                        <div className="flex-1">
                            {/* Info row */}
                            <div className="flex flex-wrap gap-x-8 gap-y-4 mb-5">
                                <div>
                                    <p className="text-xs text-text-muted">{t('buildings.field_code')}</p>
                                    <p className="text-sm font-semibold text-text-primary mt-0.5">{building.code}</p>
                                </div>
                                <div>
                                    <p className="text-xs text-text-muted">{t('buildings.field_municipality')}</p>
                                    <p className="text-sm font-semibold text-text-primary mt-0.5">{building.city}</p>
                                </div>
                                <div>
                                    <p className="text-xs text-text-muted">{t('buildings.field_destination')}</p>
                                    <p className="text-sm font-semibold text-text-primary mt-0.5">{building.buildingType}</p>
                                </div>
                                <div>
                                    <p className="text-xs text-text-muted">{t('buildings.field_year_built')}</p>
                                    <p className="text-sm font-semibold text-text-primary mt-0.5">{building.yearBuilt ?? '—'}</p>
                                </div>
                            </div>

                            {/* Stat row */}
                            <div className="flex flex-wrap gap-x-8 gap-y-4">
                                <div className="flex items-center gap-2">
                                    <ChartBarIcon className={`h-7 w-7 ${getCompletionColor(building.completionPercent)}`}/>
                                    <div>
                                        <p className={`text-lg font-bold leading-none ${getCompletionColor(building.completionPercent)}`}>{building.completionPercent}%</p>
                                        <p className="text-xs text-text-muted mt-0.5">{t('buildings.field_completion')}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className={`h-3 w-3 rounded-full ${building.status === 'active' ? 'bg-success' : 'bg-primary-400'}`}/>
                                    <div>
                                        <p className={`text-sm font-bold leading-none ${building.status === 'active' ? 'text-success-dark' : 'text-primary-600'}`}>{t(BUILDING_STATUS_LABEL[building.status])}</p>
                                        <p className="text-xs text-text-muted mt-0.5">{t('buildings.field_status')}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <ExclamationTriangleIcon className={`h-7 w-7 ${building.criticalityCount > 0 ? 'text-warning-dark' : 'text-success-dark'}`}/>
                                    <div>
                                        <p className="text-lg font-bold text-text-primary leading-none">{building.criticalityCount}</p>
                                        <p className="text-xs text-text-muted mt-0.5">{t('buildings.criticality')}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <CalendarDaysIcon className="h-7 w-7 text-text-muted"/>
                                    <div>
                                        <p className="text-sm font-bold text-text-primary leading-none">{building.deadline ? new Date(building.deadline).toLocaleDateString(i18n.language) : '—'}</p>
                                        <p className="text-xs text-text-muted mt-0.5">{t('buildings.deadline')}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

                {/* Tab bar sticky */}
                <div className="sticky top-16 z-10 bg-surface-card border-b border-border-default rounded-xl mt-4 -mx-0">
                    {/* Desktop */}
                    <div className="hidden sm:flex overflow-x-auto">
                        <button
                            onClick={() => setActiveTab('planimetria')}
                            className={`flex items-center gap-2 px-4 py-3 text-sm font-medium whitespace-nowrap transition-colors min-h-[44px] ${activeTab === 'planimetria' ? 'text-primary-600 border-b-2 border-primary-500' : 'text-text-muted hover:text-text-primary'}`}
                        >
                            <FolderOpenIcon className="h-4 w-4"/>
                            {t('buildingDetail.documentation')}
                        </button>
                        <button
                            onClick={() => setActiveTab('anagrafica')}
                            className={`flex items-center gap-2 px-4 py-3 text-sm font-medium whitespace-nowrap transition-colors min-h-[44px] ${activeTab === 'anagrafica' ? 'text-primary-600 border-b-2 border-primary-500' : 'text-text-muted hover:text-text-primary'}`}
                        >
                            <CubeIcon className="h-4 w-4"/>
                            {t('buildingDetail.anagrafica')}
                        </button>
                        <button
                            onClick={() => setActiveTab('rilievo')}
                            className={`flex items-center gap-2 px-4 py-3 text-sm font-medium whitespace-nowrap transition-colors min-h-[44px] ${activeTab === 'rilievo' ? 'text-primary-600 border-b-2 border-primary-500' : 'text-text-muted hover:text-text-primary'}`}
                        >
                            <ClipboardDocumentCheckIcon className="h-4 w-4"/>
                            {t('buildingDetail.rilievo')}
                        </button>
                    </div>

                    {/* Mobile */}
                    <div className="sm:hidden p-2">
                        <select
                            id="building-detail-tab-select"
                            name="building-detail-tab-select"
                            className="input w-full text-sm"
                            value={activeTab}
                            onChange={(e) => setActiveTab(e.target.value as 'planimetria' | 'anagrafica' | 'rilievo')}
                        >
                            <option value="planimetria">{t('buildingDetail.documentation')}</option>
                            <option value="anagrafica">{t('buildingDetail.anagrafica')}</option>
                            <option value="rilievo">{t('buildingDetail.rilievo')}</option>
                        </select>
                    </div>
                </div>

                {/* Contenuto tab (placeholder) */}
                {activeTab === 'planimetria' && <DocumentazioneTab/>}
                {activeTab === 'anagrafica' && <AnagraficaTab/>}
                {activeTab === 'rilievo' && <RilievoTab/>}

            {/* Modale modifica */}
            {showEditModal && (
                <EditBuildingModal
                    building={building}
                    onClose={() => setShowEditModal(false)}
                    onSaved={() => setShowEditModal(false)}
                />
            )}
        </div>
    );
};

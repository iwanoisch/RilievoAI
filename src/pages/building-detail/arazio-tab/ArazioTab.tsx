import {FC, useState} from "react";
import {useTranslation} from "react-i18next";
import {useParams} from "react-router-dom";
import {DocumentTextIcon, CheckCircleIcon} from "@heroicons/react/24/outline";
import {ARAZIO_SECTIONS} from "../../../constants/arazio-sections.constant.ts";
import {useArazio} from "../../../features/arazio/useArazio.ts";
import {ArazioSectionForm} from "../arazio-section-form/ArazioSectionForm.tsx";

export const ArazioTab: FC = () => {
    const {t} = useTranslation();
    const {id: buildingId} = useParams<{id: string}>();
    const {getSectionsForBuilding} = useArazio();
    const [selectedId, setSelectedId] = useState<string | null>(null);

    if (!buildingId) return null;

    const sectionsData = getSectionsForBuilding(buildingId);

    const getStatusIndicator = (sectionId: string) => {
        const data = sectionsData.find(s => s.sectionId === sectionId);
        if (data?.status === 'completed') return 'bg-success text-text-inverse';
        if (data?.status === 'draft') return 'bg-primary-300 text-text-inverse';
        return 'bg-border-default text-text-muted';
    };

    const getSectionStatus = (sectionId: string) => {
        return sectionsData.find(s => s.sectionId === sectionId)?.status ?? 'empty';
    };

    return (
        <div className="card mt-4 p-0 overflow-hidden">
            <div className="flex flex-col lg:flex-row min-h-[500px]">

                {/* Sidebar - desktop */}
                <nav className="hidden lg:block w-72 shrink-0 border-r border-border-default bg-surface-page/50 p-3 space-y-0.5">
                    {ARAZIO_SECTIONS.map((section) => {
                        const status = getSectionStatus(section.id);
                        return (
                            <button
                                key={section.id}
                                onClick={() => setSelectedId(section.id)}
                                className={`w-full text-left px-3 py-2.5 rounded-lg text-sm flex items-center gap-3 transition-colors min-h-[44px] ${
                                    selectedId === section.id
                                        ? 'bg-primary-100 text-primary-700 font-medium'
                                        : 'text-text-secondary hover:bg-surface-hover'
                                }`}
                            >
                                <span className={`flex items-center justify-center h-6 w-6 rounded-md text-xs font-bold shrink-0 ${
                                    selectedId === section.id
                                        ? 'bg-primary-500 text-text-inverse'
                                        : getStatusIndicator(section.id)
                                }`}>
                                    {status === 'completed'
                                        ? <CheckCircleIcon className="h-4 w-4"/>
                                        : section.number
                                    }
                                </span>
                                <span className="truncate">{section.label}</span>
                            </button>
                        );
                    })}
                </nav>

                {/* Sidebar - mobile/tablet (select) */}
                <div className="lg:hidden p-3 border-b border-border-default bg-surface-page/50">
                    <select
                        id="arazio-section-select"
                        name="arazio-section-select"
                        className="input w-full text-sm"
                        value={selectedId ?? ''}
                        onChange={(e) => setSelectedId(e.target.value || null)}
                    >
                        <option value="">{t('buildingDetail.select_section')}</option>
                        {ARAZIO_SECTIONS.map((section) => {
                            const status = getSectionStatus(section.id);
                            const statusIcon = status === 'completed' ? '\u2713 ' : status === 'draft' ? '\u25CB ' : '';
                            return (
                                <option key={section.id} value={section.id}>
                                    {statusIcon}{section.number}. {section.label}
                                </option>
                            );
                        })}
                    </select>
                </div>

                {/* Contenuto */}
                <div className="flex-1 min-w-0 p-4 sm:p-6">
                    {selectedId ? (
                        <ArazioSectionForm buildingId={buildingId} sectionId={selectedId}/>
                    ) : (
                        <div className="flex flex-col items-center justify-center py-16 text-center">
                            <span className="flex items-center justify-center h-14 w-14 rounded-2xl bg-primary-50 text-primary-500 mb-4">
                                <DocumentTextIcon className="h-7 w-7"/>
                            </span>
                            <h3 className="text-base font-semibold text-text-primary">
                                {t('buildingDetail.arazio_title')}
                            </h3>
                            <p className="mt-1 text-sm text-text-muted max-w-sm">
                                {t('buildingDetail.arazio_hint')}
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

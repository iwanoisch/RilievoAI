import {FC, useState} from "react";
import {useTranslation} from "react-i18next";
import {DocumentTextIcon} from "@heroicons/react/24/outline";
import {ARAZIO_SECTIONS} from "../../constants/arazio-sections.constant.ts";

export const ArazioTab: FC = () => {
    const {t} = useTranslation();
    const [selectedId, setSelectedId] = useState<string | null>(null);

    const selectedSection = ARAZIO_SECTIONS.find(s => s.id === selectedId);

    return (
        <div className="card mt-4 p-0 overflow-hidden">
            <div className="flex flex-col lg:flex-row">

                {/* Sidebar - desktop/tablet */}
                <nav className="hidden lg:block w-72 shrink-0 border-r border-border-default bg-surface-page/50 p-3 space-y-0.5">
                    {ARAZIO_SECTIONS.map((section) => (
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
                                    : 'bg-border-default text-text-muted'
                            }`}>
                                {section.number}
                            </span>
                            <span className="truncate">{section.label}</span>
                        </button>
                    ))}
                </nav>

                {/* Sidebar - mobile/tablet (select) */}
                <div className="lg:hidden p-3 border-b border-border-default bg-surface-page/50">
                    <select
                        className="input w-full text-sm"
                        value={selectedId ?? ''}
                        onChange={(e) => setSelectedId(e.target.value || null)}
                    >
                        <option value="">{t('buildingDetail.select_section')}</option>
                        {ARAZIO_SECTIONS.map((section) => (
                            <option key={section.id} value={section.id}>
                                {section.number}. {section.label}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Contenuto */}
                <div className="flex-1 min-w-0 p-6">
                    {selectedSection ? (
                        <div>
                            <div className="flex items-center gap-3 mb-6">
                                <span className="flex items-center justify-center h-10 w-10 rounded-xl bg-primary-100 text-primary-600">
                                    <DocumentTextIcon className="h-5 w-5"/>
                                </span>
                                <div>
                                    <h3 className="text-lg font-semibold text-text-primary">
                                        {selectedSection.label}
                                    </h3>
                                    <p className="text-xs text-text-muted">
                                        {t('buildingDetail.section')} {selectedSection.number} {t('buildingDetail.of')} {ARAZIO_SECTIONS.length}
                                    </p>
                                </div>
                            </div>
                            <div className="rounded-xl border border-dashed border-border-strong bg-surface-page/30 p-10 text-center">
                                <DocumentTextIcon className="h-10 w-10 text-text-disabled mx-auto mb-3"/>
                                <p className="text-sm text-text-muted">{t('buildingDetail.section_empty')}</p>
                            </div>
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center py-12 text-center">
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

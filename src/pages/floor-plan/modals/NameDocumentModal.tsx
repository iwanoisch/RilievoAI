import {FC, useState} from "react";
import {useTranslation} from "react-i18next";
import {DocumentTextIcon} from "@heroicons/react/24/outline";
import {useBuilding} from "../../../features/building/hooks/useBuilding.ts";
import type {NameDocumentModalProps} from "./nameDocumentModal.type.ts";

export const NameDocumentModal: FC<NameDocumentModalProps> = ({defaultName, defaultBuildingId, onConfirm, onClose}) => {
    const {t} = useTranslation();
    const {elements} = useBuilding();
    const [name, setName] = useState(defaultName);
    const [buildingId, setBuildingId] = useState<string | null>(defaultBuildingId ?? null);

    const buildings = Object.values(elements).filter(el => el.type === 'building');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const trimmed = name.trim();
        if (trimmed) onConfirm(trimmed, buildingId);
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={onClose}>
            <div className="card w-full max-w-md" onClick={e => e.stopPropagation()}>
                <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 rounded-lg bg-primary-100 text-primary-600">
                        <DocumentTextIcon className="h-6 w-6"/>
                    </div>
                    <h2 className="text-lg font-semibold text-text-primary">{t('floorPlan.name_document')}</h2>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="flex flex-col gap-4">
                        <div>
                            <label className="block text-sm font-medium text-text-secondary mb-1">
                                {t('floorPlan.document_name')}
                            </label>
                            <input
                                type="text"
                                value={name}
                                onChange={e => setName(e.target.value)}
                                className="input w-full"
                                placeholder={t('floorPlan.document_name_placeholder')}
                                autoFocus
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-text-secondary mb-1">
                                {t('floorPlan.associated_building')}
                            </label>
                            {buildings.length > 0 ? (
                                <select
                                    value={buildingId ?? ''}
                                    onChange={e => setBuildingId(e.target.value || null)}
                                    className="input w-full"
                                >
                                    <option value="">{t('floorPlan.no_building')}</option>
                                    {buildings.map(b => (
                                        <option key={b.id} value={b.id}>{b.label}</option>
                                    ))}
                                </select>
                            ) : (
                                <p className="text-sm text-text-muted italic">{t('floorPlan.no_buildings_available')}</p>
                            )}
                        </div>
                    </div>

                    <div className="flex justify-end gap-3 mt-6">
                        <button type="button" onClick={onClose} className="btn btn-ghost min-h-[44px]">
                            {t('common.cancel')}
                        </button>
                        <button
                            type="submit"
                            disabled={!name.trim()}
                            className="btn btn-primary min-h-[44px]"
                        >
                            {t('common.confirm')}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

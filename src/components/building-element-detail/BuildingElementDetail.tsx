import React, {FC} from "react";
import {useTranslation} from "react-i18next";
import {useSurvey} from "../../features/survey/hooks/useSurvey.ts";
import {PencilIcon, TrashIcon} from "@heroicons/react/24/solid";
import type {BuildingElementDetailProps} from "./buildingElementDetail.type.ts";
import {BUILDING_ELEMENT_CONFIG} from "../../constants/building-element-config.constant.ts";

export const BuildingElementDetail: FC<BuildingElementDetailProps> = ({element, onEdit, onDelete}) => {
    const {t, i18n} = useTranslation();
    const {photos, voiceObservations, measurements} = useSurvey();

    const associatedPhotos = photos.filter(p => p.targetElementId === element.id);
    const associatedVoice = voiceObservations.filter(v => v.targetElementId === element.id);
    const associatedMeasurements = measurements.filter(m => m.elementId === element.id);

    const config = BUILDING_ELEMENT_CONFIG[element.type];

    const formatDate = (dateStr: string): string => {
        return new Date(dateStr).toLocaleDateString(i18n.language, {day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit'});
    };

    const renderFieldValue = (key: string): string | undefined => {
        const val = (element as unknown as Record<string, unknown>)[key];
        if (val === undefined || val === null || val === '') return undefined;

        const fieldConfig = config.fields.find(f => f.key === key);
        if (!fieldConfig) return String(val);

        if (fieldConfig.type === 'select' && fieldConfig.options) {
            const option = fieldConfig.options.find(o => o.value === val);
            return option ? t(option.labelKey) : String(val);
        }

        if (fieldConfig.unit) return `${val} ${fieldConfig.unit}`;

        return String(val);
    };

    const renderField = (label: string, value: string | undefined): React.ReactElement | null => {
        if (value === undefined) return null;
        return (
            <div className="flex justify-between py-1.5 border-b border-border-light last:border-0">
                <span className="text-sm text-text-muted">{label}</span>
                <span className="text-sm text-text-primary font-medium">{value}</span>
            </div>
        );
    };

    return (
        <div className="flex flex-col gap-4">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h3 className="text-base font-semibold text-text-primary">{element.label}</h3>
                    <span className="badge badge-primary mt-1">{t('building.' + element.type)}</span>
                </div>
                <div className="flex items-center gap-2">
                    <button
                        onClick={() => onEdit(element)}
                        className="btn btn-outline min-h-[44px] min-w-[44px] flex items-center gap-2"
                        aria-label={t('common.edit')}
                    >
                        <PencilIcon className="h-4 w-4"/>
                        <span className="hidden sm:inline">{t('common.edit')}</span>
                    </button>
                    <button
                        onClick={() => onDelete(element.id)}
                        className="btn min-h-[44px] min-w-[44px] flex items-center gap-2 border border-error-light text-error hover:bg-error-light transition-colors"
                        aria-label={t('common.delete')}
                    >
                        <TrashIcon className="h-4 w-4"/>
                        <span className="hidden sm:inline">{t('common.delete')}</span>
                    </button>
                </div>
            </div>

            {/* Info — campi dinamici dal config */}
            <div className="card p-4">
                {renderField(t('building.created_at'), formatDate(element.createdAt))}
                {renderField(t('building.updated_at'), formatDate(element.updatedAt))}
                {config.fields.map(field => (
                    <React.Fragment key={field.key}>
                        {renderField(t(field.labelKey), renderFieldValue(field.key))}
                    </React.Fragment>
                ))}
            </div>

            {/* Foto associate */}
            {associatedPhotos.length > 0 && (
                <div>
                    <h4 className="text-sm font-semibold text-text-secondary mb-2">
                        {t('building.associated_photos')} ({associatedPhotos.length})
                    </h4>
                    <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                        {associatedPhotos.map(photo => (
                            <div key={photo.id} className="aspect-square rounded-lg overflow-hidden border border-border-light">
                                <img
                                    src={photo.thumbnailPath || photo.mediaPath}
                                    alt={photo.viewDirection || ''}
                                    className="w-full h-full object-cover"
                                />
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Note vocali associate */}
            {associatedVoice.length > 0 && (
                <div>
                    <h4 className="text-sm font-semibold text-text-secondary mb-2">
                        {t('building.associated_voice')} ({associatedVoice.length})
                    </h4>
                    <div className="flex flex-col gap-2">
                        {associatedVoice.map(voice => (
                            <div key={voice.id} className="card p-3">
                                {voice.transcription && (
                                    <p className="text-sm text-text-primary">{voice.transcription}</p>
                                )}
                                <span className="text-xs text-text-muted mt-1 block">{formatDate(voice.timestamp)}</span>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Misure associate */}
            {associatedMeasurements.length > 0 && (
                <div>
                    <h4 className="text-sm font-semibold text-text-secondary mb-2">
                        {t('building.associated_measurements')} ({associatedMeasurements.length})
                    </h4>
                    <div className="flex flex-col gap-2">
                        {associatedMeasurements.map(m => (
                            <div key={m.id} className="card p-3 flex justify-between items-center">
                                <span className="text-sm text-text-primary">{t('survey.' + m.type)}</span>
                                <span className="text-sm font-medium text-text-primary">{m.value} {m.unit}</span>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Nessun dato associato */}
            {associatedPhotos.length === 0 && associatedVoice.length === 0 && associatedMeasurements.length === 0 && (
                <p className="text-sm text-text-muted text-center py-4">{t('building.no_associated_data')}</p>
            )}
        </div>
    );
};

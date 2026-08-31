import {FC, useState} from "react";
import {useTranslation} from "react-i18next";
import {useSurvey} from "../../../features/survey/hooks/useSurvey.ts";
import {XMarkIcon, TrashIcon, ArrowsPointingOutIcon} from "@heroicons/react/24/solid";
import type {MarkerDetailModalProps} from "./markerDetailModal.type.ts";

export const MarkerDetailModal: FC<MarkerDetailModalProps> = ({marker, onClose, onUpdateAngle, onDelete, onReposition}) => {
    const {t, i18n} = useTranslation();
    const {photos} = useSurvey();
    const photo = photos.find(p => p.id === marker.photoId);
    const [angle, setAngle] = useState(marker.directionAngle ?? 0);

    const formatDate = (dateStr: string): string => {
        return new Date(dateStr).toLocaleDateString(i18n.language, {day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit'});
    };

    const handleSaveAngle = () => {
        onUpdateAngle(marker.photoId, angle);
        onClose();
    };

    const handleDelete = () => {
        onDelete(marker.photoId);
        onClose();
    };

    const handleReposition = () => {
        onReposition(marker.photoId);
        onClose();
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" onClick={onClose}>
            <div className="card w-full max-w-md mx-4 max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()} role="dialog" aria-modal="true">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-base font-semibold text-text-primary">{t('floorPlan.marker_detail')}</h3>
                    <button
                        onClick={onClose}
                        className="p-2 rounded-lg hover:bg-surface-hover transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center"
                        aria-label={t('common.close')}
                    >
                        <XMarkIcon className="h-5 w-5 text-text-muted"/>
                    </button>
                </div>

                {photo && (
                    <>
                        <img
                            src={photo.thumbnailPath || photo.mediaPath}
                            alt={photo.viewDirection || ''}
                            className="w-full rounded-lg mb-3"
                        />
                        <div className="flex flex-col gap-1 mb-4">
                            <div className="flex justify-between text-sm">
                                <span className="text-text-muted">{t('building.created_at')}</span>
                                <span className="text-text-primary">{formatDate(photo.timestamp)}</span>
                            </div>
                            {photo.viewDirection && (
                                <div className="flex justify-between text-sm">
                                    <span className="text-text-muted">{t('survey.view_direction')}</span>
                                    <span className="text-text-primary">{photo.viewDirection}</span>
                                </div>
                            )}
                        </div>
                    </>
                )}

                <div className="mb-4">
                    <label className="text-sm text-text-secondary mb-1 block">{t('floorPlan.direction_angle')}</label>
                    <div className="flex items-center gap-3">
                        <input
                            type="range"
                            min="0"
                            max="360"
                            value={angle}
                            onChange={(e) => setAngle(Number(e.target.value))}
                            className="flex-1"
                        />
                        <span className="text-sm text-text-primary font-medium w-12 text-right">{angle}°</span>
                    </div>
                </div>

                <div className="flex flex-col gap-2">
                    <div className="flex gap-2">
                        <button onClick={handleSaveAngle} className="btn btn-primary flex-1 min-h-[44px]">{t('common.save')}</button>
                        <button onClick={handleReposition} className="btn btn-outline flex-1 min-h-[44px] flex items-center justify-center gap-2">
                            <ArrowsPointingOutIcon className="h-4 w-4"/>
                            {t('floorPlan.reposition')}
                        </button>
                    </div>
                    <button onClick={handleDelete} className="btn btn-ghost text-error hover:bg-error-light min-h-[44px] flex items-center justify-center gap-2">
                        <TrashIcon className="h-4 w-4"/>
                        {t('floorPlan.remove_marker')}
                    </button>
                </div>
            </div>
        </div>
    );
};

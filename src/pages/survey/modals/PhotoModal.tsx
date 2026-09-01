import {FC, useCallback, useEffect, useRef, useState} from "react";
import {useCamera} from "../../../hooks/useCamera.ts";
import {useBuilding} from "../../../features/building/hooks/useBuilding.ts";
import {useSurvey} from "../../../features/survey/hooks/useSurvey.ts";
import {XMarkIcon} from "@heroicons/react/24/solid";
import {useTranslation} from "react-i18next";
import type {PhotoModalProps} from "./photoModal.type.ts";
import type {SurveyPhoto} from "../../../features/survey/slice/survey.type.ts";

export const PhotoModal: FC<PhotoModalProps> = ({editData, onClose, onSaved}) => {
    const {t} = useTranslation();
    const {isCameraActive, cameraError, startCamera, stopCamera, captureFrame} = useCamera();
    const survey = useSurvey();
    const {createPhoto} = survey;
    const {elements} = useBuilding();
    const videoRef = useRef<HTMLVideoElement>(null);
    const elementList = Object.values(elements);

    const [pendingPhoto, setPendingPhoto] = useState<SurveyPhoto | null>(editData || null);
    const [viewDirection, setViewDirection] = useState(editData?.viewDirection || '');
    const [targetElementId, setTargetElementId] = useState(editData?.targetElementId || '');
    const [hasChanges, setHasChanges] = useState(false);
    const [didRetake, setDidRetake] = useState(false);

    const isEditMode = !!editData;
    const originalViewDirection = editData?.viewDirection || '';
    const originalTargetElementId = editData?.targetElementId || '';

    // Detecte modifiche ai campi
    useEffect(() => {
        if (pendingPhoto) {
            const changed = viewDirection !== originalViewDirection || targetElementId !== originalTargetElementId || didRetake;
            setHasChanges(changed);
        }
    }, [viewDirection, targetElementId, didRetake, originalViewDirection, originalTargetElementId, pendingPhoto]);

    useEffect(() => {
        if (!pendingPhoto && videoRef.current) {
            startCamera(videoRef.current);
        }
        return () => stopCamera();
    }, [pendingPhoto, startCamera, stopCamera]);

    useEffect(() => {
        return () => stopCamera();
    }, [stopCamera]);

    const handleClose = useCallback(() => {
        stopCamera();
        onClose();
    }, [stopCamera, onClose]);

    useEffect(() => {
        const handleKey = (e: KeyboardEvent) => {
            if (e.key === 'Escape') handleClose();
        };
        window.addEventListener('keydown', handleKey);
        return () => window.removeEventListener('keydown', handleKey);
    }, [handleClose]);

    const handleTakePhoto = useCallback(async () => {
        const frame = captureFrame();
        if (!frame) return;
        const photo = await createPhoto(frame.mediaPath, frame.thumbnailPath);
        if (photo) {
            setPendingPhoto(photo);
            stopCamera();
            setHasChanges(true);
            setDidRetake(false);
        }
    }, [captureFrame, createPhoto, stopCamera]);

    const handleRetake = () => {
        if (pendingPhoto) {
            survey.deletePhoto(pendingPhoto.id);
        }
        setPendingPhoto(null);
        setViewDirection('');
        setTargetElementId('');
        setDidRetake(true);
    };

    const handleSave = () => {
        if (!pendingPhoto) return;
        const updatedPhoto: SurveyPhoto = {
            ...pendingPhoto,
            viewDirection: viewDirection || undefined,
            targetElementId: targetElementId || undefined,
        };
        survey.updatePhoto(updatedPhoto);
        stopCamera();
        onSaved?.(updatedPhoto);
        onClose();
    };

    const handleDone = () => {
        stopCamera();
        onClose();
    };

    return (
        <div className="fixed inset-0 z-50 bg-surface-page flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-border-default bg-surface-card">
                <h2 className="text-base font-semibold text-slate-700">
                    {isEditMode ? t('common.edit') : t('survey.photo')}
                </h2>
                <button
                    onClick={handleClose}
                    className="p-2 rounded-lg hover:bg-surface-hover transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center"
                    aria-label={t('common.close')}
                >
                    <XMarkIcon className="h-6 w-6 text-slate-500"/>
                </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-4">
                <div className="mx-auto w-full max-w-lg flex flex-col gap-4">
                    {pendingPhoto ? (
                        <img src={pendingPhoto.mediaPath} alt="" className="w-full rounded-xl"/>
                    ) : (
                        <div className="relative w-full">
                            {cameraError ? (
                                <div className="card flex flex-col items-center justify-center p-8 bg-error-light border border-error">
                                    <p className="text-error-dark text-sm text-center">{t('survey.camera_permission_denied')}</p>
                                </div>
                            ) : (
                                <>
                                    <video
                                        ref={videoRef}
                                        className="w-full rounded-xl bg-black aspect-video object-cover"
                                        playsInline muted autoPlay aria-hidden="true"
                                    />
                                    {isCameraActive && (
                                        <div className="absolute bottom-4 left-0 right-0 flex justify-center">
                                            <button
                                                onClick={handleTakePhoto}
                                                className="w-16 h-16 rounded-full bg-white border-4 border-slate-300 shadow-lg
                                                           flex items-center justify-center active:scale-95 transition-transform
                                                           hover:border-primary-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
                                                aria-label={t('survey.take_photo')}
                                            >
                                                <div className="w-12 h-12 rounded-full bg-white border-2 border-slate-400"/>
                                            </button>
                                        </div>
                                    )}
                                </>
                            )}
                        </div>
                    )}

                    {pendingPhoto && (
                        <>
                            <div>
                                <label className="text-sm text-slate-600 mb-1 block">{t('survey.view_direction')}</label>
                                <input
                                    type="text"
                                    value={viewDirection}
                                    onChange={(e) => setViewDirection(e.target.value)}
                                    className="input"
                                    placeholder={t('survey.view_direction_placeholder')}
                                />
                            </div>

                            <div>
                                <label className="text-sm text-slate-600 mb-1 block">{t('survey.measurement_element')}</label>
                                <select value={targetElementId} onChange={(e) => setTargetElementId(e.target.value)} className="input">
                                    <option value="">--</option>
                                    {elementList.map((el) => (
                                        <option key={el.id} value={el.id}>{el.label}</option>
                                    ))}
                                </select>
                            </div>
                        </>
                    )}
                </div>
            </div>

            {/* Footer */}
            {pendingPhoto ? (
                <div className="px-4 py-3 border-t border-border-default bg-surface-card flex gap-2">
                    <button onClick={handleRetake} className="btn btn-outline flex-1">{t('survey.retake')}</button>
                    {hasChanges ? (
                        <button onClick={handleSave} className="btn btn-primary flex-1">{t('common.save')}</button>
                    ) : (
                        <button onClick={handleDone} className="btn btn-primary flex-1">{t('common.close')}</button>
                    )}
                </div>
            ) : (
                <div className="px-4 py-3 border-t border-border-default bg-surface-card flex gap-2">
                    <button onClick={onClose} className="btn btn-outline flex-1">{t('common.cancel')}</button>
                </div>
            )}
        </div>
    );
};

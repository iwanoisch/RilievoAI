import {FC, useCallback, useEffect, useRef, useState} from "react";
import {useCamera} from "../../../hooks/useCamera.ts";
import {useBuilding} from "../../../features/building/hooks/useBuilding.ts";
import {useSurvey} from "../../../features/survey/hooks/useSurvey.ts";
import {XMarkIcon, ArrowUpTrayIcon, CameraIcon, ExclamationCircleIcon} from "@heroicons/react/24/solid";
import {useTranslation} from "react-i18next";
import {ACCEPTED_PHOTO_FORMATS, MAX_BATCH_PHOTO_COUNT} from "../../../constants/file-formats.constant.ts";
import type {PhotoModalProps, PhotoModalTab} from "./photoModal.type.ts";
import type {SurveyPhoto} from "../../../features/survey/slice/survey.type.ts";
import type {PhotoUploadJob} from "../../../features/survey/slice/survey.type.ts";

export const PhotoModal: FC<PhotoModalProps> = ({editData, onClose, onSaved, onBatchSaved}) => {
    const {t} = useTranslation();
    const {isCameraActive, cameraError, startCamera, stopCamera, captureFrame} = useCamera();
    const survey = useSurvey();
    const {createPhoto, createPhotosFromFiles, savePhotos} = survey;
    const {elements} = useBuilding();
    const videoRef = useRef<HTMLVideoElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const elementList = Object.values(elements);

    const isEditMode = !!editData;
    const [activeTab, setActiveTab] = useState<PhotoModalTab>(isEditMode ? 'capture' : 'capture');

    // --- Capture state ---
    const [pendingPhoto, setPendingPhoto] = useState<SurveyPhoto | null>(editData || null);
    const [viewDirection, setViewDirection] = useState(editData?.viewDirection || '');
    const [targetElementId, setTargetElementId] = useState(editData?.targetElementId || '');
    const [hasChanges, setHasChanges] = useState(false);
    const [didRetake, setDidRetake] = useState(false);

    const originalViewDirection = editData?.viewDirection || '';
    const originalTargetElementId = editData?.targetElementId || '';

    // --- Upload state ---
    const [uploadJobs, setUploadJobs] = useState<PhotoUploadJob[]>([]);
    const [pendingUploadPhotos, setPendingUploadPhotos] = useState<SurveyPhoto[]>([]);
    const [isUploading, setIsUploading] = useState(false);
    const [isDragging, setIsDragging] = useState(false);

    // --- Capture effects ---
    useEffect(() => {
        if (pendingPhoto) {
            const changed = viewDirection !== originalViewDirection || targetElementId !== originalTargetElementId || didRetake;
            setHasChanges(changed);
        }
    }, [viewDirection, targetElementId, didRetake, originalViewDirection, originalTargetElementId, pendingPhoto]);

    // Cleanup camera on unmount
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

    // --- Tab switch ---
    const handleTabChange = (tab: PhotoModalTab) => {
        if (isEditMode) return;
        stopCamera();
        setActiveTab(tab);
    };

    const handleStartCamera = useCallback(() => {
        if (videoRef.current) {
            startCamera(videoRef.current);
        }
    }, [startCamera]);

    // --- Capture handlers ---
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

    // --- Upload handlers ---
    const processFiles = async (files: File[]) => {
        const totalCount = pendingUploadPhotos.length + files.length;
        if (totalCount > MAX_BATCH_PHOTO_COUNT) {
            setUploadJobs(prev => [...prev, {
                tempId: 'error-limit',
                fileName: '',
                preview: '',
                status: 'error',
                photo: null,
                error: t('survey.upload_batch_limit', {max: MAX_BATCH_PHOTO_COUNT}),
                progress: 100,
            }]);
            return;
        }

        setIsUploading(true);
        const createdPhotos = await createPhotosFromFiles(files, (jobs) => {
            setUploadJobs(prev => {
                const withoutOldCompleted = prev.filter(j => j.status !== 'pending' && j.status !== 'processing');
                return [...withoutOldCompleted, ...jobs];
            });
        });
        setIsUploading(false);

        if (createdPhotos.length > 0) {
            setPendingUploadPhotos(prev => [...prev, ...createdPhotos]);
        }
    };

    const handleRemoveUploadPhoto = (photoId: string) => {
        setPendingUploadPhotos(prev => prev.filter(p => p.id !== photoId));
        setUploadJobs(prev => prev.filter(j => j.photo?.id !== photoId));
    };

    const handleSaveUpload = () => {
        if (pendingUploadPhotos.length === 0) return;
        savePhotos(pendingUploadPhotos);
        onBatchSaved?.(pendingUploadPhotos);
        onClose();
    };

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || []);
        if (files.length > 0) processFiles(files);
        if (fileInputRef.current) fileInputRef.current.value = '';
    };

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
        const files = Array.from(e.dataTransfer.files);
        if (files.length > 0) processFiles(files);
    };

    const errorCount = uploadJobs.filter(j => j.status === 'error').length;

    // --- Render ---
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

            {/* Tabs (solo se non in edit mode) */}
            {!isEditMode && (
                <div className="flex border-b border-border-default bg-surface-card">
                    <button
                        onClick={() => handleTabChange('capture')}
                        className={`flex-1 flex items-center justify-center gap-2 py-3 text-sm font-medium transition-colors min-h-[44px]
                            ${activeTab === 'capture'
                            ? 'text-primary-600 border-b-2 border-primary-500'
                            : 'text-text-muted hover:text-text-secondary'
                        }`}
                    >
                        <CameraIcon className="h-4 w-4"/>
                        {t('survey.tab_capture')}
                    </button>
                    <button
                        onClick={() => handleTabChange('upload')}
                        className={`flex-1 flex items-center justify-center gap-2 py-3 text-sm font-medium transition-colors min-h-[44px]
                            ${activeTab === 'upload'
                            ? 'text-primary-600 border-b-2 border-primary-500'
                            : 'text-text-muted hover:text-text-secondary'
                        }`}
                    >
                        <ArrowUpTrayIcon className="h-4 w-4"/>
                        {t('survey.tab_upload')}
                    </button>
                </div>
            )}

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-4">
                <div className="mx-auto w-full max-w-lg flex flex-col gap-4">

                    {/* ===== TAB: CAPTURE ===== */}
                    {activeTab === 'capture' && (
                        <>
                            {pendingPhoto ? (
                                <img src={pendingPhoto.mediaPath} alt="" className="w-full rounded-xl"/>
                            ) : (
                                <div className="relative w-full">
                                    {cameraError ? (
                                        <div className="card flex flex-col items-center justify-center p-8 bg-error-light border border-error">
                                            <p className="text-error-dark text-sm text-center">{t('survey.camera_permission_denied')}</p>
                                        </div>
                                    ) : isCameraActive ? (
                                        <>
                                            <video
                                                ref={videoRef}
                                                className="w-full rounded-xl bg-black aspect-video object-cover"
                                                playsInline muted autoPlay aria-hidden="true"
                                            />
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
                                        </>
                                    ) : (
                                        <div className="card flex flex-col items-center justify-center p-8 gap-4">
                                            <CameraIcon className="h-12 w-12 text-text-muted"/>
                                            <video ref={videoRef} className="hidden" playsInline muted/>
                                            <button
                                                onClick={handleStartCamera}
                                                className="btn btn-primary"
                                            >
                                                {t('survey.start_camera')}
                                            </button>
                                        </div>
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
                        </>
                    )}

                    {/* ===== TAB: UPLOAD ===== */}
                    {activeTab === 'upload' && (
                        <>
                            {/* Drop zone */}
                            <div
                                onDragOver={handleDragOver}
                                onDragLeave={handleDragLeave}
                                onDrop={handleDrop}
                                onClick={() => !isUploading && fileInputRef.current?.click()}
                                className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all
                                    ${isDragging
                                    ? 'border-primary-500 bg-primary-50'
                                    : 'border-border-default hover:border-primary-300 hover:bg-surface-hover'
                                }
                                    ${isUploading ? 'pointer-events-none opacity-60' : ''}`}
                            >
                                <ArrowUpTrayIcon className="h-10 w-10 text-text-muted mx-auto mb-3"/>
                                <p className="text-sm text-text-secondary font-medium">{t('survey.upload_drag_drop')}</p>
                                <p className="text-xs text-text-muted mt-1">{t('survey.upload_formats')}</p>
                                <input
                                    ref={fileInputRef}
                                    type="file"
                                    accept={ACCEPTED_PHOTO_FORMATS}
                                    multiple
                                    onChange={handleFileSelect}
                                    className="hidden"
                                />
                            </div>

                            {/* Foto pronte (eliminabili) */}
                            {pendingUploadPhotos.length > 0 && (
                                <div className="flex flex-col gap-2">
                                    <div className="flex items-center justify-between text-sm">
                                        <span className="text-text-secondary font-medium">
                                            {t('survey.upload_count', {count: pendingUploadPhotos.length})}
                                        </span>
                                        {errorCount > 0 && (
                                            <span className="text-error text-xs">{errorCount} {t('survey.upload_error').toLowerCase()}</span>
                                        )}
                                    </div>

                                    <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                                        {pendingUploadPhotos.map(photo => (
                                            <div key={photo.id} className="relative rounded-lg overflow-hidden border border-border-light aspect-square bg-slate-50 group">
                                                <img src={photo.thumbnailPath || photo.mediaPath} alt="" className="w-full h-full object-cover"/>
                                                <button
                                                    onClick={() => handleRemoveUploadPhoto(photo.id)}
                                                    className="absolute top-1 right-1 p-1 rounded-full bg-black/50 text-white opacity-0 group-hover:opacity-100
                                                               transition-opacity min-w-[28px] min-h-[28px] flex items-center justify-center
                                                               hover:bg-error focus:opacity-100"
                                                    aria-label={t('common.delete')}
                                                >
                                                    <XMarkIcon className="h-4 w-4"/>
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Processing jobs (in corso) */}
                            {isUploading && uploadJobs.some(j => j.status === 'processing') && (
                                <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                                    {uploadJobs.filter(j => j.status === 'processing').map(job => (
                                        <div key={job.tempId} className="relative rounded-lg overflow-hidden border border-border-light aspect-square bg-slate-50">
                                            <div className="w-full h-full flex items-center justify-center">
                                                <CameraIcon className="h-6 w-6 text-text-muted"/>
                                            </div>
                                            <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center">
                                                <div className="h-5 w-5 rounded-full border-2 border-transparent border-t-white motion-safe:animate-spin"/>
                                                <span className="text-white text-[10px] mt-1">{job.progress}%</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}

                            {/* Errori */}
                            {uploadJobs.filter(j => j.status === 'error').map(job => (
                                <div key={job.tempId} className="flex items-center gap-2 p-2 rounded-lg bg-error-light border border-error">
                                    <ExclamationCircleIcon className="h-4 w-4 text-error flex-shrink-0"/>
                                    <span className="text-error-dark text-xs">{job.fileName}: {job.error}</span>
                                </div>
                            ))}
                        </>
                    )}
                </div>
            </div>

            {/* Footer */}
            {activeTab === 'capture' && pendingPhoto ? (
                <div className="px-4 py-3 border-t border-border-default bg-surface-card flex gap-2">
                    <button onClick={handleRetake} className="btn btn-outline flex-1">{t('survey.retake')}</button>
                    {hasChanges ? (
                        <button onClick={handleSave} className="btn btn-primary flex-1">{t('common.save')}</button>
                    ) : (
                        <button onClick={handleDone} className="btn btn-primary flex-1">{t('common.close')}</button>
                    )}
                </div>
            ) : activeTab === 'capture' && !pendingPhoto ? (
                <div className="px-4 py-3 border-t border-border-default bg-surface-card flex gap-2">
                    <button onClick={onClose} className="btn btn-outline flex-1">{t('common.cancel')}</button>
                </div>
            ) : activeTab === 'upload' && (
                <div className="px-4 py-3 border-t border-border-default bg-surface-card flex gap-2">
                    <button onClick={onClose} className="btn btn-outline flex-1">{t('common.cancel')}</button>
                    {pendingUploadPhotos.length > 0 && !isUploading && (
                        <button onClick={handleSaveUpload} className="btn btn-primary flex-1">{t('common.save')}</button>
                    )}
                </div>
            )}
        </div>
    );
};

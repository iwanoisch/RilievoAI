import {FC, useCallback, useEffect, useRef, useState} from "react";
import {useTranslation} from "react-i18next";
import {useCamera} from "../../../../hooks/useCamera.ts";
import {CameraIcon, XMarkIcon} from "@heroicons/react/24/solid";
import type {RilievoCaptureModalProps} from "./rilievoModals.type.ts";
import type {RilievoPhoto} from "../../../../features/rilievo/rilievo.type.ts";

export const RilievoPhotoModal: FC<RilievoCaptureModalProps> = ({itemId, onSave, onClose}) => {
    const {t} = useTranslation();
    const {isCameraActive, cameraError, startCamera, stopCamera, captureFrame} = useCamera();
    const videoRef = useRef<HTMLVideoElement>(null);

    const [capturedUri, setCapturedUri] = useState<string | null>(null);
    const [photoName, setPhotoName] = useState('');
    const defaultName = `foto-${new Date().toISOString().slice(0, 19).replace(/[T:]/g, '-')}`;

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

    const handleStartCamera = useCallback(() => {
        if (videoRef.current) {
            startCamera(videoRef.current);
        }
    }, [startCamera]);

    const handleCapture = useCallback(() => {
        const frame = captureFrame();
        if (!frame) return;
        setCapturedUri(frame.mediaPath);
        stopCamera();
    }, [captureFrame, stopCamera]);

    const handleRetake = () => {
        setCapturedUri(null);
        setPhotoName('');
    };

    const handleSave = () => {
        if (!capturedUri) return;
        const photo: RilievoPhoto = {
            id: `photo-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
            itemId,
            uri: capturedUri,
            timestamp: new Date().toISOString(),
            note: photoName.trim() || defaultName,
        };
        onSave(photo);
        onClose();
    };

    return (
        <div className="fixed inset-0 z-50 bg-surface-page flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-border-default bg-surface-card">
                <h2 className="text-base font-semibold text-slate-700">
                    {t('rilievo.modal_photo_title')}
                </h2>
                <button
                    onClick={handleClose}
                    className="p-2 rounded-lg hover:bg-surface-hover transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center"
                    aria-label={t('rilievo.modal_cancel')}
                >
                    <XMarkIcon className="h-6 w-6 text-slate-500"/>
                </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-4">
                <div className="mx-auto w-full max-w-lg flex flex-col gap-4">
                    {capturedUri ? (
                        <>
                            <img src={capturedUri} alt="" className="w-full rounded-xl"/>
                            <div>
                                <label htmlFor="rilievo-photo-name" className="text-sm text-slate-600 mb-1 block">
                                    {t('rilievo.modal_photo_name')}
                                </label>
                                <input
                                    id="rilievo-photo-name"
                                    name="rilievo-photo-name"
                                    type="text"
                                    value={photoName}
                                    onChange={(e) => setPhotoName(e.target.value)}
                                    className="input"
                                    placeholder={defaultName}
                                />
                            </div>
                        </>
                    ) : (
                        <div className="relative w-full">
                            {cameraError && (
                                <div className="card flex flex-col items-center justify-center p-8 bg-error-light border border-error">
                                    <p className="text-error-dark text-sm text-center">{t('rilievo.camera_error')}</p>
                                </div>
                            )}

                            {/* Video element sempre montato per mantenere srcObject */}
                            <video
                                ref={videoRef}
                                className={`w-full rounded-xl bg-black aspect-video object-cover ${isCameraActive ? '' : 'hidden'}`}
                                playsInline muted autoPlay aria-hidden="true"
                            />

                            {isCameraActive && (
                                <div className="absolute bottom-4 left-0 right-0 flex justify-center">
                                    <button
                                        onClick={handleCapture}
                                        className="w-16 h-16 rounded-full bg-white border-4 border-slate-300 shadow-lg
                                                   flex items-center justify-center active:scale-95 transition-transform
                                                   hover:border-primary-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
                                        aria-label={t('rilievo.btn_capture')}
                                    >
                                        <div className="w-12 h-12 rounded-full bg-white border-2 border-slate-400"/>
                                    </button>
                                </div>
                            )}

                            {!isCameraActive && !cameraError && (
                                <div className="card flex flex-col items-center justify-center p-8 gap-4">
                                    <CameraIcon className="h-12 w-12 text-text-muted"/>
                                    <button
                                        onClick={handleStartCamera}
                                        className="btn btn-primary min-h-[44px]"
                                    >
                                        {t('rilievo.start_camera')}
                                    </button>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>

            {/* Footer */}
            {capturedUri ? (
                <div className="px-4 py-3 border-t border-border-default bg-surface-card flex gap-2">
                    <button onClick={handleRetake} className="btn btn-outline flex-1 min-h-[44px]">
                        {t('rilievo.btn_retake')}
                    </button>
                    <button onClick={handleSave} className="btn btn-primary flex-1 min-h-[44px]">
                        {t('rilievo.modal_save')}
                    </button>
                </div>
            ) : (
                <div className="px-4 py-3 border-t border-border-default bg-surface-card flex gap-2">
                    <button onClick={handleClose} className="btn btn-outline flex-1 min-h-[44px]">
                        {t('rilievo.modal_cancel')}
                    </button>
                </div>
            )}
        </div>
    );
};

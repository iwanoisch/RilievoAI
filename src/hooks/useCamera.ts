import {useCallback, useRef, useState} from "react";
import type {CaptureResult} from "./useCamera.type.ts";

export const useCamera = () => {
    const videoRef = useRef<HTMLVideoElement | null>(null);
    const streamRef = useRef<MediaStream | null>(null);
    const [isCameraActive, setIsCameraActive] = useState(false);
    const [cameraError, setCameraError] = useState<string | null>(null);

    const startCamera = useCallback(async (video: HTMLVideoElement) => {
        try {
            // Check if getUserMedia is available (requires HTTPS on mobile)
            if (!navigator.mediaDevices?.getUserMedia) {
                setCameraError('Camera non supportata. Assicurati di usare HTTPS.');
                setIsCameraActive(false);
                return;
            }

            // Try rear camera first, then fallback to any camera
            let stream: MediaStream;
            try {
                stream = await navigator.mediaDevices.getUserMedia({
                    video: {facingMode: {ideal: 'environment'}},
                    audio: false,
                });
            } catch (_) {
                // Fallback: any available camera
                stream = await navigator.mediaDevices.getUserMedia({
                    video: true,
                    audio: false,
                });
            }

            video.setAttribute('autoplay', '');
            video.setAttribute('playsinline', '');
            video.setAttribute('muted', '');
            video.srcObject = stream;
            await video.play();
            videoRef.current = video;
            streamRef.current = stream;
            setIsCameraActive(true);
            setCameraError(null);
        } catch (error) {
            const err = error instanceof Error ? error : new Error('Errore accesso camera');
            if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
                setCameraError('Permesso fotocamera negato. Consenti l\'accesso nelle impostazioni del browser.');
            } else if (err.name === 'NotFoundError' || err.name === 'DevicesNotFoundError') {
                setCameraError('Nessuna fotocamera trovata sul dispositivo.');
            } else if (err.name === 'NotReadableError' || err.name === 'TrackStartError') {
                setCameraError('La fotocamera è in uso da un\'altra applicazione.');
            } else if (err.name === 'OverconstrainedError') {
                setCameraError('Fotocamera non compatibile con i requisiti richiesti.');
            } else {
                setCameraError(err.message || 'Impossibile accedere alla fotocamera.');
            }
            setIsCameraActive(false);
        }
    }, []);

    const stopCamera = useCallback(() => {
        if (streamRef.current) {
            streamRef.current.getTracks().forEach(track => track.stop());
            streamRef.current = null;
        }
        if (videoRef.current) {
            videoRef.current.srcObject = null;
            videoRef.current = null;
        }
        setIsCameraActive(false);
    }, []);

    const captureFrame = useCallback((): CaptureResult | null => {
        if (!videoRef.current) return null;

        const vw = videoRef.current.videoWidth;
        const vh = videoRef.current.videoHeight;
        if (vw === 0 || vh === 0) return null;

        const canvas = document.createElement('canvas');
        canvas.width = vw;
        canvas.height = vh;
        const ctx = canvas.getContext('2d');
        if (!ctx) return null;

        ctx.drawImage(videoRef.current, 0, 0);

        // Genera thumbnail
        const thumbCanvas = document.createElement('canvas');
        const thumbSize = 200;
        const ratio = Math.min(thumbSize / vw, thumbSize / vh);
        thumbCanvas.width = vw * ratio;
        thumbCanvas.height = vh * ratio;
        const thumbCtx = thumbCanvas.getContext('2d');
        thumbCtx?.drawImage(canvas, 0, 0, thumbCanvas.width, thumbCanvas.height);

        return {
            mediaPath: canvas.toDataURL('image/jpeg', 0.85),
            thumbnailPath: thumbCanvas.toDataURL('image/jpeg', 0.6),
        };
    }, []);

    return {
        isCameraActive,
        cameraError,
        startCamera,
        stopCamera,
        captureFrame,
    };
};

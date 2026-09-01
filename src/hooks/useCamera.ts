import {useCallback, useRef, useState} from "react";
import type {CaptureResult} from "./useCamera.type.ts";

export const useCamera = () => {
    const videoRef = useRef<HTMLVideoElement | null>(null);
    const streamRef = useRef<MediaStream | null>(null);
    const [isCameraActive, setIsCameraActive] = useState(false);
    const [cameraError, setCameraError] = useState<string | null>(null);

    const startCamera = useCallback(async (video: HTMLVideoElement) => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({
                video: {facingMode: 'environment', width: {ideal: 1920}, height: {ideal: 1080}},
                audio: false,
            });
            video.srcObject = stream;
            await video.play();
            videoRef.current = video;
            streamRef.current = stream;
            setIsCameraActive(true);
            setCameraError(null);
        } catch (error) {
            const message = error instanceof Error ? error.message : 'Errore accesso camera';
            setCameraError(message);
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

        const canvas = document.createElement('canvas');
        canvas.width = videoRef.current.videoWidth;
        canvas.height = videoRef.current.videoHeight;
        const ctx = canvas.getContext('2d');
        if (!ctx) return null;

        ctx.drawImage(videoRef.current, 0, 0);

        // Genera thumbnail
        const thumbCanvas = document.createElement('canvas');
        const thumbSize = 200;
        const ratio = Math.min(thumbSize / canvas.width, thumbSize / canvas.height);
        thumbCanvas.width = canvas.width * ratio;
        thumbCanvas.height = canvas.height * ratio;
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

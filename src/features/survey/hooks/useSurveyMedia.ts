import {useCallback, useRef, useState} from "react";
import {useAppSelector, store} from "../../../store/store.ts";
import type {SurveyPhoto, GeoPosition, DeviceOrient} from "../slice/survey.type.ts";

export const useSurveyMedia = () => {
    const currentSession = useAppSelector(state => state.survey.currentSession);
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

    const getGeolocation = (): Promise<GeoPosition | undefined> => {
        return new Promise((resolve) => {
            if (!navigator.geolocation) {
                resolve(undefined);
                return;
            }
            navigator.geolocation.getCurrentPosition(
                (pos) => resolve({
                    lat: pos.coords.latitude,
                    lon: pos.coords.longitude,
                    alt: pos.coords.altitude ?? undefined,
                    accuracy: pos.coords.accuracy,
                    timestamp: pos.timestamp,
                }),
                () => resolve(undefined),
                {enableHighAccuracy: true, timeout: 5000}
            );
        });
    };

    const getDeviceOrientation = (): Promise<DeviceOrient | undefined> => {
        return new Promise((resolve) => {
            const handler = (event: DeviceOrientationEvent) => {
                window.removeEventListener('deviceorientation', handler);
                resolve({alpha: event.alpha, beta: event.beta, gamma: event.gamma});
            };
            window.addEventListener('deviceorientation', handler);
            setTimeout(() => {
                window.removeEventListener('deviceorientation', handler);
                resolve(undefined);
            }, 1000);
        });
    };

    const takePhoto = useCallback(async (): Promise<SurveyPhoto | null> => {
        if (!videoRef.current || !currentSession) return null;

        const canvas = document.createElement('canvas');
        canvas.width = videoRef.current.videoWidth;
        canvas.height = videoRef.current.videoHeight;
        const ctx = canvas.getContext('2d');
        if (!ctx) return null;

        ctx.drawImage(videoRef.current, 0, 0);

        const [geolocation, deviceOrientation] = await Promise.all([
            getGeolocation(),
            getDeviceOrientation(),
        ]);

        const surveyState = store.getState().survey;
        const allIds = [
            ...surveyState.photos.map(p => Number(p.id) || 0),
            ...surveyState.voiceObservations.map(v => Number(v.id) || 0),
            ...surveyState.measurements.map(m => Number(m.id) || 0),
        ];
        const photoId = String(allIds.length > 0 ? Math.max(...allIds) + 1 : 1);
        const timestamp = new Date().toISOString();

        // Genera thumbnail
        const thumbCanvas = document.createElement('canvas');
        const thumbSize = 200;
        const ratio = Math.min(thumbSize / canvas.width, thumbSize / canvas.height);
        thumbCanvas.width = canvas.width * ratio;
        thumbCanvas.height = canvas.height * ratio;
        const thumbCtx = thumbCanvas.getContext('2d');
        thumbCtx?.drawImage(canvas, 0, 0, thumbCanvas.width, thumbCanvas.height);

        const mediaPath = canvas.toDataURL('image/jpeg', 0.85);
        const thumbnailPath = thumbCanvas.toDataURL('image/jpeg', 0.6);

        const photo: SurveyPhoto = {
            id: photoId,
            sessionId: currentSession.id,
            timestamp,
            geolocation,
            deviceOrientation,
            confidence: 50,
            dataStatus: 'RAW',
            mediaPath,
            thumbnailPath,
        };

        // Vibrazione feedback
        if (navigator.vibrate) {
            navigator.vibrate(50);
        }

        return photo;
    }, [currentSession]);

    return {
        isCameraActive,
        cameraError,
        startCamera,
        stopCamera,
        takePhoto,
    };
};

import {useAppDispatch, useAppSelector, store} from "../../../store/store.ts";
import {
    setCurrentSession,
    setPhotos,
    setVoiceObservations,
    setMeasurements,
    setValidationLog,
    setSurveyError,
    resetSurvey,
} from "../slice/surveySlice.ts";
import type {SurveySession, SurveyPhoto, VoiceObservation, Measurement, ObservationType, ValidationLogEntry, PhotoUploadJob} from "../slice/survey.type.ts";
import type {DataStatus} from "../../edificio/edificio.type.ts";
import {createMockSession, MOCK_PHOTOS, MOCK_VOICE_OBSERVATIONS, MOCK_MEASUREMENTS} from "../../../dataMock/MOCK_SURVEY.ts";
import {getGeolocation, getDeviceOrientation} from "../../../utility/device-utils.ts";
import {fileToImageData} from "../../../utility/image-utils.ts";
import {ACCEPTED_PHOTO_MIME_TYPES, MAX_PHOTO_FILE_SIZE_MB} from "../../../constants/file-formats.constant.ts";

export const useSurvey = () => {
    const dispatch = useAppDispatch();
    const surveyState = useAppSelector(state => state.survey);
    const {photos, voiceObservations, measurements, currentSession} = surveyState;
    const validationLog = surveyState.validationLog ?? [];

    // =====================
    // Session management
    // =====================

    const startSession = async (buildingId: string) => {
        try {
            // TODO real api: const response = await post<SurveySession>('/survey/sessions', {buildingId});
            const session: SurveySession = createMockSession(buildingId);
            dispatch(setCurrentSession(session));
            return {data: session};
        } catch (error) {
            const message = error instanceof Error ? error.message : 'Errore sconosciuto';
            dispatch(setSurveyError(message));
            return null;
        }
    };

    const pauseSession = () => {
        if (!currentSession) return;
        dispatch(setCurrentSession({...currentSession, status: 'paused'}));
    };

    const resumeSession = () => {
        if (!currentSession) return;
        dispatch(setCurrentSession({...currentSession, status: 'active'}));
    };

    const completeSession = () => {
        if (!currentSession) return;
        dispatch(setCurrentSession({
            ...currentSession,
            status: 'completed',
            endedAt: new Date().toISOString(),
        }));
    };

    const fetchSessionData = async (_sessionId: string) => {
        try {
            // TODO real api: const response = await get<{...}>(`/survey/sessions/${sessionId}/data`);
            dispatch(setPhotos(MOCK_PHOTOS));
            dispatch(setVoiceObservations(MOCK_VOICE_OBSERVATIONS));
            dispatch(setMeasurements(MOCK_MEASUREMENTS));
            return {data: {photos: MOCK_PHOTOS, voiceObservations: MOCK_VOICE_OBSERVATIONS, measurements: MOCK_MEASUREMENTS}};
        } catch (error) {
            const message = error instanceof Error ? error.message : 'Errore sconosciuto';
            dispatch(setSurveyError(message));
            return null;
        }
    };

    // =====================
    // ID generation
    // =====================

    const getNextObservationId = (): string => {
        const fresh = store.getState().survey;
        const allIds = [
            ...fresh.photos.map(p => Number(p.id) || 0),
            ...fresh.voiceObservations.map(v => Number(v.id) || 0),
            ...fresh.measurements.map(m => Number(m.id) || 0),
        ];
        return String(allIds.length > 0 ? Math.max(...allIds) + 1 : 1);
    };

    // =====================
    // Photo CRUD + creation
    // =====================

    const createPhoto = async (mediaPath: string, thumbnailPath: string): Promise<SurveyPhoto | null> => {
        if (!currentSession) return null;

        const [geolocation, deviceOrientation] = await Promise.all([
            getGeolocation(),
            getDeviceOrientation(),
        ]);

        const photo: SurveyPhoto = {
            id: getNextObservationId(),
            sessionId: currentSession.id,
            timestamp: new Date().toISOString(),
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

        dispatch(setPhotos([...photos, photo]));
        return photo;
    };

    const createPhotosFromFiles = async (
        files: File[],
        onProgress?: (jobs: PhotoUploadJob[]) => void,
    ): Promise<SurveyPhoto[]> => {
        if (!currentSession) return [];

        const maxBytes = MAX_PHOTO_FILE_SIZE_MB * 1024 * 1024;

        // Inizializza jobs
        const jobs: PhotoUploadJob[] = files.map((file, i) => ({
            tempId: `upload-${Date.now()}-${i}`,
            fileName: file.name,
            preview: '',
            status: 'pending',
            photo: null,
            error: null,
            progress: 0,
        }));

        onProgress?.(jobs);

        // Geo/orientation una sola volta per il batch
        const [geolocation, deviceOrientation] = await Promise.all([
            getGeolocation(),
            getDeviceOrientation(),
        ]);

        const createdPhotos: SurveyPhoto[] = [];
        let nextId = Number(getNextObservationId());

        for (let i = 0; i < files.length; i++) {
            const file = files[i];
            jobs[i] = {...jobs[i], status: 'processing', progress: 10};
            onProgress?.([...jobs]);

            // Validazione
            if (!ACCEPTED_PHOTO_MIME_TYPES[file.type]) {
                jobs[i] = {...jobs[i], status: 'error', error: `Formato non supportato: ${file.type}`, progress: 100};
                onProgress?.([...jobs]);
                continue;
            }

            if (file.size > maxBytes) {
                jobs[i] = {...jobs[i], status: 'error', error: `File troppo grande (max ${MAX_PHOTO_FILE_SIZE_MB}MB)`, progress: 100};
                onProgress?.([...jobs]);
                continue;
            }

            try {
                jobs[i] = {...jobs[i], progress: 30};
                onProgress?.([...jobs]);

                const {mediaPath, thumbnailPath} = await fileToImageData(file);

                jobs[i] = {...jobs[i], preview: thumbnailPath, progress: 70};
                onProgress?.([...jobs]);

                const photo: SurveyPhoto = {
                    id: String(nextId++),
                    sessionId: currentSession.id,
                    timestamp: new Date().toISOString(),
                    geolocation,
                    deviceOrientation,
                    confidence: 50,
                    dataStatus: 'RAW',
                    mediaPath,
                    thumbnailPath,
                };

                createdPhotos.push(photo);

                jobs[i] = {...jobs[i], status: 'completed', photo, progress: 100};
                onProgress?.([...jobs]);
            } catch (error) {
                const message = error instanceof Error ? error.message : 'Errore elaborazione';
                jobs[i] = {...jobs[i], status: 'error', error: message, progress: 100};
                onProgress?.([...jobs]);
            }
        }

        return createdPhotos;
    };

    const savePhotos = (newPhotos: SurveyPhoto[]) => {
        const freshPhotos = store.getState().survey.photos;
        dispatch(setPhotos([...freshPhotos, ...newPhotos]));
    };

    const addPhoto = async (photo: SurveyPhoto) => {
        try {
            // TODO real api: const response = await post<SurveyPhoto>('/survey/photos', photo);
            dispatch(setPhotos([...photos, photo]));
            return {data: photo};
        } catch (error) {
            const message = error instanceof Error ? error.message : 'Errore sconosciuto';
            dispatch(setSurveyError(message));
            return null;
        }
    };

    const updatePhoto = async (photo: SurveyPhoto) => {
        try {
            // TODO real api: const response = await put<SurveyPhoto>(`/survey/photos/${photo.id}`, photo);
            dispatch(setPhotos(photos.map(p => p.id === photo.id ? photo : p)));
            return {data: photo};
        } catch (error) {
            const message = error instanceof Error ? error.message : 'Errore sconosciuto';
            dispatch(setSurveyError(message));
            return null;
        }
    };

    const deletePhoto = async (photoId: string) => {
        try {
            // TODO real api: await del(`/survey/photos/${photoId}`);
            dispatch(setPhotos(photos.filter(p => p.id !== photoId)));
            return {success: true};
        } catch (error) {
            const message = error instanceof Error ? error.message : 'Errore sconosciuto';
            dispatch(setSurveyError(message));
            return null;
        }
    };

    // =====================
    // Voice CRUD
    // =====================

    const addVoiceObservation = async (observation: VoiceObservation) => {
        try {
            // TODO real api: const response = await post<VoiceObservation>('/survey/voice-observations', observation);
            dispatch(setVoiceObservations([...voiceObservations, observation]));
            return {data: observation};
        } catch (error) {
            const message = error instanceof Error ? error.message : 'Errore sconosciuto';
            dispatch(setSurveyError(message));
            return null;
        }
    };

    const updateVoiceObservation = async (observation: VoiceObservation) => {
        try {
            // TODO real api: const response = await put<VoiceObservation>(`/survey/voice-observations/${observation.id}`, observation);
            dispatch(setVoiceObservations(voiceObservations.map(v => v.id === observation.id ? observation : v)));
            return {data: observation};
        } catch (error) {
            const message = error instanceof Error ? error.message : 'Errore sconosciuto';
            dispatch(setSurveyError(message));
            return null;
        }
    };

    const deleteVoiceObservation = async (observationId: string) => {
        try {
            // TODO real api: await del(`/survey/voice-observations/${observationId}`);
            dispatch(setVoiceObservations(voiceObservations.filter(v => v.id !== observationId)));
            return {success: true};
        } catch (error) {
            const message = error instanceof Error ? error.message : 'Errore sconosciuto';
            dispatch(setSurveyError(message));
            return null;
        }
    };

    // =====================
    // Measurement CRUD
    // =====================

    const addMeasurement = async (measurement: Measurement) => {
        try {
            // TODO real api: const response = await post<Measurement>('/survey/measurements', measurement);
            dispatch(setMeasurements([...measurements, measurement]));
            return {data: measurement};
        } catch (error) {
            const message = error instanceof Error ? error.message : 'Errore sconosciuto';
            dispatch(setSurveyError(message));
            return null;
        }
    };

    const updateMeasurement = async (measurement: Measurement) => {
        try {
            // TODO real api: const response = await put<Measurement>(`/survey/measurements/${measurement.id}`, measurement);
            dispatch(setMeasurements(measurements.map(m => m.id === measurement.id ? measurement : m)));
            return {data: measurement};
        } catch (error) {
            const message = error instanceof Error ? error.message : 'Errore sconosciuto';
            dispatch(setSurveyError(message));
            return null;
        }
    };

    const deleteMeasurement = async (measurementId: string) => {
        try {
            // TODO real api: await del(`/survey/measurements/${measurementId}`);
            dispatch(setMeasurements(measurements.filter(m => m.id !== measurementId)));
            return {success: true};
        } catch (error) {
            const message = error instanceof Error ? error.message : 'Errore sconosciuto';
            dispatch(setSurveyError(message));
            return null;
        }
    };

    // =====================
    // Derived
    // =====================

    const getAllObservations = () => {
        const p = photos.map(p => ({...p, observationType: 'photo' as const}));
        const v = voiceObservations.map(v => ({...v, observationType: 'voice' as const}));
        const m = measurements.map(m => ({...m, observationType: 'measurement' as const}));
        return [...p, ...v, ...m].sort((a, b) => a.timestamp.localeCompare(b.timestamp));
    };

    const getObservationById = (id: string) => {
        const photo = photos.find(p => p.id === id);
        if (photo) return {data: photo, type: 'photo' as const};

        const voice = voiceObservations.find(v => v.id === id);
        if (voice) return {data: voice, type: 'voice' as const};

        const measurement = measurements.find(m => m.id === id);
        if (measurement) return {data: measurement, type: 'measurement' as const};

        return null;
    };

    // =====================
    // Validation
    // =====================

    const validateObservation = async (
        observationId: string,
        observationType: ObservationType,
        newStatus: DataStatus,
        newConfidence?: number,
        note?: string,
    ) => {
        try {
            // TODO real api: await put(`/survey/observations/${observationId}/validate`, {newStatus, newConfidence});
            const createLogEntry = (previousStatus: DataStatus, previousConfidence: number, finalConfidence: number): ValidationLogEntry => ({
                id: String(Date.now()),
                observationId,
                observationType,
                previousStatus,
                newStatus,
                previousConfidence,
                newConfidence: finalConfidence,
                timestamp: new Date().toISOString(),
                technicianId: currentSession?.technicianId ?? '',
                note,
            });

            if (observationType === 'photo') {
                const photo = photos.find(p => p.id === observationId);
                if (!photo) return null;
                const logEntry = createLogEntry(photo.dataStatus, photo.confidence, newConfidence ?? photo.confidence);
                dispatch(setPhotos(photos.map(p =>
                    p.id === observationId
                        ? {...p, dataStatus: newStatus, confidence: newConfidence ?? p.confidence}
                        : p
                )));
                dispatch(setValidationLog([...validationLog, logEntry]));
            }

            if (observationType === 'voice') {
                const voice = voiceObservations.find(v => v.id === observationId);
                if (!voice) return null;
                const logEntry = createLogEntry(voice.dataStatus, voice.confidence, newConfidence ?? voice.confidence);
                dispatch(setVoiceObservations(voiceObservations.map(v =>
                    v.id === observationId
                        ? {...v, dataStatus: newStatus, confidence: newConfidence ?? v.confidence}
                        : v
                )));
                dispatch(setValidationLog([...validationLog, logEntry]));
            }

            if (observationType === 'measurement') {
                const measurement = measurements.find(m => m.id === observationId);
                if (!measurement) return null;
                const logEntry = createLogEntry(measurement.dataStatus, measurement.confidence, newConfidence ?? measurement.confidence);
                dispatch(setMeasurements(measurements.map(m =>
                    m.id === observationId
                        ? {...m, dataStatus: newStatus, confidence: newConfidence ?? m.confidence}
                        : m
                )));
                dispatch(setValidationLog([...validationLog, logEntry]));
            }

            return {success: true};
        } catch (error) {
            const message = error instanceof Error ? error.message : 'Errore sconosciuto';
            dispatch(setSurveyError(message));
            return null;
        }
    };

    const confirmObservation = (observationId: string, observationType: ObservationType) => {
        return validateObservation(observationId, observationType, 'VALIDATED', 100);
    };

    const rejectObservation = (observationId: string, observationType: ObservationType, note?: string) => {
        return validateObservation(observationId, observationType, 'REJECTED', undefined, note);
    };

    const correctObservation = (observationId: string, observationType: ObservationType, newConfidence: number, note?: string) => {
        return validateObservation(observationId, observationType, 'VALIDATED', newConfidence, note);
    };

    const getLogForObservation = (observationId: string): ValidationLogEntry[] => {
        return validationLog.filter(l => l.observationId === observationId);
    };

    // Validation derived
    const allValidationItems = [
        ...photos.map(p => ({id: p.id, type: 'photo' as const, confidence: p.confidence, dataStatus: p.dataStatus, timestamp: p.timestamp})),
        ...voiceObservations.map(v => ({id: v.id, type: 'voice' as const, confidence: v.confidence, dataStatus: v.dataStatus, timestamp: v.timestamp})),
        ...measurements.map(m => ({id: m.id, type: 'measurement' as const, confidence: m.confidence, dataStatus: m.dataStatus, timestamp: m.timestamp})),
    ];

    const pendingValidation = allValidationItems
        .filter(o => o.dataStatus === 'PROPOSED' || o.dataStatus === 'DERIVED')
        .sort((a, b) => a.confidence - b.confidence);

    const validatedCount = allValidationItems.filter(o => o.dataStatus === 'VALIDATED').length;
    const rejectedCount = allValidationItems.filter(o => o.dataStatus === 'REJECTED').length;
    const totalCount = allValidationItems.length;
    const pendingCount = pendingValidation.length;

    // =====================
    // Reset
    // =====================

    const reset = () => {
        dispatch(resetSurvey());
    };

    return {
        ...surveyState,
        // Session
        startSession,
        pauseSession,
        resumeSession,
        completeSession,
        fetchSessionData,
        // Photo
        createPhoto,
        createPhotosFromFiles,
        savePhotos,
        addPhoto,
        updatePhoto,
        deletePhoto,
        // Voice
        addVoiceObservation,
        updateVoiceObservation,
        deleteVoiceObservation,
        // Measurement
        addMeasurement,
        updateMeasurement,
        deleteMeasurement,
        // Derived
        getAllObservations,
        getObservationById,
        getNextObservationId,
        // Validation
        validationLog,
        pendingValidation,
        validatedCount,
        rejectedCount,
        totalCount,
        pendingCount,
        validateObservation,
        confirmObservation,
        rejectObservation,
        correctObservation,
        getLogForObservation,
        // Reset
        reset,
    };
};

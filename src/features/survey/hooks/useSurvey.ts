import {useAppDispatch, useAppSelector, store} from "../../../store/store.ts";
import {
    setCurrentSession,
    setPhotos,
    setVoiceObservations,
    setMeasurements,
    setSurveyError,
    resetSurvey,
} from "../slice/surveySlice.ts";
import type {SurveySession, SurveyPhoto, VoiceObservation, Measurement} from "../slice/survey.type.ts";
import {createMockSession, MOCK_PHOTOS, MOCK_VOICE_OBSERVATIONS, MOCK_MEASUREMENTS} from "../../../dataMock/MOCK_SURVEY.ts";

export const useSurvey = () => {
    const dispatch = useAppDispatch();
    const surveyState = useAppSelector(state => state.survey);

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
        if (!surveyState.currentSession) return;
        dispatch(setCurrentSession({...surveyState.currentSession, status: 'paused'}));
    };

    const resumeSession = () => {
        if (!surveyState.currentSession) return;
        dispatch(setCurrentSession({...surveyState.currentSession, status: 'active'}));
    };

    const completeSession = () => {
        if (!surveyState.currentSession) return;
        dispatch(setCurrentSession({
            ...surveyState.currentSession,
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

    // --- Photo CRUD ---
    const addPhoto = async (photo: SurveyPhoto) => {
        try {
            // TODO real api: const response = await post<SurveyPhoto>('/survey/photos', photo);
            dispatch(setPhotos([...surveyState.photos, photo]));
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
            dispatch(setPhotos(surveyState.photos.map(p => p.id === photo.id ? photo : p)));
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
            dispatch(setPhotos(surveyState.photos.filter(p => p.id !== photoId)));
            return {success: true};
        } catch (error) {
            const message = error instanceof Error ? error.message : 'Errore sconosciuto';
            dispatch(setSurveyError(message));
            return null;
        }
    };

    // --- Voice CRUD ---
    const addVoiceObservation = async (observation: VoiceObservation) => {
        try {
            // TODO real api: const response = await post<VoiceObservation>('/survey/voice-observations', observation);
            dispatch(setVoiceObservations([...surveyState.voiceObservations, observation]));
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
            dispatch(setVoiceObservations(surveyState.voiceObservations.map(v => v.id === observation.id ? observation : v)));
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
            dispatch(setVoiceObservations(surveyState.voiceObservations.filter(v => v.id !== observationId)));
            return {success: true};
        } catch (error) {
            const message = error instanceof Error ? error.message : 'Errore sconosciuto';
            dispatch(setSurveyError(message));
            return null;
        }
    };

    // --- Measurement CRUD ---
    const addMeasurement = async (measurement: Measurement) => {
        try {
            // TODO real api: const response = await post<Measurement>('/survey/measurements', measurement);
            dispatch(setMeasurements([...surveyState.measurements, measurement]));
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
            dispatch(setMeasurements(surveyState.measurements.map(m => m.id === measurement.id ? measurement : m)));
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
            dispatch(setMeasurements(surveyState.measurements.filter(m => m.id !== measurementId)));
            return {success: true};
        } catch (error) {
            const message = error instanceof Error ? error.message : 'Errore sconosciuto';
            dispatch(setSurveyError(message));
            return null;
        }
    };

    // --- Derived ---
    const getAllObservations = () => {
        const photos = surveyState.photos.map(p => ({...p, observationType: 'photo' as const}));
        const voices = surveyState.voiceObservations.map(v => ({...v, observationType: 'voice' as const}));
        const measures = surveyState.measurements.map(m => ({...m, observationType: 'measurement' as const}));
        return [...photos, ...voices, ...measures].sort((a, b) => a.timestamp.localeCompare(b.timestamp));
    };

    const getObservationById = (id: string) => {
        const photo = surveyState.photos.find(p => p.id === id);
        if (photo) return {data: photo, type: 'photo' as const};

        const voice = surveyState.voiceObservations.find(v => v.id === id);
        if (voice) return {data: voice, type: 'voice' as const};

        const measurement = surveyState.measurements.find(m => m.id === id);
        if (measurement) return {data: measurement, type: 'measurement' as const};

        return null;
    };

    const getNextObservationId = (): string => {
        // Legge lo state fresco dal store per evitare stale closure
        const fresh = store.getState().survey;
        const allIds = [
            ...fresh.photos.map(p => Number(p.id) || 0),
            ...fresh.voiceObservations.map(v => Number(v.id) || 0),
            ...fresh.measurements.map(m => Number(m.id) || 0),
        ];
        return String(allIds.length > 0 ? Math.max(...allIds) + 1 : 1);
    };

    const reset = () => {
        dispatch(resetSurvey());
    };

    return {
        ...surveyState,
        startSession,
        pauseSession,
        resumeSession,
        completeSession,
        fetchSessionData,
        addPhoto,
        updatePhoto,
        deletePhoto,
        addVoiceObservation,
        updateVoiceObservation,
        deleteVoiceObservation,
        addMeasurement,
        updateMeasurement,
        deleteMeasurement,
        getAllObservations,
        getObservationById,
        getNextObservationId,
        reset,
    };
};

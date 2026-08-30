import {useAppDispatch, useAppSelector} from "../../../store/store.ts";
import {
    setCurrentSession,
    setSessionStatus,
    setSessionEndedAt,
    setPhoto,
    removePhoto,
    setVoiceObservation,
    removeVoiceObservation,
    setMeasurement,
    removeMeasurement,
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
        dispatch(setSessionStatus('paused'));
    };

    const resumeSession = () => {
        dispatch(setSessionStatus('active'));
    };

    const completeSession = () => {
        dispatch(setSessionStatus('completed'));
        dispatch(setSessionEndedAt(new Date().toISOString()));
    };

    const fetchSessionData = async (_sessionId: string) => {
        try {
            // TODO real api: const response = await get<{...}>(`/survey/sessions/${sessionId}/data`);
            MOCK_PHOTOS.forEach(p => dispatch(setPhoto(p)));
            MOCK_VOICE_OBSERVATIONS.forEach(v => dispatch(setVoiceObservation(v)));
            MOCK_MEASUREMENTS.forEach(m => dispatch(setMeasurement(m)));
            return {data: {photos: MOCK_PHOTOS, voiceObservations: MOCK_VOICE_OBSERVATIONS, measurements: MOCK_MEASUREMENTS}};
        } catch (error) {
            const message = error instanceof Error ? error.message : 'Errore sconosciuto';
            dispatch(setSurveyError(message));
            return null;
        }
    };

    const addPhoto = async (photo: SurveyPhoto) => {
        try {
            // TODO real api: const response = await post<SurveyPhoto>('/survey/photos', photo);
            dispatch(setPhoto(photo));
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
            dispatch(setPhoto(photo));
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
            dispatch(removePhoto(photoId));
            return {success: true};
        } catch (error) {
            const message = error instanceof Error ? error.message : 'Errore sconosciuto';
            dispatch(setSurveyError(message));
            return null;
        }
    };

    const addVoiceObservation = async (observation: VoiceObservation) => {
        try {
            // TODO real api: const response = await post<VoiceObservation>('/survey/voice-observations', observation);
            dispatch(setVoiceObservation(observation));
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
            dispatch(setVoiceObservation(observation));
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
            dispatch(removeVoiceObservation(observationId));
            return {success: true};
        } catch (error) {
            const message = error instanceof Error ? error.message : 'Errore sconosciuto';
            dispatch(setSurveyError(message));
            return null;
        }
    };

    const addMeasurement = async (measurement: Measurement) => {
        try {
            // TODO real api: const response = await post<Measurement>('/survey/measurements', measurement);
            dispatch(setMeasurement(measurement));
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
            dispatch(setMeasurement(measurement));
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
            dispatch(removeMeasurement(measurementId));
            return {success: true};
        } catch (error) {
            const message = error instanceof Error ? error.message : 'Errore sconosciuto';
            dispatch(setSurveyError(message));
            return null;
        }
    };

    const getAllObservations = () => {
        const photos = Object.values(surveyState.photos).map(p => ({...p, observationType: 'photo' as const}));
        const voices = Object.values(surveyState.voiceObservations).map(v => ({...v, observationType: 'voice' as const}));
        const measures = Object.values(surveyState.measurements).map(m => ({...m, observationType: 'measurement' as const}));
        return [...photos, ...voices, ...measures].sort((a, b) => a.timestamp.localeCompare(b.timestamp));
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
        reset,
    };
};

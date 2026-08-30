import {useAppDispatch, useAppSelector} from "../../../store/store.ts";
import {useApiClient} from "../../../hooks/useApiClient.ts";
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
import {MOCK_SURVEY_SESSION, MOCK_PHOTOS, MOCK_VOICE_OBSERVATIONS, MOCK_MEASUREMENTS} from "../../../dataMock/MOCK_SURVEY.ts";

export const useSurvey = () => {
    const dispatch = useAppDispatch();
    const surveyState = useAppSelector(state => state.survey);
    const {get, post} = useApiClient();

    const startSession = async (buildingId: string) => {
        try {
            const response = await post<SurveySession>('/survey/sessions', {buildingId});
            dispatch(setCurrentSession(response ?? {...MOCK_SURVEY_SESSION, buildingId}));
            return {data: response ?? MOCK_SURVEY_SESSION};
        } catch (error) {
            const message = error instanceof Error ? error.message : 'Errore avvio sessione';
            dispatch(setSurveyError(message));
            // Fallback mock
            dispatch(setCurrentSession({...MOCK_SURVEY_SESSION, buildingId}));
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

    const fetchSessionData = async (sessionId: string) => {
        try {
            const response = await get<{photos: SurveyPhoto[]; voiceObservations: VoiceObservation[]; measurements: Measurement[]}>(`/survey/sessions/${sessionId}/data`);
            if (response) {
                response.photos.forEach(p => dispatch(setPhoto(p)));
                response.voiceObservations.forEach(v => dispatch(setVoiceObservation(v)));
                response.measurements.forEach(m => dispatch(setMeasurement(m)));
                return {data: response};
            }
            // Fallback mock
            _loadMockData();
            return null;
        } catch (error) {
            const message = error instanceof Error ? error.message : 'Errore caricamento dati sessione';
            dispatch(setSurveyError(message));
            _loadMockData();
            return null;
        }
    };

    const _loadMockData = () => {
        MOCK_PHOTOS.forEach(p => dispatch(setPhoto(p)));
        MOCK_VOICE_OBSERVATIONS.forEach(v => dispatch(setVoiceObservation(v)));
        MOCK_MEASUREMENTS.forEach(m => dispatch(setMeasurement(m)));
    };

    const addPhoto = (photo: SurveyPhoto) => {
        dispatch(setPhoto(photo));
    };

    const deletePhoto = (photoId: string) => {
        dispatch(removePhoto(photoId));
    };

    const addVoiceObservation = (observation: VoiceObservation) => {
        dispatch(setVoiceObservation(observation));
    };

    const deleteVoiceObservation = (observationId: string) => {
        dispatch(removeVoiceObservation(observationId));
    };

    const addMeasurement = (measurement: Measurement) => {
        dispatch(setMeasurement(measurement));
    };

    const deleteMeasurement = (measurementId: string) => {
        dispatch(removeMeasurement(measurementId));
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
        deletePhoto,
        addVoiceObservation,
        deleteVoiceObservation,
        addMeasurement,
        deleteMeasurement,
        getAllObservations,
        reset,
    };
};

import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import type {
    Measurement, SurveyPhoto, SurveySession, SurveyState,
    VoiceObservation, ValidationLogEntry
} from "./survey.type.ts";

const initialState: SurveyState = {
    currentSession: null,
    photos: [],
    voiceObservations: [],
    measurements: [],
    validationLog: [],
    error: null,
};

export const surveySlice = createSlice({
    name: 'survey',
    initialState,
    reducers: {
        setCurrentSession: (state, action: PayloadAction<SurveySession | null>) => {
            state.currentSession = action.payload;
        },

        setPhotos: (state, action: PayloadAction<SurveyPhoto[]>) => {
            state.photos = action.payload;
        },

        setVoiceObservations: (state, action: PayloadAction<VoiceObservation[]>) => {
            state.voiceObservations = action.payload;
        },

        setMeasurements: (state, action: PayloadAction<Measurement[]>) => {
            state.measurements = action.payload;
        },

        setValidationLog: (state, action: PayloadAction<ValidationLogEntry[]>) => {
            state.validationLog = action.payload;
        },

        setSurveyError: (state, action: PayloadAction<string | null>) => {
            state.error = action.payload;
        },

        resetSurvey: () => initialState,
    },
});

export const {
    setCurrentSession,
    setPhotos,
    setVoiceObservations,
    setMeasurements,
    setValidationLog,
    setSurveyError,
    resetSurvey,
} = surveySlice.actions;

export default surveySlice.reducer;

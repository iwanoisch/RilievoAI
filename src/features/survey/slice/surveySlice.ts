import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import type {Measurement, SurveyPhoto, SurveySession, SurveyState, VoiceObservation} from "./survey.type.ts";

const initialState: SurveyState = {
    currentSession: null,
    photos: {},
    voiceObservations: {},
    measurements: {},
    error: null,
};

export const surveySlice = createSlice({
    name: 'survey',
    initialState,
    reducers: {
        setCurrentSession: (state, action: PayloadAction<SurveySession | null>) => {
            state.currentSession = action.payload;
        },

        setSessionStatus: (state, action: PayloadAction<SurveySession['status']>) => {
            if (state.currentSession) {
                state.currentSession.status = action.payload;
            }
        },

        setSessionEndedAt: (state, action: PayloadAction<string>) => {
            if (state.currentSession) {
                state.currentSession.endedAt = action.payload;
            }
        },

        setPhoto: (state, action: PayloadAction<SurveyPhoto>) => {
            state.photos[action.payload.id] = action.payload;
        },

        removePhoto: (state, action: PayloadAction<string>) => {
            delete state.photos[action.payload];
        },

        setVoiceObservation: (state, action: PayloadAction<VoiceObservation>) => {
            state.voiceObservations[action.payload.id] = action.payload;
        },

        removeVoiceObservation: (state, action: PayloadAction<string>) => {
            delete state.voiceObservations[action.payload];
        },

        setMeasurement: (state, action: PayloadAction<Measurement>) => {
            state.measurements[action.payload.id] = action.payload;
        },

        removeMeasurement: (state, action: PayloadAction<string>) => {
            delete state.measurements[action.payload];
        },

        setSurveyError: (state, action: PayloadAction<string | null>) => {
            state.error = action.payload;
        },

        resetSurvey: () => initialState,
    },
});

export const {
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
} = surveySlice.actions;

export default surveySlice.reducer;

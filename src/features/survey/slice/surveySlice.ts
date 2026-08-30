import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import type {Measurement, SurveyPhoto, SurveySession, SurveyState, VoiceObservation} from "./survey.type.ts";

const initialState: SurveyState = {
    currentSession: null,
    photos: [],
    voiceObservations: [],
    measurements: [],
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
            const idx = state.photos.findIndex(p => p.id === action.payload.id);
            if (idx !== -1) {
                state.photos[idx] = action.payload;
            } else {
                state.photos.push(action.payload);
            }
        },

        removePhoto: (state, action: PayloadAction<string>) => {
            state.photos = state.photos.filter(p => p.id !== action.payload);
        },

        setVoiceObservation: (state, action: PayloadAction<VoiceObservation>) => {
            const idx = state.voiceObservations.findIndex(v => v.id === action.payload.id);
            if (idx !== -1) {
                state.voiceObservations[idx] = action.payload;
            } else {
                state.voiceObservations.push(action.payload);
            }
        },

        removeVoiceObservation: (state, action: PayloadAction<string>) => {
            state.voiceObservations = state.voiceObservations.filter(v => v.id !== action.payload);
        },

        setMeasurement: (state, action: PayloadAction<Measurement>) => {
            const idx = state.measurements.findIndex(m => m.id === action.payload.id);
            if (idx !== -1) {
                state.measurements[idx] = action.payload;
            } else {
                state.measurements.push(action.payload);
            }
        },

        removeMeasurement: (state, action: PayloadAction<string>) => {
            state.measurements = state.measurements.filter(m => m.id !== action.payload);
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

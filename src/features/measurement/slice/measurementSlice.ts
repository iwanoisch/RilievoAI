import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import type {MeasurementEntry, MeasurementState} from "./measurement.type.ts";

const initialState: MeasurementState = {
    measurements: {},
    error: null,
};

export const measurementSlice = createSlice({
    name: 'measurement',
    initialState,
    reducers: {
        setMeasurementEntry: (state, action: PayloadAction<MeasurementEntry>) => {
            state.measurements[action.payload.id] = action.payload;
        },

        removeMeasurementEntry: (state, action: PayloadAction<string>) => {
            delete state.measurements[action.payload];
        },

        setMeasurementError: (state, action: PayloadAction<string | null>) => {
            state.error = action.payload;
        },

        resetMeasurement: () => initialState,
    },
});

export const {
    setMeasurementEntry,
    removeMeasurementEntry,
    setMeasurementError,
    resetMeasurement,
} = measurementSlice.actions;

export default measurementSlice.reducer;

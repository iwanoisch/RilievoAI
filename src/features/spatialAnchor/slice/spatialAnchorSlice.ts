import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import type {Landmark, SpatialAnchor, SpatialAnchorState} from "./spatialAnchor.type.ts";

const initialState: SpatialAnchorState = {
    anchors: {},
    landmarks: {},
    error: null,
};

export const spatialAnchorSlice = createSlice({
    name: 'spatialAnchor',
    initialState,
    reducers: {
        setAnchor: (state, action: PayloadAction<SpatialAnchor>) => {
            state.anchors[action.payload.id] = action.payload;
        },

        removeAnchor: (state, action: PayloadAction<string>) => {
            delete state.anchors[action.payload];
        },

        setLandmark: (state, action: PayloadAction<Landmark>) => {
            state.landmarks[action.payload.id] = action.payload;
        },

        removeLandmark: (state, action: PayloadAction<string>) => {
            delete state.landmarks[action.payload];
        },

        setSpatialAnchorError: (state, action: PayloadAction<string | null>) => {
            state.error = action.payload;
        },

        resetSpatialAnchor: () => initialState,
    },
});

export const {
    setAnchor,
    removeAnchor,
    setLandmark,
    removeLandmark,
    setSpatialAnchorError,
    resetSpatialAnchor,
} = spatialAnchorSlice.actions;

export default spatialAnchorSlice.reducer;

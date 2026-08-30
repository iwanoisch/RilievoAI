import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import type {FloorPlan, FloorPlanState, PhotoMarker} from "./floorPlan.type.ts";

const initialState: FloorPlanState = {
    floorPlans: {},
    selectedFloorPlanId: null,
    error: null,
};

export const floorPlanSlice = createSlice({
    name: 'floorPlan',
    initialState,
    reducers: {
        setFloorPlan: (state, action: PayloadAction<FloorPlan>) => {
            state.floorPlans[action.payload.id] = action.payload;
        },

        removeFloorPlan: (state, action: PayloadAction<string>) => {
            delete state.floorPlans[action.payload];
        },

        setSelectedFloorPlanId: (state, action: PayloadAction<string | null>) => {
            state.selectedFloorPlanId = action.payload;
        },

        setPhotoMarker: (state, action: PayloadAction<{ floorPlanId: string; marker: PhotoMarker }>) => {
            const fp = state.floorPlans[action.payload.floorPlanId];
            if (fp) {
                const idx = fp.photoMarkers.findIndex(m => m.photoId === action.payload.marker.photoId);
                if (idx !== -1) {
                    fp.photoMarkers[idx] = action.payload.marker;
                } else {
                    fp.photoMarkers.push(action.payload.marker);
                }
            }
        },

        removePhotoMarker: (state, action: PayloadAction<{ floorPlanId: string; photoId: string }>) => {
            const fp = state.floorPlans[action.payload.floorPlanId];
            if (fp) {
                fp.photoMarkers = fp.photoMarkers.filter(m => m.photoId !== action.payload.photoId);
            }
        },

        setFloorPlanError: (state, action: PayloadAction<string | null>) => {
            state.error = action.payload;
        },

        resetFloorPlan: () => initialState,
    },
});

export const {
    setFloorPlan,
    removeFloorPlan,
    setSelectedFloorPlanId,
    setPhotoMarker,
    removePhotoMarker,
    setFloorPlanError,
    resetFloorPlan,
} = floorPlanSlice.actions;

export default floorPlanSlice.reducer;

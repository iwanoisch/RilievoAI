import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import type {FloorPlanDocument, FloorPlanState} from "./floorPlan.type.ts";

const initialState: FloorPlanState = {
    documents: [],
    selectedDocumentId: null,
    selectedPageId: null,
    error: null,
};

export const floorPlanSlice = createSlice({
    name: 'floorPlan',
    initialState,
    reducers: {
        setDocuments: (state, action: PayloadAction<FloorPlanDocument[]>) => {
            state.documents = action.payload;
        },

        setSelectedDocumentId: (state, action: PayloadAction<string | null>) => {
            state.selectedDocumentId = action.payload;
        },

        setSelectedPageId: (state, action: PayloadAction<string | null>) => {
            state.selectedPageId = action.payload;
        },

        setFloorPlanError: (state, action: PayloadAction<string | null>) => {
            state.error = action.payload;
        },

        resetFloorPlan: () => initialState,
    },
});

export const {
    setDocuments,
    setSelectedDocumentId,
    setSelectedPageId,
    setFloorPlanError,
    resetFloorPlan,
} = floorPlanSlice.actions;

export default floorPlanSlice.reducer;

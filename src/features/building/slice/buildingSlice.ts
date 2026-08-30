import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import type {BuildingElement, BuildingState} from "./building.type.ts";

const initialState: BuildingState = {
    elements: {},
    selectedElementId: null,
    rootBuildingId: null,
    error: null,
};

export const buildingSlice = createSlice({
    name: 'building',
    initialState,
    reducers: {
        loadElements: (state, action: PayloadAction<{ elements: Record<string, BuildingElement>; rootBuildingId: string | null }>) => {
            state.elements = action.payload.elements;
            state.rootBuildingId = action.payload.rootBuildingId;
            state.error = null;
        },

        setElement: (state, action: PayloadAction<BuildingElement>) => {
            state.elements[action.payload.id] = action.payload;
        },

        removeElement: (state, action: PayloadAction<string>) => {
            delete state.elements[action.payload];
        },

        setSelectedElementId: (state, action: PayloadAction<string | null>) => {
            state.selectedElementId = action.payload;
        },

        setBuildingError: (state, action: PayloadAction<string | null>) => {
            state.error = action.payload;
        },

        resetBuilding: () => initialState,
    },
});

export const {
    loadElements,
    setElement,
    removeElement,
    setSelectedElementId,
    setBuildingError,
    resetBuilding,
} = buildingSlice.actions;

export default buildingSlice.reducer;

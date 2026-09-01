import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import type {EdificioElement, EdificioState} from "./edificio.type.ts";

const initialState: EdificioState = {
    elements: {},
    selectedElementId: null,
    rootBuildingId: null,
    error: null,
};

export const edificioSlice = createSlice({
    name: 'edificio',
    initialState,
    reducers: {
        loadElements: (state, action: PayloadAction<{ elements: Record<string, EdificioElement>; rootBuildingId: string | null }>) => {
            state.elements = action.payload.elements;
            state.rootBuildingId = action.payload.rootBuildingId;
            state.error = null;
        },

        setElement: (state, action: PayloadAction<EdificioElement>) => {
            state.elements[action.payload.id] = action.payload;
        },

        removeElement: (state, action: PayloadAction<string>) => {
            delete state.elements[action.payload];
        },

        setSelectedElementId: (state, action: PayloadAction<string | null>) => {
            state.selectedElementId = action.payload;
        },

        setEdificioError: (state, action: PayloadAction<string | null>) => {
            state.error = action.payload;
        },

        resetEdificio: () => initialState,
    },
});

export const {
    loadElements,
    setElement,
    removeElement,
    setSelectedElementId,
    setEdificioError,
    resetEdificio,
} = edificioSlice.actions;

export default edificioSlice.reducer;

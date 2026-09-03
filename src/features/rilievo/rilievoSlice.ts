import {createSlice} from "@reduxjs/toolkit";
import type {PayloadAction} from "@reduxjs/toolkit";
import type {RilievoItem, RilievoPhoto, RilievoAudio, RilievoMeasurement, RilievoState} from "./rilievo.type.ts";

const emptyRilievoState: RilievoState = {
    items: [],
    photos: [],
    audios: [],
    measurements: [],
    selectedItemId: null,
    generated: false,
    error: null,
};

interface RilievoPerBuildingState {
    activeBuildingId: string | null;
    byBuilding: Record<string, RilievoState>;
}

const initialState: RilievoPerBuildingState = {
    activeBuildingId: null,
    byBuilding: {},
};

const updateCurrent = (state: RilievoPerBuildingState, updater: (s: RilievoState) => void) => {
    if (!state.activeBuildingId) return;
    if (!state.byBuilding[state.activeBuildingId]) {
        state.byBuilding[state.activeBuildingId] = {...emptyRilievoState, photos: [], audios: [], measurements: [], items: []};
    }
    updater(state.byBuilding[state.activeBuildingId]);
};

const rilievoSlice = createSlice({
    name: 'rilievo',
    initialState,
    reducers: {
        setRilievoActiveBuildingId: (state, action: PayloadAction<string | null>) => {
            state.activeBuildingId = action.payload;
        },
        setRilievoItems: (state, action: PayloadAction<RilievoItem[]>) => {
            updateCurrent(state, s => { s.items = action.payload; });
        },
        setRilievoPhotos: (state, action: PayloadAction<RilievoPhoto[]>) => {
            updateCurrent(state, s => { s.photos = action.payload; });
        },
        setRilievoAudios: (state, action: PayloadAction<RilievoAudio[]>) => {
            updateCurrent(state, s => { s.audios = action.payload; });
        },
        setRilievoMeasurements: (state, action: PayloadAction<RilievoMeasurement[]>) => {
            updateCurrent(state, s => { s.measurements = action.payload; });
        },
        setSelectedItemId: (state, action: PayloadAction<string | null>) => {
            updateCurrent(state, s => { s.selectedItemId = action.payload; });
        },
        setGenerated: (state, action: PayloadAction<boolean>) => {
            updateCurrent(state, s => { s.generated = action.payload; });
        },
        setRilievoError: (state, action: PayloadAction<string | null>) => {
            updateCurrent(state, s => { s.error = action.payload; });
        },
    },
});

export const {
    setRilievoActiveBuildingId,
    setRilievoItems, setRilievoPhotos, setRilievoAudios, setRilievoMeasurements,
    setSelectedItemId, setGenerated, setRilievoError,
} = rilievoSlice.actions;

export const selectActiveRilievo = (rootState: {rilievo: RilievoPerBuildingState}): RilievoState => {
    if (!rootState.rilievo.activeBuildingId) return emptyRilievoState;
    return rootState.rilievo.byBuilding[rootState.rilievo.activeBuildingId] ?? emptyRilievoState;
};

export default rilievoSlice.reducer;

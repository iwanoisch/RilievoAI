import {createSlice} from "@reduxjs/toolkit";
import type {PayloadAction} from "@reduxjs/toolkit";
import type {RilievoItem, RilievoPhoto, RilievoAudio, RilievoMeasurement, RilievoState} from "./rilievo.type.ts";

const initialState: RilievoState = {
    items: [],
    photos: [],
    audios: [],
    measurements: [],
    selectedItemId: null,
    generated: false,
    error: null,
};

const rilievoSlice = createSlice({
    name: 'rilievo',
    initialState,
    reducers: {
        setRilievoItems: (state, action: PayloadAction<RilievoItem[]>) => {
            state.items = action.payload;
        },
        setRilievoPhotos: (state, action: PayloadAction<RilievoPhoto[]>) => {
            state.photos = action.payload;
        },
        setRilievoAudios: (state, action: PayloadAction<RilievoAudio[]>) => {
            state.audios = action.payload;
        },
        setRilievoMeasurements: (state, action: PayloadAction<RilievoMeasurement[]>) => {
            state.measurements = action.payload;
        },
        setSelectedItemId: (state, action: PayloadAction<string | null>) => {
            state.selectedItemId = action.payload;
        },
        setGenerated: (state, action: PayloadAction<boolean>) => {
            state.generated = action.payload;
        },
        setRilievoError: (state, action: PayloadAction<string | null>) => {
            state.error = action.payload;
        },
    },
});

export const {
    setRilievoItems, setRilievoPhotos, setRilievoAudios, setRilievoMeasurements,
    setSelectedItemId, setGenerated, setRilievoError,
} = rilievoSlice.actions;
export default rilievoSlice.reducer;

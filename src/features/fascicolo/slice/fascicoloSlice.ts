import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import type {FascicoloScheda, FascicoloState, TransferRecord} from "./fascicolo.type.ts";

const initialState: FascicoloState = {
    schede: [],
    transferHistory: [],
    error: null,
};

export const fascicoloSlice = createSlice({
    name: 'fascicolo',
    initialState,
    reducers: {
        setSchede: (state, action: PayloadAction<FascicoloScheda[]>) => {
            state.schede = action.payload;
        },

        setTransferHistory: (state, action: PayloadAction<TransferRecord[]>) => {
            state.transferHistory = action.payload;
        },

        setFascicoloError: (state, action: PayloadAction<string | null>) => {
            state.error = action.payload;
        },

        resetFascicolo: () => initialState,
    },
});

export const {
    setSchede,
    setTransferHistory,
    setFascicoloError,
    resetFascicolo,
} = fascicoloSlice.actions;

export default fascicoloSlice.reducer;

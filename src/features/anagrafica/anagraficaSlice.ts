import {createSlice} from "@reduxjs/toolkit";
import type {PayloadAction} from "@reduxjs/toolkit";
import type {AnagraficaSectionData, AnagraficaState} from "./anagrafica.type.ts";

const initialState: AnagraficaState = {
    sections: [],
    error: null,
};

const anagraficaSlice = createSlice({
    name: 'anagrafica',
    initialState,
    reducers: {
        setSections: (state, action: PayloadAction<AnagraficaSectionData[]>) => {
            state.sections = action.payload;
        },
        setAnagraficaError: (state, action: PayloadAction<string | null>) => {
            state.error = action.payload;
        },
    },
});

export const {setSections, setAnagraficaError} = anagraficaSlice.actions;
export default anagraficaSlice.reducer;

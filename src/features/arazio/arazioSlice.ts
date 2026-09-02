import {createSlice} from "@reduxjs/toolkit";
import type {PayloadAction} from "@reduxjs/toolkit";
import type {ArazioSectionData, ArazioState} from "./arazio.type.ts";

const initialState: ArazioState = {
    sections: [],
    error: null,
};

const arazioSlice = createSlice({
    name: 'arazio',
    initialState,
    reducers: {
        setSections: (state, action: PayloadAction<ArazioSectionData[]>) => {
            state.sections = action.payload;
        },
        setArazioError: (state, action: PayloadAction<string | null>) => {
            state.error = action.payload;
        },
    },
});

export const {setSections, setArazioError} = arazioSlice.actions;
export default arazioSlice.reducer;

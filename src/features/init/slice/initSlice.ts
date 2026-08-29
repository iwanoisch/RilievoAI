import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {initState} from "./init.type.ts";

const initialState: initState = {
    start: false,
}

export const initSlice = createSlice({
    name: "init",
    initialState,
    reducers: {
        start: (state, action: PayloadAction<boolean>) => {
            state.start = action.payload;
        }
    }
});

// Esporta le actions
export const {start} = initSlice.actions;
// Esporta il reducer

export default initSlice.reducer;

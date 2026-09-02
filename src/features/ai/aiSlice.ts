import {createSlice} from "@reduxjs/toolkit";
import type {PayloadAction} from "@reduxjs/toolkit";
import type {AiAnnotation, AiState, AiStatus} from "./ai.type.ts";

const initialState: AiState = {
    status: 'idle',
    annotations: [],
    sectionsProcessed: 0,
    error: null,
};

const aiSlice = createSlice({
    name: 'ai',
    initialState,
    reducers: {
        setAiStatus: (state, action: PayloadAction<AiStatus>) => {
            state.status = action.payload;
        },
        setAnnotations: (state, action: PayloadAction<AiAnnotation[]>) => {
            state.annotations = action.payload;
        },
        setSectionsProcessed: (state, action: PayloadAction<number>) => {
            state.sectionsProcessed = action.payload;
        },
        setAiError: (state, action: PayloadAction<string | null>) => {
            state.error = action.payload;
        },
    },
});

export const {setAiStatus, setAnnotations, setSectionsProcessed, setAiError} = aiSlice.actions;
export default aiSlice.reducer;

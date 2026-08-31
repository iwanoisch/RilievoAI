import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import type {AiState, AiSuggestionWithStatus} from "./ai.type.ts";

const initialState: AiState = {
    suggestions: [],
    isAnalyzing: false,
    analyzingSourceId: null,
    error: null,
};

export const aiSlice = createSlice({
    name: 'ai',
    initialState,
    reducers: {
        setSuggestions: (state, action: PayloadAction<AiSuggestionWithStatus[]>) => {
            state.suggestions = action.payload;
        },

        setIsAnalyzing: (state, action: PayloadAction<boolean>) => {
            state.isAnalyzing = action.payload;
        },

        setAnalyzingSourceId: (state, action: PayloadAction<string | null>) => {
            state.analyzingSourceId = action.payload;
        },

        setAiError: (state, action: PayloadAction<string | null>) => {
            state.error = action.payload;
        },

        resetAi: () => initialState,
    },
});

export const {
    setSuggestions,
    setIsAnalyzing,
    setAnalyzingSourceId,
    setAiError,
    resetAi,
} = aiSlice.actions;

export default aiSlice.reducer;

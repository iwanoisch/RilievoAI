import {createSlice} from "@reduxjs/toolkit";
import type {PayloadAction} from "@reduxjs/toolkit";
import type {AiAnnotation, AiSession, AiState, AiStatus, AiUploadedFile} from "./ai.type.ts";

const initialState: AiState = {
    status: 'idle',
    annotations: [],
    sectionsProcessed: 0,
    totalSectionsProcessed: 0,
    error: null,
    uploadedFiles: [],
    sessions: [],
    currentSessionId: null,
    userPrompt: '',
    extractionProgress: 0,
    extractionFileName: '',
    failedBatches: 0,
    totalBatches: 0,
    currentBatch: 0,
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
        addAnnotations: (state, action: PayloadAction<AiAnnotation[]>) => {
            state.annotations = [...state.annotations, ...action.payload];
        },
        setSectionsProcessed: (state, action: PayloadAction<number>) => {
            state.sectionsProcessed = action.payload;
        },
        addSectionsProcessed: (state, action: PayloadAction<number>) => {
            state.sectionsProcessed = state.sectionsProcessed + action.payload;
            state.totalSectionsProcessed = state.totalSectionsProcessed + action.payload;
        },
        setAiError: (state, action: PayloadAction<string | null>) => {
            state.error = action.payload;
        },
        setUploadedFiles: (state, action: PayloadAction<AiUploadedFile[]>) => {
            state.uploadedFiles = action.payload;
        },
        addUploadedFiles: (state, action: PayloadAction<AiUploadedFile[]>) => {
            state.uploadedFiles = [...state.uploadedFiles, ...action.payload];
        },
        archiveSessionFiles: (state, action: PayloadAction<string>) => {
            state.uploadedFiles = state.uploadedFiles.map(f =>
                f.sessionId === action.payload ? {...f, archived: true} : f
            );
        },
        removeUploadedFile: (state, action: PayloadAction<number>) => {
            state.uploadedFiles = state.uploadedFiles.filter((_, i) => i !== action.payload);
        },
        addSession: (state, action: PayloadAction<AiSession>) => {
            state.sessions = [...state.sessions, action.payload];
        },
        setCurrentSessionId: (state, action: PayloadAction<string | null>) => {
            state.currentSessionId = action.payload;
        },
        setUserPrompt: (state, action: PayloadAction<string>) => {
            state.userPrompt = action.payload;
        },
        setExtractionProgress: (state, action: PayloadAction<{percent: number; fileName: string}>) => {
            state.extractionProgress = action.payload.percent;
            state.extractionFileName = action.payload.fileName;
        },
        setBatchProgress: (state, action: PayloadAction<{current: number; total: number; failed: number}>) => {
            state.currentBatch = action.payload.current;
            state.totalBatches = action.payload.total;
            state.failedBatches = action.payload.failed;
        },
    },
});

export const {
    setAiStatus, setAnnotations, addAnnotations,
    setSectionsProcessed, addSectionsProcessed, setAiError,
    setUploadedFiles, addUploadedFiles, archiveSessionFiles, removeUploadedFile,
    addSession, setCurrentSessionId, setUserPrompt, setExtractionProgress, setBatchProgress,
} = aiSlice.actions;
export default aiSlice.reducer;

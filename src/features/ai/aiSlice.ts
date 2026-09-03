import {createSlice} from "@reduxjs/toolkit";
import type {PayloadAction} from "@reduxjs/toolkit";
import type {AiAnnotation, AiSession, AiState, AiStatus, AiUploadedFile} from "./ai.type.ts";

const emptyAiState: AiState = {
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

interface AiPerBuildingState {
    activeBuildingId: string | null;
    byBuilding: Record<string, AiState>;
}

const initialState: AiPerBuildingState = {
    activeBuildingId: null,
    byBuilding: {},
};

const getCurrent = (state: AiPerBuildingState): AiState => {
    if (!state.activeBuildingId) return emptyAiState;
    return state.byBuilding[state.activeBuildingId] ?? emptyAiState;
};

const updateCurrent = (state: AiPerBuildingState, updater: (s: AiState) => void) => {
    if (!state.activeBuildingId) return;
    if (!state.byBuilding[state.activeBuildingId]) {
        state.byBuilding[state.activeBuildingId] = {...emptyAiState};
    }
    updater(state.byBuilding[state.activeBuildingId]);
};

const aiSlice = createSlice({
    name: 'ai',
    initialState,
    reducers: {
        setActiveBuildingId: (state, action: PayloadAction<string | null>) => {
            state.activeBuildingId = action.payload;
        },
        setAiStatus: (state, action: PayloadAction<AiStatus>) => {
            updateCurrent(state, s => { s.status = action.payload; });
        },
        setAnnotations: (state, action: PayloadAction<AiAnnotation[]>) => {
            updateCurrent(state, s => { s.annotations = action.payload; });
        },
        addAnnotations: (state, action: PayloadAction<AiAnnotation[]>) => {
            updateCurrent(state, s => { s.annotations = [...s.annotations, ...action.payload]; });
        },
        setSectionsProcessed: (state, action: PayloadAction<number>) => {
            updateCurrent(state, s => { s.sectionsProcessed = action.payload; });
        },
        addSectionsProcessed: (state, action: PayloadAction<number>) => {
            updateCurrent(state, s => {
                s.sectionsProcessed = s.sectionsProcessed + action.payload;
                s.totalSectionsProcessed = s.totalSectionsProcessed + action.payload;
            });
        },
        setAiError: (state, action: PayloadAction<string | null>) => {
            updateCurrent(state, s => { s.error = action.payload; });
        },
        setUploadedFiles: (state, action: PayloadAction<AiUploadedFile[]>) => {
            updateCurrent(state, s => { s.uploadedFiles = action.payload; });
        },
        addUploadedFiles: (state, action: PayloadAction<AiUploadedFile[]>) => {
            updateCurrent(state, s => { s.uploadedFiles = [...s.uploadedFiles, ...action.payload]; });
        },
        archiveSessionFiles: (state, action: PayloadAction<string>) => {
            updateCurrent(state, s => {
                s.uploadedFiles = s.uploadedFiles.map(f =>
                    f.sessionId === action.payload ? {...f, archived: true} : f
                );
            });
        },
        removeUploadedFile: (state, action: PayloadAction<number>) => {
            updateCurrent(state, s => {
                s.uploadedFiles = s.uploadedFiles.filter((_, i) => i !== action.payload);
            });
        },
        addSession: (state, action: PayloadAction<AiSession>) => {
            updateCurrent(state, s => {
                const exists = s.sessions.some(ss => ss.id === action.payload.id);
                if (!exists) {
                    s.sessions = [...s.sessions, action.payload];
                }
            });
        },
        setCurrentSessionId: (state, action: PayloadAction<string | null>) => {
            updateCurrent(state, s => { s.currentSessionId = action.payload; });
        },
        setUserPrompt: (state, action: PayloadAction<string>) => {
            updateCurrent(state, s => { s.userPrompt = action.payload; });
        },
        setExtractionProgress: (state, action: PayloadAction<{percent: number; fileName: string}>) => {
            updateCurrent(state, s => {
                s.extractionProgress = action.payload.percent;
                s.extractionFileName = action.payload.fileName;
            });
        },
        setBatchProgress: (state, action: PayloadAction<{current: number; total: number; failed: number}>) => {
            updateCurrent(state, s => {
                s.currentBatch = action.payload.current;
                s.totalBatches = action.payload.total;
                s.failedBatches = action.payload.failed;
            });
        },
        resetAi: (state) => {
            if (state.activeBuildingId) {
                state.byBuilding[state.activeBuildingId] = {...emptyAiState};
            }
        },
    },
});

export const {
    setActiveBuildingId,
    setAiStatus, setAnnotations, addAnnotations,
    setSectionsProcessed, addSectionsProcessed, setAiError,
    setUploadedFiles, addUploadedFiles, archiveSessionFiles, removeUploadedFile,
    addSession, setCurrentSessionId, setUserPrompt, setExtractionProgress, setBatchProgress,
    resetAi,
} = aiSlice.actions;

// Selector: restituisce lo state AI per il building attivo
export const selectActiveAi = (rootState: {ai: AiPerBuildingState}): AiState => {
    return getCurrent(rootState.ai);
};

export default aiSlice.reducer;

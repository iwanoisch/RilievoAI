import type {ArazioValutazione} from "../arazio/arazio.type.ts";

export interface AiExtractedFile {
    name: string;
    mimeType: string;
    base64: string;
}

export interface AiArazioRequest {
    sectionId: string;
    sectionLabel: string;
    fieldSchema: AiFieldSchema[];
    files: AiExtractedFile[];
    userPrompt?: string;
}

export interface AiFieldSchema {
    key: string;
    label: string;
    type: string;
    groupKey: string;
    options?: string[];
}

export interface AiArazioResponse {
    values: Record<string, string>;
    groupValutazioni: Record<string, ArazioValutazione>;
    repeatables: Record<string, AiRepeatableData[]>;
    notes: AiAnnotation[];
}

export interface AiRepeatableData {
    values: Record<string, string>;
    valutazione: ArazioValutazione;
}

export type AiAnnotationType = 'missing' | 'warning' | 'info' | 'conflict';

export interface AiAnnotation {
    type: AiAnnotationType;
    section: string;
    field?: string;
    message: string;
}

export interface AiBulkRequest {
    sections: AiArazioRequest[];
    userPrompt: string;
    files: AiExtractedFile[];
}

export interface AiBulkResponse {
    sections: Record<string, AiArazioResponse>;
    globalNotes: AiAnnotation[];
    documentDate?: string;
}

export type AiStatus = 'idle' | 'extracting' | 'analyzing' | 'done' | 'error';

export interface AiUploadedFile {
    name: string;
    sizeMb: number;
    sessionId: string;
    archived: boolean;
}

export interface AiSession {
    id: string;
    timestamp: string;
    fileCount: number;
    sectionsProcessed: number;
}

export interface AiState {
    status: AiStatus;
    annotations: AiAnnotation[];
    sectionsProcessed: number;
    totalSectionsProcessed: number;
    error: string | null;
    uploadedFiles: AiUploadedFile[];
    sessions: AiSession[];
    currentSessionId: string | null;
    userPrompt: string;
    extractionProgress: number;
    extractionFileName: string;
    failedBatches: number;
    totalBatches: number;
    currentBatch: number;
}

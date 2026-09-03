import type {AnagraficaValutazione} from "../anagrafica/anagrafica.type.ts";

export interface AiExtractedFile {
    name: string;
    mimeType: string;
    base64: string;
}

export interface AiAnagraficaRequest {
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
    repeatable?: boolean;
    options?: string[];
}

export interface AiAnagraficaResponse {
    values: Record<string, string>;
    groupValutazioni: Record<string, AnagraficaValutazione>;
    repeatables: Record<string, AiRepeatableData[]>;
    notes: AiAnnotation[];
}

export interface AiRepeatableData {
    values: Record<string, string>;
    valutazione: AnagraficaValutazione;
}

export type AiAnnotationType = 'missing' | 'warning' | 'info' | 'conflict';

export interface AiAnnotation {
    type: AiAnnotationType;
    section: string;
    field?: string;
    message: string;
}

export interface AiBulkRequest {
    sections: AiAnagraficaRequest[];
    userPrompt: string;
    files: AiExtractedFile[];
}

// ===== Building Structure (per tab Rilievo) =====

export interface AiStructureOpening {
    label: string;
    type: 'door' | 'window' | 'french_door' | 'other';
    width?: string;
    height?: string;
    note?: string;
}

export interface AiStructureElement {
    label: string;
    category: 'thermal' | 'electrical' | 'degradation' | 'finish' | 'other';
    note?: string;
}

export interface AiStructureWall {
    label: string;
    length?: string;
    height?: string;
    openings: AiStructureOpening[];
    elements: AiStructureElement[];
}

export interface AiStructureRoom {
    label: string;
    area?: string;
    height?: string;
    destinationUse?: string;
    walls: AiStructureWall[];
}

export interface AiStructureFloor {
    label: string;
    level: number;
    rooms: AiStructureRoom[];
}

export interface AiBuildingStructure {
    label: string;
    address?: string;
    floors: AiStructureFloor[];
    externalElements?: AiStructureElement[];
}

export interface AiBulkResponse {
    sections: Record<string, AiAnagraficaResponse>;
    globalNotes: AiAnnotation[];
    documentDate?: string;
    buildingStructure?: AiBuildingStructure;
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

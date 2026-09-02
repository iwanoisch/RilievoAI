import type {ElementType} from "../../edificio/edificio.type.ts";

export interface AiPhotoAnalysisRequest {
    photoId: string;
    mediaPath: string;
    buildingId: string;
    currentFloorId?: string;
    currentRoomId?: string;
    contextHint?: string;
}

export interface AiVoiceAnalysisRequest {
    observationId: string;
    transcription: string;
    buildingId: string;
    currentFloorId?: string;
    currentRoomId?: string;
    recentPhotoIds?: string[];
}

export interface AiSuggestion {
    id: string;
    sourceId: string;
    sourceType: 'photo' | 'voice';
    proposedElementType: ElementType;
    proposedElementLabel: string;
    proposedParentId?: string;
    confidence: number;
    reasoning: string;
    criticality?: 'none' | 'low' | 'medium' | 'high' | 'critical';
    criticalityDescription?: string;
    tags: string[];
    timestamp: string;
}

export interface AiService {
    analyzePhoto: (request: AiPhotoAnalysisRequest) => Promise<AiSuggestion>;
    analyzeVoice: (request: AiVoiceAnalysisRequest) => Promise<AiSuggestion>;
    sendFeedback: (suggestionId: string, action: 'accepted' | 'modified' | 'rejected', correction?: Partial<AiSuggestion>) => Promise<void>;
}

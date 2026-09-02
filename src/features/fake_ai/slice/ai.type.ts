import type {AiSuggestion} from "../services/ai-service.type.ts";

export type SuggestionStatus = 'pending' | 'accepted' | 'modified' | 'rejected';

export interface AiSuggestionWithStatus extends AiSuggestion {
    status: SuggestionStatus;
}

export interface AiState {
    suggestions: AiSuggestionWithStatus[];
    isAnalyzing: boolean;
    analyzingSourceId: string | null;
    error: string | null;
}

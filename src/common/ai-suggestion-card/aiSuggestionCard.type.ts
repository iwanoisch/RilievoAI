import type {AiSuggestionWithStatus} from "../../features/ai/slice/ai.type.ts";

export interface AiSuggestionCardProps {
    suggestion: AiSuggestionWithStatus;
    onAccept: (id: string) => void;
    onReject: (id: string) => void;
    onModify?: (id: string) => void;
}

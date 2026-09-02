import type {AiSuggestionWithStatus} from "../../features/fake_ai/slice/ai.type.ts";

export interface AiSuggestionCardProps {
    suggestion: AiSuggestionWithStatus;
    onAccept: (id: string) => void;
    onReject: (id: string) => void;
    onModify?: (id: string) => void;
}

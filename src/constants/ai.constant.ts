import type {SuggestionStatus} from "../features/ai/slice/ai.type.ts";

export const SUGGESTION_STATUS_LABELS: Record<SuggestionStatus, string> = {
    pending: 'ai.status_pending',
    accepted: 'ai.status_accepted',
    modified: 'ai.status_modified',
    rejected: 'ai.status_rejected',
};

export const SUGGESTION_STATUS_STYLES: Record<SuggestionStatus, string> = {
    pending: 'badge-warning',
    accepted: 'badge-success',
    modified: 'badge-info',
    rejected: 'badge-error',
};

export const CRITICALITY_LABELS: Record<string, string> = {
    none: 'ai.criticality_none',
    low: 'ai.criticality_low',
    medium: 'ai.criticality_medium',
    high: 'ai.criticality_high',
    critical: 'ai.criticality_critical',
};

export const CRITICALITY_STYLES: Record<string, string> = {
    none: 'text-text-muted',
    low: 'text-info',
    medium: 'text-warning-dark',
    high: 'text-error',
    critical: 'text-error font-bold',
};

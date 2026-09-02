import type {SuggestionStatus} from "../features/fake_ai/slice/ai.type.ts";

export const SUGGESTION_STATUS_LABELS: Record<SuggestionStatus, string> = {
    pending: 'fake_ai.status_pending',
    accepted: 'fake_ai.status_accepted',
    modified: 'fake_ai.status_modified',
    rejected: 'fake_ai.status_rejected',
};

export const SUGGESTION_STATUS_STYLES: Record<SuggestionStatus, string> = {
    pending: 'badge-warning',
    accepted: 'badge-success',
    modified: 'badge-info',
    rejected: 'badge-error',
};

export const CRITICALITY_LABELS: Record<string, string> = {
    none: 'fake_ai.criticality_none',
    low: 'fake_ai.criticality_low',
    medium: 'fake_ai.criticality_medium',
    high: 'fake_ai.criticality_high',
    critical: 'fake_ai.criticality_critical',
};

export const CRITICALITY_STYLES: Record<string, string> = {
    none: 'text-text-muted',
    low: 'text-info',
    medium: 'text-warning-dark',
    high: 'text-error',
    critical: 'text-error font-bold',
};

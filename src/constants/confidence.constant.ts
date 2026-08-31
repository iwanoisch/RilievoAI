export type ConfidenceLevel = 'high' | 'medium' | 'low';

export const CONFIDENCE_COLORS: Record<ConfidenceLevel, string> = {
    high: 'bg-success border-success-dark',
    medium: 'bg-warning border-warning-dark',
    low: 'bg-error border-error-dark',
};

export const CONFIDENCE_BADGE_STYLES: Record<ConfidenceLevel, string> = {
    high: 'badge-success',
    medium: 'badge-warning',
    low: 'badge-error',
};

export const CONFIDENCE_LABELS: Record<ConfidenceLevel, string> = {
    high: 'confidence.high',
    medium: 'confidence.medium',
    low: 'confidence.low',
};

export const CONFIDENCE_COLORS = {
    high: 'bg-success border-success-dark',
    medium: 'bg-warning border-warning-dark',
    low: 'bg-error border-error-dark',
} as const;

export type ConfidenceLevel = keyof typeof CONFIDENCE_COLORS;

import type {ConfidenceLevel} from "../constants/confidence.constant.ts";

export const getConfidenceLevel = (confidence: number): ConfidenceLevel => {
    if (confidence >= 90) return 'high';
    if (confidence >= 70) return 'medium';
    return 'low';
};

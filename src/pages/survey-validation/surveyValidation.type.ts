import type {ObservationType} from "../../features/survey/slice/survey.type.ts";

export type ValidationFilter = 'all' | ObservationType;
export type ConfidenceFilter = 'all' | 'high' | 'medium' | 'low';
export type StatusFilter = 'pending' | 'validated' | 'rejected' | 'all';

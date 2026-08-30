import type {SurveyPhoto, VoiceObservation, Measurement} from "../../features/survey/slice/survey.type.ts";

export type ObservationType = 'photo' | 'voice' | 'measurement';

export type FilterType = 'all' | ObservationType;

export type ObservationItem =
    | (SurveyPhoto & { observationType: 'photo' })
    | (VoiceObservation & { observationType: 'voice' })
    | (Measurement & { observationType: 'measurement' });

export interface SurveyObservationListProps {
    onEdit: (observation: ObservationItem) => void;
}

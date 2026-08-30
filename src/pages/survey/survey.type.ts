import type {SurveyPhoto, VoiceObservation, Measurement} from "../../features/survey/slice/survey.type.ts";

export type ModalType = 'photo' | 'voice' | 'measure' | null;

export interface ModalState {
    type: ModalType;
    editData?: SurveyPhoto | VoiceObservation | Measurement;
}

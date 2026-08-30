import type {VoiceObservation} from "../../../features/survey/slice/survey.type.ts";

export interface VoiceModalProps {
    editData?: VoiceObservation;
    onClose: () => void;
}

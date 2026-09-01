import type {SurveyPhoto} from "../../../features/survey/slice/survey.type.ts";

export type PhotoModalTab = 'capture' | 'upload';

export interface PhotoModalProps {
    editData?: SurveyPhoto;
    onClose: () => void;
    onSaved?: (photo: SurveyPhoto) => void;
    onBatchSaved?: (photos: SurveyPhoto[]) => void;
}

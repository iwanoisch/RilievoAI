import type {SurveyPhoto} from "../../../features/survey/slice/survey.type.ts";

export interface PhotoModalProps {
    editData?: SurveyPhoto;
    onClose: () => void;
    onSaved?: (photo: SurveyPhoto) => void;
}

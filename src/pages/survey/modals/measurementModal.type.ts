import type {Measurement} from "../../../features/survey/slice/survey.type.ts";

export interface MeasurementModalProps {
    editData?: Measurement;
    onClose: () => void;
}

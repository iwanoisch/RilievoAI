import type {EdificioElement, ElementType} from "../../../features/edificio/edificio.type.ts";

export interface EdificioElementFormProps {
    editData?: EdificioElement;
    parentId?: string | null;
    defaultType?: ElementType;
    onClose: () => void;
}

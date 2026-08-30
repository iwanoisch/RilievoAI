import type {BuildingElement, ElementType} from "../../../features/building/slice/building.type.ts";

export interface BuildingElementFormProps {
    editData?: BuildingElement;
    parentId?: string | null;
    defaultType?: ElementType;
    onClose: () => void;
}

import type {BuildingElement} from "../../features/building/slice/building.type.ts";

export interface BuildingModalState {
    isOpen: boolean;
    editData?: BuildingElement;
    parentId?: string | null;
}

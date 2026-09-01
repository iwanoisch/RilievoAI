import type {EdificioElement} from "../../features/edificio/edificio.type.ts";

export interface EdificioModalState {
    isOpen: boolean;
    editData?: EdificioElement;
    parentId?: string | null;
}

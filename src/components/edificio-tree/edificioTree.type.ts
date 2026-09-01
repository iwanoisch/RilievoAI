import type {EdificioElement} from "../../features/edificio/edificio.type.ts";

export interface EdificioTreeProps {
    onSelectElement: (element: EdificioElement) => void;
    selectedElementId?: string | null;
}

export interface EdificioTreeNodeProps {
    elementId: string;
    depth: number;
    onSelectElement: (element: EdificioElement) => void;
    selectedElementId?: string | null;
}

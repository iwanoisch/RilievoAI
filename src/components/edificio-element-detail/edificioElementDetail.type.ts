import type {EdificioElement, DataStatus} from "../../features/edificio/edificio.type.ts";

export interface EdificioElementDetailProps {
    element: EdificioElement;
    onEdit: (element: EdificioElement) => void;
    onDelete: (elementId: string) => void;
    onStatusChange: (elementId: string, status: DataStatus) => void;
}

import type {BuildingElement, DataStatus} from "../../features/building/slice/building.type.ts";

export interface BuildingElementDetailProps {
    element: BuildingElement;
    onEdit: (element: BuildingElement) => void;
    onDelete: (elementId: string) => void;
    onStatusChange: (elementId: string, status: DataStatus) => void;
}

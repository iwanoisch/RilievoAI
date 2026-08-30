import type {BuildingElement} from "../../features/building/slice/building.type.ts";

export interface BuildingElementDetailProps {
    element: BuildingElement;
    onEdit: (element: BuildingElement) => void;
    onDelete: (elementId: string) => void;
}

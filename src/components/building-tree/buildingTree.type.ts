import type {BuildingElement} from "../../features/building/slice/building.type.ts";

export interface BuildingTreeProps {
    onSelectElement: (element: BuildingElement) => void;
    selectedElementId?: string | null;
}

export interface BuildingTreeNodeProps {
    elementId: string;
    depth: number;
    onSelectElement: (element: BuildingElement) => void;
    selectedElementId?: string | null;
}

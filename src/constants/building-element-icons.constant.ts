import {
    BuildingOffice2Icon,
    HomeIcon,
    CubeIcon,
    ExclamationTriangleIcon,
} from "@heroicons/react/24/outline";
import type {ElementType} from "../features/building/slice/building.type.ts";
import type {ComponentType, SVGProps} from "react";

export const BUILDING_ELEMENT_ICONS: Record<ElementType, ComponentType<SVGProps<SVGSVGElement>>> = {
    building: BuildingOffice2Icon,
    floor: HomeIcon,
    room: CubeIcon,
    wall: CubeIcon,
    door: CubeIcon,
    window: CubeIcon,
    ceiling: CubeIcon,
    floor_surface: CubeIcon,
    element: CubeIcon,
    plant: CubeIcon,
    defect: ExclamationTriangleIcon,
};

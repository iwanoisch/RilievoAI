import type {PhotoMarker} from "../../features/floorPlan/slice/floorPlan.type.ts";

export interface FloorPlanViewerProps {
    imageSrc: string;
    markers: PhotoMarker[];
    onMarkerClick?: (marker: PhotoMarker) => void;
    onPlaceMarker?: (x: number, y: number) => void;
    isPlacingMode?: boolean;
}

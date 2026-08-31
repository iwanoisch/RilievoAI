import type {PhotoMarker} from "../../../features/floorPlan/slice/floorPlan.type.ts";

export interface MarkerDetailModalProps {
    marker: PhotoMarker;
    onClose: () => void;
    onUpdateAngle: (photoId: string, angle: number) => void;
    onDelete: (photoId: string) => void;
    onReposition: (photoId: string) => void;
}

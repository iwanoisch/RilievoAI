import type {PhotoMarker, FloorPlanPage, FloorPlanFileType} from "../../features/floorPlan/slice/floorPlan.type.ts";

export interface MarkerDetailState {
    marker: PhotoMarker | null;
}

export interface PendingUpload {
    pages: FloorPlanPage[];
    defaultName: string;
    fileType: FloorPlanFileType;
}

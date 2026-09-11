import type {FloorPlanImage} from "../../../../utility/floor-plan-db.ts";

export interface FloorPlanCardProps {
    buildingId: string;
    onSelectImage: (image: FloorPlanImage) => void;
    activeFileId: string | null;
}

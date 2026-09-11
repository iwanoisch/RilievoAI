import type {FloorPlanImage} from "../../../../utility/floor-plan-db.ts";
import type {FloorPlanMarker, RilievoItem} from "../../../../features/rilievo/rilievo.type.ts";

export interface FloorPlanViewerProps {
    image: FloorPlanImage;
    markers: FloorPlanMarker[];
    items: RilievoItem[];
    onTapEmpty: (posX: number, posY: number) => void;
    onTapMarker: (marker: FloorPlanMarker) => void;
}

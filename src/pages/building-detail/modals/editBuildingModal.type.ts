import type {BuildingCardData} from "../../../features/buildings/buildings.type.ts";

export interface EditBuildingModalProps {
    building: BuildingCardData;
    onClose: () => void;
    onSaved: () => void;
}

import type {BuildingCardData} from "../../features/buildings/buildings.type.ts";

export interface BuildingDetailField {
    key: keyof BuildingCardData;
    labelKey: string;
    type: 'text' | 'number' | 'select' | 'date';
    editable: boolean;
    options?: string[];
}

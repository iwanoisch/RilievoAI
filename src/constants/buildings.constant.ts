import type {BuildingCardData, BuildingStatus} from "../features/buildings/buildings.type.ts";

export const BUILDING_STATUS_BADGE: Record<BuildingCardData['status'], string> = {
    active: 'badge badge-success',
    completed: 'badge badge-info',
};

export const BUILDING_STATUS_LABEL: Record<BuildingCardData['status'], string> = {
    active: 'buildings.status_active',
    completed: 'buildings.status_completed',
};

export const BUILDING_TYPE_KEYS: string[] = [
    'type_residential',
    'type_commercial',
    'type_industrial',
    'type_public',
    'type_historical',
    'type_other',
];

export const BUILDING_STATUS_OPTIONS: BuildingStatus[] = ['active', 'completed'];

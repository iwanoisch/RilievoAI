import type {BuildingCardData} from "../features/buildings/buildings.type.ts";

export const BUILDING_STATUS_BADGE: Record<BuildingCardData['status'], string> = {
    active: 'badge badge-success',
    completed: 'badge badge-info',
    draft: 'badge badge-warning',
};

export const BUILDING_STATUS_LABEL: Record<BuildingCardData['status'], string> = {
    active: 'buildings.status_active',
    completed: 'buildings.status_completed',
    draft: 'buildings.status_draft',
};

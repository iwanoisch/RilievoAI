export type BuildingStatus = 'active' | 'completed' | 'draft';

export interface BuildingCardData {
    id: string;
    name: string;
    address: string;
    city: string;
    buildingType: string;
    floorsCount: number;
    completionPercent: number;
    criticalityCount: number;
    createdAt: string;
    deadline?: string;
    imageUrl?: string;
    status: BuildingStatus;
}

export interface BuildingsState {
    buildings: BuildingCardData[];
    selectedBuildingId: string | null;
    error: string | null;
}

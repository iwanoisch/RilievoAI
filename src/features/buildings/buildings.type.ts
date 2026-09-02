export type BuildingStatus = 'active' | 'completed';

export interface BuildingCardData {
    id: string;
    code: string;
    name: string;
    address: string;
    city: string;
    buildingType: string;
    description?: string;
    yearBuilt?: number;
    floorsCount: number;
    completionPercent: number;
    criticalityCount: number;
    createdAt: string;
    deadline?: string;
    imageUrl?: string;
    status: BuildingStatus;
    dataDate?: string;
}

export interface BuildingsState {
    buildings: BuildingCardData[];
    selectedBuildingId: string | null;
    error: string | null;
}

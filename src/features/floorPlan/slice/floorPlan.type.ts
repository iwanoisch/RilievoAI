export interface PhotoMarker {
    photoId: string;
    x: number;
    y: number;
    directionAngle?: number;
    confidence: number;
}

export interface FloorPlan {
    id: string;
    buildingId: string;
    floorId: string;
    imagePath: string;
    scale?: number;
    origin?: { x: number; y: number };
    rotation?: number;
    photoMarkers: PhotoMarker[];
}

export interface FloorPlanState {
    floorPlans: Record<string, FloorPlan>;
    selectedFloorPlanId: string | null;
    error: string | null;
}

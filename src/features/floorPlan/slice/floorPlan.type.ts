export interface PhotoMarker {
    photoId: string;
    x: number;
    y: number;
    directionAngle?: number;
    confidence: number;
}

export interface FloorPlanPage {
    id: string;
    pageNumber: number;
    imagePath: string;
    scale?: number;
    origin?: { x: number; y: number };
    rotation?: number;
    photoMarkers: PhotoMarker[];
}

export type FloorPlanFileType = 'pdf' | 'png' | 'jpg' | 'jpeg' | 'webp';

export interface FloorPlanDocument {
    id: string;
    buildingId: string;
    name: string;
    fileType: FloorPlanFileType;
    createdAt: string;
    pages: FloorPlanPage[];
}

export interface FloorPlanState {
    documents: FloorPlanDocument[];
    selectedDocumentId: string | null;
    selectedPageId: string | null;
    error: string | null;
}

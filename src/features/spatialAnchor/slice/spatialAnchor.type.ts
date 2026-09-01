import type {DataStatus} from "../../edificio/edificio.type.ts";

export interface SpatialAnchor {
    id: string;
    buildingId: string;
    floorId?: string;
    localTransform?: number[];
    globalReference?: {
        lat: number;
        lon: number;
        alt?: number;
        accuracy: number;
    };
    source: 'GNSS' | 'PLAN' | 'MARKER' | 'MANUAL' | 'BACKEND_AR';
    persistenceScope: 'SESSION' | 'DEVICE' | 'PROJECT';
    positionalAccuracy?: number;
    confidence: number;
    createdAt: string;
    status: DataStatus;
}

export interface Landmark {
    id: string;
    type: 'corner' | 'door' | 'pillar' | 'staircase' | 'window' | 'plant_element' | 'other';
    semanticLabel: string;
    confidence: number;
    sourceSessionId: string;
}

export interface SpatialAnchorState {
    anchors: Record<string, SpatialAnchor>;
    landmarks: Record<string, Landmark>;
    error: string | null;
}

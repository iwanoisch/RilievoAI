import type {SpatialAnchor, Landmark} from "../features/spatialAnchor/slice/spatialAnchor.type.ts";

export const MOCK_SPATIAL_ANCHORS: SpatialAnchor[] = [
    {
        id: 'anchor-1',
        buildingId: 'building-1',
        floorId: 'floor-1',
        globalReference: {lat: 45.4642, lon: 9.1900, accuracy: 3},
        source: 'GNSS',
        persistenceScope: 'PROJECT',
        positionalAccuracy: 3,
        confidence: 85,
        createdAt: '2026-08-01T09:00:00Z',
        status: 'VALIDATED',
    },
    {
        id: 'anchor-2',
        buildingId: 'building-1',
        floorId: 'floor-1',
        source: 'MANUAL',
        persistenceScope: 'SESSION',
        confidence: 60,
        createdAt: '2026-08-01T09:05:00Z',
        status: 'PROPOSED',
    },
];

export const MOCK_LANDMARKS: Landmark[] = [
    {
        id: 'landmark-1',
        type: 'door',
        semanticLabel: 'Porta ingresso principale',
        confidence: 95,
        sourceSessionId: 'session-1',
    },
    {
        id: 'landmark-2',
        type: 'corner',
        semanticLabel: 'Angolo nord-est cucina',
        confidence: 78,
        sourceSessionId: 'session-1',
    },
    {
        id: 'landmark-3',
        type: 'staircase',
        semanticLabel: 'Scala principale piano terra - primo piano',
        confidence: 90,
        sourceSessionId: 'session-1',
    },
];

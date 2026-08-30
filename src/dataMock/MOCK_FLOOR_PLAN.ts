import type {FloorPlan} from "../features/floorPlan/slice/floorPlan.type.ts";

export const MOCK_FLOOR_PLANS: FloorPlan[] = [
    {
        id: 'floorplan-1',
        buildingId: 'building-1',
        floorId: 'floor-1',
        imagePath: '/uploads/floorplans/piano-terra.png',
        scale: 50,
        origin: {x: 0, y: 0},
        rotation: 0,
        photoMarkers: [
            {photoId: 'photo-1', x: 120, y: 85, directionAngle: 0, confidence: 92},
            {photoId: 'photo-2', x: 280, y: 200, directionAngle: 180, confidence: 78},
            {photoId: 'photo-3', x: 310, y: 190, directionAngle: 90, confidence: 85},
        ],
    },
    {
        id: 'floorplan-2',
        buildingId: 'building-1',
        floorId: 'floor-2',
        imagePath: '/uploads/floorplans/primo-piano.png',
        scale: 50,
        origin: {x: 0, y: 0},
        rotation: 0,
        photoMarkers: [],
    },
];

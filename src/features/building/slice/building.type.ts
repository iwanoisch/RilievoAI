export type DataStatus = 'RAW' | 'DERIVED' | 'PROPOSED' | 'VALIDATED' | 'REJECTED' | 'SUPERSEDED';

export type ElementType =
    | 'building'
    | 'floor'
    | 'room'
    | 'wall'
    | 'door'
    | 'window'
    | 'ceiling'
    | 'floor_surface'
    | 'element'
    | 'plant'
    | 'defect';

export interface BuildingEntity {
    id: string;
    label: string;
    parentId: string | null;
    type: ElementType;
    dataStatus: DataStatus;
    confidence: number;
    sessionId: string;
    createdAt: string;
    updatedAt: string;
}

export interface Building extends BuildingEntity {
    type: 'building';
    parentId: null;
    address?: string;
    floors: string[];
}

export interface Floor extends BuildingEntity {
    type: 'floor';
    floorNumber: number;
    rooms: string[];
}

export interface Room extends BuildingEntity {
    type: 'room';
    area?: number;
    perimeter?: number;
    height?: number;
    elements: string[];
}

export interface Wall extends BuildingEntity {
    type: 'wall';
    length?: number;
    height?: number;
    thickness?: number;
    material?: string;
}

export interface Door extends BuildingEntity {
    type: 'door';
    width?: number;
    height?: number;
    material?: string;
    openingDirection?: 'left' | 'right' | 'sliding' | 'other';
}

export interface Window extends BuildingEntity {
    type: 'window';
    width?: number;
    height?: number;
    sillHeight?: number;
    material?: string;
    glazingType?: 'single' | 'double' | 'triple';
}

export interface Ceiling extends BuildingEntity {
    type: 'ceiling';
    height?: number;
    material?: string;
}

export interface FloorSurface extends BuildingEntity {
    type: 'floor_surface';
    material?: string;
    area?: number;
}

export interface GenericElement extends BuildingEntity {
    type: 'element';
    description?: string;
}

export interface Plant extends BuildingEntity {
    type: 'plant';
    plantType?: 'electrical' | 'plumbing' | 'hvac' | 'gas' | 'fire' | 'other';
    description?: string;
}

export interface Defect extends BuildingEntity {
    type: 'defect';
    severity?: 'low' | 'medium' | 'high' | 'critical';
    description?: string;
    photoIds?: string[];
}

export type BuildingElement =
    | Building
    | Floor
    | Room
    | Wall
    | Door
    | Window
    | Ceiling
    | FloorSurface
    | GenericElement
    | Plant
    | Defect;

export interface BuildingState {
    elements: Record<string, BuildingElement>;
    selectedElementId: string | null;
    rootBuildingId: string | null;
    error: string | null;
}

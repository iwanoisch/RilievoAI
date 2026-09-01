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

export interface EdificioEntity {
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

export interface Edificio extends EdificioEntity {
    type: 'building';
    parentId: null;
    address?: string;
    floors: string[];
}

export interface Floor extends EdificioEntity {
    type: 'floor';
    floorNumber: number;
    rooms: string[];
}

export interface Room extends EdificioEntity {
    type: 'room';
    area?: number;
    perimeter?: number;
    height?: number;
    elements: string[];
}

export interface Wall extends EdificioEntity {
    type: 'wall';
    length?: number;
    height?: number;
    thickness?: number;
    material?: string;
}

export interface Door extends EdificioEntity {
    type: 'door';
    width?: number;
    height?: number;
    material?: string;
    openingDirection?: 'left' | 'right' | 'sliding' | 'other';
}

export interface Window extends EdificioEntity {
    type: 'window';
    width?: number;
    height?: number;
    sillHeight?: number;
    material?: string;
    glazingType?: 'single' | 'double' | 'triple';
}

export interface Ceiling extends EdificioEntity {
    type: 'ceiling';
    height?: number;
    material?: string;
}

export interface FloorSurface extends EdificioEntity {
    type: 'floor_surface';
    material?: string;
    area?: number;
}

export interface GenericElement extends EdificioEntity {
    type: 'element';
    description?: string;
}

export interface Plant extends EdificioEntity {
    type: 'plant';
    plantType?: 'electrical' | 'plumbing' | 'hvac' | 'gas' | 'fire' | 'other';
    description?: string;
}

export interface Defect extends EdificioEntity {
    type: 'defect';
    severity?: 'low' | 'medium' | 'high' | 'critical';
    description?: string;
    photoIds?: string[];
}

export type EdificioElement =
    | Edificio
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

export interface EdificioState {
    elements: Record<string, EdificioElement>;
    selectedElementId: string | null;
    rootBuildingId: string | null;
    error: string | null;
}

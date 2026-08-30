import type {ElementType} from "../features/building/slice/building.type.ts";

export type FieldType = 'text' | 'number' | 'select';

export interface ElementFieldConfig {
    key: string;
    labelKey: string;
    type: FieldType;
    unit?: string;
    options?: { value: string; labelKey: string }[];
}

export interface ElementTypeConfig {
    defaultChildren: Record<string, unknown>;
    fields: ElementFieldConfig[];
}

export const BUILDING_ELEMENT_CONFIG: Record<ElementType, ElementTypeConfig> = {
    building: {
        defaultChildren: {floors: []},
        fields: [
            {key: 'address', labelKey: 'building.address', type: 'text'},
        ],
    },
    floor: {
        defaultChildren: {rooms: []},
        fields: [
            {key: 'floorNumber', labelKey: 'building.floor_number', type: 'number'},
        ],
    },
    room: {
        defaultChildren: {elements: []},
        fields: [
            {key: 'area', labelKey: 'building.area', type: 'number', unit: 'm²'},
            {key: 'perimeter', labelKey: 'building.perimeter', type: 'number', unit: 'm'},
            {key: 'height', labelKey: 'building.height', type: 'number', unit: 'm'},
        ],
    },
    wall: {
        defaultChildren: {},
        fields: [
            {key: 'length', labelKey: 'building.length', type: 'number', unit: 'm'},
            {key: 'height', labelKey: 'building.height', type: 'number', unit: 'm'},
            {key: 'thickness', labelKey: 'building.thickness', type: 'number', unit: 'm'},
            {key: 'material', labelKey: 'building.material', type: 'text'},
        ],
    },
    door: {
        defaultChildren: {},
        fields: [
            {key: 'width', labelKey: 'building.width', type: 'number', unit: 'm'},
            {key: 'height', labelKey: 'building.height', type: 'number', unit: 'm'},
            {key: 'material', labelKey: 'building.material', type: 'text'},
            {key: 'openingDirection', labelKey: 'building.opening_direction', type: 'select', options: [
                {value: 'left', labelKey: 'building.direction_left'},
                {value: 'right', labelKey: 'building.direction_right'},
                {value: 'sliding', labelKey: 'building.direction_sliding'},
                {value: 'other', labelKey: 'building.direction_other'},
            ]},
        ],
    },
    window: {
        defaultChildren: {},
        fields: [
            {key: 'width', labelKey: 'building.width', type: 'number', unit: 'm'},
            {key: 'height', labelKey: 'building.height', type: 'number', unit: 'm'},
            {key: 'sillHeight', labelKey: 'building.sill_height', type: 'number', unit: 'm'},
            {key: 'material', labelKey: 'building.material', type: 'text'},
            {key: 'glazingType', labelKey: 'building.glazing_type', type: 'select', options: [
                {value: 'single', labelKey: 'building.glazing_single'},
                {value: 'double', labelKey: 'building.glazing_double'},
                {value: 'triple', labelKey: 'building.glazing_triple'},
            ]},
        ],
    },
    ceiling: {
        defaultChildren: {},
        fields: [
            {key: 'height', labelKey: 'building.height', type: 'number', unit: 'm'},
            {key: 'material', labelKey: 'building.material', type: 'text'},
        ],
    },
    floor_surface: {
        defaultChildren: {},
        fields: [
            {key: 'material', labelKey: 'building.material', type: 'text'},
            {key: 'area', labelKey: 'building.area', type: 'number', unit: 'm²'},
        ],
    },
    element: {
        defaultChildren: {},
        fields: [
            {key: 'description', labelKey: 'building.description', type: 'text'},
        ],
    },
    plant: {
        defaultChildren: {},
        fields: [
            {key: 'plantType', labelKey: 'building.plant_type', type: 'select', options: [
                {value: 'electrical', labelKey: 'building.plant_electrical'},
                {value: 'plumbing', labelKey: 'building.plant_plumbing'},
                {value: 'hvac', labelKey: 'building.plant_hvac'},
                {value: 'gas', labelKey: 'building.plant_gas'},
                {value: 'fire', labelKey: 'building.plant_fire'},
                {value: 'other', labelKey: 'building.plant_other'},
            ]},
            {key: 'description', labelKey: 'building.description', type: 'text'},
        ],
    },
    defect: {
        defaultChildren: {},
        fields: [
            {key: 'severity', labelKey: 'building.severity', type: 'select', options: [
                {value: 'low', labelKey: 'building.severity_low'},
                {value: 'medium', labelKey: 'building.severity_medium'},
                {value: 'high', labelKey: 'building.severity_high'},
                {value: 'critical', labelKey: 'building.severity_critical'},
            ]},
            {key: 'description', labelKey: 'building.description', type: 'text'},
        ],
    },
};

import type {AiBuildingStructure} from "../features/ai/ai.type.ts";
import type {RilievoItem, RilievoCheck} from "../features/rilievo/rilievo.type.ts";
import {RILIEVO_OPENING_TYPE_LABELS} from "../constants/rilievo.constant.ts";

let counter = 0;
const nextId = (prefix: string) => `${prefix}-${++counter}`;

const makeRoomChecks = (id: string): RilievoCheck[] => [
    {id: `${id}-chk-photo`, type: 'photo', label: 'Foto ambiente', done: false},
    {id: `${id}-chk-measure`, type: 'measurement', label: 'Misure', done: false},
    {id: `${id}-chk-note`, type: 'note', label: 'Note', done: false},
];

const makeWallChecks = (id: string): RilievoCheck[] => [
    {id: `${id}-chk-photo`, type: 'photo', label: 'Foto parete', done: false},
    {id: `${id}-chk-measure`, type: 'measurement', label: 'Misure', done: false},
    {id: `${id}-chk-note`, type: 'note', label: 'Note', done: false},
];

const makeOpeningChecks = (id: string, type: string): RilievoCheck[] => [
    {id: `${id}-chk-photo`, type: 'photo', label: `Foto ${type}`, done: false},
    {id: `${id}-chk-measure`, type: 'measurement', label: 'Misure', done: false},
    {id: `${id}-chk-note`, type: 'note', label: 'Note', done: false},
];

const makeElementChecks = (id: string, label: string): RilievoCheck[] => [
    {id: `${id}-chk-photo`, type: 'photo', label: `Foto ${label}`, done: false},
    {id: `${id}-chk-note`, type: 'note', label: 'Note', done: false},
];

export const convertAiStructureToItems = (structure: AiBuildingStructure): RilievoItem[] => {
    counter = 0;
    const items: RilievoItem[] = [];

    const buildingId = nextId('bld');
    items.push({
        id: buildingId,
        parentId: null,
        type: 'building',
        label: structure.label || 'Edificio',
        detail: structure.address,
        status: 'pending',
        checks: [
            {id: `${buildingId}-chk-ext-photo`, type: 'photo', label: 'Foto esterna edificio', done: false},
            {id: `${buildingId}-chk-ext-note`, type: 'note', label: 'Note generali edificio', done: false},
        ],
        order: 0,
    });

    for (const floor of structure.floors) {
        const floorId = nextId('floor');
        items.push({
            id: floorId,
            parentId: buildingId,
            type: 'floor',
            label: floor.label,
            status: 'pending',
            checks: [
                {id: `${floorId}-chk-panoramic`, type: 'photo', label: `Foto panoramica ${floor.label}`, done: false},
            ],
            order: floor.level,
        });

        for (let ri = 0; ri < floor.rooms.length; ri++) {
            const room = floor.rooms[ri];
            const roomId = nextId('room');
            const areaStr = room.area ? ` (${room.area} mq)` : '';

            items.push({
                id: roomId,
                parentId: floorId,
                type: 'room',
                label: `${room.label}${areaStr}`,
                detail: room.destinationUse,
                status: 'pending',
                checks: makeRoomChecks(roomId),
                order: ri,
            });

            for (let wi = 0; wi < room.walls.length; wi++) {
                const wall = room.walls[wi];
                const wallId = nextId('wall');
                const wallDetail = wall.length ? `${wall.length} m` : undefined;

                items.push({
                    id: wallId,
                    parentId: roomId,
                    type: 'wall',
                    label: wall.label,
                    detail: wallDetail,
                    status: 'pending',
                    checks: makeWallChecks(wallId),
                    order: wi,
                });

                // Aperture come figli della parete
                for (let oi = 0; oi < wall.openings.length; oi++) {
                    const opening = wall.openings[oi];
                    const openingId = nextId('opening');
                    const typeLabel = RILIEVO_OPENING_TYPE_LABELS[opening.type] || 'Apertura';
                    const dimStr = opening.width && opening.height ? ` (${opening.width} x ${opening.height})` : '';

                    items.push({
                        id: openingId,
                        parentId: wallId,
                        type: 'opening',
                        label: `${opening.label} - ${typeLabel}${dimStr}`,
                        detail: opening.note,
                        status: 'pending',
                        checks: makeOpeningChecks(openingId, typeLabel),
                        openingType: opening.type,
                        order: oi,
                    });
                }

                // Elementi come figli della parete
                for (let ei = 0; ei < wall.elements.length; ei++) {
                    const element = wall.elements[ei];
                    const elementId = nextId('elem');

                    items.push({
                        id: elementId,
                        parentId: wallId,
                        type: 'element',
                        label: `${element.label}${element.note ? ` - ${element.note}` : ''}`,
                        status: 'pending',
                        checks: makeElementChecks(elementId, element.label),
                        elementCategory: element.category,
                        order: 100 + ei,
                    });
                }
            }
        }
    }

    // Elementi esterni
    if (structure.externalElements) {
        for (let i = 0; i < structure.externalElements.length; i++) {
            const ext = structure.externalElements[i];
            const extId = nextId('elem');
            items.push({
                id: extId,
                parentId: buildingId,
                type: 'element',
                label: `${ext.label}${ext.note ? ` - ${ext.note}` : ''}`,
                status: 'pending',
                checks: makeElementChecks(extId, ext.label),
                elementCategory: ext.category,
                order: 200 + i,
            });
        }
    }

    return items;
};

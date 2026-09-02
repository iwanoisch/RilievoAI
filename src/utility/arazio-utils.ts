import type {ArazioRepeatableInstance, ArazioSectionData} from "../features/arazio/arazio.type.ts";
import {EMPTY_VALUTAZIONE} from "../constants/arazio-sections.constant.ts";

export const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};

export const mapInstance = (
    instances: ArazioRepeatableInstance[],
    instanceId: string,
    updater: (inst: ArazioRepeatableInstance) => ArazioRepeatableInstance
): ArazioRepeatableInstance[] =>
    instances.map(inst => inst.id === instanceId ? updater(inst) : inst);

export const createEmptyInstance = (): ArazioRepeatableInstance => ({
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
    values: {},
    valutazione: {...EMPTY_VALUTAZIONE},
    subRepeatables: {},
    subGroupValutazioni: {},
});

export const createEmptySection = (sectionId: string, buildingId: string): ArazioSectionData => ({
    sectionId,
    buildingId,
    status: 'empty',
    values: {},
    groupValutazioni: {},
    repeatables: {},
    visibleOptionalGroups: [],
    attachments: [],
});

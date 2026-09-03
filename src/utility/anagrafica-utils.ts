import type {AnagraficaRepeatableInstance, AnagraficaSectionData} from "../features/anagrafica/anagrafica.type.ts";
import {EMPTY_VALUTAZIONE} from "../constants/anagrafica-sections.constant.ts";

export const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};

export const mapInstance = (
    instances: AnagraficaRepeatableInstance[],
    instanceId: string,
    updater: (inst: AnagraficaRepeatableInstance) => AnagraficaRepeatableInstance
): AnagraficaRepeatableInstance[] =>
    instances.map(inst => inst.id === instanceId ? updater(inst) : inst);

export const createEmptyInstance = (): AnagraficaRepeatableInstance => ({
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
    values: {},
    valutazione: {...EMPTY_VALUTAZIONE},
    subRepeatables: {},
    subGroupValutazioni: {},
});

export const createEmptySection = (sectionId: string, buildingId: string): AnagraficaSectionData => ({
    sectionId,
    buildingId,
    status: 'empty',
    values: {},
    groupValutazioni: {},
    repeatables: {},
    visibleOptionalGroups: [],
    attachments: [],
});

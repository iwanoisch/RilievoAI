import {useAppDispatch, useAppSelector, store} from "../../store/store.ts";
import {setSections, setAnagraficaError} from "./anagraficaSlice.ts";
import type {AnagraficaAttachment, AnagraficaRepeatableInstance, AnagraficaSectionData, AnagraficaValutazione} from "./anagrafica.type.ts";
import type {AiAnagraficaResponse} from "../ai/ai.type.ts";
import {ANAGRAFICA_SECTIONS, EMPTY_VALUTAZIONE} from "../../constants/anagrafica-sections.constant.ts";
import {mapInstance, createEmptyInstance, createEmptySection} from "../../utility/anagrafica-utils.ts";

export const useAnagrafica = () => {
    const dispatch = useAppDispatch();
    const state = useAppSelector(state => state.anagrafica);

    const getFreshState = () => store.getState().anagrafica;

    const getSectionsForBuilding = (buildingId: string): AnagraficaSectionData[] => {
        return ANAGRAFICA_SECTIONS.map(config => {
            const existing = state.sections.find(
                s => s.sectionId === config.id && s.buildingId === buildingId
            );
            if (!existing) return createEmptySection(config.id, buildingId);
            return {...createEmptySection(config.id, buildingId), ...existing};
        });
    };

    const getSectionData = (buildingId: string, sectionId: string): AnagraficaSectionData => {
        const existing = state.sections.find(
            s => s.sectionId === sectionId && s.buildingId === buildingId
        );
        if (!existing) return createEmptySection(sectionId, buildingId);
        return {
            ...createEmptySection(sectionId, buildingId),
            ...existing,
        };
    };

    const updateSection = (buildingId: string, sectionId: string, patch: Partial<AnagraficaSectionData>) => {
        const current = getSectionData(buildingId, sectionId);
        const updated: AnagraficaSectionData = {...current, ...patch};
        const others = state.sections.filter(
            s => !(s.sectionId === sectionId && s.buildingId === buildingId)
        );
        dispatch(setSections([...others, updated]));
    };

    const addAttachments = (buildingId: string, sectionId: string, fieldKey: string, files: File[], instanceId?: string) => {
        const current = getSectionData(buildingId, sectionId);
        const newAttachments: AnagraficaAttachment[] = files.map(file => ({
            id: `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
            fieldKey,
            instanceId,
            name: file.name,
            size: file.size,
            type: file.type,
            url: URL.createObjectURL(file),
        }));
        updateSection(buildingId, sectionId, {
            attachments: [...current.attachments, ...newAttachments],
        });
    };

    const removeAttachment = (buildingId: string, sectionId: string, attachmentId: string) => {
        const current = getSectionData(buildingId, sectionId);
        updateSection(buildingId, sectionId, {
            attachments: current.attachments.filter(a => a.id !== attachmentId),
        });
    };

    const addRepeatableInstance = (buildingId: string, sectionId: string, groupKey: string) => {
        const current = getSectionData(buildingId, sectionId);
        const instances = current.repeatables[groupKey] ?? [];
        updateSection(buildingId, sectionId, {
            repeatables: {
                ...current.repeatables,
                [groupKey]: [...instances, createEmptyInstance()],
            },
        });
    };

    const removeRepeatableInstance = (buildingId: string, sectionId: string, groupKey: string, instanceId: string) => {
        const current = getSectionData(buildingId, sectionId);
        const instances = current.repeatables[groupKey] ?? [];
        updateSection(buildingId, sectionId, {
            repeatables: {
                ...current.repeatables,
                [groupKey]: instances.filter(i => i.id !== instanceId),
            },
            attachments: current.attachments.filter(a => a.instanceId !== instanceId),
        });
    };

    const updateRepeatableField = (
        buildingId: string, sectionId: string, groupKey: string,
        instanceId: string, fieldKey: string, value: string
    ) => {
        const current = getSectionData(buildingId, sectionId);
        const instances = current.repeatables[groupKey] ?? [];
        updateSection(buildingId, sectionId, {
            repeatables: {
                ...current.repeatables,
                [groupKey]: mapInstance(instances, instanceId, inst => ({
                    ...inst, values: {...inst.values, [fieldKey]: value},
                })),
            },
        });
    };

    const updateRepeatableValutazione = (
        buildingId: string, sectionId: string, groupKey: string,
        instanceId: string, key: keyof AnagraficaValutazione, value: string
    ) => {
        const current = getSectionData(buildingId, sectionId);
        const instances = current.repeatables[groupKey] ?? [];
        updateSection(buildingId, sectionId, {
            repeatables: {
                ...current.repeatables,
                [groupKey]: mapInstance(instances, instanceId, inst => ({
                    ...inst, valutazione: {...inst.valutazione, [key]: value},
                })),
            },
        });
    };

    const addSubRepeatableInstance = (
        buildingId: string, sectionId: string, groupKey: string,
        parentInstanceId: string, subGroupKey: string
    ) => {
        const current = getSectionData(buildingId, sectionId);
        const instances = current.repeatables[groupKey] ?? [];
        updateSection(buildingId, sectionId, {
            repeatables: {
                ...current.repeatables,
                [groupKey]: mapInstance(instances, parentInstanceId, inst => ({
                    ...inst,
                    subRepeatables: {
                        ...inst.subRepeatables,
                        [subGroupKey]: [...(inst.subRepeatables[subGroupKey] ?? []), createEmptyInstance()],
                    },
                })),
            },
        });
    };

    const removeSubRepeatableInstance = (
        buildingId: string, sectionId: string, groupKey: string,
        parentInstanceId: string, subGroupKey: string, subInstanceId: string
    ) => {
        const current = getSectionData(buildingId, sectionId);
        const instances = current.repeatables[groupKey] ?? [];
        updateSection(buildingId, sectionId, {
            repeatables: {
                ...current.repeatables,
                [groupKey]: mapInstance(instances, parentInstanceId, inst => ({
                    ...inst,
                    subRepeatables: {
                        ...inst.subRepeatables,
                        [subGroupKey]: (inst.subRepeatables[subGroupKey] ?? []).filter(si => si.id !== subInstanceId),
                    },
                })),
            },
            attachments: current.attachments.filter(a => a.instanceId !== subInstanceId),
        });
    };

    const updateSubRepeatableField = (
        buildingId: string, sectionId: string, groupKey: string,
        parentInstanceId: string, subGroupKey: string,
        subInstanceId: string, fieldKey: string, value: string
    ) => {
        const current = getSectionData(buildingId, sectionId);
        const instances = current.repeatables[groupKey] ?? [];
        updateSection(buildingId, sectionId, {
            repeatables: {
                ...current.repeatables,
                [groupKey]: mapInstance(instances, parentInstanceId, inst => ({
                    ...inst,
                    subRepeatables: {
                        ...inst.subRepeatables,
                        [subGroupKey]: mapInstance(inst.subRepeatables[subGroupKey] ?? [], subInstanceId, si => ({
                            ...si, values: {...si.values, [fieldKey]: value},
                        })),
                    },
                })),
            },
        });
    };

    const updateSubRepeatableValutazione = (
        buildingId: string, sectionId: string, groupKey: string,
        parentInstanceId: string, subGroupKey: string,
        subInstanceId: string, key: keyof AnagraficaValutazione, value: string
    ) => {
        const current = getSectionData(buildingId, sectionId);
        const instances = current.repeatables[groupKey] ?? [];
        updateSection(buildingId, sectionId, {
            repeatables: {
                ...current.repeatables,
                [groupKey]: mapInstance(instances, parentInstanceId, inst => ({
                    ...inst,
                    subRepeatables: {
                        ...inst.subRepeatables,
                        [subGroupKey]: mapInstance(inst.subRepeatables[subGroupKey] ?? [], subInstanceId, si => ({
                            ...si, valutazione: {...si.valutazione, [key]: value},
                        })),
                    },
                })),
            },
        });
    };

    const updateSubGroupValutazione = (
        buildingId: string, sectionId: string, groupKey: string,
        parentInstanceId: string, subGroupKey: string,
        key: keyof AnagraficaValutazione, value: string
    ) => {
        const current = getSectionData(buildingId, sectionId);
        const instances = current.repeatables[groupKey] ?? [];
        updateSection(buildingId, sectionId, {
            repeatables: {
                ...current.repeatables,
                [groupKey]: mapInstance(instances, parentInstanceId, inst => {
                    const existing = inst.subGroupValutazioni[subGroupKey] ?? {...EMPTY_VALUTAZIONE};
                    return {
                        ...inst,
                        subGroupValutazioni: {
                            ...inst.subGroupValutazioni,
                            [subGroupKey]: {...existing, [key]: value},
                        },
                    };
                }),
            },
        });
    };

    const addOptionalGroup = (buildingId: string, sectionId: string, groupKey: string) => {
        const current = getSectionData(buildingId, sectionId);
        if (current.visibleOptionalGroups.includes(groupKey)) return;
        updateSection(buildingId, sectionId, {
            visibleOptionalGroups: [...current.visibleOptionalGroups, groupKey],
        });
    };

    const removeOptionalGroup = (buildingId: string, sectionId: string, groupKey: string) => {
        const current = getSectionData(buildingId, sectionId);
        updateSection(buildingId, sectionId, {
            visibleOptionalGroups: current.visibleOptionalGroups.filter(k => k !== groupKey),
        });
    };

    const updateGroupValutazione = (
        buildingId: string, sectionId: string, groupKey: string,
        key: keyof AnagraficaValutazione, value: string
    ) => {
        const current = getSectionData(buildingId, sectionId);
        const existing = current.groupValutazioni[groupKey] ?? {...EMPTY_VALUTAZIONE};
        updateSection(buildingId, sectionId, {
            groupValutazioni: {
                ...current.groupValutazioni,
                [groupKey]: {...existing, [key]: value},
            },
        });
    };

    const applyAiResponse = (buildingId: string, sectionId: string, aiResponse: AiAnagraficaResponse) => {
        const freshState = getFreshState();
        const existing = freshState.sections.find(
            s => s.sectionId === sectionId && s.buildingId === buildingId
        );
        const current = existing ?? createEmptySection(sectionId, buildingId);
        const values = aiResponse.values ?? {};
        const groupValutazioni = aiResponse.groupValutazioni ?? {};
        const repeatables = aiResponse.repeatables ?? {};

        const nonEmptyValues: Record<string, string> = {};
        for (const [k, v] of Object.entries(values)) {
            let str = '';
            if (typeof v === 'string') {
                str = v;
            } else if (v != null && typeof v === 'object') {
                const obj = v as Record<string, unknown>;
                const first = Object.values(obj).find(val => typeof val === 'string' && val.trim() !== '');
                str = typeof first === 'string' ? first : JSON.stringify(v);
            } else if (v != null) {
                str = String(v);
            }
            if (str.trim() !== '') nonEmptyValues[k] = str;
        }

        const mergedValues = {...current.values, ...nonEmptyValues};
        const mergedGroupValutazioni = {...current.groupValutazioni, ...groupValutazioni};

        const mergedRepeatables: Record<string, AnagraficaRepeatableInstance[]> = {...current.repeatables};
        for (const [groupKey, aiInstances] of Object.entries(repeatables)) {
            if (!Array.isArray(aiInstances)) continue;
            const newInstances: AnagraficaRepeatableInstance[] = aiInstances.map(ai => ({
                ...createEmptyInstance(),
                values: ai.values ?? {},
                valutazione: ai.valutazione ?? {...EMPTY_VALUTAZIONE},
            }));
            mergedRepeatables[groupKey] = [...(mergedRepeatables[groupKey] ?? []), ...newInstances];
        }

        const updated: AnagraficaSectionData = {
            ...current,
            values: mergedValues,
            groupValutazioni: mergedGroupValutazioni,
            repeatables: mergedRepeatables,
        };
        const freshOthers = getFreshState().sections.filter(
            s => !(s.sectionId === sectionId && s.buildingId === buildingId)
        );
        dispatch(setSections([...freshOthers, updated]));
    };

    const saveDraft = async (buildingId: string, sectionId: string) => {
        try {
            updateSection(buildingId, sectionId, {status: 'draft'});
            return {success: true};
        } catch (error) {
            const message = error instanceof Error ? error.message : 'Errore sconosciuto';
            dispatch(setAnagraficaError(message));
            return null;
        }
    };

    const saveAndComplete = async (buildingId: string, sectionId: string) => {
        try {
            updateSection(buildingId, sectionId, {status: 'completed'});
            return {success: true};
        } catch (error) {
            const message = error instanceof Error ? error.message : 'Errore sconosciuto';
            dispatch(setAnagraficaError(message));
            return null;
        }
    };

    return {
        ...state,
        getSectionsForBuilding,
        getSectionData,
        updateSection,
        addAttachments,
        removeAttachment,
        addRepeatableInstance,
        removeRepeatableInstance,
        updateRepeatableField,
        updateRepeatableValutazione,
        addOptionalGroup,
        removeOptionalGroup,
        addSubRepeatableInstance,
        removeSubRepeatableInstance,
        updateSubRepeatableField,
        updateSubRepeatableValutazione,
        updateSubGroupValutazione,
        updateGroupValutazione,
        applyAiResponse,
        saveDraft,
        saveAndComplete,
    };
};

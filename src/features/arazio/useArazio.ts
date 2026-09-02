import {useAppDispatch, useAppSelector} from "../../store/store.ts";
import {setSections, setArazioError} from "./arazioSlice.ts";
import type {ArazioAttachment, ArazioSectionData, ArazioValutazione} from "./arazio.type.ts";
import {ARAZIO_SECTIONS, EMPTY_VALUTAZIONE} from "../../constants/arazio-sections.constant.ts";
import {mapInstance, createEmptyInstance, createEmptySection} from "../../utility/arazio-utils.ts";

export const useArazio = () => {
    const dispatch = useAppDispatch();
    const state = useAppSelector(state => state.arazio);

    const getSectionsForBuilding = (buildingId: string): ArazioSectionData[] => {
        return ARAZIO_SECTIONS.map(config => {
            const existing = state.sections.find(
                s => s.sectionId === config.id && s.buildingId === buildingId
            );
            return existing ?? createEmptySection(config.id, buildingId);
        });
    };

    const getSectionData = (buildingId: string, sectionId: string): ArazioSectionData => {
        const existing = state.sections.find(
            s => s.sectionId === sectionId && s.buildingId === buildingId
        );
        return existing ?? createEmptySection(sectionId, buildingId);
    };

    const updateSection = (buildingId: string, sectionId: string, patch: Partial<ArazioSectionData>) => {
        const current = getSectionData(buildingId, sectionId);
        const updated: ArazioSectionData = {...current, ...patch};
        const others = state.sections.filter(
            s => !(s.sectionId === sectionId && s.buildingId === buildingId)
        );
        dispatch(setSections([...others, updated]));
    };

    // ── Allegati ──

    const addAttachments = (buildingId: string, sectionId: string, fieldKey: string, files: File[], instanceId?: string) => {
        const current = getSectionData(buildingId, sectionId);
        const newAttachments: ArazioAttachment[] = files.map(file => ({
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

    // ── Gruppi ripetibili (livello sezione) ──

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
        instanceId: string, key: keyof ArazioValutazione, value: string
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

    // ── Sub-repeatables (nidificati dentro un'istanza) ──

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
        subInstanceId: string, key: keyof ArazioValutazione, value: string
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
        key: keyof ArazioValutazione, value: string
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

    // ── Gruppi opzionali ──

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

    // ── Valutazione per gruppo (non ripetibile, livello sezione) ──

    const updateGroupValutazione = (
        buildingId: string, sectionId: string, groupKey: string,
        key: keyof ArazioValutazione, value: string
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

    // ── Salvataggio ──

    const saveDraft = async (buildingId: string, sectionId: string) => {
        try {
            updateSection(buildingId, sectionId, {status: 'draft'});
            return {success: true};
        } catch (error) {
            const message = error instanceof Error ? error.message : 'Errore sconosciuto';
            dispatch(setArazioError(message));
            return null;
        }
    };

    const saveAndComplete = async (buildingId: string, sectionId: string) => {
        try {
            updateSection(buildingId, sectionId, {status: 'completed'});
            return {success: true};
        } catch (error) {
            const message = error instanceof Error ? error.message : 'Errore sconosciuto';
            dispatch(setArazioError(message));
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
        saveDraft,
        saveAndComplete,
    };
};

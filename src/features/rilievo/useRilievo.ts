import {useState} from "react";
import {useAppDispatch, useAppSelector} from "../../store/store.ts";
import {
    setRilievoItems, setRilievoPhotos, setRilievoAudios, setRilievoMeasurements,
    setSelectedItemId, setGenerated, setRilievoError,
} from "./rilievoSlice.ts";
import {convertAiStructureToItems} from "../../utility/rilievo-utils.ts";
import {
    AI_MODEL, AI_MAX_TOKENS, AI_API_URL, AI_API_VERSION, AI_RILIEVO_SYSTEM_PROMPT,
} from "../../constants/ai-prompts.constant.ts";
import type {AiBuildingStructure} from "../ai/ai.type.ts";
import type {RilievoItem, RilievoCheck, RilievoPhoto, RilievoAudio, RilievoMeasurement} from "./rilievo.type.ts";

const API_KEY = import.meta.env.VITE_CLAUDE_KEY as string;

const serializeArazioForPrompt = (sections: Array<{sectionId: string; values: Record<string, string>; repeatables: Record<string, Array<{values: Record<string, string>}>>}>): string => {
    const parts: string[] = [];
    for (const section of sections) {
        const nonEmpty = Object.entries(section.values || {}).filter(([_, v]) => v && v.trim());
        if (nonEmpty.length === 0 && (!section.repeatables || Object.keys(section.repeatables).length === 0)) continue;

        parts.push(`\n--- Sezione: ${section.sectionId} ---`);
        for (const [key, val] of nonEmpty) {
            parts.push(`${key}: ${val}`);
        }
        if (section.repeatables) {
            for (const [groupKey, instances] of Object.entries(section.repeatables)) {
                if (!instances?.length) continue;
                parts.push(`  [Gruppo ripetibile: ${groupKey}]`);
                for (let i = 0; i < instances.length; i++) {
                    const inst = instances[i];
                    const instNonEmpty = Object.entries(inst.values || {}).filter(([_, v]) => v && v.trim());
                    if (instNonEmpty.length === 0) continue;
                    parts.push(`    Istanza ${i + 1}:`);
                    for (const [k, v] of instNonEmpty) {
                        parts.push(`      ${k}: ${v}`);
                    }
                }
            }
        }
    }
    return parts.join('\n');
};

export const useRilievo = () => {
    const dispatch = useAppDispatch();
    const rawState = useAppSelector(state => state.rilievo);
    const arazioSections = useAppSelector(state => state.arazio.sections);
    const state = {
        ...rawState,
        photos: rawState.photos ?? [],
        audios: rawState.audios ?? [],
        measurements: rawState.measurements ?? [],
    };

    const [generating, setGenerating] = useState(false);

    const regenerateFromArazio = async () => {
        if (!arazioSections || arazioSections.length === 0) {
            dispatch(setRilievoError('Nessun dato disponibile. Analizza prima i documenti nella tab Documentazione.'));
            return null;
        }

        const serialized = serializeArazioForPrompt(arazioSections);
        if (serialized.trim().length < 50) {
            dispatch(setRilievoError('Dati insufficienti. Analizza prima i documenti nella tab Documentazione.'));
            return null;
        }

        try {
            dispatch(setRilievoError(null));
            setGenerating(true);

            const response = await fetch(AI_API_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'x-api-key': API_KEY,
                    'anthropic-version': AI_API_VERSION,
                },
                body: JSON.stringify({
                    model: AI_MODEL,
                    max_tokens: AI_MAX_TOKENS,
                    system: AI_RILIEVO_SYSTEM_PROMPT,
                    messages: [{role: 'user', content: `Ecco i dati dell'immobile gia estratti dalla documentazione:\n${serialized}\n\nGenera la struttura gerarchica completa dell'edificio per il rilievo tecnico.`}],
                }),
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`Errore AI: ${response.status} - ${errorText.slice(0, 200)}`);
            }

            const data = await response.json();
            const textBlock = (data.content as Array<Record<string, unknown>>)?.find((b: Record<string, unknown>) => b.type === 'text');
            if (!textBlock?.text) throw new Error('Risposta vuota dall\'AI');

            let text = textBlock.text as string;
            const jsonMatch = text.match(/```(?:json)?\s*([\s\S]*?)```/);
            if (jsonMatch) text = jsonMatch[1];

            const structure = JSON.parse(text.trim()) as AiBuildingStructure;
            const items = convertAiStructureToItems(structure);

            dispatch(setRilievoItems(items));
            dispatch(setGenerated(true));
            setGenerating(false);
            return {data: items};
        } catch (error) {
            const message = error instanceof Error ? error.message : 'Errore nella generazione';
            dispatch(setRilievoError(message));
            setGenerating(false);
            return null;
        }
    };

    const selectItem = (id: string | null) => {
        dispatch(setSelectedItemId(id));
    };

    // ===== Item CRUD =====

    const addItem = (item: RilievoItem) => {
        dispatch(setRilievoItems([...state.items, item]));
    };

    const updateItem = (itemId: string, updates: Partial<RilievoItem>) => {
        const updated = state.items.map(i =>
            i.id === itemId ? {...i, ...updates} : i
        );
        dispatch(setRilievoItems(updated));
    };

    const deleteItem = (itemId: string) => {
        const idsToDelete = new Set<string>();
        const collectIds = (id: string) => {
            idsToDelete.add(id);
            state.items.filter(i => i.parentId === id).forEach(child => collectIds(child.id));
        };
        collectIds(itemId);

        dispatch(setRilievoItems(state.items.filter(i => !idsToDelete.has(i.id))));
        dispatch(setRilievoPhotos(state.photos.filter(p => !idsToDelete.has(p.itemId))));
        dispatch(setRilievoAudios(state.audios.filter(a => !idsToDelete.has(a.itemId))));
        dispatch(setRilievoMeasurements(state.measurements.filter(m => !idsToDelete.has(m.itemId))));

        if (state.selectedItemId && idsToDelete.has(state.selectedItemId)) {
            dispatch(setSelectedItemId(null));
        }
    };

    // ===== Checks =====

    const toggleCheck = (itemId: string, checkId: string) => {
        const updated = state.items.map(item => {
            if (item.id !== itemId) return item;
            const checks = item.checks.map(c =>
                c.id === checkId ? {...c, done: !c.done} : c
            );
            return {...item, checks, status: computeStatus(checks)};
        });
        dispatch(setRilievoItems(updated));
    };

    const updateCheckValue = (itemId: string, checkId: string, value: string) => {
        const updated = state.items.map(item => {
            if (item.id !== itemId) return item;
            const checks = item.checks.map(c =>
                c.id === checkId ? {...c, value, done: true} : c
            );
            return {...item, checks, status: computeStatus(checks)};
        });
        dispatch(setRilievoItems(updated));
    };

    const addCheck = (itemId: string, check: RilievoCheck) => {
        const updated = state.items.map(item => {
            if (item.id !== itemId) return item;
            return {...item, checks: [...item.checks, check]};
        });
        dispatch(setRilievoItems(updated));
    };

    // ===== Foto =====

    const addPhoto = (photo: RilievoPhoto) => {
        dispatch(setRilievoPhotos([...state.photos, photo]));
        markCheckDone(photo.itemId, 'photo');
    };

    const updatePhoto = (photoId: string, updates: Partial<RilievoPhoto>) => {
        dispatch(setRilievoPhotos(state.photos.map(p => p.id === photoId ? {...p, ...updates} : p)));
    };

    const deletePhoto = (photoId: string) => {
        dispatch(setRilievoPhotos(state.photos.filter(p => p.id !== photoId)));
    };

    const getPhotosForItem = (itemId: string) =>
        state.photos.filter(p => p.itemId === itemId);

    // ===== Audio =====

    const addAudio = (audio: RilievoAudio) => {
        dispatch(setRilievoAudios([...state.audios, audio]));
        markCheckDone(audio.itemId, 'audio');
    };

    const updateAudio = (audioId: string, updates: Partial<RilievoAudio>) => {
        dispatch(setRilievoAudios(state.audios.map(a => a.id === audioId ? {...a, ...updates} : a)));
    };

    const deleteAudio = (audioId: string) => {
        dispatch(setRilievoAudios(state.audios.filter(a => a.id !== audioId)));
    };

    const getAudiosForItem = (itemId: string) =>
        state.audios.filter(a => a.itemId === itemId);

    // ===== Misurazioni =====

    const addMeasurement = (measurement: RilievoMeasurement) => {
        dispatch(setRilievoMeasurements([...state.measurements, measurement]));
        markCheckDone(measurement.itemId, 'measurement');
    };

    const updateMeasurement = (measurementId: string, updates: Partial<RilievoMeasurement>) => {
        dispatch(setRilievoMeasurements(state.measurements.map(m => m.id === measurementId ? {...m, ...updates} : m)));
    };

    const deleteMeasurement = (measurementId: string) => {
        dispatch(setRilievoMeasurements(state.measurements.filter(m => m.id !== measurementId)));
    };

    const getMeasurementsForItem = (itemId: string) =>
        state.measurements.filter(m => m.itemId === itemId);

    // ===== Helpers =====

    const markCheckDone = (itemId: string, checkType: string) => {
        const item = state.items.find(i => i.id === itemId);
        if (!item) return;
        const firstUndone = item.checks.find(c => c.type === checkType && !c.done);
        if (firstUndone) {
            toggleCheck(itemId, firstUndone.id);
        }
    };

    const computeStatus = (checks: RilievoCheck[]): RilievoItem['status'] => {
        if (checks.length === 0) return 'pending';
        const allDone = checks.every(c => c.done);
        const anyDone = checks.some(c => c.done);
        return allDone ? 'done' : anyDone ? 'in_progress' : 'pending';
    };

    const selectedItem = state.selectedItemId
        ? state.items.find(i => i.id === state.selectedItemId) || null
        : null;

    const getChildren = (parentId: string) =>
        state.items.filter(i => i.parentId === parentId).sort((a, b) => a.order - b.order);

    const getRoots = () =>
        state.items.filter(i => i.parentId === null).sort((a, b) => a.order - b.order);

    const getCompletionPercent = (itemId: string): number => {
        const item = state.items.find(i => i.id === itemId);
        if (!item) return 0;
        const children = getChildren(itemId);
        if (children.length === 0) {
            if (item.checks.length === 0) return 0;
            const done = item.checks.filter(c => c.done).length;
            return Math.round((done / item.checks.length) * 100);
        }
        const childPercents = children.map(c => getCompletionPercent(c.id));
        if (childPercents.length === 0) return 0;
        return Math.round(childPercents.reduce((a, b) => a + b, 0) / childPercents.length);
    };

    const totalCompletion = (): number => {
        const roots = getRoots();
        if (roots.length === 0) return 0;
        const percents = roots.map(r => getCompletionPercent(r.id));
        return Math.round(percents.reduce((a, b) => a + b, 0) / percents.length);
    };

    const reset = () => {
        dispatch(setRilievoItems([]));
        dispatch(setRilievoPhotos([]));
        dispatch(setRilievoAudios([]));
        dispatch(setRilievoMeasurements([]));
        dispatch(setSelectedItemId(null));
        dispatch(setGenerated(false));
        dispatch(setRilievoError(null));
    };

    return {
        ...state,
        selectedItem,
        generating,
        // Generate
        regenerateFromArazio,
        // Item
        selectItem,
        addItem,
        updateItem,
        deleteItem,
        // Checks
        toggleCheck,
        updateCheckValue,
        addCheck,
        // Photo
        addPhoto,
        updatePhoto,
        deletePhoto,
        getPhotosForItem,
        // Audio
        addAudio,
        updateAudio,
        deleteAudio,
        getAudiosForItem,
        // Measurement
        addMeasurement,
        updateMeasurement,
        deleteMeasurement,
        getMeasurementsForItem,
        // Navigation
        getChildren,
        getRoots,
        getCompletionPercent,
        totalCompletion,
        // Reset
        reset,
    };
};

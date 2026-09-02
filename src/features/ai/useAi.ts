import {useRef} from "react";
import {useAppDispatch, useAppSelector} from "../../store/store.ts";
import {
    setAiStatus, addAnnotations, setSectionsProcessed, addSectionsProcessed,
    setAiError, addUploadedFiles, archiveSessionFiles, removeUploadedFile,
    addSession, setCurrentSessionId, setUserPrompt, setExtractionProgress, setBatchProgress,
} from "./aiSlice.ts";
import {ARAZIO_SECTIONS} from "../../constants/arazio-sections.constant.ts";
import {
    AI_ARAZIO_SYSTEM_PROMPT,
    AI_SECTION_PROMPT_TEMPLATE,
    AI_BULK_PROMPT_TEMPLATE,
    AI_MODEL,
    AI_MAX_TOKENS,
    AI_API_URL,
    AI_API_VERSION,
    AI_MAX_PAYLOAD_BYTES,
} from "../../constants/ai-prompts.constant.ts";
import {buildFieldSchema} from "../../utility/ai-schema-utils.ts";
import {extractFilesFromList} from "../../utility/file-extract-utils.ts";
import {useArazio} from "../arazio/useArazio.ts";
import {useBuildings} from "../buildings/useBuildings.ts";
import type {BuildingCardData} from "../buildings/buildings.type.ts";
import type {AiArazioRequest, AiArazioResponse, AiAnnotation, AiBulkResponse, AiExtractedFile, AiSession, AiUploadedFile} from "./ai.type.ts";
import type {SkippedFile} from "../../utility/file-extract-utils.ts";

const API_KEY = import.meta.env.VITE_CLAUDE_KEY as string;

const splitIntoBatches = (files: AiExtractedFile[]): AiExtractedFile[][] => {
    const batches: AiExtractedFile[][] = [];
    let currentBatch: AiExtractedFile[] = [];
    let currentSize = 0;

    for (const file of files) {
        const fileSize = file.base64.length;
        if (currentSize + fileSize > AI_MAX_PAYLOAD_BYTES && currentBatch.length > 0) {
            batches.push(currentBatch);
            currentBatch = [];
            currentSize = 0;
        }
        currentBatch.push(file);
        currentSize += fileSize;
    }

    if (currentBatch.length > 0) batches.push(currentBatch);
    return batches;
};

const buildContentBlocks = (files: AiExtractedFile[], finalText: string): Array<Record<string, unknown>> => {
    const blocks: Array<Record<string, unknown>> = [];

    for (const file of files) {
        if (file.mimeType === 'application/pdf') {
            blocks.push({
                type: 'document',
                source: {type: 'base64', media_type: 'application/pdf', data: file.base64},
            });
        } else if (file.mimeType.startsWith('image/')) {
            blocks.push({
                type: 'image',
                source: {type: 'base64', media_type: file.mimeType, data: file.base64},
            });
        } else {
            const text = atob(file.base64);
            blocks.push({type: 'text', text: `--- File: ${file.name} ---\n${text}`});
        }
    }

    blocks.push({type: 'text', text: finalText});
    return blocks;
};

const MAX_RETRIES = 2;
const RETRY_DELAYS = [3000, 6000];

const callClaude = async (system: string, content: Array<Record<string, unknown>>, signal?: AbortSignal): Promise<Record<string, unknown>> => {
    for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
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
                system,
                messages: [{role: 'user', content}],
            }),
            signal,
        });

        if (response.status === 529 && attempt < MAX_RETRIES) {
            await new Promise(r => setTimeout(r, RETRY_DELAYS[attempt]));
            continue;
        }

        if (!response.ok) {
            const error = await response.text();
            throw new Error(`Claude API error ${response.status}: ${error}`);
        }

        return response.json();
    }

    throw new Error('Claude API error 529: Server sovraccarico dopo più tentativi');
};

const parseResponse = <T>(data: Record<string, unknown>): T => {
    const textBlock = (data.content as Array<Record<string, unknown>>)?.find(b => b.type === 'text');
    if (!textBlock?.text) throw new Error('Risposta vuota da Claude');

    let text = textBlock.text as string;
    const jsonMatch = text.match(/```(?:json)?\s*([\s\S]*?)```/);
    if (jsonMatch) text = jsonMatch[1];

    return JSON.parse(text.trim()) as T;
};

const AI_STATE_DEFAULTS = {
    uploadedFiles: [] as AiUploadedFile[],
    sessions: [] as AiSession[],
    currentSessionId: null as string | null,
    userPrompt: '',
    totalSectionsProcessed: 0,
};

export const useAi = () => {
    const dispatch = useAppDispatch();
    const rawState = useAppSelector(state => state.ai);
    const state = {...AI_STATE_DEFAULTS, ...rawState};
    const arazio = useArazio();
    const buildings = useBuildings();
    const abortControllerRef = useRef<AbortController | null>(null);
    const failedBatchesRef = useRef<Array<{
        batch: AiExtractedFile[];
        index: number;
        systemPrompt: string;
        bulkPrompt: string;
        buildingId: string;
        totalBatches: number;
    }>>([]);

    const generateSessionId = () => `session-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;

    const extractBuildingUpdates = (
        responseSections: Record<string, AiArazioResponse>,
        newestDocDate: string,
        current: BuildingCardData
    ): Partial<BuildingCardData> => {
        // Se il building ha una dataDate e il documento è più vecchio, non aggiornare
        if (current.dataDate && newestDocDate && newestDocDate < current.dataDate) {
            return {};
        }

        const updates: Partial<BuildingCardData> = {};
        const strVal = (v: unknown): string => {
            if (typeof v === 'string') return v.trim();
            if (v != null && typeof v === 'object') {
                const first = Object.values(v as Record<string, unknown>).find(
                    val => typeof val === 'string' && val.trim() !== ''
                );
                return typeof first === 'string' ? first.trim() : '';
            }
            return v != null ? String(v).trim() : '';
        };

        const ubic = responseSections['ubicazione']?.values ?? {};
        const via = strVal(ubic['via']);
        const civico = strVal(ubic['numero_civico']);
        if (via) {
            updates.address = civico ? `${via} ${civico}` : via;
        }
        const comune = strVal(ubic['comune']);
        const provincia = strVal(ubic['provincia']);
        if (comune) {
            updates.city = provincia ? `${comune} (${provincia})` : comune;
        }
        const destUso = strVal(ubic['destinazione_uso']);
        if (destUso) {
            updates.buildingType = destUso;
        }

        const datiGen = responseSections['dati-generali']?.values ?? {};
        const pianiStr = strVal(datiGen['piani_fuori_terra_descrizione']) || strVal(datiGen['piani_fuori_terra']);
        if (pianiStr) {
            const match = pianiStr.match(/(\d+)/);
            if (match) updates.floorsCount = parseInt(match[1], 10);
        }

        const classif = responseSections['classificazione']?.values ?? {};
        const anno = strVal(classif['anno_costruzione']);
        if (anno) {
            const matchAnno = anno.match(/(\d{4})/);
            if (matchAnno) updates.yearBuilt = parseInt(matchAnno[1], 10);
        }

        const denominazione = strVal(ubic['denominazione']);
        if (denominazione) {
            updates.name = denominazione;
        }

        // Aggiorna la data del dato con la data del documento più recente
        if (newestDocDate) {
            updates.dataDate = newestDocDate;
        }

        return updates;
    };

    const extractFiles = async (files: File[]): Promise<{files: AiExtractedFile[]; skipped: SkippedFile[]; totalSizeMb: number}> => {
        try {
            dispatch(setAiStatus('extracting'));
            dispatch(setExtractionProgress({percent: 0, fileName: ''}));
            const result = await extractFilesFromList(files, (percent, fileName) => {
                dispatch(setExtractionProgress({percent, fileName}));
            });

            const sessionId = state.currentSessionId ?? generateSessionId();
            if (!state.currentSessionId) dispatch(setCurrentSessionId(sessionId));

            const uploadedEntries = files.map(f => ({
                name: f.name,
                sizeMb: Math.round(f.size / 1024 / 1024 * 10) / 10,
                sessionId,
                archived: false,
            }));
            dispatch(addUploadedFiles(uploadedEntries));
            dispatch(setAiStatus('idle'));
            return result;
        } catch (error) {
            const message = error instanceof Error ? error.message : 'Errore estrazione file';
            dispatch(setAiError(message));
            dispatch(setAiStatus('error'));
            return {files: [], skipped: [], totalSizeMb: 0};
        }
    };

    const stopAnalysis = () => {
        if (abortControllerRef.current) {
            abortControllerRef.current.abort();
            abortControllerRef.current = null;
            dispatch(setAiStatus('idle'));
            dispatch(setAiError(null));
        }
    };

    const analyzeSection = async (
        buildingId: string,
        sectionId: string,
        files: AiExtractedFile[],
        userPrompt?: string
    ) => {
        try {
            abortControllerRef.current = new AbortController();
            dispatch(setAiStatus('analyzing'));
            dispatch(setAiError(null));

            const config = ARAZIO_SECTIONS.find(s => s.id === sectionId);
            if (!config) throw new Error(`Sezione ${sectionId} non trovata`);

            const fieldSchema = buildFieldSchema(config);
            const systemPrompt = AI_ARAZIO_SYSTEM_PROMPT + (userPrompt ? `\nISTRUZIONI UTENTE:\n${userPrompt}\n` : '');
            const sectionPrompt = AI_SECTION_PROMPT_TEMPLATE
                .replace('{{sectionLabel}}', config.label)
                .replace('{{fieldSchema}}', JSON.stringify(fieldSchema, null, 2));

            const content = buildContentBlocks(files, sectionPrompt);
            const data = await callClaude(systemPrompt, content, abortControllerRef.current.signal);
            const response = parseResponse<AiArazioResponse>(data);

            arazio.applyAiResponse(buildingId, sectionId, response);
            dispatch(addAnnotations(response.notes ?? []));
            dispatch(addSectionsProcessed(1));
            dispatch(setAiStatus('done'));
            abortControllerRef.current = null;
            return {success: true};
        } catch (error) {
            if (error instanceof DOMException && error.name === 'AbortError') {
                dispatch(setAiStatus('idle'));
                return null;
            }
            const message = error instanceof Error ? error.message : 'Errore AI';
            dispatch(setAiError(message));
            dispatch(setAiStatus('error'));
            abortControllerRef.current = null;
            return null;
        }
    };

    const analyzeBulk = async (
        buildingId: string,
        files: AiExtractedFile[],
        userPrompt: string
    ) => {
        try {
            abortControllerRef.current = new AbortController();
            dispatch(setAiStatus('analyzing'));
            dispatch(setAiError(null));
            dispatch(setSectionsProcessed(0));

            const sessionId = state.currentSessionId ?? generateSessionId();
            dispatch(setCurrentSessionId(sessionId));

            const batches = splitIntoBatches(files);
            const sections: AiArazioRequest[] = ARAZIO_SECTIONS.map(config => ({
                sectionId: config.id,
                sectionLabel: config.label,
                fieldSchema: buildFieldSchema(config),
                files,
                userPrompt,
            }));

            const sectionsSchema = sections.map(s => ({
                sectionId: s.sectionId,
                sectionLabel: s.sectionLabel,
                fields: s.fieldSchema,
            }));

            const systemPrompt = AI_ARAZIO_SYSTEM_PROMPT + (userPrompt ? `\nISTRUZIONI UTENTE:\n${userPrompt}\n` : '');
            const bulkPrompt = AI_BULK_PROMPT_TEMPLATE
                .replace('{{sectionsSchema}}', JSON.stringify(sectionsSchema, null, 2));

            let batchProcessed = 0;
            let failedCount = 0;
            let newestDocDate = '';
            const allNotes: AiAnnotation[] = [];
            const mergedSections: Record<string, AiArazioResponse> = {};
            const failedBatchIndices: number[] = [];

            dispatch(setBatchProgress({current: 0, total: batches.length, failed: 0}));

            for (let i = 0; i < batches.length; i++) {
                if (abortControllerRef.current?.signal.aborted) break;

                dispatch(setBatchProgress({current: i + 1, total: batches.length, failed: failedCount}));

                const batchInfo = batches.length > 1
                    ? `\n\nATTENZIONE: Stai analizzando il batch ${i + 1} di ${batches.length}. Integra i dati trovati con quelli eventualmente già presenti.\n`
                    : '';

                try {
                    const content = buildContentBlocks(batches[i], bulkPrompt + batchInfo);
                    const data = await callClaude(systemPrompt, content, abortControllerRef.current?.signal);
                    const response = parseResponse<AiBulkResponse>(data);

                    // Traccia la data documento più recente tra tutti i batch
                    const batchDate = response.documentDate ?? '';
                    if (batchDate && batchDate > newestDocDate) {
                        newestDocDate = batchDate;
                    }

                    const responseSections = response.sections ?? {};
                    for (const [sectionId, sectionResponse] of Object.entries(responseSections)) {
                        arazio.applyAiResponse(buildingId, sectionId, sectionResponse);
                        batchProcessed++;
                        if (!mergedSections[sectionId]) {
                            mergedSections[sectionId] = sectionResponse;
                        } else {
                            mergedSections[sectionId] = {
                                ...mergedSections[sectionId],
                                values: {...mergedSections[sectionId].values, ...sectionResponse.values},
                            };
                        }
                    }

                    if (response.globalNotes?.length) allNotes.push(...response.globalNotes);
                    for (const sectionResponse of Object.values(responseSections)) {
                        if (sectionResponse.notes?.length) allNotes.push(...sectionResponse.notes);
                    }
                } catch (batchError) {
                    if (batchError instanceof DOMException && batchError.name === 'AbortError') throw batchError;
                    failedCount++;
                    failedBatchIndices.push(i);
                }
            }

            dispatch(setBatchProgress({current: batches.length, total: batches.length, failed: failedCount}));

            // Aggiorna dati edificio solo se la data documento è più recente della dataDate corrente
            const currentBuilding = buildings.buildings.find(b => b.id === buildingId);
            if (currentBuilding) {
                const buildingUpdates = extractBuildingUpdates(mergedSections, newestDocDate, currentBuilding);
                if (Object.keys(buildingUpdates).length > 0) {
                    void buildings.updateBuilding({...currentBuilding, ...buildingUpdates});
                }
            }

            dispatch(addAnnotations(allNotes));
            dispatch(addSectionsProcessed(batchProcessed));

            dispatch(addSession({
                id: sessionId,
                timestamp: new Date().toISOString(),
                fileCount: files.length,
                sectionsProcessed: batchProcessed,
            }));

            // Salva batch falliti per retry
            failedBatchesRef.current = failedBatchIndices.map(idx => ({
                batch: batches[idx],
                index: idx,
                systemPrompt,
                bulkPrompt,
                buildingId,
                totalBatches: batches.length,
            }));

            dispatch(setAiStatus(failedCount > 0 ? 'error' : 'done'));
            if (failedCount > 0) {
                dispatch(setAiError(`${failedCount} batch su ${batches.length} falliti per sovraccarico server. Puoi riprovare i batch falliti.`));
            }
            abortControllerRef.current = null;
            return {success: true, failedBatches: failedCount};
        } catch (error) {
            if (error instanceof DOMException && error.name === 'AbortError') {
                dispatch(setAiStatus('idle'));
                return null;
            }
            const message = error instanceof Error ? error.message : 'Errore AI';
            dispatch(setAiError(message));
            dispatch(setAiStatus('error'));
            abortControllerRef.current = null;
            return null;
        }
    };

    const retryFailedBatches = async () => {
        const pending = failedBatchesRef.current;
        if (pending.length === 0) return null;

        try {
            abortControllerRef.current = new AbortController();
            dispatch(setAiStatus('analyzing'));
            dispatch(setAiError(null));

            let retried = 0;
            let stillFailed = 0;
            const remaining: typeof pending = [];

            dispatch(setBatchProgress({current: 0, total: pending.length, failed: 0}));

            for (let i = 0; i < pending.length; i++) {
                if (abortControllerRef.current?.signal.aborted) break;

                const item = pending[i];
                dispatch(setBatchProgress({current: i + 1, total: pending.length, failed: stillFailed}));

                const batchInfo = `\n\nATTENZIONE: Stai analizzando il batch ${item.index + 1} di ${item.totalBatches} (retry). Integra i dati trovati con quelli eventualmente già presenti.\n`;

                try {
                    const content = buildContentBlocks(item.batch, item.bulkPrompt + batchInfo);
                    const data = await callClaude(item.systemPrompt, content, abortControllerRef.current?.signal);
                    const response = parseResponse<AiBulkResponse>(data);

                    const responseSections = response.sections ?? {};
                    for (const [sectionId, sectionResponse] of Object.entries(responseSections)) {
                        arazio.applyAiResponse(item.buildingId, sectionId, sectionResponse);
                    }
                    retried++;

                    if (response.globalNotes?.length) dispatch(addAnnotations(response.globalNotes));
                    for (const sectionResponse of Object.values(responseSections)) {
                        if (sectionResponse.notes?.length) dispatch(addAnnotations(sectionResponse.notes));
                    }
                } catch (batchError) {
                    if (batchError instanceof DOMException && batchError.name === 'AbortError') throw batchError;
                    stillFailed++;
                    remaining.push(item);
                }
            }

            failedBatchesRef.current = remaining;
            dispatch(setBatchProgress({current: pending.length, total: pending.length, failed: stillFailed}));
            dispatch(addSectionsProcessed(retried));

            if (stillFailed > 0) {
                dispatch(setAiError(`Ancora ${stillFailed} batch falliti. Puoi riprovare.`));
                dispatch(setAiStatus('error'));
            } else {
                dispatch(setAiError(null));
                dispatch(setAiStatus('done'));
            }

            abortControllerRef.current = null;
            return {success: true, failedBatches: stillFailed};
        } catch (error) {
            if (error instanceof DOMException && error.name === 'AbortError') {
                dispatch(setAiStatus('idle'));
                return null;
            }
            const message = error instanceof Error ? error.message : 'Errore AI';
            dispatch(setAiError(message));
            dispatch(setAiStatus('error'));
            abortControllerRef.current = null;
            return null;
        }
    };

    const hasFailedBatches = failedBatchesRef.current.length > 0;

    const archiveCurrentSession = () => {
        if (state.currentSessionId) {
            dispatch(archiveSessionFiles(state.currentSessionId));
            dispatch(setCurrentSessionId(null));
        }
    };

    const removeFile = (index: number) => {
        dispatch(removeUploadedFile(index));
    };

    const updatePrompt = (prompt: string) => {
        dispatch(setUserPrompt(prompt));
    };

    const resetStatus = () => {
        dispatch(setAiStatus('idle'));
        dispatch(setAiError(null));
        failedBatchesRef.current = [];
    };

    return {
        ...state,
        extractFiles,
        analyzeSection,
        analyzeBulk,
        stopAnalysis,
        retryFailedBatches,
        hasFailedBatches,
        archiveCurrentSession,
        removeFile,
        updatePrompt,
        resetStatus,
    };
};

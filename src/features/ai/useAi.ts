import {useAppDispatch, useAppSelector} from "../../store/store.ts";
import {setAiStatus, setAnnotations, setSectionsProcessed, setAiError} from "./aiSlice.ts";
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
import type {AiArazioRequest, AiArazioResponse, AiAnnotation, AiBulkResponse, AiExtractedFile} from "./ai.type.ts";
import type {SkippedFile} from "../../utility/file-extract-utils.ts";

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

const API_KEY = import.meta.env.VITE_CLAUDE_KEY as string;

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

const callClaude = async (system: string, content: Array<Record<string, unknown>>): Promise<Record<string, unknown>> => {
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
    });

    if (!response.ok) {
        const error = await response.text();
        throw new Error(`Claude API error ${response.status}: ${error}`);
    }

    return response.json();
};

const parseResponse = <T>(data: Record<string, unknown>): T => {
    const textBlock = (data.content as Array<Record<string, unknown>>)?.find(b => b.type === 'text');
    if (!textBlock?.text) throw new Error('Risposta vuota da Claude');

    let text = textBlock.text as string;
    const jsonMatch = text.match(/```(?:json)?\s*([\s\S]*?)```/);
    if (jsonMatch) text = jsonMatch[1];

    return JSON.parse(text.trim()) as T;
};

export const useAi = () => {
    const dispatch = useAppDispatch();
    const state = useAppSelector(state => state.ai);
    const arazio = useArazio();

    const extractFiles = async (files: File[]): Promise<{files: AiExtractedFile[]; skipped: SkippedFile[]; totalSizeMb: number}> => {
        try {
            dispatch(setAiStatus('extracting'));
            const result = await extractFilesFromList(files);
            dispatch(setAiStatus('idle'));
            return result;
        } catch (error) {
            const message = error instanceof Error ? error.message : 'Errore estrazione file';
            dispatch(setAiError(message));
            dispatch(setAiStatus('error'));
            return {files: [], skipped: [], totalSizeMb: 0};
        }
    };

    const analyzeSection = async (
        buildingId: string,
        sectionId: string,
        files: AiExtractedFile[],
        userPrompt?: string
    ) => {
        try {
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
            const data = await callClaude(systemPrompt, content);
            const response = parseResponse<AiArazioResponse>(data);

            arazio.applyAiResponse(buildingId, sectionId, response);
            dispatch(setAnnotations(response.notes ?? []));
            dispatch(setSectionsProcessed(1));
            dispatch(setAiStatus('done'));
            return {success: true};
        } catch (error) {
            const message = error instanceof Error ? error.message : 'Errore AI';
            dispatch(setAiError(message));
            dispatch(setAiStatus('error'));
            return null;
        }
    };

    const analyzeBulk = async (
        buildingId: string,
        files: AiExtractedFile[],
        userPrompt: string
    ) => {
        try {
            dispatch(setAiStatus('analyzing'));
            dispatch(setAiError(null));
            dispatch(setAnnotations([]));
            dispatch(setSectionsProcessed(0));

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

            let totalProcessed = 0;
            const allNotes: AiAnnotation[] = [];

            for (const batch of batches) {
                const batchInfo = batches.length > 1
                    ? `\n\nATTENZIONE: Stai analizzando il batch ${batches.indexOf(batch) + 1} di ${batches.length}. Integra i dati trovati con quelli eventualmente già presenti.\n`
                    : '';

                const content = buildContentBlocks(batch, bulkPrompt + batchInfo);
                const data = await callClaude(systemPrompt, content);
                const response = parseResponse<AiBulkResponse>(data);

                const sections = response.sections ?? {};
                for (const [sectionId, sectionResponse] of Object.entries(sections)) {
                    arazio.applyAiResponse(buildingId, sectionId, sectionResponse);
                    totalProcessed++;
                }

                if (response.globalNotes?.length) allNotes.push(...response.globalNotes);
                for (const sectionResponse of Object.values(sections)) {
                    if (sectionResponse.notes?.length) allNotes.push(...sectionResponse.notes);
                }
            }

            dispatch(setAnnotations(allNotes));
            dispatch(setSectionsProcessed(totalProcessed));
            dispatch(setAiStatus('done'));
            return {success: true};
        } catch (error) {
            const message = error instanceof Error ? error.message : 'Errore AI';
            dispatch(setAiError(message));
            dispatch(setAiStatus('error'));
            return null;
        }
    };

    return {
        ...state,
        extractFiles,
        analyzeSection,
        analyzeBulk,
    };
};

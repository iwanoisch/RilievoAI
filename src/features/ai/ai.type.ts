import type {ArazioValutazione} from "../arazio/arazio.type.ts";

export interface AiExtractedFile {
    name: string;
    mimeType: string;
    base64: string;
}

export interface AiArazioRequest {
    sectionId: string;
    sectionLabel: string;
    fieldSchema: AiFieldSchema[];
    files: AiExtractedFile[];
}

export interface AiFieldSchema {
    key: string;
    label: string;
    type: string;
    groupKey: string;
    options?: string[];
}

export interface AiArazioResponse {
    values: Record<string, string>;
    groupValutazioni: Record<string, ArazioValutazione>;
    repeatables: Record<string, AiRepeatableData[]>;
}

export interface AiRepeatableData {
    values: Record<string, string>;
    valutazione: ArazioValutazione;
}

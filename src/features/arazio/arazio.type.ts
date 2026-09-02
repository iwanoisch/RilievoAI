// ===== Configurazione campi (data-driven) =====

export type ArazioFieldType = 'text' | 'number' | 'date' | 'select' | 'radio' | 'textarea' | 'heading' | 'file' | 'checkbox';

export interface ArazioFieldOption {
    value: string;
    label: string;
}

export interface ArazioFieldConfig {
    key: string;
    label: string;
    type: ArazioFieldType;
    options?: ArazioFieldOption[];
    required?: boolean;
    colSpan?: 1 | 2;
    placeholder?: string;
    accept?: string;
    multiple?: boolean;
}

export interface ArazioGroupConfig {
    key: string;
    label: string;
    required?: boolean;
    repeatable?: boolean;
    hasValutazione?: boolean;
    optional?: boolean;
    fields: ArazioFieldConfig[];
    subGroups?: ArazioGroupConfig[];
}

export interface ArazioSectionConfig {
    id: string;
    number: number;
    label: string;
    groups: ArazioGroupConfig[];
}

// ===== Valutazione del record =====

export interface ArazioValutazione {
    responsabile: string;
    scadenza: string;
    criticita: string;
    priorita: string;
    rischio: string;
    impatto: string;
    azioneRichiesta: string;
}

// ===== Allegati =====

export interface ArazioAttachment {
    id: string;
    fieldKey: string;
    instanceId?: string;
    name: string;
    size: number;
    type: string;
    url: string;
}

// ===== Gruppi ripetibili =====

export interface ArazioRepeatableInstance {
    id: string;
    values: Record<string, string>;
    valutazione: ArazioValutazione;
    subRepeatables: Record<string, ArazioRepeatableInstance[]>;
    subGroupValutazioni: Record<string, ArazioValutazione>;
}

// ===== Dati runtime =====

export type ArazioSectionStatus = 'empty' | 'draft' | 'completed';

export interface ArazioSectionData {
    sectionId: string;
    buildingId: string;
    status: ArazioSectionStatus;
    values: Record<string, string>;
    groupValutazioni: Record<string, ArazioValutazione>;
    repeatables: Record<string, ArazioRepeatableInstance[]>;
    visibleOptionalGroups: string[];
    attachments: ArazioAttachment[];
}

// ===== State Redux =====

export interface ArazioState {
    sections: ArazioSectionData[];
    error: string | null;
}

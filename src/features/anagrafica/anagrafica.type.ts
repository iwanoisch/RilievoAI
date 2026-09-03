// ===== Configurazione campi (data-driven) =====

export type AnagraficaFieldType = 'text' | 'number' | 'date' | 'select' | 'radio' | 'textarea' | 'heading' | 'file' | 'checkbox';

export interface AnagraficaFieldOption {
    value: string;
    label: string;
}

export interface AnagraficaFieldConfig {
    key: string;
    label: string;
    type: AnagraficaFieldType;
    options?: AnagraficaFieldOption[];
    required?: boolean;
    colSpan?: 1 | 2;
    placeholder?: string;
    accept?: string;
    multiple?: boolean;
}

export interface AnagraficaGroupConfig {
    key: string;
    label: string;
    required?: boolean;
    repeatable?: boolean;
    hasValutazione?: boolean;
    optional?: boolean;
    fields: AnagraficaFieldConfig[];
    subGroups?: AnagraficaGroupConfig[];
}

export interface AnagraficaSectionConfig {
    id: string;
    number: number;
    label: string;
    groups: AnagraficaGroupConfig[];
}

// ===== Valutazione del record =====

export interface AnagraficaValutazione {
    responsabile: string;
    scadenza: string;
    criticita: string;
    priorita: string;
    rischio: string;
    impatto: string;
    azioneRichiesta: string;
}

// ===== Allegati =====

export interface AnagraficaAttachment {
    id: string;
    fieldKey: string;
    instanceId?: string;
    name: string;
    size: number;
    type: string;
    url: string;
}

// ===== Gruppi ripetibili =====

export interface AnagraficaRepeatableInstance {
    id: string;
    values: Record<string, string>;
    valutazione: AnagraficaValutazione;
    subRepeatables: Record<string, AnagraficaRepeatableInstance[]>;
    subGroupValutazioni: Record<string, AnagraficaValutazione>;
}

// ===== Dati runtime =====

export type AnagraficaSectionStatus = 'empty' | 'draft' | 'completed';

export interface AnagraficaSectionData {
    sectionId: string;
    buildingId: string;
    status: AnagraficaSectionStatus;
    values: Record<string, string>;
    groupValutazioni: Record<string, AnagraficaValutazione>;
    repeatables: Record<string, AnagraficaRepeatableInstance[]>;
    visibleOptionalGroups: string[];
    attachments: AnagraficaAttachment[];
}

// ===== State Redux =====

export interface AnagraficaState {
    sections: AnagraficaSectionData[];
    error: string | null;
}

import type {DataStatus, ElementType} from "../../building/slice/building.type.ts";
import type {ObservationType} from "../../survey/slice/survey.type.ts";

export type TransferStatus = 'pending' | 'transferred' | 'error';

export interface FascicoloField {
    key: string;
    label: string;
    value: string | number | undefined;
    source: 'building' | 'survey';
    sourceId: string;
    confidence: number;
    dataStatus: DataStatus;
}

export interface FascicoloScheda {
    elementId: string;
    elementType: ElementType;
    elementLabel: string;
    parentLabel: string;
    fields: FascicoloField[];
    observations: FascicoloObservation[];
    transferStatus: TransferStatus;
}

export interface FascicoloObservation {
    id: string;
    type: ObservationType;
    label: string;
    confidence: number;
    dataStatus: DataStatus;
    timestamp: string;
    excluded: boolean;
}

export interface TransferRecord {
    id: string;
    buildingId: string;
    sessionId: string;
    timestamp: string;
    schedeCount: number;
    observationsCount: number;
    status: 'success' | 'partial' | 'error';
    details: TransferRecordDetail[];
}

export interface TransferRecordDetail {
    elementId: string;
    elementLabel: string;
    fieldsTransferred: number;
    observationsTransferred: number;
    status: 'success' | 'error';
    errorMessage?: string;
}

export interface FascicoloState {
    schede: FascicoloScheda[];
    transferHistory: TransferRecord[];
    error: string | null;
}

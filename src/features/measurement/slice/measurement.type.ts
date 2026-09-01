import type {DataStatus} from "../../edificio/edificio.type.ts";

export interface MeasurementEntry {
    id: string;
    sessionId: string;
    type: 'distance' | 'height' | 'thickness' | 'other';
    value: number;
    unit: 'mm' | 'cm' | 'm';
    elementId?: string;
    instrumentId?: string;
    instrument?: 'manual' | 'tape' | 'laser' | 'other';
    timestamp: string;
    confidence: number;
    dataStatus: DataStatus;
}

export interface MeasurementState {
    measurements: Record<string, MeasurementEntry>;
    error: string | null;
}

import type {DataStatus} from "../../building/slice/building.type.ts";

export interface DeviceInfo {
    userAgent: string;
    platform: string;
    screenWidth: number;
    screenHeight: number;
    hasCamera: boolean;
    hasMicrophone: boolean;
    hasGeolocation: boolean;
    hasDeviceOrientation: boolean;
}

export interface GeoPosition {
    lat: number;
    lon: number;
    alt?: number;
    accuracy: number;
    timestamp: number;
}

export interface DeviceOrient {
    alpha: number | null;
    beta: number | null;
    gamma: number | null;
}

export interface SurveySession {
    id: string;
    buildingId: string;
    technicianId: string;
    deviceInfo: DeviceInfo;
    startedAt: string;
    endedAt?: string;
    status: 'active' | 'paused' | 'completed' | 'interrupted';
    softwareVersion: string;
}

export interface SurveyPhoto {
    id: string;
    sessionId: string;
    timestamp: string;
    floorId?: string;
    roomId?: string;
    targetElementId?: string;
    geolocation?: GeoPosition;
    deviceOrientation?: DeviceOrient;
    confidence: number;
    dataStatus: DataStatus;
    mediaPath: string;
    thumbnailPath?: string;
    viewDirection?: string;
}

export interface VoiceObservation {
    id: string;
    sessionId: string;
    timestamp: string;
    audioPath: string;
    transcription?: string;
    floorId?: string;
    roomId?: string;
    targetElementId?: string;
    confidence: number;
    dataStatus: DataStatus;
}

export interface Measurement {
    id: string;
    sessionId: string;
    type: 'distance' | 'height' | 'thickness' | 'other';
    value: number;
    unit: 'mm' | 'cm' | 'm';
    elementId?: string;
    instrumentId?: string;
    timestamp: string;
    confidence: number;
    dataStatus: DataStatus;
}

export interface SurveyState {
    currentSession: SurveySession | null;
    photos: Record<string, SurveyPhoto>;
    voiceObservations: Record<string, VoiceObservation>;
    measurements: Record<string, Measurement>;
    error: string | null;
}

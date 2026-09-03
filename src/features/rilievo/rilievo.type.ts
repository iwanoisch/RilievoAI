export type RilievoItemStatus = 'pending' | 'in_progress' | 'done' | 'to_verify';

export type RilievoItemType = 'building' | 'floor' | 'room' | 'wall' | 'opening' | 'element';

export type RilievoCheckType = 'photo' | 'audio' | 'measurement' | 'note';

export type RilievoDataSource = 'da_progetto' | 'rilevato_ai' | 'dichiarato_operatore' | 'misurato' | 'desunto' | 'da_verificare' | 'validato';

export interface RilievoCheck {
    id: string;
    type: RilievoCheckType;
    label: string;
    done: boolean;
    value?: string;
    source?: RilievoDataSource;
}

export interface RilievoPhoto {
    id: string;
    itemId: string;
    uri: string;
    timestamp: string;
    note?: string;
}

export interface RilievoAudio {
    id: string;
    itemId: string;
    uri: string;
    duration: number;
    timestamp: string;
    transcription?: string;
}

export interface RilievoMeasurement {
    id: string;
    itemId: string;
    label: string;
    value: number;
    unit: 'm' | 'cm' | 'mm';
    source: 'manual' | 'voice' | 'laser' | 'ai_estimate';
    timestamp: string;
}

export interface RilievoItem {
    id: string;
    parentId: string | null;
    type: RilievoItemType;
    label: string;
    detail?: string;
    status: RilievoItemStatus;
    checks: RilievoCheck[];
    order: number;
    openingType?: 'door' | 'window' | 'french_door' | 'other';
    elementCategory?: 'thermal' | 'electrical' | 'degradation' | 'finish' | 'other';
}

export interface RilievoState {
    items: RilievoItem[];
    photos: RilievoPhoto[];
    audios: RilievoAudio[];
    measurements: RilievoMeasurement[];
    selectedItemId: string | null;
    generated: boolean;
    error: string | null;
}

import type {RilievoPhoto, RilievoAudio, RilievoMeasurement} from "../../../../features/rilievo/rilievo.type.ts";

export interface RilievoCaptureModalProps {
    itemId: string;
    onSave: (photo: RilievoPhoto) => void;
    onClose: () => void;
}

export interface RilievoAudioModalProps {
    itemId: string;
    onSave: (audio: RilievoAudio) => void;
    onClose: () => void;
}

export interface RilievoMeasureModalProps {
    itemId: string;
    onSave: (measurement: RilievoMeasurement) => void;
    onClose: () => void;
}

export interface RilievoEditPhotoModalProps {
    photo: RilievoPhoto;
    onSave: (updates: Partial<RilievoPhoto>) => void;
    onDelete: () => void;
    onClose: () => void;
}

export interface RilievoEditAudioModalProps {
    audio: RilievoAudio;
    onSave: (updates: Partial<RilievoAudio>) => void;
    onDelete: () => void;
    onClose: () => void;
}

export interface RilievoEditMeasurementModalProps {
    measurement: RilievoMeasurement;
    onSave: (updates: Partial<RilievoMeasurement>) => void;
    onDelete: () => void;
    onClose: () => void;
}

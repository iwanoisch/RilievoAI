import type {RilievoItem, RilievoPhoto, RilievoAudio, RilievoMeasurement} from "../../../../features/rilievo/rilievo.type.ts";

export type FloorPlanModalStep = 'floor' | 'room' | 'element' | 'detail';

export interface FloorPlanElementModalProps {
    items: RilievoItem[];
    initialItemId?: string;
    onSelectItem: (itemId: string) => void;
    onRemoveMarker: () => void;
    onClose: () => void;
    // Card dettaglio callbacks
    photos: RilievoPhoto[];
    audios: RilievoAudio[];
    measurements: RilievoMeasurement[];
    onToggleCheck: (itemId: string, checkId: string) => void;
    onAddPhoto: (photo: RilievoPhoto) => void;
    onDeletePhoto: (photoId: string) => void;
    onAddAudio: (audio: RilievoAudio) => void;
    onDeleteAudio: (audioId: string) => void;
    onAddMeasurement: (measurement: RilievoMeasurement) => void;
    onDeleteMeasurement: (measurementId: string) => void;
    onShowPhotoModal: () => void;
    onShowAudioModal: () => void;
    onShowMeasurementModal: () => void;
    onFileUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
    // Modali editing
    onEditPhoto: (photo: RilievoPhoto) => void;
    onEditAudio: (audio: RilievoAudio) => void;
    onEditMeasurement: (measurement: RilievoMeasurement) => void;
    lastSelectedFloorId: string | null;
    onFloorSelected: (floorId: string) => void;
    isExistingMarker: boolean;
    placedItemIds: Set<string>;
}

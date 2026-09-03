import {FC} from "react";
import {
    CameraIcon,
    MicrophoneIcon,
    ArrowsPointingOutIcon,
    PencilSquareIcon,
} from "@heroicons/react/24/outline";
import type {RilievoItemStatus} from "../features/rilievo/rilievo.type.ts";

export const RILIEVO_STATUS_CONFIG: Record<RilievoItemStatus, {label: string; color: string; bg: string}> = {
    pending: {label: 'rilievo.status_pending', color: 'text-text-muted', bg: 'bg-slate-200'},
    in_progress: {label: 'rilievo.status_in_progress', color: 'text-warning-dark', bg: 'bg-warning'},
    done: {label: 'rilievo.status_done', color: 'text-success-dark', bg: 'bg-success'},
    to_verify: {label: 'rilievo.status_to_verify', color: 'text-info', bg: 'bg-info'},
};

export const RILIEVO_CHECK_ICON: Record<string, FC<{className?: string}>> = {
    photo: CameraIcon,
    audio: MicrophoneIcon,
    measurement: ArrowsPointingOutIcon,
    note: PencilSquareIcon,
};

export const RILIEVO_OPENING_TYPE_LABELS: Record<string, string> = {
    door: 'Porta',
    window: 'Finestra',
    french_door: 'Portafinestra',
    other: 'Apertura',
};

export const RILIEVO_TYPE_LABELS: Record<string, string> = {
    building: 'Edificio',
    floor: 'Piano',
    room: 'Ambiente',
    wall: 'Parete',
    opening: 'Apertura',
    element: 'Elemento',
};

export const RILIEVO_MEASUREMENT_QUICK_LABELS: string[] = ['Lunghezza', 'Larghezza', 'Altezza', 'Profondita', 'Distanza'];

export const RILIEVO_ALLOWED_CHILDREN: Record<string, string[]> = {
    building: ['floor', 'element'],
    floor: ['room'],
    room: ['wall', 'element'],
    wall: ['opening', 'element'],
    opening: ['element'],
    element: [],
};

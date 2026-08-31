import type {TransferStatus} from "../features/fascicolo/slice/fascicolo.type.ts";

export const FASCICOLO_SKIP_FIELDS: string[] = [
    'id', 'label', 'parentId', 'type', 'dataStatus', 'confidence',
    'sessionId', 'createdAt', 'updatedAt', 'floors', 'rooms', 'elements', 'photoIds',
];

export const TRANSFER_STATUS_LABELS: Record<TransferStatus, string> = {
    pending: 'fascicolo.status_pending',
    transferred: 'fascicolo.status_transferred',
    error: 'fascicolo.status_error',
};

export const TRANSFER_STATUS_STYLES: Record<TransferStatus, string> = {
    pending: 'badge-warning',
    transferred: 'badge-success',
    error: 'badge-error',
};

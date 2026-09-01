export const ACCEPTED_FLOOR_PLAN_FORMATS = '.png,.jpg,.jpeg,.webp,.pdf';

export const ACCEPTED_PHOTO_FORMATS = '.png,.jpg,.jpeg,.webp,.heic';

export const ACCEPTED_PHOTO_MIME_TYPES: Record<string, boolean> = {
    'image/png': true,
    'image/jpeg': true,
    'image/webp': true,
    'image/heic': true,
};

export const MAX_PHOTO_FILE_SIZE_MB = 20;

export const MAX_BATCH_PHOTO_COUNT = 50;

import type {FloorPlanFileType} from "../features/floorPlan/slice/floorPlan.type.ts";

export const getFileType = (file: File): FloorPlanFileType => {
    const ext = file.name.split('.').pop()?.toLowerCase() ?? '';
    if (['png', 'jpg', 'jpeg', 'webp', 'pdf'].includes(ext)) return ext as FloorPlanFileType;
    if (file.type === 'application/pdf') return 'pdf';
    return 'png';
};

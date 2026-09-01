import {
    BuildingOffice2Icon,
    CameraIcon,
    ClipboardDocumentCheckIcon,
    DocumentTextIcon,
    MapIcon,
} from "@heroicons/react/24/outline";
import type {PocTab} from "../pages/poc/poc.type.ts";

export const POC_TABS: PocTab[] = [
    {id: 'building', labelKey: 'building.title', icon: BuildingOffice2Icon},
    {id: 'survey', labelKey: 'survey.title', icon: CameraIcon},
    {id: 'validation', labelKey: 'validation.title', icon: ClipboardDocumentCheckIcon},
    {id: 'fascicolo', labelKey: 'fascicolo.title', icon: DocumentTextIcon},
    {id: 'floorPlan', labelKey: 'floorPlan.title', icon: MapIcon},
];

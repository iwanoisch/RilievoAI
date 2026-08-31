import {CameraIcon, MicrophoneIcon, WrenchScrewdriverIcon} from "@heroicons/react/24/solid";
import type {DataStatus} from "../features/building/slice/building.type.ts";
import type {ObservationType} from "../features/survey/slice/survey.type.ts";
import type {FC, SVGProps} from "react";

export const OBSERVATION_TYPE_ICONS: Record<ObservationType, FC<SVGProps<SVGSVGElement>>> = {
    photo: CameraIcon,
    voice: MicrophoneIcon,
    measurement: WrenchScrewdriverIcon,
};

export const OBSERVATION_TYPE_LABELS: Record<ObservationType, string> = {
    photo: 'validation.type_photo',
    voice: 'validation.type_voice',
    measurement: 'validation.type_measurement',
};

export const DATA_STATUS_LABELS: Record<DataStatus, string> = {
    RAW: 'validation.status_raw',
    DERIVED: 'validation.status_derived',
    PROPOSED: 'validation.status_proposed',
    VALIDATED: 'validation.status_validated',
    REJECTED: 'validation.status_rejected',
    SUPERSEDED: 'validation.status_superseded',
};

export const DATA_STATUS_STYLES: Record<DataStatus, string> = {
    RAW: 'badge-info',
    DERIVED: 'badge-info',
    PROPOSED: 'badge-warning',
    VALIDATED: 'badge-success',
    REJECTED: 'badge-error',
    SUPERSEDED: 'badge-info',
};

export const DATA_STATUS_OPTIONS: DataStatus[] = ['RAW', 'PROPOSED', 'VALIDATED', 'REJECTED'];

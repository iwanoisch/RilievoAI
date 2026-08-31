import {FC} from "react";
import {useTranslation} from "react-i18next";
import {getConfidenceLevel} from "../../utility/confidence-utils.ts";
import {CONFIDENCE_BADGE_STYLES, CONFIDENCE_LABELS} from "../../constants/confidence.constant.ts";
import type {ConfidenceBadgeProps} from "./confidenceBadge.type.ts";

export const ConfidenceBadge: FC<ConfidenceBadgeProps> = ({confidence, showLabel = false, size = 'sm'}) => {
    const {t} = useTranslation();
    const level = getConfidenceLevel(confidence);
    const sizeClass = size === 'sm' ? 'text-xs' : 'text-sm';

    return (
        <span
            className={`badge ${CONFIDENCE_BADGE_STYLES[level]} ${sizeClass}`}
            aria-label={`${t('confidence.label')}: ${confidence}% — ${t(CONFIDENCE_LABELS[level])}`}
            title={`${confidence}% — ${t(CONFIDENCE_LABELS[level])}`}
        >
            {confidence}%{showLabel && ` — ${t(CONFIDENCE_LABELS[level])}`}
        </span>
    );
};

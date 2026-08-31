import {FC} from "react";
import {useTranslation} from "react-i18next";
import {ConfidenceBadge} from "../confidence-badge/ConfidenceBadge.tsx";
import {SUGGESTION_STATUS_LABELS, SUGGESTION_STATUS_STYLES, CRITICALITY_LABELS, CRITICALITY_STYLES} from "../../constants/ai.constant.ts";
import {CheckIcon, XMarkIcon, PencilIcon, SparklesIcon} from "@heroicons/react/24/solid";
import type {AiSuggestionCardProps} from "./aiSuggestionCard.type.ts";

export const AiSuggestionCard: FC<AiSuggestionCardProps> = ({suggestion, onAccept, onReject, onModify}) => {
    const {t} = useTranslation();
    const isPending = suggestion.status === 'pending';

    return (
        <div className={`card border-l-4 transition-all ${isPending ? 'border-l-primary-500 motion-safe:animate-pulse-subtle' : 'border-l-border-light'}`}>
            {/* Header */}
            <div className="flex items-center gap-2 mb-3">
                <SparklesIcon className="h-5 w-5 text-primary-500 flex-shrink-0"/>
                <h4 className="text-sm font-semibold text-text-primary flex-1">{t('ai.suggestion')}</h4>
                <span className={`badge ${SUGGESTION_STATUS_STYLES[suggestion.status]}`}>
                    {t(SUGGESTION_STATUS_LABELS[suggestion.status])}
                </span>
                <ConfidenceBadge confidence={suggestion.confidence}/>
            </div>

            {/* Proposta */}
            <div className="bg-slate-50 rounded-lg p-3 mb-3">
                <div className="flex items-center gap-2 mb-1">
                    <span className="badge badge-primary text-xs">{suggestion.proposedElementType}</span>
                    <span className="text-sm font-medium text-text-primary">{suggestion.proposedElementLabel}</span>
                </div>
                <p className="text-xs text-text-muted mt-1">{suggestion.reasoning}</p>

                {suggestion.criticality && suggestion.criticality !== 'none' && (
                    <p className={`text-xs mt-2 ${CRITICALITY_STYLES[suggestion.criticality]}`}>
                        {t(CRITICALITY_LABELS[suggestion.criticality])}
                        {suggestion.criticalityDescription && ` — ${suggestion.criticalityDescription}`}
                    </p>
                )}

                {suggestion.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-2">
                        {suggestion.tags.map(tag => (
                            <span key={tag} className="text-xs bg-slate-200 text-text-muted rounded px-1.5 py-0.5">{tag}</span>
                        ))}
                    </div>
                )}
            </div>

            {/* Azioni */}
            {isPending && (
                <div className="flex gap-2">
                    <button
                        onClick={() => onAccept(suggestion.id)}
                        className="btn btn-primary flex-1 min-h-[44px] flex items-center justify-center gap-1.5 text-sm"
                    >
                        <CheckIcon className="h-4 w-4"/>
                        {t('ai.accept')}
                    </button>
                    {onModify && (
                        <button
                            onClick={() => onModify(suggestion.id)}
                            className="btn btn-outline flex-1 min-h-[44px] flex items-center justify-center gap-1.5 text-sm"
                        >
                            <PencilIcon className="h-4 w-4"/>
                            {t('ai.modify')}
                        </button>
                    )}
                    <button
                        onClick={() => onReject(suggestion.id)}
                        className="btn bg-error text-white hover:bg-red-700 flex-1 min-h-[44px] flex items-center justify-center gap-1.5 text-sm"
                    >
                        <XMarkIcon className="h-4 w-4"/>
                        {t('ai.reject')}
                    </button>
                </div>
            )}
        </div>
    );
};

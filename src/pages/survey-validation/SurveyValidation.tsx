import {FC, useMemo, useState} from "react";
import {useNavigate} from "react-router-dom";
import {useTranslation} from "react-i18next";
import {PageTitle} from "../../common/page-title/PageTitle.tsx";
import {ConfidenceBadge} from "../../common/confidence-badge/ConfidenceBadge.tsx";
import {useSurvey} from "../../features/survey/hooks/useSurvey.ts";
import {getConfidenceLevel} from "../../utility/confidence-utils.ts";
import {CheckIcon, XMarkIcon} from "@heroicons/react/24/solid";
import {OBSERVATION_TYPE_ICONS, OBSERVATION_TYPE_LABELS, DATA_STATUS_LABELS} from "../../constants/validation.constant.ts";
import type {ObservationType} from "../../features/survey/slice/survey.type.ts";
import type {ValidationFilter, ConfidenceFilter, StatusFilter} from "./surveyValidation.type.ts";

export const SurveyValidation: FC = () => {
    const {t} = useTranslation();
    const navigate = useNavigate();
    const {
        photos, voiceObservations, measurements,
        pendingCount, validatedCount, rejectedCount, totalCount,
        confirmObservation, rejectObservation,
    } = useSurvey();

    const [typeFilter, setTypeFilter] = useState<ValidationFilter>('all');
    const [confidenceFilter, setConfidenceFilter] = useState<ConfidenceFilter>('all');
    const [statusFilter, setStatusFilter] = useState<StatusFilter>('pending');

    const progressPercent = totalCount > 0 ? Math.round(((validatedCount + rejectedCount) / totalCount) * 100) : 0;

    const allItems = useMemo(() => {
        const items = [
            ...photos.map(p => ({
                id: p.id, type: 'photo' as ObservationType,
                confidence: p.confidence, dataStatus: p.dataStatus,
                timestamp: p.timestamp, label: p.viewDirection || t('validation.type_photo'),
                thumbnail: p.thumbnailPath || p.mediaPath,
            })),
            ...voiceObservations.map(v => ({
                id: v.id, type: 'voice' as ObservationType,
                confidence: v.confidence, dataStatus: v.dataStatus,
                timestamp: v.timestamp, label: v.transcription?.substring(0, 50) || t('validation.type_voice'),
                thumbnail: undefined,
            })),
            ...measurements.map(m => ({
                id: m.id, type: 'measurement' as ObservationType,
                confidence: m.confidence, dataStatus: m.dataStatus,
                timestamp: m.timestamp, label: `${m.value} ${m.unit} (${m.type})`,
                thumbnail: undefined,
            })),
        ];
        return items.sort((a, b) => a.confidence - b.confidence);
    }, [photos, voiceObservations, measurements, t]);

    const filteredItems = useMemo(() => {
        return allItems.filter(item => {
            if (typeFilter !== 'all' && item.type !== typeFilter) return false;
            if (confidenceFilter !== 'all' && getConfidenceLevel(item.confidence) !== confidenceFilter) return false;
            if (statusFilter === 'pending' && item.dataStatus !== 'PROPOSED' && item.dataStatus !== 'DERIVED') return false;
            if (statusFilter === 'validated' && item.dataStatus !== 'VALIDATED') return false;
            if (statusFilter === 'rejected' && item.dataStatus !== 'REJECTED') return false;
            return true;
        });
    }, [allItems, typeFilter, confidenceFilter, statusFilter]);

    return (
        <div className="w-full px-4 sm:px-6 lg:px-8 py-6 bg-gradient-to-br from-primary-50/50 via-primary-100/30 to-slate-50 min-h-screen">
            <div className="mx-auto w-full max-w-5xl">
                <PageTitle title={t('validation.title')} subtitle={t('validation.subtitle')}/>

                {/* Card riepilogo + progresso + filtri */}
                <div className="mt-4 card">
                    {/* Contatori */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                        <button
                            onClick={() => setStatusFilter('all')}
                            className={`rounded-xl p-4 text-center transition-all ${statusFilter === 'all' ? 'bg-primary-50 ring-2 ring-primary-500' : 'bg-slate-50 hover:bg-slate-100'}`}
                        >
                            <p className="text-3xl font-bold text-text-primary">{totalCount}</p>
                            <p className="text-xs font-medium text-text-muted mt-1">{t('validation.total')}</p>
                        </button>
                        <button
                            onClick={() => setStatusFilter('pending')}
                            className={`rounded-xl p-4 text-center transition-all ${statusFilter === 'pending' ? 'bg-warning-light ring-2 ring-warning' : 'bg-slate-50 hover:bg-slate-100'}`}
                        >
                            <p className="text-3xl font-bold text-warning-dark">{pendingCount}</p>
                            <p className="text-xs font-medium text-text-muted mt-1">{t('validation.pending')}</p>
                        </button>
                        <button
                            onClick={() => setStatusFilter('validated')}
                            className={`rounded-xl p-4 text-center transition-all ${statusFilter === 'validated' ? 'bg-success-light ring-2 ring-success' : 'bg-slate-50 hover:bg-slate-100'}`}
                        >
                            <p className="text-3xl font-bold text-success-dark">{validatedCount}</p>
                            <p className="text-xs font-medium text-text-muted mt-1">{t('validation.validated')}</p>
                        </button>
                        <button
                            onClick={() => setStatusFilter('rejected')}
                            className={`rounded-xl p-4 text-center transition-all ${statusFilter === 'rejected' ? 'bg-error-light ring-2 ring-error' : 'bg-slate-50 hover:bg-slate-100'}`}
                        >
                            <p className="text-3xl font-bold text-error">{rejectedCount}</p>
                            <p className="text-xs font-medium text-text-muted mt-1">{t('validation.rejected')}</p>
                        </button>
                    </div>

                    {/* Barra progresso */}
                    {totalCount > 0 && (
                        <div className="mt-5 pt-5 border-t border-border-light">
                            <div className="flex justify-between items-center mb-2">
                                <span className="text-sm font-medium text-text-secondary">{t('validation.progress')}</span>
                                <span className="text-sm font-bold text-text-primary">{progressPercent}%</span>
                            </div>
                            <div className="h-3 rounded-full bg-slate-100 overflow-hidden">
                                <div
                                    className="h-full rounded-full bg-gradient-to-r from-primary-400 to-success transition-all duration-500 ease-out"
                                    style={{width: `${progressPercent}%`}}
                                />
                            </div>
                            <p className="text-xs text-text-muted mt-1.5">{validatedCount + rejectedCount} / {totalCount} {t('validation.processed')}</p>
                        </div>
                    )}

                    {/* Filtri */}
                    <div className="mt-5 pt-5 border-t border-border-light flex flex-col sm:flex-row gap-3">
                        <select
                            value={typeFilter}
                            onChange={e => setTypeFilter(e.target.value as ValidationFilter)}
                            className="input text-sm flex-1"
                        >
                            <option value="all">{t('validation.filter_all_types')}</option>
                            <option value="photo">{t('validation.type_photo')}</option>
                            <option value="voice">{t('validation.type_voice')}</option>
                            <option value="measurement">{t('validation.type_measurement')}</option>
                        </select>

                        <select
                            value={confidenceFilter}
                            onChange={e => setConfidenceFilter(e.target.value as ConfidenceFilter)}
                            className="input text-sm flex-1"
                        >
                            <option value="all">{t('validation.filter_all_confidence')}</option>
                            <option value="high">{t('confidence.high')}</option>
                            <option value="medium">{t('confidence.medium')}</option>
                            <option value="low">{t('confidence.low')}</option>
                        </select>
                    </div>
                </div>

                {/* Lista items */}
                <div className="mt-4 flex flex-col gap-3">
                    {filteredItems.length === 0 && (
                        <div className="card text-center py-10">
                            <p className="text-sm text-text-muted">{t('validation.empty')}</p>
                        </div>
                    )}

                    {filteredItems.map(item => {
                        const Icon = OBSERVATION_TYPE_ICONS[item.type];
                        const isPending = item.dataStatus === 'PROPOSED' || item.dataStatus === 'DERIVED';

                        return (
                            <div key={item.id} className="card flex items-center gap-3">
                                {/* Parte cliccabile → dettaglio */}
                                <button
                                    onClick={() => navigate(`/validation/${item.id}`)}
                                    className="flex items-center gap-3 flex-1 min-w-0 text-left"
                                >
                                    <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-slate-100 border border-border-light flex items-center justify-center overflow-hidden">
                                        {item.thumbnail ? (
                                            <img src={item.thumbnail} alt="" className="w-full h-full object-cover"/>
                                        ) : (
                                            <Icon className="h-5 w-5 text-text-muted"/>
                                        )}
                                    </div>

                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2">
                                            <span className="text-xs text-text-muted">{t(OBSERVATION_TYPE_LABELS[item.type])}</span>
                                            <ConfidenceBadge confidence={item.confidence}/>
                                        </div>
                                        <p className="text-sm text-text-primary truncate mt-0.5">{item.label}</p>
                                        <span className={`text-xs ${item.dataStatus === 'VALIDATED' ? 'text-success-dark' : item.dataStatus === 'REJECTED' ? 'text-error' : 'text-text-muted'}`}>
                                            {t(DATA_STATUS_LABELS[item.dataStatus])}
                                        </span>
                                    </div>
                                </button>

                                {/* Azioni rapide */}
                                {isPending && (
                                    <div className="flex items-center gap-1 flex-shrink-0">
                                        <button
                                            onClick={() => confirmObservation(item.id, item.type)}
                                            className="p-2 rounded-lg text-success-dark hover:bg-success-light transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center"
                                            aria-label={t('validation.confirm')}
                                            title={t('validation.confirm')}
                                        >
                                            <CheckIcon className="h-5 w-5"/>
                                        </button>
                                        <button
                                            onClick={() => rejectObservation(item.id, item.type)}
                                            className="p-2 rounded-lg text-error hover:bg-error-light transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center"
                                            aria-label={t('validation.reject')}
                                            title={t('validation.reject')}
                                        >
                                            <XMarkIcon className="h-5 w-5"/>
                                        </button>
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

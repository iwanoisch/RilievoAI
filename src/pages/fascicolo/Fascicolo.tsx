import {FC, useEffect, useMemo, useState} from "react";
import {useTranslation} from "react-i18next";
import {PageTitle} from "../../common/page-title/PageTitle.tsx";
import {ConfidenceBadge} from "../../common/confidence-badge/ConfidenceBadge.tsx";
import {useFascicolo} from "../../features/fascicolo/hooks/useFascicolo.ts";
import {useFascicoloMapping} from "../../features/fascicolo/hooks/useFascicoloMapping.ts";
import {useSurvey} from "../../features/survey/hooks/useSurvey.ts";
import {TRANSFER_STATUS_LABELS, TRANSFER_STATUS_STYLES} from "../../constants/fascicolo.constant.ts";
import {OBSERVATION_TYPE_ICONS, OBSERVATION_TYPE_LABELS} from "../../constants/validation.constant.ts";
import {ArrowPathIcon, CheckIcon, DocumentTextIcon, EyeIcon, XMarkIcon} from "@heroicons/react/24/solid";

export const Fascicolo: FC = () => {
    const {t, i18n} = useTranslation();
    const {schede, transferHistory, loadSchede, toggleObservationExclusion, transferSchede} = useFascicolo();
    const {buildSchede, validatedCount, totalCount} = useFascicoloMapping();
    const {currentSession} = useSurvey();

    const [showPreview, setShowPreview] = useState(false);
    const [previewElementId, setPreviewElementId] = useState<string | null>(null);
    const [transferDone, setTransferDone] = useState(false);

    useEffect(() => {
        loadSchede(buildSchede());
    }, [validatedCount]);

    const pendingSchede = useMemo(() =>
        schede.filter(s => s.transferStatus === 'pending'),
    [schede]);

    const previewScheda = previewElementId
        ? schede.find(s => s.elementId === previewElementId)
        : null;

    const handleTransfer = async () => {
        if (pendingSchede.length === 0) return;

        const result = await transferSchede(
            pendingSchede,
            currentSession?.id ?? '',
            currentSession?.buildingId ?? '',
        );
        if (result) setTransferDone(true);
    };

    const formatDate = (dateStr: string) => {
        return new Date(dateStr).toLocaleString(i18n.language, {
            day: '2-digit', month: '2-digit', year: 'numeric',
            hour: '2-digit', minute: '2-digit',
        });
    };

    return (
        <div className="w-full px-4 sm:px-6 lg:px-8 py-6 bg-gradient-to-br from-primary-50/50 via-primary-100/30 to-slate-50 min-h-screen">
            <div className="mx-auto w-full max-w-5xl">
                <div className="flex items-center justify-between">
                    <PageTitle title={t('fascicolo.title')} subtitle={t('fascicolo.subtitle')}/>
                    {pendingSchede.length > 0 && (
                        <button
                            onClick={handleTransfer}
                            className="btn btn-primary flex items-center gap-2 min-h-[44px]"
                        >
                            <ArrowPathIcon className="h-5 w-5"/>
                            <span className="hidden sm:inline">{t('fascicolo.transfer')}</span>
                        </button>
                    )}
                </div>

                {/* Riepilogo */}
                <div className="mt-4 card">
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                        <div className="rounded-xl p-4 text-center bg-slate-50">
                            <p className="text-3xl font-bold text-text-primary">{totalCount}</p>
                            <p className="text-xs font-medium text-text-muted mt-1">{t('fascicolo.total_elements')}</p>
                        </div>
                        <div className="rounded-xl p-4 text-center bg-success-light">
                            <p className="text-3xl font-bold text-success-dark">{validatedCount}</p>
                            <p className="text-xs font-medium text-text-muted mt-1">{t('fascicolo.validated_elements')}</p>
                        </div>
                        <div className="rounded-xl p-4 text-center bg-primary-50">
                            <p className="text-3xl font-bold text-primary-600">{schede.length}</p>
                            <p className="text-xs font-medium text-text-muted mt-1">{t('fascicolo.ready_schede')}</p>
                        </div>
                    </div>
                </div>

                {/* Feedback trasferimento */}
                {transferDone && (
                    <div className="mt-4 card p-4 bg-success-light border-success flex items-center gap-3">
                        <CheckIcon className="h-6 w-6 text-success-dark flex-shrink-0"/>
                        <p className="text-sm text-success-dark font-medium">{t('fascicolo.transfer_success')}</p>
                        <button onClick={() => setTransferDone(false)} className="ml-auto p-1">
                            <XMarkIcon className="h-4 w-4 text-success-dark"/>
                        </button>
                    </div>
                )}

                {/* Lista schede */}
                {schede.length > 0 ? (
                    <div className="mt-4 flex flex-col gap-3">
                        {schede.map(scheda => (
                            <div
                                key={scheda.elementId}
                                onClick={() => { setPreviewElementId(scheda.elementId); setShowPreview(true); }}
                                className="card flex items-center gap-4 cursor-pointer hover:border-primary-300 hover:shadow-md transition-all"
                            >
                                <div className="flex-shrink-0 p-2 rounded-lg bg-primary-50">
                                    <DocumentTextIcon className="h-6 w-6 text-primary-600"/>
                                </div>

                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2">
                                        <h3 className="text-sm font-semibold text-text-primary truncate">{scheda.elementLabel}</h3>
                                        <span className={`badge ${TRANSFER_STATUS_STYLES[scheda.transferStatus]}`}>
                                            {t(TRANSFER_STATUS_LABELS[scheda.transferStatus])}
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-3 mt-1">
                                        <span className="text-xs text-text-muted">{scheda.parentLabel}</span>
                                        <span className="text-xs text-text-muted">
                                            {scheda.fields.length} {t('fascicolo.fields')} · {scheda.observations.length} {t('fascicolo.observations')}
                                        </span>
                                    </div>
                                </div>

                                <EyeIcon className="h-5 w-5 text-text-muted flex-shrink-0"/>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="mt-10 card text-center py-10">
                        <DocumentTextIcon className="h-16 w-16 text-slate-400 mx-auto mb-4"/>
                        <h3 className="text-lg font-semibold text-text-secondary mb-2">{t('fascicolo.empty')}</h3>
                        <p className="text-sm text-text-muted">{t('fascicolo.empty_desc')}</p>
                    </div>
                )}

                {/* Storico trasferimenti */}
                {transferHistory.length > 0 && (
                    <div className="mt-6">
                        <h3 className="text-sm font-semibold text-text-secondary mb-3">{t('fascicolo.transfer_history')}</h3>
                        <div className="flex flex-col gap-2">
                            {transferHistory.map(record => (
                                <div key={record.id} className="card p-3 flex items-center gap-3">
                                    <span className={`badge ${record.status === 'success' ? 'badge-success' : 'badge-error'}`}>
                                        {record.status === 'success' ? t('fascicolo.status_transferred') : t('fascicolo.status_error')}
                                    </span>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-xs text-text-muted">
                                            {formatDate(record.timestamp)} · {record.schedeCount} {t('fascicolo.schede')} · {record.observationsCount} {t('fascicolo.observations')}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {/* Modale preview scheda */}
            {showPreview && previewScheda && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={() => setShowPreview(false)}>
                    <div className="card w-full max-w-lg max-h-[80vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-lg font-semibold text-text-primary">{previewScheda.elementLabel}</h2>
                            <button onClick={() => setShowPreview(false)} className="btn btn-ghost p-2 min-h-[44px] min-w-[44px]">
                                <XMarkIcon className="h-5 w-5"/>
                            </button>
                        </div>

                        {/* Campi */}
                        {previewScheda.fields.length > 0 && (
                            <div className="mb-4">
                                <h3 className="text-sm font-semibold text-text-secondary mb-2">{t('fascicolo.fields')}</h3>
                                <div className="flex flex-col gap-1">
                                    {previewScheda.fields.map(field => (
                                        <div key={field.key} className="flex justify-between text-sm py-1 border-b border-border-light">
                                            <span className="text-text-muted">{field.label.includes('.') ? t(field.label) : field.label}</span>
                                            <span className="text-text-primary font-medium">{String(field.value)}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Osservazioni */}
                        {previewScheda.observations.length > 0 && (
                            <div>
                                <h3 className="text-sm font-semibold text-text-secondary mb-2">{t('fascicolo.observations')}</h3>
                                <div className="flex flex-col gap-2">
                                    {previewScheda.observations.map(obs => {
                                        const Icon = OBSERVATION_TYPE_ICONS[obs.type];
                                        return (
                                            <div
                                                key={obs.id}
                                                className={`flex items-center gap-3 p-2 rounded-lg border transition-colors cursor-pointer
                                                    ${obs.excluded ? 'border-border-light bg-slate-50 opacity-50' : 'border-border-default'}`}
                                                onClick={() => toggleObservationExclusion(previewScheda.elementId, obs.id)}
                                            >
                                                <input
                                                    type="checkbox"
                                                    checked={!obs.excluded}
                                                    readOnly
                                                    className="h-4 w-4 rounded border-border-default text-primary-500 cursor-pointer"
                                                />
                                                <Icon className="h-4 w-4 text-text-muted flex-shrink-0"/>
                                                <div className="flex-1 min-w-0">
                                                    <p className="text-xs text-text-primary truncate">{obs.label}</p>
                                                    <p className="text-xs text-text-muted">{t(OBSERVATION_TYPE_LABELS[obs.type])}</p>
                                                </div>
                                                <ConfidenceBadge confidence={obs.confidence}/>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

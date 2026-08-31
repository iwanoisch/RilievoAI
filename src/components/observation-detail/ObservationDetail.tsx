import {FC} from "react";
import {useNavigate, useParams} from "react-router-dom";
import {useTranslation} from "react-i18next";
import {PageTitle} from "../../common/page-title/PageTitle.tsx";
import {ConfidenceBadge} from "../../common/confidence-badge/ConfidenceBadge.tsx";
import {useSurvey} from "../../features/survey/hooks/useSurvey.ts";
import {useSurveyValidation} from "../../features/survey/hooks/useSurveyValidation.ts";
import {useBuilding} from "../../features/building/hooks/useBuilding.ts";
import {ArrowLeftIcon, CheckIcon, XMarkIcon, MicrophoneIcon, WrenchScrewdriverIcon} from "@heroicons/react/24/solid";
import {OBSERVATION_TYPE_ICONS, OBSERVATION_TYPE_LABELS, DATA_STATUS_LABELS} from "../../constants/validation.constant.ts";
import type {ObservationDetailProps} from "./observationDetail.type.ts";
import type {SurveyPhoto, VoiceObservation, Measurement} from "../../features/survey/slice/survey.type.ts";

export const ObservationDetail: FC<ObservationDetailProps> = ({onBack}) => {
    const {t, i18n} = useTranslation();
    const navigate = useNavigate();
    const {observationId} = useParams<{observationId: string}>();
    const {getObservationById} = useSurvey();
    const {confirmObservation, rejectObservation, getLogForObservation} = useSurveyValidation();
    const {elements} = useBuilding();

    const result = observationId ? getObservationById(observationId) : null;

    if (!result) {
        return (
            <div className="w-full px-4 sm:px-6 lg:px-8 py-6 bg-gradient-to-br from-primary-50/50 via-primary-100/30 to-slate-50 min-h-screen">
                <div className="mx-auto w-full max-w-5xl text-center py-20">
                    <p className="text-sm text-text-muted">{t('validation.empty')}</p>
                    <button onClick={() => navigate('/validation')} className="btn btn-primary mt-4">{t('general.back')}</button>
                </div>
            </div>
        );
    }

    const {data: observation, type: observationType} = result;
    const photo = observationType === 'photo' ? observation as SurveyPhoto : null;
    const voice = observationType === 'voice' ? observation as VoiceObservation : null;
    const measurement = observationType === 'measurement' ? observation as Measurement : null;

    const log = getLogForObservation(observation.id);
    const elementList = Object.values(elements);

    const associatedElement = photo?.targetElementId
        ? elementList.find(el => el.id === photo.targetElementId)
        : voice?.targetElementId
            ? elementList.find(el => el.id === voice.targetElementId)
            : measurement?.elementId
                ? elementList.find(el => el.id === measurement.elementId)
                : null;

    const handleBack = () => {
        if (onBack) onBack();
        else navigate('/validation');
    };

    const formatDate = (dateStr: string) => {
        return new Date(dateStr).toLocaleString(i18n.language, {
            day: '2-digit', month: '2-digit', year: 'numeric',
            hour: '2-digit', minute: '2-digit',
        });
    };

    const handleConfirm = async () => {
        await confirmObservation(observation.id, observationType);
    };

    const handleReject = async () => {
        await rejectObservation(observation.id, observationType);
    };

    const TypeIcon = OBSERVATION_TYPE_ICONS[observationType];
    const typeLabel = t(OBSERVATION_TYPE_LABELS[observationType]);

    return (
        <div className="w-full px-4 sm:px-6 lg:px-8 py-6 bg-gradient-to-br from-primary-50/50 via-primary-100/30 to-slate-50 min-h-screen">
            <div className="mx-auto w-full max-w-5xl">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <button onClick={handleBack} className="btn btn-ghost p-2 min-h-[44px] min-w-[44px]" aria-label={t('general.back')}>
                            <ArrowLeftIcon className="h-5 w-5"/>
                        </button>
                        <PageTitle title={typeLabel} subtitle={t('observation.detail_subtitle')}/>
                    </div>
                    <ConfidenceBadge confidence={observation.confidence} showLabel size="md"/>
                </div>

                <div className="mt-4 grid grid-cols-1 lg:grid-cols-2 gap-4">
                    {/* Colonna sinistra: media */}
                    <div className="card">
                        {photo && (
                            <img src={photo.mediaPath} alt="" className="w-full rounded-lg"/>
                        )}
                        {voice && (
                            <div className="flex flex-col items-center gap-4 py-8">
                                <MicrophoneIcon className="h-16 w-16 text-text-muted"/>
                                <audio controls src={voice.audioPath} className="w-full"/>
                                {voice.transcription && (
                                    <div className="w-full mt-2">
                                        <p className="text-xs font-medium text-text-muted mb-1">{t('observation.transcription')}</p>
                                        <p className="text-sm text-text-primary bg-slate-50 rounded-lg p-3">{voice.transcription}</p>
                                    </div>
                                )}
                            </div>
                        )}
                        {measurement && (
                            <div className="flex flex-col items-center gap-4 py-8">
                                <WrenchScrewdriverIcon className="h-16 w-16 text-text-muted"/>
                                <div className="text-center">
                                    <p className="text-4xl font-bold text-text-primary">{measurement.value}</p>
                                    <p className="text-lg text-text-muted">{measurement.unit}</p>
                                    <p className="text-sm text-text-muted mt-1">{measurement.type}</p>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Colonna destra: info + azioni */}
                    <div className="flex flex-col gap-4">
                        {/* Info card */}
                        <div className="card">
                            <h3 className="text-sm font-semibold text-text-secondary mb-3">{t('observation.info')}</h3>
                            <div className="flex flex-col gap-2">
                                <div className="flex justify-between text-sm">
                                    <span className="text-text-muted">{t('observation.type')}</span>
                                    <div className="flex items-center gap-1.5">
                                        <TypeIcon className="h-4 w-4 text-text-muted"/>
                                        <span className="text-text-primary">{typeLabel}</span>
                                    </div>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-text-muted">{t('observation.date')}</span>
                                    <span className="text-text-primary">{formatDate(observation.timestamp)}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-text-muted">{t('observation.status')}</span>
                                    <span className={`font-medium ${observation.dataStatus === 'VALIDATED' ? 'text-success-dark' : observation.dataStatus === 'REJECTED' ? 'text-error' : 'text-warning-dark'}`}>
                                        {t(DATA_STATUS_LABELS[observation.dataStatus])}
                                    </span>
                                </div>
                                {photo?.viewDirection && (
                                    <div className="flex justify-between text-sm">
                                        <span className="text-text-muted">{t('survey.view_direction')}</span>
                                        <span className="text-text-primary">{photo.viewDirection}</span>
                                    </div>
                                )}
                                {associatedElement && (
                                    <div className="flex justify-between text-sm">
                                        <span className="text-text-muted">{t('survey.measurement_element')}</span>
                                        <span className="text-text-primary">{associatedElement.label}</span>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Validation actions — sempre visibile */}
                        <div className="card">
                            <h3 className="text-sm font-semibold text-text-secondary mb-3">{t('observation.validation')}</h3>
                            <div className="flex gap-3">
                                <button
                                    onClick={handleConfirm}
                                    disabled={observation.dataStatus === 'VALIDATED'}
                                    className={`flex-1 min-h-[44px] flex items-center justify-center gap-2 rounded-lg font-medium text-sm transition-colors
                                        ${observation.dataStatus === 'VALIDATED'
                                        ? 'bg-success text-white cursor-default'
                                        : 'btn btn-primary'
                                    }`}
                                >
                                    <CheckIcon className="h-5 w-5"/>
                                    {t('validation.confirm')}
                                </button>
                                <button
                                    onClick={handleReject}
                                    disabled={observation.dataStatus === 'REJECTED'}
                                    className={`flex-1 min-h-[44px] flex items-center justify-center gap-2 rounded-lg font-medium text-sm transition-colors
                                        ${observation.dataStatus === 'REJECTED'
                                        ? 'bg-error text-white cursor-default'
                                        : 'btn bg-error text-white hover:bg-red-700'
                                    }`}
                                >
                                    <XMarkIcon className="h-5 w-5"/>
                                    {t('validation.reject')}
                                </button>
                            </div>
                        </div>

                        {/* Validation log */}
                        {log.length > 0 && (
                            <div className="card">
                                <h3 className="text-sm font-semibold text-text-secondary mb-3">{t('observation.history')}</h3>
                                <div className="flex flex-col gap-2">
                                    {log.map(entry => (
                                        <div key={entry.id} className="text-xs text-text-muted border-l-2 border-border-light pl-3 py-1">
                                            <p>{t(DATA_STATUS_LABELS[entry.previousStatus])} → <strong>{t(DATA_STATUS_LABELS[entry.newStatus])}</strong></p>
                                            <p>{formatDate(entry.timestamp)}</p>
                                            {entry.note && <p className="italic mt-0.5">{entry.note}</p>}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

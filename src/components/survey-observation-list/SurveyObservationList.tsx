import {FC, useState} from "react";
import {useSurvey} from "../../features/survey/hooks/useSurvey.ts";
import {CameraIcon, MicrophoneIcon, TrashIcon} from "@heroicons/react/24/solid";
import {WrenchScrewdriverIcon} from "@heroicons/react/24/outline";
import {useTranslation} from "react-i18next";
import type {FilterType, SurveyObservationListProps} from "./surveyObservationList.type.ts";

export const SurveyObservationList: FC<SurveyObservationListProps> = ({onEdit}) => {
    const {t, i18n} = useTranslation();
    const {getAllObservations, deletePhoto, deleteVoiceObservation, deleteMeasurement} = useSurvey();
    const [filter, setFilter] = useState<FilterType>('all');

    const observations = getAllObservations();
    const filtered = filter === 'all'
        ? observations
        : observations.filter(o => o.observationType === filter);

    const filters: { key: FilterType; label: string }[] = [
        {key: 'all', label: t('survey.filter_all')},
        {key: 'photo', label: t('survey.filter_photos')},
        {key: 'voice', label: t('survey.filter_voice')},
        {key: 'measurement', label: t('survey.filter_measurements')},
    ];

    const handleDelete = (e: React.MouseEvent, id: string, type: string) => {
        e.stopPropagation();
        switch (type) {
            case 'photo':
                deletePhoto(id);
                break;
            case 'voice':
                deleteVoiceObservation(id);
                break;
            case 'measurement':
                deleteMeasurement(id);
                break;
        }
    };

    const getIcon = (type: string) => {
        switch (type) {
            case 'photo':
                return <CameraIcon className="h-5 w-5 text-info"/>;
            case 'voice':
                return <MicrophoneIcon className="h-5 w-5 text-error"/>;
            case 'measurement':
                return <WrenchScrewdriverIcon className="h-5 w-5 text-warning"/>;
            default:
                return null;
        }
    };

    const getTypeLabel = (type: string): string => {
        switch (type) {
            case 'photo':
                return t('survey.photo');
            case 'voice':
                return t('survey.voice');
            case 'measurement':
                return t('survey.measure');
            default:
                return '';
        }
    };

    const formatDateTime = (timestamp: string): string => {
        const date = new Date(timestamp);
        return date.toLocaleDateString(i18n.language, {day: '2-digit', month: '2-digit', year: 'numeric'})
            + ' ' + date.toLocaleTimeString(i18n.language, {hour: '2-digit', minute: '2-digit'});
    };

    return (
        <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold text-slate-700">
                    {t('survey.observations')} ({filtered.length})
                </h3>
            </div>

            <div className="flex gap-1.5 overflow-x-auto pb-1" role="tablist">
                {filters.map(f => (
                    <button
                        key={f.key}
                        onClick={() => setFilter(f.key)}
                        role="tab"
                        aria-selected={filter === f.key}
                        className={`px-4 py-2.5 text-xs font-medium rounded-full whitespace-nowrap transition-colors min-h-[44px]
                            ${filter === f.key
                            ? 'bg-primary-500 text-white'
                            : 'bg-surface-hover text-slate-600 hover:bg-slate-200'
                        }`}
                    >
                        {f.label}
                    </button>
                ))}
            </div>

            {filtered.length === 0 ? (
                <div className="py-8 text-center">
                    <p className="text-sm text-slate-500">{t('survey.no_observations')}</p>
                    <p className="text-sm text-slate-500 mt-2">{t('survey.start_instructions')}</p>
                </div>
            ) : (
                <div className="flex flex-col gap-2 max-h-96 overflow-y-auto">
                    {filtered.map((obs) => (
                        <div
                            key={obs.id}
                            onClick={() => onEdit(obs)}
                            className="flex items-center gap-3 p-3 bg-surface-card rounded-lg border border-border-light
                                       hover:border-border-default transition-colors group cursor-pointer"
                            role="button"
                            tabIndex={0}
                            onKeyDown={(e) => { if (e.key === 'Enter') onEdit(obs); }}
                        >
                            <div className="flex-shrink-0 min-w-[44px] min-h-[44px] flex items-center justify-center">
                                {obs.observationType === 'photo' && 'thumbnailPath' in obs && obs.thumbnailPath ? (
                                    <img src={obs.thumbnailPath} alt="" className="w-10 h-10 rounded-lg object-cover"/>
                                ) : (
                                    <div className="w-10 h-10 rounded-lg bg-surface-hover flex items-center justify-center">
                                        {getIcon(obs.observationType)}
                                    </div>
                                )}
                            </div>

                            <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2">
                                    <span className="text-xs font-medium text-slate-700">{getTypeLabel(obs.observationType)}</span>
                                    <span className="text-xs text-slate-500">{formatDateTime(obs.timestamp)}</span>
                                </div>
                                {'viewDirection' in obs && obs.viewDirection && (
                                    <p className="text-xs text-slate-600 mt-0.5">{t('survey.view_direction')}: {obs.viewDirection}</p>
                                )}
                                {'transcription' in obs && obs.transcription && (
                                    <p className="text-xs text-slate-600 mt-0.5 truncate">{obs.transcription}</p>
                                )}
                                {'value' in obs && (
                                    <p className="text-xs text-slate-600 mt-0.5">{obs.value} {obs.unit}</p>
                                )}
                            </div>

                            <button
                                onClick={(e) => handleDelete(e, obs.id, obs.observationType)}
                                className="flex-shrink-0 p-2.5 rounded-lg text-slate-400 hover:text-error hover:bg-error-light
                                           transition-all focus:outline-none focus:ring-2 focus:ring-error
                                           opacity-0 group-hover:opacity-100 focus:opacity-100"
                                aria-label={t('common.delete')}
                            >
                                <TrashIcon className="h-4 w-4"/>
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

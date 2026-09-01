import {FC, useRef, useState} from "react";
import {PageTitle} from "../../common/page-title/PageTitle.tsx";
import {store} from "../../store/store.ts";
import {useSurvey} from "../../features/survey/hooks/useSurvey.ts";
import {useBuilding} from "../../features/building/hooks/useBuilding.ts";
import {useAiAnalysis} from "../../features/ai/hooks/useAiAnalysis.ts";
import {PhotoModal} from "./modals/PhotoModal.tsx";
import {VoiceModal} from "./modals/VoiceModal.tsx";
import {MeasurementModal} from "./modals/MeasurementModal.tsx";
import {SurveyObservationList} from "../../components/survey-observation-list/SurveyObservationList.tsx";
import {AiSuggestionCard} from "../../common/ai-suggestion-card/AiSuggestionCard.tsx";
import type {ObservationItem} from "../../components/survey-observation-list/surveyObservationList.type.ts";
import type {SurveyPhoto, VoiceObservation, Measurement} from "../../features/survey/slice/survey.type.ts";
import type {ModalState, ModalType} from "./survey.type.ts";
import {useTranslation} from "react-i18next";
import {useAlert} from "../../common/alert/useAlert.ts";
import {
    CameraIcon,
    MicrophoneIcon,
    PauseIcon,
    PlayIcon,
    SparklesIcon,
    StopIcon,
} from "@heroicons/react/24/solid";

export const Survey: FC = () => {
    const {t} = useTranslation();
    const {showAlert} = useAlert();
    const survey = useSurvey();
    const {currentSession, photos, voiceObservations, measurements} = survey;
    const {fetchBuilding} = useBuilding();
    const {isAnalyzing, pendingSuggestions, analyzePhoto, analyzePhotoBatch, analyzeVoice, acceptSuggestion, rejectSuggestion} = useAiAnalysis();
    const [modal, setModal] = useState<ModalState>({type: null});
    const photoCountRef = useRef(0);
    const voiceCountRef = useRef(0);

    const photoCount = photos.length;
    const voiceCount = voiceObservations.length;
    const measureCount = measurements.length;

    const handleStart = async () => {
        await fetchBuilding('building-1');
        await survey.startSession('building-1');
        await survey.fetchSessionData('session-1');
    };

    const handlePauseResume = () => {
        if (currentSession?.status === 'paused') {
            survey.resumeSession();
        } else {
            survey.pauseSession();
        }
    };

    const handleStop = () => {
        survey.completeSession();
        showAlert({title: t('survey.status_completed'), type: 'success', message: ''});
    };

    const openModal = (type: ModalType) => {
        photoCountRef.current = photos.length;
        voiceCountRef.current = voiceObservations.length;
        setModal({type});
    };

    const closeModal = () => {
        const modalType = modal.type;
        setModal({type: null});

        // AI per nuove voci (foto gestita da onSaved)
        if (modalType === 'voice') {
            const freshState = store.getState().survey;
            const session = freshState.currentSession;
            if (freshState.voiceObservations.length > voiceCountRef.current) {
                const newVoice = freshState.voiceObservations[freshState.voiceObservations.length - 1];
                if (newVoice?.transcription && session) {
                    analyzeVoice({
                        observationId: newVoice.id,
                        transcription: newVoice.transcription,
                        buildingId: session.buildingId,
                        currentFloorId: newVoice.floorId,
                        currentRoomId: newVoice.roomId,
                    });
                }
            }
        }
    };

    const handlePhotoSaved = (photo: SurveyPhoto) => {
        const session = store.getState().survey.currentSession;
        if (session) {
            analyzePhoto({
                photoId: photo.id,
                mediaPath: photo.mediaPath,
                buildingId: session.buildingId,
                currentFloorId: photo.floorId,
                currentRoomId: photo.roomId,
            });
        }
    };

    const handleBatchSaved = (batchPhotos: SurveyPhoto[]) => {
        const session = store.getState().survey.currentSession;
        if (!session) return;
        const requests = batchPhotos.map(photo => ({
            photoId: photo.id,
            mediaPath: photo.mediaPath,
            buildingId: session.buildingId,
            currentFloorId: photo.floorId,
            currentRoomId: photo.roomId,
        }));
        analyzePhotoBatch(requests);
    };

    const handleEditObservation = (obs: ObservationItem) => {
        switch (obs.observationType) {
            case 'photo':
                setModal({type: 'photo', editData: obs as SurveyPhoto});
                break;
            case 'voice':
                setModal({type: 'voice', editData: obs as VoiceObservation});
                break;
            case 'measurement':
                setModal({type: 'measure', editData: obs as Measurement});
                break;
        }
    };

    const handleAcceptSuggestion = async (id: string) => {
        await acceptSuggestion(id);
        showAlert({title: t('ai.feedback_sent'), type: 'success', message: ''});
    };

    const handleRejectSuggestion = async (id: string) => {
        await rejectSuggestion(id);
        showAlert({title: t('ai.feedback_sent'), type: 'info', message: ''});
    };

    const getStatusBadgeClass = (): string => {
        if (!currentSession) return '';
        const map: Record<string, string> = {
            active: 'badge-success',
            paused: 'badge-warning',
            completed: 'badge-info',
            interrupted: 'badge-error',
        };
        return map[currentSession.status] || '';
    };

    const getStatusLabel = (): string => {
        if (!currentSession) return '';
        const map: Record<string, string> = {
            active: t('survey.status_active'),
            paused: t('survey.status_paused'),
            completed: t('survey.status_completed'),
            interrupted: t('survey.status_interrupted'),
        };
        return map[currentSession.status] || '';
    };

    // Nessuna sessione attiva
    if (!currentSession || currentSession.status === 'completed') {
        return (
            <div className="w-full px-4 sm:px-6 lg:px-8 py-6 bg-gradient-to-br from-primary-50/50 via-primary-100/30 to-slate-50 min-h-screen">
                <div className="mx-auto w-full max-w-5xl">
                    <PageTitle title={t('survey.title')} subtitle={t('survey.subtitle')}/>
                    <div className="mt-10 flex flex-col items-center gap-6">
                        <div className="card text-center w-full">
                            <CameraIcon className="h-16 w-16 text-slate-400 mx-auto mb-4"/>
                            <h3 className="text-lg font-semibold text-slate-700 mb-2">{t('survey.no_session')}</h3>
                            <p className="text-slate-500 mb-4">{t('survey.select_building')}</p>
                            <p className="text-sm text-slate-500 mb-6">{t('survey.start_instructions')}</p>
                            <button onClick={handleStart} className="btn btn-primary">
                                {t('survey.start')}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // Sessione attiva
    return (
        <div className="w-full px-4 sm:px-6 lg:px-8 py-6 bg-gradient-to-br from-primary-50/50 via-primary-100/30 to-slate-50 min-h-screen">
            <div className="mx-auto w-full max-w-5xl">
                <PageTitle
                    title={t('survey.title')}
                    subtitle={t('survey.subtitle')}
                    badges={[{label: getStatusLabel()}]}
                />

                {/* Status bar */}
                <div className="mt-4 flex flex-wrap items-center gap-3 p-3 card" aria-live="polite">
                    <span className={`badge ${getStatusBadgeClass()}`}>{getStatusLabel()}</span>
                    <div className="ml-auto flex items-center gap-3 text-sm text-slate-600">
                        <span>{t('survey.filter_photos')}: {photoCount}</span>
                        <span>{t('survey.filter_voice')}: {voiceCount}</span>
                        <span>{t('survey.filter_measurements')}: {measureCount}</span>
                    </div>
                </div>

                {/* Action buttons */}
                <div className="mt-4 grid grid-cols-5 gap-2">
                    <button
                        onClick={() => openModal('photo')}
                        className="flex flex-col items-center justify-center gap-1 min-h-[56px] rounded-xl text-xs font-medium transition-colors btn-outline"
                        aria-label={t('survey.photo')}
                    >
                        <CameraIcon className="h-6 w-6"/>
                        <span className="hidden sm:inline">{t('survey.photo')}</span>
                    </button>
                    <button
                        onClick={() => openModal('voice')}
                        className="flex flex-col items-center justify-center gap-1 min-h-[56px] rounded-xl text-xs font-medium transition-colors btn-outline"
                        aria-label={t('survey.voice')}
                    >
                        <MicrophoneIcon className="h-6 w-6"/>
                        <span className="hidden sm:inline">{t('survey.voice')}</span>
                    </button>
                    <button
                        onClick={() => openModal('measure')}
                        className="flex flex-col items-center justify-center gap-1 min-h-[56px] rounded-xl text-xs font-medium transition-colors btn-outline"
                        aria-label={t('survey.measure')}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M3 6h18M3 12h18M3 18h18"/>
                        </svg>
                        <span className="hidden sm:inline">{t('survey.measure')}</span>
                    </button>
                    <button
                        onClick={handlePauseResume}
                        className="flex flex-col items-center justify-center gap-1 min-h-[56px] rounded-xl text-xs font-medium btn-outline"
                        aria-label={currentSession.status === 'paused' ? t('survey.resume') : t('survey.pause')}
                    >
                        {currentSession.status === 'paused'
                            ? <PlayIcon className="h-6 w-6 text-success"/>
                            : <PauseIcon className="h-6 w-6 text-warning"/>
                        }
                        <span className="hidden sm:inline">{currentSession.status === 'paused' ? t('survey.resume') : t('survey.pause')}</span>
                    </button>
                    <button
                        onClick={handleStop}
                        className="flex flex-col items-center justify-center gap-1 min-h-[56px] rounded-xl text-xs font-medium
                                   border border-error-light text-error hover:bg-error-light transition-colors"
                        aria-label={t('survey.stop')}
                    >
                        <StopIcon className="h-6 w-6"/>
                        <span className="hidden sm:inline">{t('survey.stop')}</span>
                    </button>
                </div>

                {/* AI Suggerimenti */}
                {(isAnalyzing || pendingSuggestions.length > 0) && (
                    <div className="mt-4 flex flex-col gap-3">
                        {isAnalyzing && (
                            <div className="card flex items-center gap-3 border-l-4 border-l-primary-500">
                                <div className="relative h-6 w-6 flex-shrink-0">
                                    <div className="absolute inset-0 rounded-full border-2 border-primary-100"/>
                                    <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-primary-500 motion-safe:animate-spin"/>
                                </div>
                                <SparklesIcon className="h-5 w-5 text-primary-500 flex-shrink-0"/>
                                <p className="text-sm text-text-secondary">{t('ai.analyzing')}</p>
                            </div>
                        )}

                        {pendingSuggestions.map(suggestion => (
                            <AiSuggestionCard
                                key={suggestion.id}
                                suggestion={suggestion}
                                onAccept={handleAcceptSuggestion}
                                onReject={handleRejectSuggestion}
                            />
                        ))}
                    </div>
                )}

                {/* Observation list */}
                <div className="mt-6 card">
                    <SurveyObservationList onEdit={handleEditObservation}/>
                </div>
            </div>

            {/* Modali fullscreen */}
            {modal.type === 'photo' && (
                <PhotoModal editData={modal.editData as SurveyPhoto | undefined} onClose={closeModal} onSaved={handlePhotoSaved} onBatchSaved={handleBatchSaved}/>
            )}
            {modal.type === 'voice' && (
                <VoiceModal editData={modal.editData as VoiceObservation | undefined} onClose={closeModal}/>
            )}
            {modal.type === 'measure' && (
                <MeasurementModal editData={modal.editData as Measurement | undefined} onClose={closeModal}/>
            )}
        </div>
    );
};

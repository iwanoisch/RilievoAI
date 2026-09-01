import {FC, useCallback, useEffect, useState} from "react";
import {useVoiceRecorder} from "../../../hooks/useVoiceRecorder.ts";
import {useBuilding} from "../../../features/building/hooks/useBuilding.ts";
import {useSurvey} from "../../../features/survey/hooks/useSurvey.ts";
import {MicrophoneIcon, StopIcon, XMarkIcon} from "@heroicons/react/24/solid";
import {useTranslation} from "react-i18next";
import type {VoiceModalProps} from "./voiceModal.type.ts";

export const VoiceModal: FC<VoiceModalProps> = ({editData, onClose}) => {
    const {t} = useTranslation();
    const {isRecording, transcription, audioPath, voiceError, startRecording, stopRecording} = useVoiceRecorder();
    const {currentSession, addVoiceObservation, updateVoiceObservation, deleteVoiceObservation, getNextObservationId} = useSurvey();
    const {elements} = useBuilding();
    const elementList = Object.values(elements);

    const [hasRecorded, setHasRecorded] = useState(!!editData);
    const [targetElementId, setTargetElementId] = useState(editData?.targetElementId || '');
    const [localTranscription, setLocalTranscription] = useState(editData?.transcription || '');
    const [pendingId, setPendingId] = useState<string | null>(editData?.id || null);

    const isEditMode = !!editData;
    const [hasChanges, setHasChanges] = useState(false);

    const originalTranscription = editData?.transcription || '';
    const originalTargetElementId = editData?.targetElementId || '';

    // Sincronizza trascrizione live durante registrazione e dopo stop
    useEffect(() => {
        if (!isEditMode) {
            setLocalTranscription(transcription);
        }
    }, [transcription, isEditMode]);

    // Quando l'audio è pronto, salva automaticamente e mostra il form di revisione
    useEffect(() => {
        if (!isEditMode && audioPath && currentSession) {
            const id = getNextObservationId();
            addVoiceObservation({
                id,
                sessionId: currentSession.id,
                timestamp: new Date().toISOString(),
                audioPath,
                transcription: localTranscription || undefined,
                confidence: localTranscription ? 70 : 30,
                dataStatus: 'RAW',
            });
            setPendingId(id);
            setHasRecorded(true);
        }
    }, [audioPath, isEditMode]);

    // Detecta modifiche ai campi
    useEffect(() => {
        if (hasRecorded) {
            const changed = localTranscription !== originalTranscription || targetElementId !== originalTargetElementId;
            setHasChanges(changed);
        }
    }, [localTranscription, targetElementId, originalTranscription, originalTargetElementId, hasRecorded]);

    // Chiudi con Escape
    useEffect(() => {
        const handleKey = (e: KeyboardEvent) => {
            if (e.key === 'Escape' && !isRecording) onClose();
        };
        window.addEventListener('keydown', handleKey);
        return () => window.removeEventListener('keydown', handleKey);
    }, [onClose, isRecording]);

    const handleStart = useCallback(() => {
        if (pendingId) {
            deleteVoiceObservation(pendingId);
            setPendingId(null);
        }
        setHasRecorded(false);
        setLocalTranscription('');
        setTargetElementId('');
        setHasChanges(false);
    }, [pendingId, deleteVoiceObservation]);

    const handleRecord = useCallback(() => {
        startRecording();
    }, [startRecording]);

    const handleStop = useCallback(() => {
        stopRecording();
    }, [stopRecording]);

    const handleSave = () => {
        if (isEditMode && editData) {
            updateVoiceObservation({
                ...editData,
                transcription: localTranscription || undefined,
                targetElementId: targetElementId || undefined,
            });
        } else if (pendingId && hasRecorded && audioPath && currentSession) {
            updateVoiceObservation({
                id: pendingId,
                sessionId: currentSession.id,
                timestamp: new Date().toISOString(),
                audioPath,
                transcription: localTranscription || undefined,
                targetElementId: targetElementId || undefined,
                confidence: localTranscription ? 70 : 30,
                dataStatus: 'RAW',
            });
        }
        onClose();
    };

    return (
        <div className="fixed inset-0 z-50 bg-surface-page flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-border-default bg-surface-card">
                <h2 className="text-base font-semibold text-slate-700">
                    {isEditMode ? t('common.edit') : t('survey.voice')}
                </h2>
                <button
                    onClick={onClose}
                    className="p-2 rounded-lg hover:bg-surface-hover transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center"
                    aria-label={t('common.close')}
                >
                    <XMarkIcon className="h-6 w-6 text-slate-500"/>
                </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-4">
                <div className="mx-auto w-full max-w-lg flex flex-col gap-4">

                    {/* Recorder / Player */}
                    {!hasRecorded ? (
                        <div className="flex flex-col items-center gap-4 py-8">
                            <button
                                onClick={isRecording ? handleStop : handleRecord}
                                className={`w-20 h-20 rounded-full flex items-center justify-center shadow-lg transition-all
                                    active:scale-95 focus:outline-none focus:ring-2 focus:ring-offset-2
                                    ${isRecording
                                    ? 'bg-error hover:bg-error-dark focus:ring-error motion-safe:animate-pulse'
                                    : 'bg-primary-500 hover:bg-primary-600 focus:ring-primary-500'
                                }`}
                                aria-label={isRecording ? t('survey.stop_recording') : t('survey.start_recording')}
                            >
                                {isRecording
                                    ? <StopIcon className="h-8 w-8 text-white"/>
                                    : <MicrophoneIcon className="h-8 w-8 text-white"/>
                                }
                            </button>

                            <div aria-live="polite" className="text-center">
                                {isRecording ? (
                                    <div className="flex items-center gap-2 justify-center">
                                        <span className="inline-block w-2 h-2 rounded-full bg-error" aria-hidden="true"/>
                                        <span className="text-sm text-error-dark font-medium">{t('survey.recording')}</span>
                                    </div>
                                ) : (
                                    <p className="text-sm text-slate-500">{t('survey.voice_instructions')}</p>
                                )}
                            </div>

                            {isRecording && transcription && (
                                <p className="text-sm text-slate-700 bg-surface-hover rounded-lg p-3 border border-border-default w-full">
                                    {transcription}
                                </p>
                            )}
                        </div>
                    ) : (
                        <>
                            {/* Audio player */}
                            {(isEditMode ? editData?.audioPath : audioPath) && (
                                <audio controls src={isEditMode ? editData!.audioPath : audioPath!} className="w-full"/>
                            )}

                            {/* Trascrizione */}
                            <div>
                                <label className="text-sm text-slate-600 mb-1 block">{t('survey.transcription')}</label>
                                <textarea
                                    value={localTranscription}
                                    onChange={(e) => setLocalTranscription(e.target.value)}
                                    rows={4}
                                    className="input resize-none"
                                    placeholder={t('survey.transcription_placeholder')}
                                />
                            </div>

                            {/* Elemento associato */}
                            <div>
                                <label className="text-sm text-slate-600 mb-1 block">{t('survey.measurement_element')}</label>
                                <select value={targetElementId} onChange={(e) => setTargetElementId(e.target.value)} className="input">
                                    <option value="">--</option>
                                    {elementList.map((el) => (
                                        <option key={el.id} value={el.id}>{el.label}</option>
                                    ))}
                                </select>
                            </div>
                        </>
                    )}

                    {voiceError && (
                        <div className="card bg-error-light border border-error p-4">
                            <p className="text-error-dark text-sm text-center">{t('survey.mic_permission_denied')}</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Footer */}
            {hasRecorded ? (
                <div className="px-4 py-3 border-t border-border-default bg-surface-card flex gap-2">
                    <button onClick={handleStart} className="btn btn-outline flex-1">{t('survey.retake')}</button>
                    {hasChanges ? (
                        <button onClick={handleSave} className="btn btn-primary flex-1">{t('common.save')}</button>
                    ) : (
                        <button onClick={onClose} className="btn btn-primary flex-1">{t('common.close')}</button>
                    )}
                </div>
            ) : !isRecording && (
                <div className="px-4 py-3 border-t border-border-default bg-surface-card flex gap-2">
                    <button onClick={onClose} className="btn btn-outline flex-1">{t('common.cancel')}</button>
                </div>
            )}
        </div>
    );
};

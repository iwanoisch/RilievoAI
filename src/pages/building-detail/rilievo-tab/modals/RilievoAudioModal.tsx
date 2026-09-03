import {FC, useCallback, useEffect, useState} from "react";
import {useTranslation} from "react-i18next";
import {useVoiceRecorder} from "../../../../hooks/useVoiceRecorder.ts";
import {MicrophoneIcon, StopIcon, XMarkIcon} from "@heroicons/react/24/solid";
import type {RilievoAudioModalProps} from "./rilievoModals.type.ts";
import type {RilievoAudio} from "../../../../features/rilievo/rilievo.type.ts";

export const RilievoAudioModal: FC<RilievoAudioModalProps> = ({itemId, onSave, onClose}) => {
    const {t} = useTranslation();
    const {isRecording, transcription, audioPath, voiceError, startRecording, stopRecording} = useVoiceRecorder();

    const [hasRecorded, setHasRecorded] = useState(false);
    const [localTranscription, setLocalTranscription] = useState('');
    const [recordingStartTime, setRecordingStartTime] = useState(0);
    const [lastAudioPath, setLastAudioPath] = useState<string | null>(null);

    useEffect(() => {
        if (!hasRecorded) {
            setLocalTranscription(transcription);
        }
    }, [transcription, hasRecorded]);

    useEffect(() => {
        if (audioPath && audioPath !== lastAudioPath) {
            setLastAudioPath(audioPath);
            setHasRecorded(true);
        }
    }, [audioPath, lastAudioPath]);

    useEffect(() => {
        const handleKey = (e: KeyboardEvent) => {
            if (e.key === 'Escape' && !isRecording) onClose();
        };
        window.addEventListener('keydown', handleKey);
        return () => window.removeEventListener('keydown', handleKey);
    }, [onClose, isRecording]);

    const handleRecord = useCallback(() => {
        setRecordingStartTime(Date.now());
        startRecording();
    }, [startRecording]);

    const handleStop = useCallback(() => {
        stopRecording();
    }, [stopRecording]);

    const handleRetake = () => {
        setHasRecorded(false);
        setLocalTranscription('');
        setRecordingStartTime(0);
        setLastAudioPath(audioPath);
    };

    const handleSave = () => {
        const duration = recordingStartTime > 0 ? Math.round((Date.now() - recordingStartTime) / 1000) : 0;
        const audio: RilievoAudio = {
            id: `audio-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
            itemId,
            uri: audioPath || '',
            duration,
            timestamp: new Date().toISOString(),
            transcription: localTranscription.trim() || undefined,
        };
        onSave(audio);
        onClose();
    };

    return (
        <div className="fixed inset-0 z-50 bg-surface-page flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-border-default bg-surface-card">
                <h2 className="text-base font-semibold text-slate-700">
                    {t('rilievo.modal_audio_title')}
                </h2>
                <button
                    onClick={onClose}
                    className="p-2 rounded-lg hover:bg-surface-hover transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center"
                    aria-label={t('rilievo.modal_cancel')}
                >
                    <XMarkIcon className="h-6 w-6 text-slate-500"/>
                </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-4">
                <div className="mx-auto w-full max-w-lg flex flex-col gap-4">
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
                                aria-label={isRecording ? t('rilievo.stop_recording') : t('rilievo.start_recording')}
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
                                        <span className="text-sm text-error-dark font-medium">{t('rilievo.recording')}</span>
                                    </div>
                                ) : (
                                    <p className="text-sm text-slate-500">{t('rilievo.voice_instructions')}</p>
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
                            {audioPath && (
                                <audio controls src={audioPath} className="w-full"/>
                            )}

                            <div>
                                <label htmlFor="rilievo-audio-transcription" className="text-sm text-slate-600 mb-1 block">
                                    {t('rilievo.modal_transcription')}
                                </label>
                                <textarea
                                    id="rilievo-audio-transcription"
                                    name="rilievo-audio-transcription"
                                    value={localTranscription}
                                    onChange={(e) => setLocalTranscription(e.target.value)}
                                    rows={4}
                                    className="input resize-none"
                                    placeholder={t('rilievo.modal_transcription_placeholder')}
                                />
                            </div>
                        </>
                    )}

                    {voiceError && (
                        <div className="card bg-error-light border border-error p-4">
                            <p className="text-error-dark text-sm text-center">{t('rilievo.mic_error')}</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Footer */}
            {hasRecorded ? (
                <div className="px-4 py-3 border-t border-border-default bg-surface-card flex gap-2">
                    <button onClick={handleRetake} className="btn btn-outline flex-1 min-h-[44px]">
                        {t('rilievo.btn_retake')}
                    </button>
                    <button onClick={handleSave} className="btn btn-primary flex-1 min-h-[44px]">
                        {t('rilievo.modal_save')}
                    </button>
                </div>
            ) : !isRecording && (
                <div className="px-4 py-3 border-t border-border-default bg-surface-card flex gap-2">
                    <button onClick={onClose} className="btn btn-outline flex-1 min-h-[44px]">
                        {t('rilievo.modal_cancel')}
                    </button>
                </div>
            )}
        </div>
    );
};

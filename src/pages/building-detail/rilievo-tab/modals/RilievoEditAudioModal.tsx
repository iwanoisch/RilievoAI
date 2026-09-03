import {FC, useState, useRef} from "react";
import {useTranslation} from "react-i18next";
import {XMarkIcon, PlayIcon, PauseIcon} from "@heroicons/react/24/solid";
import {TrashIcon} from "@heroicons/react/24/outline";
import type {RilievoEditAudioModalProps} from "./rilievoModals.type.ts";

export const RilievoEditAudioModal: FC<RilievoEditAudioModalProps> = ({audio, onSave, onDelete, onClose}) => {
    const {t} = useTranslation();
    const [transcription, setTranscription] = useState(audio.transcription || '');
    const [playing, setPlaying] = useState(false);
    const audioRef = useRef<HTMLAudioElement | null>(null);

    const formatDuration = (seconds: number): string => {
        const m = Math.floor(seconds / 60);
        const s = seconds % 60;
        return `${m}:${s.toString().padStart(2, '0')}`;
    };

    const togglePlay = () => {
        if (!audioRef.current) {
            const el = new Audio(audio.uri);
            el.onended = () => setPlaying(false);
            audioRef.current = el;
        }
        if (playing) {
            audioRef.current.pause();
            setPlaying(false);
        } else {
            audioRef.current.play();
            setPlaying(true);
        }
    };

    const handleSave = () => {
        if (audioRef.current) {
            audioRef.current.pause();
            audioRef.current = null;
        }
        onSave({transcription: transcription.trim() || undefined});
        onClose();
    };

    const handleDelete = () => {
        if (audioRef.current) {
            audioRef.current.pause();
            audioRef.current = null;
        }
        onDelete();
        onClose();
    };

    return (
        <div className="fixed inset-0 z-50 bg-surface-page flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-border-default bg-surface-card">
                <h2 className="text-base font-semibold text-slate-700">
                    {t('rilievo.modal_edit_audio')}
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
                    {/* Player */}
                    <div className="flex items-center gap-4 p-4 rounded-xl bg-surface-hover border border-border-light">
                        <button
                            type="button"
                            className="flex items-center justify-center h-12 w-12 rounded-full bg-primary-500 text-white hover:bg-primary-600 transition-colors"
                            onClick={togglePlay}
                            aria-label={playing ? t('rilievo.modal_audio_pause') : t('rilievo.modal_audio_play')}
                        >
                            {playing ? <PauseIcon className="h-5 w-5"/> : <PlayIcon className="h-5 w-5"/>}
                        </button>
                        <div className="flex-1">
                            <p className="text-sm font-medium text-text-primary">
                                {t('rilievo.modal_audio_recording')}
                            </p>
                            <p className="text-xs text-text-muted">
                                {t('rilievo.modal_audio_duration')}: {formatDuration(audio.duration)}
                            </p>
                        </div>
                    </div>

                    {/* Trascrizione */}
                    <div>
                        <label htmlFor="rilievo-edit-audio-transcription" className="text-sm text-slate-600 mb-1 block">
                            {t('rilievo.modal_transcription')}
                        </label>
                        <textarea
                            id="rilievo-edit-audio-transcription"
                            name="rilievo-edit-audio-transcription"
                            value={transcription}
                            onChange={(e) => setTranscription(e.target.value)}
                            rows={4}
                            className="input resize-none"
                            placeholder={t('rilievo.modal_transcription_placeholder')}
                        />
                    </div>

                    <p className="text-xs text-text-muted">
                        {new Date(audio.timestamp).toLocaleString()}
                    </p>

                    <button
                        type="button"
                        className="flex items-center gap-2 text-sm text-error hover:text-error-dark transition-colors min-h-[44px]"
                        onClick={handleDelete}
                    >
                        <TrashIcon className="h-4 w-4"/>
                        {t('rilievo.modal_delete_audio')}
                    </button>
                </div>
            </div>

            {/* Footer */}
            <div className="px-4 py-3 border-t border-border-default bg-surface-card flex gap-2">
                <button onClick={onClose} className="btn btn-outline flex-1 min-h-[44px]">
                    {t('rilievo.modal_cancel')}
                </button>
                <button onClick={handleSave} className="btn btn-primary flex-1 min-h-[44px]">
                    {t('rilievo.modal_save')}
                </button>
            </div>
        </div>
    );
};

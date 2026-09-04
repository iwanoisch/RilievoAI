import {useCallback, useRef, useState} from "react";
import {useTranslation} from "react-i18next";
import type {SpeechRecognitionInstance, SpeechRecognitionEvent, SpeechRecognitionErrorEvent} from "./useVoiceRecorder.type.ts";

const isDesktop = () => !/Android|iPhone|iPad|iPod/i.test(navigator.userAgent);

export const useVoiceRecorder = () => {
    const {i18n} = useTranslation();
    const mediaRecorderRef = useRef<MediaRecorder | null>(null);
    const recognitionRef = useRef<SpeechRecognitionInstance | null>(null);
    const chunksRef = useRef<Blob[]>([]);
    const transcriptionRef = useRef('');
    const finalTranscriptRef = useRef('');
    const isStoppingRef = useRef(false);
    const [isRecording, setIsRecording] = useState(false);
    const [transcription, setTranscription] = useState('');
    const [audioPath, setAudioPath] = useState<string | null>(null);
    const [voiceError, setVoiceError] = useState<string | null>(null);
    const [recordingDone, setRecordingDone] = useState(false);

    const _setTranscription = (text: string) => {
        transcriptionRef.current = text;
        setTranscription(text);
    };

    const startRecognition = useCallback((lang: string) => {
        const W = window as Window & {
            SpeechRecognition?: new () => SpeechRecognitionInstance;
            webkitSpeechRecognition?: new () => SpeechRecognitionInstance;
        };
        const SpeechRecognitionCtor = W.SpeechRecognition || W.webkitSpeechRecognition;
        if (!SpeechRecognitionCtor) return;

        if (recognitionRef.current) {
            try { recognitionRef.current.stop(); } catch (_) { /* ignore */ }
        }

        const recognition = new SpeechRecognitionCtor();
        recognition.continuous = true;
        recognition.interimResults = true;
        recognition.lang = lang;

        recognition.onresult = (event: SpeechRecognitionEvent) => {
            const desktop = isDesktop();
            console.log('[VOICE] onresult', {
                desktop,
                resultIndex: event.resultIndex,
                resultsLength: event.results.length,
                finalTranscriptBefore: finalTranscriptRef.current,
            });

            // Log each result
            for (let i = 0; i < event.results.length; i++) {
                const r = event.results[i];
                console.log(`[VOICE] result[${i}]`, {
                    isFinal: r.isFinal,
                    transcript: r[0].transcript,
                    confidence: r[0].confidence,
                });
            }

            if (desktop) {
                // Desktop: append only new final results (handles restarts)
                let interimText = '';
                for (let i = event.resultIndex; i < event.results.length; i++) {
                    const result = event.results[i];
                    if (result.isFinal) {
                        finalTranscriptRef.current += result[0].transcript;
                    } else {
                        interimText += result[0].transcript;
                    }
                }
                _setTranscription(finalTranscriptRef.current + interimText);
            } else {
                // Mobile: rebuild full transcript each time (single session, no restarts)
                let finalText = '';
                let interimText = '';
                for (let i = 0; i < event.results.length; i++) {
                    const result = event.results[i];
                    if (result.isFinal) {
                        finalText += result[0].transcript;
                    } else {
                        interimText += result[0].transcript;
                    }
                }
                finalTranscriptRef.current = finalText;
                console.log('[VOICE] mobile result', {finalText, interimText, output: finalText + interimText});
                _setTranscription(finalText + interimText);
            }
        };

        recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
            const errorType = event.error || '';
            console.log('[VOICE] onerror', {error: errorType, message: event.message});
            if (errorType === 'no-speech' || errorType === 'aborted' || errorType === 'network') {
                return;
            }
        };

        recognition.onend = () => {
            console.log('[VOICE] onend', {isStopping: isStoppingRef.current, desktop: isDesktop()});
            // Auto-restart only on desktop (on mobile it causes beep sounds)
            if (isDesktop() && !isStoppingRef.current && mediaRecorderRef.current?.state === 'recording') {
                setTimeout(() => {
                    if (!isStoppingRef.current && mediaRecorderRef.current?.state === 'recording') {
                        try { recognition.start(); } catch (_) { /* ignore */ }
                    }
                }, 300);
            }
        };

        try {
            recognition.start();
            recognitionRef.current = recognition;
        } catch (_) {
            // SpeechRecognition not available or blocked
        }
    }, []);

    const startRecording = useCallback(async () => {
        try {
            setRecordingDone(false);
            isStoppingRef.current = false;
            finalTranscriptRef.current = '';
            _setTranscription('');
            setVoiceError(null);
            setAudioPath(null);

            const langMap: Record<string, string> = {it: 'it-IT', en: 'en-US', ar: 'ar-SA'};
            const lang = langMap[i18n.language] || 'it-IT';

            if (isDesktop()) {
                // Desktop: MediaRecorder + SpeechRecognition together
                if (!navigator.mediaDevices?.getUserMedia) {
                    setVoiceError('Microfono non supportato. Assicurati di usare HTTPS.');
                    return;
                }

                const stream = await navigator.mediaDevices.getUserMedia({audio: true});

                const mimeType = MediaRecorder.isTypeSupported('audio/webm;codecs=opus')
                    ? 'audio/webm;codecs=opus'
                    : MediaRecorder.isTypeSupported('audio/webm')
                        ? 'audio/webm'
                        : MediaRecorder.isTypeSupported('audio/mp4')
                            ? 'audio/mp4'
                            : '';

                const mediaRecorder = mimeType
                    ? new MediaRecorder(stream, {mimeType})
                    : new MediaRecorder(stream);

                chunksRef.current = [];

                mediaRecorder.ondataavailable = (e) => {
                    if (e.data.size > 0) {
                        chunksRef.current.push(e.data);
                    }
                };

                mediaRecorder.onstop = () => {
                    stream.getTracks().forEach(track => track.stop());
                    const type = mimeType || 'audio/webm';
                    const audioBlob = new Blob(chunksRef.current, {type});
                    setAudioPath(URL.createObjectURL(audioBlob));
                    setRecordingDone(true);
                };

                mediaRecorder.start(1000);
                mediaRecorderRef.current = mediaRecorder;
                setIsRecording(true);
                startRecognition(lang);
            } else {
                // Mobile: SpeechRecognition only (no MediaRecorder conflict)
                setIsRecording(true);
                startRecognition(lang);
            }
        } catch (error) {
            const err = error instanceof Error ? error : new Error('Errore accesso microfono');
            if (err.name === 'NotAllowedError') {
                setVoiceError('Permesso microfono negato. Consenti l\'accesso nelle impostazioni del browser.');
            } else if (err.name === 'NotFoundError') {
                setVoiceError('Nessun microfono trovato sul dispositivo.');
            } else {
                setVoiceError(err.message || 'Impossibile accedere al microfono.');
            }
        }
    }, [i18n.language, startRecognition]);

    const stopRecording = useCallback(() => {
        isStoppingRef.current = true;
        if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
            mediaRecorderRef.current.stop();
            mediaRecorderRef.current = null;
        }
        if (recognitionRef.current) {
            try { recognitionRef.current.stop(); } catch (_) { /* ignore */ }
            recognitionRef.current = null;
        }
        setIsRecording(false);
        // On mobile there's no MediaRecorder.onstop to set recordingDone
        if (!isDesktop()) {
            setRecordingDone(true);
        }
    }, []);

    const updateTranscription = useCallback((text: string) => {
        _setTranscription(text);
    }, []);

    const resetRecording = useCallback(() => {
        setRecordingDone(false);
        _setTranscription('');
        setAudioPath(null);
        finalTranscriptRef.current = '';
    }, []);

    return {
        isRecording,
        transcription,
        audioPath,
        voiceError,
        recordingDone,
        startRecording,
        stopRecording,
        updateTranscription,
        resetRecording,
    };
};

import {useCallback, useRef, useState} from "react";
import {useTranslation} from "react-i18next";
import type {SpeechRecognitionInstance, SpeechRecognitionEvent, SpeechRecognitionErrorEvent} from "./useVoiceRecorder.type.ts";

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
    const [debugLog, setDebugLog] = useState<string[]>([]);

    const addDebug = (msg: string) => {
        setDebugLog(prev => [...prev.slice(-10), `${new Date().toLocaleTimeString()}: ${msg}`]);
    };

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
        if (!SpeechRecognitionCtor) {
            addDebug('SpeechRecognition NOT available');
            return;
        }
        addDebug('SpeechRecognition found, starting...');

        if (recognitionRef.current) {
            try { recognitionRef.current.stop(); } catch (_) { /* ignore */ }
        }

        const recognition = new SpeechRecognitionCtor();
        recognition.continuous = true;
        recognition.interimResults = true;
        recognition.lang = lang;

        recognition.onresult = (event: SpeechRecognitionEvent) => {
            let interimText = '';
            let finalText = '';
            for (let i = 0; i < event.results.length; i++) {
                const result = event.results[i];
                if (result.isFinal) {
                    finalText += result[0].transcript;
                } else {
                    interimText += result[0].transcript;
                }
            }
            // Accumulate final transcript across restarts
            if (finalText) {
                finalTranscriptRef.current += finalText;
            }
            _setTranscription(finalTranscriptRef.current + interimText);
            addDebug(`onresult: final="${finalText}" interim="${interimText}"`);
        };

        recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
            const errorType = event.error || '';
            addDebug(`onerror: ${errorType}`);
            if (errorType === 'no-speech' || errorType === 'aborted' || errorType === 'network') {
                return;
            }
        };

        // Auto-restart when recognition ends (happens frequently on Android)
        recognition.onend = () => {
            addDebug(`onend: stopping=${isStoppingRef.current} recState=${mediaRecorderRef.current?.state}`);
            if (!isStoppingRef.current && mediaRecorderRef.current?.state === 'recording') {
                setTimeout(() => {
                    if (!isStoppingRef.current && mediaRecorderRef.current?.state === 'recording') {
                        addDebug('restarting recognition...');
                        try { recognition.start(); } catch (e) { addDebug(`restart failed: ${e}`); }
                    }
                }, 300);
            }
        };

        try {
            recognition.start();
            recognitionRef.current = recognition;
            addDebug(`recognition started, lang=${lang}`);
        } catch (e) {
            addDebug(`recognition start failed: ${e}`);
        }
    }, []);

    const startRecording = useCallback(async () => {
        try {
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
            isStoppingRef.current = false;
            finalTranscriptRef.current = '';

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
            };

            mediaRecorder.start(1000);
            mediaRecorderRef.current = mediaRecorder;
            setIsRecording(true);
            setAudioPath(null);
            _setTranscription('');
            setVoiceError(null);

            const langMap: Record<string, string> = {it: 'it-IT', en: 'en-US', ar: 'ar-SA'};
            startRecognition(langMap[i18n.language] || 'it-IT');
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
    }, []);

    const updateTranscription = useCallback((text: string) => {
        _setTranscription(text);
    }, []);

    return {
        isRecording,
        transcription,
        audioPath,
        voiceError,
        startRecording,
        stopRecording,
        updateTranscription,
        debugLog,
    };
};

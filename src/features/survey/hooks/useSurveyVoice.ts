import {useCallback, useRef, useState} from "react";
import {useTranslation} from "react-i18next";

interface SpeechRecognitionEvent {
    results: SpeechRecognitionResultList;
}

interface SpeechRecognitionInstance {
    continuous: boolean;
    interimResults: boolean;
    lang: string;
    onresult: ((event: SpeechRecognitionEvent) => void) | null;
    onerror: (() => void) | null;
    start: () => void;
    stop: () => void;
}

export const useSurveyVoice = () => {
    const {i18n} = useTranslation();
    const mediaRecorderRef = useRef<MediaRecorder | null>(null);
    const recognitionRef = useRef<SpeechRecognitionInstance | null>(null);
    const chunksRef = useRef<Blob[]>([]);
    const transcriptionRef = useRef('');
    const [isRecording, setIsRecording] = useState(false);
    const [transcription, setTranscription] = useState('');
    const [audioPath, setAudioPath] = useState<string | null>(null);
    const [voiceError, setVoiceError] = useState<string | null>(null);

    const _setTranscription = (text: string) => {
        transcriptionRef.current = text;
        setTranscription(text);
    };

    const startRecording = useCallback(async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({audio: true});
            const mediaRecorder = new MediaRecorder(stream);
            chunksRef.current = [];

            mediaRecorder.ondataavailable = (e) => {
                if (e.data.size > 0) {
                    chunksRef.current.push(e.data);
                }
            };

            mediaRecorder.onstop = () => {
                stream.getTracks().forEach(track => track.stop());
                const audioBlob = new Blob(chunksRef.current, {type: 'audio/webm'});
                setAudioPath(URL.createObjectURL(audioBlob));
            };

            mediaRecorder.start();
            mediaRecorderRef.current = mediaRecorder;
            setIsRecording(true);
            setAudioPath(null);
            _setTranscription('');
            setVoiceError(null);

            // Web Speech API per trascrizione
            const langMap: Record<string, string> = {it: 'it-IT', en: 'en-US', ar: 'ar-SA'};
            const speechLang = langMap[i18n.language] || 'it-IT';

            const W = window as Window & { SpeechRecognition?: new () => SpeechRecognitionInstance; webkitSpeechRecognition?: new () => SpeechRecognitionInstance };
            const SpeechRecognitionCtor = W.SpeechRecognition || W.webkitSpeechRecognition;
            if (SpeechRecognitionCtor) {
                const recognition = new SpeechRecognitionCtor();
                recognition.continuous = true;
                recognition.interimResults = true;
                recognition.lang = speechLang;

                recognition.onresult = (event: SpeechRecognitionEvent) => {
                    let text = '';
                    for (let i = 0; i < event.results.length; i++) {
                        text += event.results[i][0].transcript;
                    }
                    _setTranscription(text);
                };

                recognition.onerror = () => {};

                recognition.start();
                recognitionRef.current = recognition;
            }
        } catch (error) {
            const message = error instanceof Error ? error.message : 'Errore accesso microfono';
            setVoiceError(message);
        }
    }, [i18n.language]);

    const stopRecording = useCallback(() => {
        if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
            mediaRecorderRef.current.stop();
            mediaRecorderRef.current = null;
        }
        if (recognitionRef.current) {
            recognitionRef.current.stop();
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
    };
};

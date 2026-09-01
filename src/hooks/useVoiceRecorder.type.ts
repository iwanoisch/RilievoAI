export interface SpeechRecognitionEvent {
    results: SpeechRecognitionResultList;
}

export interface SpeechRecognitionInstance {
    continuous: boolean;
    interimResults: boolean;
    lang: string;
    onresult: ((event: SpeechRecognitionEvent) => void) | null;
    onerror: (() => void) | null;
    start: () => void;
    stop: () => void;
}

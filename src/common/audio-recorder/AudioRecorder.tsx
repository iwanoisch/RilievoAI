import { useState, useRef } from 'react';
import {MicrophoneIcon} from "@heroicons/react/24/solid";
import {AudioRecorderProps} from "./audioRecorder.type.ts";

export const AudioRecorder = ({getApiResponse, setLoading} : AudioRecorderProps) => {
    const [recording, setRecording] = useState(false);
    const mediaRecorderRef = useRef<MediaRecorder | null>(null);
    const audioChunksRef = useRef<Blob[]>([]);

    const startRecording = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            const mediaRecorder = new MediaRecorder(stream);
            mediaRecorderRef.current = mediaRecorder;
            audioChunksRef.current = [];

            mediaRecorder.ondataavailable = (event: BlobEvent) => {
                if (event.data.size > 0) {
                    audioChunksRef.current.push(event.data);
                }
            };

            mediaRecorder.onstop = async () => {
                setRecording(false);
                setLoading(true);
                const stream = mediaRecorderRef.current?.stream;
                if (stream) {
                    stream.getTracks().forEach(track => track.stop());
                }
                const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
                const formData = new FormData();
                formData.append('file', audioBlob, 'recording.webm');

                try {
                    await fetch('https://lapsai-gwy-cdff96509da4.herokuapp.com/api/audio/audioFileTranslator?userLang=italiano&outputLang=italiano', {
                        method: 'POST',
                        body: formData,
                    }).then(async (res) => {
                        const data = await res.json();
                        setLoading(false);
                        getApiResponse(data.data.text);
                    }).catch(err => {
                            console.error('Errore:', err);
                        });

                } catch (error) {
                    console.error('Errore fetch:', error);
                }
            };

            mediaRecorder.start();
            setRecording(true);
        } catch (err) {
            console.error('Errore microfono:', err);
        }
    };

    const stopRecording = () => {
        mediaRecorderRef.current?.stop();
    };

    return (
        <div className="flex flex-col items-center gap-4 mt-10">
            <button
                type="button"
                onClick={recording ? stopRecording : startRecording}
                className={`flex items-center px-4 py-3 rounded-lg text-white font-semibold transition
          ${recording ? 'bg-red-500 hover:bg-red-600' : 'bg-primary-500 hover:bg-primary-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600'}`}
            >
                <MicrophoneIcon  className="h-6 w-8 text-white"/>
                {recording ? 'Ferma e Invia' : 'Inizia Registrazione'}
            </button>
        </div>
    );
};
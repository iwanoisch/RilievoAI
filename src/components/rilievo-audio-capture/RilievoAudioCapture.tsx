import {FC, useState, useRef, useCallback} from "react";
import {MicrophoneIcon, StopIcon} from "@heroicons/react/24/outline";
import type {RilievoAudio} from "../../features/rilievo/rilievo.type.ts";
import type {RilievoAudioCaptureProps} from "./rilievoAudioCapture.type.ts";

export const RilievoAudioCapture: FC<RilievoAudioCaptureProps> = ({itemId, onCapture}) => {
    const [recording, setRecording] = useState(false);
    const [duration, setDuration] = useState(0);
    const recorderRef = useRef<MediaRecorder | null>(null);
    const chunksRef = useRef<Blob[]>([]);
    const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
    const startTimeRef = useRef(0);

    const startRecording = useCallback(async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({audio: true});
            const recorder = new MediaRecorder(stream);
            chunksRef.current = [];

            recorder.ondataavailable = (e) => {
                if (e.data.size > 0) chunksRef.current.push(e.data);
            };

            recorder.onstop = () => {
                stream.getTracks().forEach(t => t.stop());
                if (timerRef.current) clearInterval(timerRef.current);

                const blob = new Blob(chunksRef.current, {type: 'audio/webm'});
                const reader = new FileReader();
                reader.onload = () => {
                    const elapsed = Math.round((Date.now() - startTimeRef.current) / 1000);
                    const audio: RilievoAudio = {
                        id: `audio-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
                        itemId,
                        uri: reader.result as string,
                        duration: elapsed,
                        timestamp: new Date().toISOString(),
                    };
                    onCapture(audio);
                };
                reader.readAsDataURL(blob);
                setRecording(false);
                setDuration(0);
            };

            recorder.start();
            recorderRef.current = recorder;
            startTimeRef.current = Date.now();
            setRecording(true);

            timerRef.current = setInterval(() => {
                setDuration(Math.round((Date.now() - startTimeRef.current) / 1000));
            }, 500);
        } catch (_err) {
            setRecording(false);
        }
    }, [itemId, onCapture]);

    const stopRecording = useCallback(() => {
        if (recorderRef.current && recorderRef.current.state === 'recording') {
            recorderRef.current.stop();
        }
    }, []);

    const formatTime = (seconds: number) => {
        const m = Math.floor(seconds / 60);
        const s = seconds % 60;
        return `${m}:${s.toString().padStart(2, '0')}`;
    };

    if (recording) {
        return (
            <button
                type="button"
                className="btn btn-primary flex items-center gap-1.5 text-xs min-h-[40px] animate-pulse"
                onClick={stopRecording}
            >
                <StopIcon className="h-4 w-4"/>
                {formatTime(duration)} - Stop
            </button>
        );
    }

    return (
        <button
            type="button"
            className="btn btn-outline flex items-center gap-1.5 text-xs min-h-[40px]"
            onClick={startRecording}
        >
            <MicrophoneIcon className="h-4 w-4"/>
            Audio
        </button>
    );
};

import type {RilievoAudio} from "../../features/rilievo/rilievo.type.ts";

export interface RilievoAudioCaptureProps {
    itemId: string;
    onCapture: (audio: RilievoAudio) => void;
}

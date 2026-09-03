import type {RilievoPhoto} from "../../features/rilievo/rilievo.type.ts";

export interface RilievoPhotoCaptureProps {
    itemId: string;
    onCapture: (photo: RilievoPhoto) => void;
}

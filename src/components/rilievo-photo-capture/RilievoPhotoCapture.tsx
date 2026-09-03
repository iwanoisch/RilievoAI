import {FC, useRef} from "react";
import {CameraIcon, PhotoIcon} from "@heroicons/react/24/outline";
import type {RilievoPhoto} from "../../features/rilievo/rilievo.type.ts";
import type {RilievoPhotoCaptureProps} from "./rilievoPhotoCapture.type.ts";

export const RilievoPhotoCapture: FC<RilievoPhotoCaptureProps> = ({itemId, onCapture}) => {
    const cameraInputRef = useRef<HTMLInputElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const processFile = (file: File) => {
        const reader = new FileReader();
        reader.onload = () => {
            const photo: RilievoPhoto = {
                id: `photo-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
                itemId,
                uri: reader.result as string,
                timestamp: new Date().toISOString(),
                note: file.name,
            };
            onCapture(photo);
        };
        reader.readAsDataURL(file);
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (!files) return;
        for (let i = 0; i < files.length; i++) {
            processFile(files[i]);
        }
        e.target.value = '';
    };

    return (
        <div className="flex items-center gap-1.5">
            <button
                type="button"
                className="btn btn-outline flex items-center gap-1.5 text-xs min-h-[40px]"
                onClick={() => cameraInputRef.current?.click()}
            >
                <CameraIcon className="h-4 w-4"/>
                Scatta
            </button>
            <button
                type="button"
                className="btn btn-outline flex items-center gap-1.5 text-xs min-h-[40px]"
                onClick={() => fileInputRef.current?.click()}
            >
                <PhotoIcon className="h-4 w-4"/>
                Carica
            </button>
            <input
                ref={cameraInputRef}
                type="file"
                accept="image/*"
                capture="environment"
                className="hidden"
                onChange={handleFileChange}
            />
            <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                multiple
                className="hidden"
                onChange={handleFileChange}
            />
        </div>
    );
};

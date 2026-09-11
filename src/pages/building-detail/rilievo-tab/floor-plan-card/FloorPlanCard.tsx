import {FC, useEffect, useRef, useState} from "react";
import {useTranslation} from "react-i18next";
import {MapIcon, ArrowUpTrayIcon, TrashIcon} from "@heroicons/react/24/outline";
import {floorPlanDB} from "../../../../utility/floor-plan-db.ts";
import {pdfToPageImages} from "../../../../utility/file-extract-utils.ts";
import type {FloorPlanImage} from "../../../../utility/floor-plan-db.ts";
import type {FloorPlanCardProps} from "./floorPlanCard.type.ts";

const fileToBase64 = (file: File): Promise<string> =>
    new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve((reader.result as string).split(',')[1]);
        reader.onerror = reject;
        reader.readAsDataURL(file);
    });

const fileToArrayBuffer = (file: File): Promise<ArrayBuffer> =>
    new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as ArrayBuffer);
        reader.onerror = reject;
        reader.readAsArrayBuffer(file);
    });

export const FloorPlanCard: FC<FloorPlanCardProps> = ({buildingId, onSelectImage, activeFileId}) => {
    const {t} = useTranslation();
    const [images, setImages] = useState<FloorPlanImage[]>([]);
    const [loading, setLoading] = useState(true);
    const [uploading, setUploading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const loadImages = () => {
        floorPlanDB.getAllForBuilding(buildingId).then(results => {
            setImages(results);
            setLoading(false);
        });
    };

    // eslint-disable-next-line react-hooks/exhaustive-deps
    useEffect(() => { loadImages(); }, [buildingId]);

    const handleUpload = async (files: FileList) => {
        setUploading(true);
        for (let i = 0; i < files.length; i++) {
            const file = files[i];
            const ext = file.name.split('.').pop()?.toLowerCase() ?? '';

            if (ext === 'pdf') {
                const arrayBuffer = await fileToArrayBuffer(file);
                const pageImages = await pdfToPageImages(arrayBuffer, file.name);
                for (const page of pageImages) {
                    const fileId = `fp-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
                    await floorPlanDB.save(buildingId, fileId, {
                        name: page.name,
                        mimeType: page.mimeType,
                        base64: page.base64,
                    });
                }
            } else if (['png', 'jpg', 'jpeg', 'gif', 'webp'].includes(ext)) {
                const base64 = await fileToBase64(file);
                const fileId = `fp-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
                await floorPlanDB.save(buildingId, fileId, {
                    name: file.name,
                    mimeType: file.type || `image/${ext}`,
                    base64,
                });
            }
        }
        setUploading(false);
        loadImages();
    };

    const handleDelete = async (fileId: string) => {
        await floorPlanDB.delete(fileId);
        loadImages();
    };

    return (
        <div className="border border-border-light rounded-xl bg-surface-card overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-border-light bg-surface-page">
                <div className="flex items-center gap-2">
                    <MapIcon className="h-5 w-5 text-primary-600"/>
                    <h4 className="text-sm font-bold text-text-primary">{t('floorPlan.card_title')}</h4>
                    {images.length > 0 && (
                        <span className="text-xs text-text-muted">({images.length})</span>
                    )}
                </div>
                <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={uploading}
                    className="flex items-center gap-1.5 text-xs font-medium text-primary-600 hover:text-primary-800 min-h-[36px] disabled:opacity-40"
                >
                    <ArrowUpTrayIcon className="h-4 w-4"/>
                    {uploading ? t('floorPlan.uploading') : t('floorPlan.upload_file')}
                </button>
                <input
                    ref={fileInputRef}
                    type="file"
                    multiple
                    accept=".png,.jpg,.jpeg,.gif,.webp,.pdf"
                    className="hidden"
                    onChange={(e) => {
                        if (e.target.files && e.target.files.length > 0) {
                            void handleUpload(e.target.files);
                        }
                        e.target.value = '';
                    }}
                />
            </div>

            {/* Body */}
            {loading ? (
                <div className="p-6 text-center">
                    <div className="animate-spin h-6 w-6 border-2 border-primary-500 border-t-transparent rounded-full mx-auto"/>
                </div>
            ) : images.length === 0 ? (
                <div
                    className="p-6 text-center cursor-pointer hover:bg-surface-hover transition-colors"
                    onClick={() => fileInputRef.current?.click()}
                >
                    <MapIcon className="h-10 w-10 text-text-disabled mx-auto mb-2"/>
                    <p className="text-sm text-text-muted">{t('floorPlan.empty_hint')}</p>
                </div>
            ) : (
                <div className="flex gap-2 p-3 overflow-x-auto">
                    {images.map(img => {
                        const isActive = activeFileId === img.fileId;
                        return (
                            <div
                                key={img.fileId}
                                className={`relative shrink-0 rounded-lg border-2 overflow-hidden cursor-pointer transition-all ${
                                    isActive
                                        ? 'border-primary-500 ring-2 ring-primary-200'
                                        : 'border-border-light hover:border-primary-300'
                                }`}
                                style={{width: '140px'}}
                            >
                                <button
                                    type="button"
                                    onClick={() => onSelectImage(img)}
                                    className="w-full aspect-[4/3] block"
                                >
                                    <img
                                        src={`data:${img.mimeType};base64,${img.base64}`}
                                        alt={img.name}
                                        className="w-full h-full object-contain bg-slate-50"
                                    />
                                </button>
                                <div className="flex items-center justify-between px-2 py-1 bg-surface-page border-t border-border-light">
                                    <p className="text-[10px] text-text-muted truncate flex-1">{img.name}</p>
                                    <button
                                        type="button"
                                        onClick={(e) => { e.stopPropagation(); void handleDelete(img.fileId); }}
                                        className="p-0.5 text-text-disabled hover:text-error transition-colors shrink-0"
                                        aria-label={t('common.delete')}
                                    >
                                        <TrashIcon className="h-3.5 w-3.5"/>
                                    </button>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
};

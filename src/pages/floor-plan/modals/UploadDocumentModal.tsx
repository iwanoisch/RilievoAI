import {FC} from "react";
import {useTranslation} from "react-i18next";
import {ArrowUpTrayIcon, XMarkIcon} from "@heroicons/react/24/solid";
import type {UploadDocumentModalProps} from "./uploadDocumentModal.type.ts";

export const UploadDocumentModal: FC<UploadDocumentModalProps> = ({
    isProcessing, isDragging, onFileSelect, onDragOver, onDragLeave, onDrop, onClose,
}) => {
    const {t} = useTranslation();

    return (
        <div className="fixed inset-0 z-50 flex flex-col bg-white dark:bg-slate-900">
            <div className="flex items-center justify-between px-6 py-4 border-b border-border-light">
                <h2 className="text-lg font-semibold text-text-primary">{t('floorPlan.upload_new')}</h2>
                <button
                    onClick={onClose}
                    className="btn btn-ghost p-2 min-h-[44px] min-w-[44px]"
                    aria-label={t('common.close')}
                >
                    <XMarkIcon className="h-6 w-6"/>
                </button>
            </div>

            <div className="flex-1 flex items-center justify-center p-6">
                {isProcessing ? (
                    <div className="text-center">
                        <div className="relative h-16 w-16 mx-auto mb-4">
                            <div className="absolute inset-0 rounded-full border-4 border-primary-100"/>
                            <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-primary-500 motion-safe:animate-spin"/>
                        </div>
                        <p className="text-base font-medium text-text-secondary">{t('floorPlan.processing_pdf')}</p>
                        <p className="text-sm text-text-muted mt-2">{t('loading')}</p>
                    </div>
                ) : (
                    <div
                        className={`w-full max-w-lg card text-center cursor-pointer transition-colors border-2 border-dashed py-16
                            ${isDragging
                            ? 'border-primary-500 bg-primary-50/50'
                            : 'border-border-light hover:border-primary-300 hover:bg-primary-50/20'
                        }`}
                        onDragOver={onDragOver}
                        onDragLeave={onDragLeave}
                        onDrop={onDrop}
                        onClick={onFileSelect}
                        role="button"
                        tabIndex={0}
                        onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onFileSelect(); } }}
                    >
                        <ArrowUpTrayIcon className={`h-16 w-16 mx-auto mb-4 transition-colors ${isDragging ? 'text-primary-500' : 'text-slate-400'}`}/>
                        <h3 className="text-lg font-semibold text-text-secondary mb-2">{t('floorPlan.upload_new')}</h3>
                        <p className="text-sm text-text-muted mb-4">{t('floorPlan.upload_instructions')}</p>
                        <p className="text-sm text-text-muted mb-6">{t('floorPlan.drop_hint')}</p>
                        <button
                            onClick={(e) => { e.stopPropagation(); onFileSelect(); }}
                            className="btn btn-primary"
                        >
                            {t('floorPlan.select_file')}
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

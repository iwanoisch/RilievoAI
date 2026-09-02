import {FC, useRef, useState} from "react";
import {useTranslation} from "react-i18next";
import {useParams} from "react-router-dom";
import {
    ArrowUpTrayIcon,
    DocumentTextIcon,
    SparklesIcon,
    TrashIcon,
    ExclamationTriangleIcon,
    InformationCircleIcon,
    XCircleIcon,
    CheckCircleIcon,
} from "@heroicons/react/24/outline";
import {useAi} from "../../../features/ai/useAi.ts";
import {useAlert} from "../../../common/alert/useAlert.ts";
import {formatFileSize} from "../../../utility/arazio-utils.ts";
import type {AiAnnotation, AiExtractedFile} from "../../../features/ai/ai.type.ts";
import type {SkippedFile} from "../../../utility/file-extract-utils.ts";

export const DocumentazioneTab: FC = () => {
    const {t} = useTranslation();
    const {id: buildingId} = useParams<{id: string}>();
    const ai = useAi();
    const {showAlert} = useAlert();

    const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
    const [extractedFiles, setExtractedFiles] = useState<AiExtractedFile[]>([]);
    const [skippedFiles, setSkippedFiles] = useState<SkippedFile[]>([]);
    const [totalSizeMb, setTotalSizeMb] = useState(0);
    const [userPrompt, setUserPrompt] = useState('');
    const [isDragging, setIsDragging] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    if (!buildingId) return null;

    const handleFilesAdded = async (files: File[]) => {
        setUploadedFiles(prev => [...prev, ...files]);
        const result = await ai.extractFiles(files);
        setExtractedFiles(prev => [...prev, ...result.files]);
        setSkippedFiles(prev => [...prev, ...result.skipped]);
        setTotalSizeMb(prev => prev + result.totalSizeMb);

        if (result.skipped.length > 0) {
            showAlert({
                title: t('doc.files_skipped', {count: result.skipped.length}),
                type: 'warning',
                message: result.skipped.map(s => `${s.name}: ${t(`doc.skip_${s.reason}`)}`).join(', '),
            });
        }
    };

    const handleRemoveFile = (index: number) => {
        const file = uploadedFiles[index];
        setUploadedFiles(prev => prev.filter((_, i) => i !== index));
        setExtractedFiles(prev => prev.filter(ef => ef.name !== file.name));
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
        if (e.dataTransfer.files.length > 0) {
            void handleFilesAdded(Array.from(e.dataTransfer.files));
        }
    };

    const handleAnalyze = async () => {
        if (extractedFiles.length === 0) {
            showAlert({title: t('doc.no_files'), type: 'warning', message: ''});
            return;
        }

        const result = await ai.analyzeBulk(buildingId, extractedFiles, userPrompt);
        if (result) {
            showAlert({title: t('doc.analysis_complete'), type: 'success', message: ''});
        } else {
            showAlert({title: t('doc.analysis_error'), type: 'error', message: ai.error ?? ''});
        }
    };

    const annotationIcon = (type: AiAnnotation['type']) => {
        switch (type) {
            case 'missing': return <XCircleIcon className="h-5 w-5 text-error shrink-0"/>;
            case 'warning': return <ExclamationTriangleIcon className="h-5 w-5 text-warning-dark shrink-0"/>;
            case 'info': return <InformationCircleIcon className="h-5 w-5 text-info shrink-0"/>;
            case 'conflict': return <ExclamationTriangleIcon className="h-5 w-5 text-error shrink-0"/>;
        }
    };

    const annotationStyle = (type: AiAnnotation['type']) => {
        switch (type) {
            case 'missing': return 'border-error/20 bg-error-light/30';
            case 'warning': return 'border-warning/20 bg-warning-light/30';
            case 'info': return 'border-info/20 bg-info-light/30';
            case 'conflict': return 'border-error/20 bg-error-light/30';
        }
    };

    return (
        <div className="card mt-4 p-0 overflow-hidden">
            <div className="p-4 sm:p-6 space-y-6">

                {/* Header */}
                <div className="flex items-center gap-3">
                    <span className="flex items-center justify-center h-10 w-10 rounded-xl bg-primary-100 text-primary-600">
                        <DocumentTextIcon className="h-5 w-5"/>
                    </span>
                    <div>
                        <h3 className="text-lg font-bold text-text-primary">{t('doc.title')}</h3>
                        <p className="text-sm text-text-muted">{t('doc.subtitle')}</p>
                    </div>
                </div>

                {/* Upload area */}
                <div
                    className={`relative rounded-xl border-2 border-dashed p-8 text-center transition-colors ${
                        isDragging
                            ? 'border-primary-400 bg-primary-50/50'
                            : 'border-border-strong bg-surface-page/50 hover:border-primary-300'
                    }`}
                    onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                    onDragLeave={() => setIsDragging(false)}
                    onDrop={handleDrop}
                >
                    <ArrowUpTrayIcon className="h-10 w-10 text-text-disabled mx-auto mb-3"/>
                    <p className="text-sm font-medium text-text-primary mb-1">{t('doc.drop_files')}</p>
                    <p className="text-xs text-text-muted mb-4">{t('doc.drop_hint')}</p>
                    <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="btn btn-outline min-h-[44px]"
                    >
                        {t('doc.browse_files')}
                    </button>
                    <input
                        ref={fileInputRef}
                        type="file"
                        multiple
                        accept=".zip,.pdf,.png,.jpg,.jpeg,.gif,.webp,.doc,.docx,.xls,.xlsx,.txt,.csv"
                        className="hidden"
                        onChange={(e) => {
                            if (e.target.files) void handleFilesAdded(Array.from(e.target.files));
                            e.target.value = '';
                        }}
                    />
                </div>

                {/* File list */}
                {uploadedFiles.length > 0 && (
                    <div>
                        <div className="flex items-center justify-between mb-3">
                            <h4 className="text-xs font-semibold text-text-muted uppercase tracking-wider">
                                {t('doc.uploaded_files')} ({extractedFiles.length})
                            </h4>
                            <span className="text-xs text-text-muted">{totalSizeMb} MB</span>
                        </div>
                        {skippedFiles.length > 0 && (
                            <div className="flex items-start gap-2 rounded-lg border border-warning/20 bg-warning-light/30 p-3 mb-3">
                                <ExclamationTriangleIcon className="h-5 w-5 text-warning-dark shrink-0"/>
                                <div>
                                    <p className="text-xs font-semibold text-warning-dark mb-1">{t('doc.files_skipped', {count: skippedFiles.length})}</p>
                                    <ul className="text-xs text-text-secondary space-y-0.5">
                                        {skippedFiles.map((sf, i) => (
                                            <li key={i}>{sf.name} — {t(`doc.skip_${sf.reason}`)} {sf.sizeMb ? `(${sf.sizeMb} MB)` : ''}</li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        )}
                        <ul className="space-y-1.5 max-h-48 overflow-y-auto">
                            {uploadedFiles.map((file, idx) => (
                                <li key={`${file.name}-${idx}`} className="flex items-center gap-3 text-sm bg-surface-page rounded-lg border border-border-light px-3 py-2">
                                    <DocumentTextIcon className="h-5 w-5 text-primary-500 shrink-0"/>
                                    <div className="flex-1 min-w-0">
                                        <span className="block truncate text-text-primary font-medium">{file.name}</span>
                                        <span className="text-xs text-text-muted">{formatFileSize(file.size)}</span>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => handleRemoveFile(idx)}
                                        className="p-1 rounded text-text-disabled hover:text-error hover:bg-error-light transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center"
                                        aria-label={t('common.delete')}
                                    >
                                        <TrashIcon className="h-5 w-5"/>
                                    </button>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}

                {/* Prompt utente */}
                <div>
                    <label htmlFor="doc-user-prompt" className="block text-xs font-semibold text-text-muted uppercase tracking-wider mb-2">
                        {t('doc.prompt_label')}
                    </label>
                    <textarea
                        id="doc-user-prompt"
                        name="doc-user-prompt"
                        className="input w-full text-sm min-h-[100px] resize-y"
                        placeholder={t('doc.prompt_placeholder')}
                        value={userPrompt}
                        onChange={(e) => setUserPrompt(e.target.value)}
                    />
                    <p className="text-xs text-text-muted mt-1">{t('doc.prompt_hint')}</p>
                </div>

                {/* Bottone analisi */}
                <div className="flex items-center gap-3">
                    <button
                        type="button"
                        onClick={() => void handleAnalyze()}
                        disabled={ai.status === 'analyzing' || ai.status === 'extracting' || extractedFiles.length === 0}
                        className="btn btn-primary flex items-center gap-2 min-h-[44px]"
                    >
                        <SparklesIcon className={`h-5 w-5 ${ai.status === 'analyzing' ? 'animate-spin' : ''}`}/>
                        {ai.status === 'analyzing' ? t('doc.analyzing') : t('doc.analyze_button')}
                    </button>
                    {ai.status === 'done' && (
                        <div className="flex items-center gap-2 text-sm text-success-dark">
                            <CheckCircleIcon className="h-5 w-5"/>
                            {t('doc.sections_filled', {count: ai.sectionsProcessed})}
                        </div>
                    )}
                </div>

                {/* Annotazioni AI */}
                {ai.annotations.length > 0 && (
                    <div>
                        <h4 className="text-xs font-semibold text-text-muted uppercase tracking-wider mb-3">
                            {t('doc.ai_notes')} ({ai.annotations.length})
                        </h4>
                        <div className="space-y-2 max-h-80 overflow-y-auto">
                            {ai.annotations.map((note, idx) => (
                                <div
                                    key={idx}
                                    className={`flex items-start gap-3 rounded-lg border p-3 ${annotationStyle(note.type)}`}
                                >
                                    {annotationIcon(note.type)}
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2 mb-0.5">
                                            <span className="text-xs font-semibold text-text-secondary uppercase">{note.section}</span>
                                            {note.field && (
                                                <span className="text-xs text-text-muted">{note.field}</span>
                                            )}
                                        </div>
                                        <p className="text-sm text-text-primary">{note.message}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

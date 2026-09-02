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
    StopIcon,
    ArchiveBoxIcon,
} from "@heroicons/react/24/outline";
import {useAi} from "../../../features/ai/useAi.ts";
import {useArazio} from "../../../features/arazio/useArazio.ts";
import {ARAZIO_SECTIONS} from "../../../constants/arazio-sections.constant.ts";
import {useAlert} from "../../../common/alert/useAlert.ts";
import type {AiAnnotation, AiExtractedFile} from "../../../features/ai/ai.type.ts";
import type {SkippedFile} from "../../../utility/file-extract-utils.ts";

export const DocumentazioneTab: FC = () => {
    const {t} = useTranslation();
    const {id: buildingId} = useParams<{id: string}>();
    const ai = useAi();
    const arazio = useArazio();
    const {showAlert} = useAlert();

    const [extractedFiles, setExtractedFiles] = useState<AiExtractedFile[]>([]);
    const [skippedFiles, setSkippedFiles] = useState<SkippedFile[]>([]);
    const [totalSizeMb, setTotalSizeMb] = useState(0);
    const [isDragging, setIsDragging] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    if (!buildingId) return null;

    const isExtracting = ai.status === 'extracting';
    const isAnalyzing = ai.status === 'analyzing';
    const isBusy = isExtracting || isAnalyzing;
    const activeFiles = ai.uploadedFiles.filter(f => !f.archived);
    const archivedFiles = ai.uploadedFiles.filter(f => f.archived);

    const handleFilesAdded = async (files: File[]) => {
        const result = await ai.extractFiles(files);

        if (result.files.length === 0 && result.skipped.length === 0 && ai.error) {
            showAlert({title: t('doc.extraction_error'), type: 'error', message: ai.error});
            return;
        }

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
        ai.removeFile(index);
        setExtractedFiles(prev => prev.filter((_, i) => i !== index));
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
            if (activeFiles.length > 0) {
                showAlert({title: t('doc.reload_files'), type: 'warning', message: t('doc.reload_files_hint')});
            } else {
                showAlert({title: t('doc.no_files'), type: 'warning', message: ''});
            }
            return;
        }

        const result = await ai.analyzeBulk(buildingId, extractedFiles, ai.userPrompt);
        if (result) {
            showAlert({title: t('doc.analysis_complete'), type: 'success', message: ''});
        } else if (ai.error) {
            showAlert({title: t('doc.analysis_error'), type: 'error', message: ai.error});
        }
    };

    const handleArchive = () => {
        ai.archiveCurrentSession();
        ai.resetStatus();
        setExtractedFiles([]);
        setSkippedFiles([]);
        setTotalSizeMb(0);
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
                        isBusy ? 'opacity-40 pointer-events-none' :
                        isDragging ? 'border-primary-400 bg-primary-50/50' :
                        'border-border-strong bg-surface-page/50 hover:border-primary-300'
                    }`}
                    onDragOver={(e) => { if (!isBusy) { e.preventDefault(); setIsDragging(true); } }}
                    onDragLeave={() => setIsDragging(false)}
                    onDrop={isBusy ? undefined : handleDrop}
                >
                    {isExtracting ? (
                        <>
                            <div className="relative h-10 w-10 mx-auto mb-3">
                                <svg className="h-10 w-10 text-primary-500 animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                                </svg>
                                <span className="absolute inset-0 flex items-center justify-center text-xs font-bold text-primary-700">
                                    {ai.extractionProgress}%
                                </span>
                            </div>
                            <p className="text-sm font-medium text-primary-700 mb-1">
                                {t('doc.extracting')} {ai.extractionProgress}%
                            </p>
                            {ai.extractionFileName && (
                                <p className="text-xs text-text-muted truncate max-w-xs mx-auto mb-1">{ai.extractionFileName}</p>
                            )}
                            <p className="text-xs text-text-muted">{t('doc.extracting_hint')}</p>
                        </>
                    ) : (
                        <>
                            <ArrowUpTrayIcon className="h-10 w-10 text-text-disabled mx-auto mb-3"/>
                            <p className="text-sm font-medium text-text-primary mb-1">{t('doc.drop_files')}</p>
                            <p className="text-xs text-text-muted mb-4">{t('doc.drop_hint')}</p>
                            <button
                                type="button"
                                onClick={() => fileInputRef.current?.click()}
                                disabled={isBusy}
                                className="btn btn-outline min-h-[44px]"
                            >
                                {t('doc.browse_files')}
                            </button>
                        </>
                    )}
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

                {/* File attivi */}
                {activeFiles.length > 0 && (
                    <div className={isAnalyzing ? 'opacity-40 pointer-events-none' : ''}>
                        <div className="flex items-center justify-between mb-3">
                            <h4 className="text-xs font-semibold text-text-muted uppercase tracking-wider">
                                {t('doc.uploaded_files')} ({activeFiles.length})
                            </h4>
                            <div className="flex items-center gap-3">
                                <span className="text-xs text-text-muted">{Math.round(activeFiles.reduce((sum, f) => sum + f.sizeMb, 0) * 10) / 10} MB</span>
                                <button
                                    type="button"
                                    onClick={handleArchive}
                                    disabled={isAnalyzing}
                                    className="inline-flex items-center gap-1.5 text-xs font-medium text-primary-700 hover:text-primary-800 min-h-[44px] disabled:opacity-40"
                                >
                                    <ArchiveBoxIcon className="h-4 w-4"/>
                                    {t('doc.archive_files')}
                                </button>
                            </div>
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
                            {activeFiles.map((file, idx) => (
                                <li key={`${file.name}-${idx}`} className="flex items-center gap-3 text-sm bg-surface-page rounded-lg border border-border-light px-3 py-2">
                                    <DocumentTextIcon className="h-5 w-5 text-primary-500 shrink-0"/>
                                    <div className="flex-1 min-w-0">
                                        <span className="block truncate text-text-primary font-medium">{file.name}</span>
                                        <span className="text-xs text-text-muted">{file.sizeMb} MB</span>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => handleRemoveFile(ai.uploadedFiles.indexOf(file))}
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

                {/* File archiviati per sessione */}
                {ai.sessions.length > 0 && (
                    <div>
                        <h4 className="text-xs font-semibold text-text-muted uppercase tracking-wider mb-3">
                            {t('doc.archived_files')} ({archivedFiles.length} {t('doc.files_in')} {ai.sessions.length} {t('doc.sessions_label')})
                        </h4>
                        <div className="space-y-2 max-h-60 overflow-y-auto">
                            {[...ai.sessions].reverse().map(session => {
                                const sessionFiles = archivedFiles.filter(f => f.sessionId === session.id);
                                if (sessionFiles.length === 0) return null;
                                const sessionDate = new Date(session.timestamp);
                                return (
                                    <details key={session.id} className="group rounded-lg border border-border-light bg-surface-page">
                                        <summary className="flex items-center gap-3 px-3 py-2 cursor-pointer select-none text-sm hover:bg-surface-hover rounded-lg">
                                            <ArchiveBoxIcon className="h-4 w-4 text-text-muted shrink-0"/>
                                            <div className="flex-1 min-w-0">
                                                <span className="font-medium text-text-primary">
                                                    {sessionDate.toLocaleDateString()} {sessionDate.toLocaleTimeString([], {hour: '2-digit', minute: '2-digit'})}
                                                </span>
                                                <span className="text-xs text-text-muted ml-2">
                                                    {sessionFiles.length} file — {session.sectionsProcessed} {t('doc.sections_short')}
                                                </span>
                                            </div>
                                            <svg className="h-4 w-4 text-text-muted transition-transform group-open:rotate-180" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5"/>
                                            </svg>
                                        </summary>
                                        <ul className="px-3 pb-2 space-y-1">
                                            {sessionFiles.map((file, idx) => (
                                                <li key={`${session.id}-${idx}`} className="flex items-center gap-2 text-xs text-text-muted py-1">
                                                    <DocumentTextIcon className="h-3.5 w-3.5 shrink-0"/>
                                                    <span className="truncate">{file.name}</span>
                                                    <span className="shrink-0">{file.sizeMb} MB</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </details>
                                );
                            })}
                        </div>
                    </div>
                )}

                {/* Prompt utente */}
                <div className={isAnalyzing ? 'opacity-40 pointer-events-none' : ''}>
                    <label htmlFor="doc-user-prompt" className="block text-xs font-semibold text-text-muted uppercase tracking-wider mb-2">
                        {t('doc.prompt_label')}
                    </label>
                    <textarea
                        id="doc-user-prompt"
                        name="doc-user-prompt"
                        className="input w-full text-sm min-h-[100px] resize-y"
                        placeholder={t('doc.prompt_placeholder')}
                        value={ai.userPrompt}
                        onChange={(e) => ai.updatePrompt(e.target.value)}
                    />
                    <p className="text-xs text-text-muted mt-1">{t('doc.prompt_hint')}</p>
                </div>

                {/* Bottoni analisi */}
                <div className="flex flex-wrap items-center gap-3">
                    <button
                        type="button"
                        onClick={() => void handleAnalyze()}
                        disabled={isAnalyzing || isExtracting || extractedFiles.length === 0}
                        className="btn btn-primary flex items-center gap-2 min-h-[44px]"
                    >
                        <SparklesIcon className={`h-5 w-5${isAnalyzing ? ' animate-spin' : ''}`}/>
                        {t('doc.analyze_button')}
                    </button>
                    {isAnalyzing && (
                        <>
                            <button
                                type="button"
                                onClick={() => ai.stopAnalysis()}
                                className="btn btn-ghost flex items-center gap-2 min-h-[44px] text-error"
                            >
                                <StopIcon className="h-5 w-5"/>
                                {t('doc.stop_analysis')}
                            </button>
                            {ai.totalBatches > 1 && (
                                <span className="text-sm text-text-muted animate-pulse">
                                    Batch {ai.currentBatch}/{ai.totalBatches}...
                                </span>
                            )}
                        </>
                    )}
                    {ai.hasFailedBatches && !isAnalyzing && (
                        <button
                            type="button"
                            onClick={() => void ai.retryFailedBatches()}
                            className="btn btn-outline flex items-center gap-2 min-h-[44px] text-warning-dark border-warning"
                        >
                            <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182M2.985 19.644l3.181-3.183"/>
                            </svg>
                            {t('doc.retry_failed', {count: ai.failedBatches})}
                        </button>
                    )}
                    {ai.status === 'done' && ai.sectionsProcessed > 0 && (
                        <div className="flex items-center gap-2 text-sm text-success-dark">
                            <CheckCircleIcon className="h-5 w-5"/>
                            {t('doc.sections_filled', {count: ai.sectionsProcessed})}
                        </div>
                    )}
                    {ai.status === 'error' && ai.error && (
                        <div className="flex items-center gap-2">
                            <button
                                type="button"
                                onClick={() => ai.resetStatus()}
                                className="p-1.5 rounded-full text-error bg-error-light hover:bg-error/20 transition-colors min-h-[36px] min-w-[36px] flex items-center justify-center shrink-0"
                                aria-label="Chiudi errore"
                            >
                                <XCircleIcon className="h-5 w-5"/>
                            </button>
                            <p className="text-sm text-error max-w-md">{ai.error}</p>
                        </div>
                    )}
                </div>

                {/* Dati estratti dall'AI */}
                {buildingId && (() => {
                    const filledSections = ARAZIO_SECTIONS.map(config => {
                        const sectionData = arazio.sections.find(
                            s => s.sectionId === config.id && s.buildingId === buildingId
                        );
                        if (!sectionData) return null;
                        const entries = Object.entries(sectionData.values).filter(([, v]) => v && v.trim() !== '');
                        if (entries.length === 0) return null;
                        return {label: config.label, id: config.id, entries};
                    }).filter(Boolean);

                    if (filledSections.length === 0) return null;

                    return (
                        <div>
                            <h4 className="text-xs font-semibold text-text-muted uppercase tracking-wider mb-3">
                                {t('doc.extracted_data')} ({filledSections.length} {t('doc.sections_short')})
                            </h4>
                            <div className="space-y-2 max-h-96 overflow-y-auto">
                                {filledSections.map(section => section && (
                                    <details key={section.id} className="group rounded-lg border border-border-light bg-surface-page">
                                        <summary className="flex items-center gap-3 px-3 py-2 cursor-pointer select-none text-sm hover:bg-surface-hover rounded-lg">
                                            <CheckCircleIcon className="h-4 w-4 text-success shrink-0"/>
                                            <span className="font-medium text-text-primary flex-1">{section.label}</span>
                                            <span className="text-xs text-text-muted">{section.entries.length} {t('doc.fields_filled')}</span>
                                            <svg className="h-4 w-4 text-text-muted transition-transform group-open:rotate-180" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5"/>
                                            </svg>
                                        </summary>
                                        <div className="px-3 pb-3 space-y-1.5">
                                            {section.entries.map(([key, value]) => (
                                                <div key={key} className="flex gap-2 text-xs">
                                                    <span className="text-text-muted shrink-0 min-w-[120px]">{key.replace(/_/g, ' ')}</span>
                                                    <span className="text-text-primary break-words">{value}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </details>
                                ))}
                            </div>
                        </div>
                    );
                })()}

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

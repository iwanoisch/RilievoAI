import {FC, useCallback, useMemo, useRef, useState} from "react";
import {useNavigate} from "react-router-dom";
import {PageTitle} from "../../common/page-title/PageTitle.tsx";
import {useFloorPlan} from "../../features/floorPlan/hooks/useFloorPlan.ts";
import {NameDocumentModal} from "./modals/NameDocumentModal.tsx";
import {UploadDocumentModal} from "./modals/UploadDocumentModal.tsx";
import {ConfirmDeleteModal} from "./modals/ConfirmDeleteModal.tsx";
import {usePdfToImage} from "../../hooks/usePdfToImage.ts";
import {useTranslation} from "react-i18next";
import {useAlert} from "../../common/alert/useAlert.ts";
import {ArrowUpTrayIcon, MagnifyingGlassIcon, TrashIcon} from "@heroicons/react/24/solid";
import type {FloorPlanDocument, FloorPlanPage} from "../../features/floorPlan/slice/floorPlan.type.ts";
import type {PendingUpload} from "./floorPlan.type.ts";
import {ACCEPTED_FLOOR_PLAN_FORMATS} from "../../constants/file-formats.constant.ts";
import {getFileType} from "../../utility/file-utils.ts";

export const FloorPlan: FC = () => {
    const {t} = useTranslation();
    const {showAlert} = useAlert();
    const navigate = useNavigate();
    const {
        documents,
        addDocument, deleteDocument, deleteAllDocuments, deleteDocumentsBatch,
        selectDocument,
    } = useFloorPlan();
    const {isProcessing, convertPdfToPages} = usePdfToImage();
    const fileInputRef = useRef<HTMLInputElement>(null);

    const [isDragging, setIsDragging] = useState(false);
    const [pendingUpload, setPendingUpload] = useState<PendingUpload | null>(null);
    const [showUploadModal, setShowUploadModal] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
    const [confirmDelete, setConfirmDelete] = useState<{type: 'all' | 'selected' | 'single'; documentId?: string} | null>(null);

    const filteredDocuments = useMemo(() => {
        if (!searchQuery.trim()) return documents;
        const q = searchQuery.toLowerCase();
        return documents.filter(d => d.name.toLowerCase().includes(q));
    }, [documents, searchQuery]);

    const acceptedTypes = useMemo(() => {
        return ACCEPTED_FLOOR_PLAN_FORMATS.split(',').map(f => f.trim());
    }, []);

    const isFileAccepted = useCallback((file: File) => {
        return acceptedTypes.some(type => {
            if (type.startsWith('.')) return file.name.toLowerCase().endsWith(type);
            return file.type === type;
        });
    }, [acceptedTypes]);

    const processFile = useCallback(async (file: File) => {
        if (!isFileAccepted(file)) {
            showAlert({title: t('floorPlan.invalid_format'), type: 'error', message: ''});
            return;
        }

        const defaultName = file.name.replace(/\.[^/.]+$/, '');
        const fileType = getFileType(file);

        if (file.type === 'application/pdf') {
            const pdfPages = await convertPdfToPages(file);
            if (pdfPages.length === 0) {
                showAlert({title: t('floorPlan.pdf_error'), type: 'error', message: ''});
                return;
            }

            const pages: FloorPlanPage[] = pdfPages.map(page => ({
                id: crypto.randomUUID(),
                pageNumber: page.pageNumber,
                imagePath: page.imageSrc,
                photoMarkers: [],
            }));

            setShowUploadModal(false);
            setPendingUpload({pages, defaultName, fileType});
        } else {
            const imageSrc = URL.createObjectURL(file);
            const pages: FloorPlanPage[] = [{
                id: crypto.randomUUID(),
                pageNumber: 1,
                imagePath: imageSrc,
                photoMarkers: [],
            }];

            setShowUploadModal(false);
            setPendingUpload({pages, defaultName, fileType});
        }
    }, [convertPdfToPages, showAlert, t, isFileAccepted]);

    const handleConfirmUpload = useCallback(async (name: string, buildingId: string | null) => {
        if (!pendingUpload) return;

        const nextId = documents.length > 0
            ? String(Math.max(...documents.map(d => Number(d.id) || 0)) + 1)
            : '1';

        const doc: FloorPlanDocument = {
            id: nextId,
            buildingId: buildingId ?? '',
            name,
            fileType: pendingUpload.fileType,
            createdAt: new Date().toISOString(),
            pages: pendingUpload.pages,
        };

        await addDocument(doc);
        setPendingUpload(null);
    }, [pendingUpload, addDocument, selectDocument, navigate]);

    const handleFileUpload = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        await processFile(file);
        if (fileInputRef.current) fileInputRef.current.value = '';
    }, [processFile]);

    const handleDragOver = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(true);
    }, []);

    const handleDragLeave = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);
    }, []);

    const handleDrop = useCallback(async (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);
        const file = e.dataTransfer.files?.[0];
        if (!file) return;
        await processFile(file);
    }, [processFile]);

    const toggleSelect = (id: string) => {
        setSelectedIds(prev => {
            const next = new Set(prev);
            if (next.has(id)) next.delete(id);
            else next.add(id);
            return next;
        });
    };

    const handleDeleteSelected = async () => {
        await deleteDocumentsBatch([...selectedIds]);
        setSelectedIds(new Set());
    };

    const handleDeleteAll = async () => {
        await deleteAllDocuments();
        setSelectedIds(new Set());
    };

    // --- Vista Lista ---
    return (
        <div className="w-full px-4 sm:px-6 lg:px-8 py-6 bg-gradient-to-br from-primary-50/50 via-primary-100/30 to-slate-50 min-h-screen">
            <div className="mx-auto w-full max-w-5xl">
                <div className="flex items-center justify-between">
                    <PageTitle title={t('floorPlan.title')} subtitle={t('floorPlan.subtitle')}/>
                    <button
                        onClick={() => setShowUploadModal(true)}
                        className="btn btn-primary flex items-center gap-2 min-h-[44px]"
                        aria-label={t('floorPlan.upload_new')}
                    >
                        <ArrowUpTrayIcon className="h-5 w-5"/>
                        <span className="hidden sm:inline">{t('floorPlan.upload')}</span>
                    </button>
                </div>

                {/* Toolbar: ricerca */}
                {documents.length > 0 && (
                    <div className="mt-4 card p-3">
                        <div className="relative">
                            <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-text-muted"/>
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={e => setSearchQuery(e.target.value)}
                                placeholder={t('floorPlan.search_placeholder')}
                                className="input w-full pl-9"
                            />
                        </div>
                    </div>
                )}

                {/* Header lista: seleziona tutto + azioni */}
                {documents.length > 0 && (
                    <div className="mt-3 flex items-center justify-between px-2">
                        <label className="flex items-center gap-2 cursor-pointer min-h-[44px]">
                            <input
                                type="checkbox"
                                checked={selectedIds.size === filteredDocuments.length && filteredDocuments.length > 0}
                                onChange={() => {
                                    if (selectedIds.size === filteredDocuments.length) {
                                        setSelectedIds(new Set());
                                    } else {
                                        setSelectedIds(new Set(filteredDocuments.map(d => d.id)));
                                    }
                                }}
                                className="h-5 w-5 rounded border-border-default text-primary-500 focus:ring-primary-500 cursor-pointer"
                            />
                            <span className="text-xs text-text-muted">
                                {selectedIds.size > 0
                                    ? t('floorPlan.selected_count', {count: selectedIds.size})
                                    : t('floorPlan.select_all')
                                }
                            </span>
                        </label>

                        {selectedIds.size > 0 && (
                            <button
                                onClick={() => setConfirmDelete({type: selectedIds.size === documents.length ? 'all' : 'selected'})}
                                className="btn btn-ghost text-error hover:bg-error-light text-xs flex items-center gap-1 min-h-[44px]"
                            >
                                <TrashIcon className="h-4 w-4"/>
                                <span>{selectedIds.size === documents.length ? t('floorPlan.delete_all') : t('floorPlan.delete_selected')}</span>
                            </button>
                        )}
                    </div>
                )}

                {/* Lista documenti */}
                {documents.length > 0 && (
                    <div className="mt-2 flex flex-col gap-3">
                        {filteredDocuments.map(doc => (
                            <div
                                key={doc.id}
                                className={`card flex items-center gap-4 transition-all min-h-[44px]
                                    ${selectedIds.has(doc.id) ? 'ring-2 ring-primary-500 border-primary-300' : 'hover:border-primary-300 hover:shadow-md'}
                                `}
                            >
                                <input
                                    type="checkbox"
                                    checked={selectedIds.has(doc.id)}
                                    onChange={() => toggleSelect(doc.id)}
                                    className="h-5 w-5 rounded border-border-default text-primary-500 focus:ring-primary-500 flex-shrink-0 cursor-pointer"
                                />

                                <button
                                    onClick={() => navigate(`/floor-plan/${doc.id}`)}
                                    className="flex items-center gap-4 flex-1 min-w-0 text-left"
                                >
                                    <div className="flex-shrink-0 w-14 h-14 rounded-lg overflow-hidden bg-slate-100 border border-border-light">
                                        <img src={doc.pages[0]?.imagePath} alt="" className="w-full h-full object-cover"/>
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <h3 className="text-sm font-semibold text-text-primary truncate">{doc.name}</h3>
                                        <div className="flex items-center gap-3 mt-1">
                                            <span className="badge badge-info text-xs uppercase">{doc.fileType}</span>
                                            <span className="text-xs text-text-muted">
                                                {t('floorPlan.pages_count', {count: doc.pages.length})}
                                            </span>
                                            <span className="text-xs text-text-muted">
                                                {new Date(doc.createdAt).toLocaleDateString()}
                                            </span>
                                        </div>
                                    </div>
                                </button>

                                <button
                                    onClick={() => setConfirmDelete({type: 'single', documentId: doc.id})}
                                    className="flex-shrink-0 p-2 rounded-lg text-text-muted hover:text-error hover:bg-error-light transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center"
                                    aria-label={t('common.delete')}
                                >
                                    <TrashIcon className="h-4 w-4"/>
                                </button>
                            </div>
                        ))}
                    </div>
                )}

                {/* Empty state */}
                {documents.length === 0 && !isProcessing && (
                    <div
                        className={`mt-10 card text-center cursor-pointer transition-colors border-2 border-dashed
                            ${isDragging
                            ? 'border-primary-500 bg-primary-50/50'
                            : 'border-border-light hover:border-primary-300 hover:bg-primary-50/20'
                        }`}
                        onDragOver={handleDragOver}
                        onDragLeave={handleDragLeave}
                        onDrop={handleDrop}
                        onClick={() => fileInputRef.current?.click()}
                        role="button"
                        tabIndex={0}
                        onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); fileInputRef.current?.click(); } }}
                        aria-label={t('floorPlan.upload')}
                    >
                        <ArrowUpTrayIcon className={`h-16 w-16 mx-auto mb-4 transition-colors ${isDragging ? 'text-primary-500' : 'text-slate-400'}`}/>
                        <h3 className="text-lg font-semibold text-text-secondary mb-2">{t('floorPlan.no_plans')}</h3>
                        <p className="text-sm text-text-muted mb-4">{t('floorPlan.upload_instructions')}</p>
                        <p className="text-sm text-text-muted mb-6">{t('floorPlan.drop_hint')}</p>
                        <button
                            onClick={(e) => { e.stopPropagation(); fileInputRef.current?.click(); }}
                            className="btn btn-primary"
                        >
                            {t('floorPlan.upload')}
                        </button>
                    </div>
                )}

                {/* Loader */}
                {isProcessing && (
                    <div className="mt-10 card text-center py-16">
                        <div className="flex flex-col items-center gap-4">
                            <div className="relative h-16 w-16">
                                <div className="absolute inset-0 rounded-full border-4 border-primary-100"/>
                                <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-primary-500 motion-safe:animate-spin"/>
                            </div>
                            <p className="text-base font-medium text-text-secondary">{t('floorPlan.processing_pdf')}</p>
                            <p className="text-sm text-text-muted">{t('loading')}</p>
                        </div>
                    </div>
                )}

                <input
                    ref={fileInputRef}
                    type="file"
                    accept={ACCEPTED_FLOOR_PLAN_FORMATS}
                    onChange={handleFileUpload}
                    className="hidden"
                    aria-hidden="true"
                />
            </div>

            {/* Modali */}
            {showUploadModal && (
                <UploadDocumentModal
                    isProcessing={isProcessing}
                    isDragging={isDragging}
                    onFileSelect={() => fileInputRef.current?.click()}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    onClose={() => setShowUploadModal(false)}
                />
            )}

            {pendingUpload && (
                <NameDocumentModal
                    defaultName={pendingUpload.defaultName}
                    onConfirm={handleConfirmUpload}
                    onClose={() => setPendingUpload(null)}
                />
            )}

            {confirmDelete?.type === 'all' && (
                <ConfirmDeleteModal
                    title={t('floorPlan.confirm_delete_all_title')}
                    message={t('floorPlan.confirm_delete_all_message')}
                    onConfirm={handleDeleteAll}
                    onClose={() => setConfirmDelete(null)}
                />
            )}
            {confirmDelete?.type === 'selected' && (
                <ConfirmDeleteModal
                    title={t('floorPlan.confirm_delete_selected_title')}
                    message={t('floorPlan.confirm_delete_selected_message')}
                    onConfirm={handleDeleteSelected}
                    onClose={() => setConfirmDelete(null)}
                />
            )}
            {confirmDelete?.type === 'single' && confirmDelete.documentId && (
                <ConfirmDeleteModal
                    title={t('floorPlan.confirm_delete_single_title')}
                    message={t('floorPlan.confirm_delete_single_message')}
                    onConfirm={() => deleteDocument(confirmDelete.documentId!)}
                    onClose={() => setConfirmDelete(null)}
                />
            )}
        </div>
    );
};

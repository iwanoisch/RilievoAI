import {FC, useState, useRef} from "react";
import {useTranslation} from "react-i18next";
import {
    ClipboardDocumentCheckIcon,
    ChevronRightIcon,
    PencilSquareIcon,
    CheckCircleIcon,
    ExclamationTriangleIcon,
    TrashIcon,
    PlusIcon,
    CameraIcon,
    MicrophoneIcon,
    ArrowsPointingOutIcon,
    ArrowUpTrayIcon,
    XMarkIcon,
} from "@heroicons/react/24/outline";
import {useRilievo} from "../../../features/rilievo/useRilievo.ts";
import {RILIEVO_CHECK_ICON, RILIEVO_STATUS_CONFIG, RILIEVO_TYPE_LABELS, RILIEVO_ALLOWED_CHILDREN} from "../../../constants/rilievo.constant.ts";
import {RilievoPhotoModal} from "./modals/RilievoPhotoModal.tsx";
import {RilievoAudioModal} from "./modals/RilievoAudioModal.tsx";
import {RilievoMeasurementModal} from "./modals/RilievoMeasurementModal.tsx";
import {RilievoEditPhotoModal} from "./modals/RilievoEditPhotoModal.tsx";
import {RilievoEditAudioModal} from "./modals/RilievoEditAudioModal.tsx";
import {RilievoEditMeasurementModal} from "./modals/RilievoEditMeasurementModal.tsx";
import type {RilievoItem, RilievoItemType, RilievoPhoto, RilievoAudio, RilievoMeasurement} from "../../../features/rilievo/rilievo.type.ts";

export const RilievoTab: FC = () => {
    const {t} = useTranslation();
    const {
        items, generated, generating, error, selectedItemId,
        regenerateFromAnagrafica, selectItem, toggleCheck, reset, deleteItem, addItem, updateItem,
        getChildren, getRoots, getCompletionPercent, totalCompletion,
        addPhoto, updatePhoto, deletePhoto, getPhotosForItem,
        addAudio, updateAudio, deleteAudio, getAudiosForItem,
        addMeasurement, updateMeasurement, deleteMeasurement, getMeasurementsForItem,
    } = useRilievo();

    const fileInputRef = useRef<HTMLInputElement>(null);

    const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set());
    const [addingChildFor, setAddingChildFor] = useState<string | null>(null);
    const [newItemLabel, setNewItemLabel] = useState('');
    const [newItemType, setNewItemType] = useState<RilievoItemType>('room');

    // Editing nodo inline
    const [editingNodeId, setEditingNodeId] = useState<string | null>(null);
    const [editingNodeLabel, setEditingNodeLabel] = useState('');

    const startEditNode = (item: RilievoItem) => {
        setEditingNodeId(item.id);
        setEditingNodeLabel(item.label);
    };

    const saveEditNode = () => {
        if (editingNodeId && editingNodeLabel.trim()) {
            updateItem(editingNodeId, {label: editingNodeLabel.trim()});
        }
        setEditingNodeId(null);
        setEditingNodeLabel('');
    };

    // Modali creazione
    const [showPhotoModal, setShowPhotoModal] = useState(false);
    const [showAudioModal, setShowAudioModal] = useState(false);
    const [showMeasurementModal, setShowMeasurementModal] = useState(false);

    // Modali editing
    const [editingPhoto, setEditingPhoto] = useState<RilievoPhoto | null>(null);
    const [editingAudio, setEditingAudio] = useState<RilievoAudio | null>(null);
    const [editingMeasurement, setEditingMeasurement] = useState<RilievoMeasurement | null>(null);

    const toggleExpand = (id: string) => {
        setExpandedIds(prev => {
            const next = new Set(prev);
            if (next.has(id)) next.delete(id);
            else next.add(id);
            return next;
        });
    };

    const handleAddChild = (parentId: string) => {
        if (!newItemLabel.trim()) return;
        const siblings = getChildren(parentId);
        addItem({
            id: `manual-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
            parentId,
            type: newItemType,
            label: newItemLabel.trim(),
            status: 'pending',
            checks: [],
            order: siblings.length,
        });
        setNewItemLabel('');
        setAddingChildFor(null);
        if (!expandedIds.has(parentId)) toggleExpand(parentId);
    };

    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (!files || !selectedItemId) return;
        for (let i = 0; i < files.length; i++) {
            const file = files[i];
            const reader = new FileReader();
            reader.onload = () => {
                const photo: RilievoPhoto = {
                    id: `photo-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
                    itemId: selectedItemId,
                    uri: reader.result as string,
                    timestamp: new Date().toISOString(),
                    note: file.name,
                };
                addPhoto(photo);
            };
            reader.readAsDataURL(file);
        }
        e.target.value = '';
    };

    // Stato vuoto
    if (!generated || items.length === 0) {
        return (
            <div className="card mt-4 p-0 overflow-hidden">
                <div className="p-4 sm:p-6 space-y-6">
                    <div className="flex items-center gap-3">
                        <span className="flex items-center justify-center h-10 w-10 rounded-xl bg-primary-100 text-primary-600">
                            <ClipboardDocumentCheckIcon className="h-5 w-5"/>
                        </span>
                        <div>
                            <h3 className="text-lg font-bold text-text-primary">{t('rilievo.title')}</h3>
                            <p className="text-sm text-text-muted">{t('rilievo.subtitle')}</p>
                        </div>
                    </div>

                    <div className="text-center py-12 space-y-4">
                        <ClipboardDocumentCheckIcon className="h-16 w-16 text-text-disabled mx-auto"/>
                        <p className="text-base font-medium text-text-primary">{t('rilievo.empty_title')}</p>
                        <p className="text-sm text-text-muted max-w-md mx-auto">{t('rilievo.empty_description')}</p>

                        {error && (
                            <div className="flex items-center gap-2 justify-center text-sm text-error">
                                <ExclamationTriangleIcon className="h-4 w-4"/>
                                <span>{error}</span>
                            </div>
                        )}

                        <button
                            type="button"
                            onClick={regenerateFromAnagrafica}
                            disabled={generating}
                            className="btn btn-primary flex items-center gap-2 min-h-[44px] mx-auto disabled:opacity-60"
                        >
                            {generating ? (
                                <>
                                    <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                                    </svg>
                                    {t('rilievo.generating')}
                                </>
                            ) : (
                                <>
                                    <ClipboardDocumentCheckIcon className="h-5 w-5"/>
                                    {t('rilievo.generate_btn')}
                                </>
                            )}
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    const roots = getRoots();
    const total = totalCompletion();
    const selectedItemData = selectedItemId ? items.find(i => i.id === selectedItemId) : null;

    const renderItem = (item: RilievoItem, depth: number = 0) => {
        const children = getChildren(item.id);
        const hasChildren = children.length > 0;
        const isExpanded = expandedIds.has(item.id);
        const isSelected = selectedItemId === item.id;
        const completion = getCompletionPercent(item.id);
        const statusCfg = RILIEVO_STATUS_CONFIG[item.status];
        const allowedTypes = (RILIEVO_ALLOWED_CHILDREN[item.type] || []) as RilievoItemType[];

        return (
            <div key={item.id}>
                <div
                    className={`flex items-center gap-2 px-3 py-2.5 cursor-pointer transition-colors ${
                        isSelected ? 'bg-primary-50 border-l-2 border-primary-500' : 'hover:bg-surface-hover border-l-2 border-transparent'
                    }`}
                    style={{paddingLeft: `${12 + depth * 20}px`}}
                    onClick={() => {
                        selectItem(isSelected ? null : item.id);
                        if (hasChildren && !isExpanded) toggleExpand(item.id);
                    }}
                >
                    {hasChildren ? (
                        <button
                            type="button"
                            className="p-0.5"
                            onClick={(e) => { e.stopPropagation(); toggleExpand(item.id); }}
                        >
                            <ChevronRightIcon className={`h-4 w-4 text-text-muted shrink-0 transition-transform ${isExpanded ? 'rotate-90' : ''}`}/>
                        </button>
                    ) : (
                        <span className="w-5 shrink-0"/>
                    )}

                    <span className={`h-2.5 w-2.5 rounded-full shrink-0 ${statusCfg.bg}`}/>

                    <div className="flex-1 min-w-0">
                        {editingNodeId === item.id ? (
                            <input
                                className="input text-sm py-0.5 w-full"
                                value={editingNodeLabel}
                                onChange={(e) => setEditingNodeLabel(e.target.value)}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter') saveEditNode();
                                    if (e.key === 'Escape') { setEditingNodeId(null); setEditingNodeLabel(''); }
                                }}
                                onBlur={saveEditNode}
                                onClick={(e) => e.stopPropagation()}
                                autoFocus
                            />
                        ) : (
                            <>
                                <span className={`text-sm font-medium truncate block ${isSelected ? 'text-primary-700' : 'text-text-primary'}`}>
                                    {item.label}
                                </span>
                                {item.detail && (
                                    <span className="text-xs text-text-muted truncate block">{item.detail}</span>
                                )}
                            </>
                        )}
                    </div>

                    <span className={`text-xs font-medium shrink-0 ${
                        completion === 100 ? 'text-success-dark' : completion > 0 ? 'text-warning-dark' : 'text-text-muted'
                    }`}>
                        {completion}%
                    </span>

                    {/* Modifica nome */}
                    <button
                        type="button"
                        className="p-1 rounded text-text-disabled hover:text-primary-600 hover:bg-primary-50 transition-colors min-h-[32px] min-w-[32px] flex items-center justify-center"
                        aria-label={t('rilievo.edit_node')}
                        onClick={(e) => {
                            e.stopPropagation();
                            startEditNode(item);
                        }}
                    >
                        <PencilSquareIcon className="h-3.5 w-3.5"/>
                    </button>

                    {allowedTypes.length > 0 && (
                        <button
                            type="button"
                            className="p-1 rounded text-text-disabled hover:text-primary-600 hover:bg-primary-50 transition-colors min-h-[32px] min-w-[32px] flex items-center justify-center"
                            aria-label={t('rilievo.add_child')}
                            onClick={(e) => {
                                e.stopPropagation();
                                setAddingChildFor(addingChildFor === item.id ? null : item.id);
                                setNewItemType(allowedTypes[0]);
                                setNewItemLabel('');
                            }}
                        >
                            <PlusIcon className="h-4 w-4"/>
                        </button>
                    )}

                    <button
                        type="button"
                        className="p-1 rounded text-text-disabled hover:text-error hover:bg-error-light transition-colors min-h-[32px] min-w-[32px] flex items-center justify-center"
                        aria-label={t('rilievo.delete_item')}
                        onClick={(e) => {
                            e.stopPropagation();
                            deleteItem(item.id);
                        }}
                    >
                        <TrashIcon className="h-3.5 w-3.5"/>
                    </button>
                </div>

                {addingChildFor === item.id && (
                    <div
                        className="flex items-center gap-2 px-3 py-2 bg-primary-50/50 border-l-2 border-primary-300"
                        style={{paddingLeft: `${32 + depth * 20}px`}}
                    >
                        <select
                            className="input text-xs py-1 w-28"
                            value={newItemType}
                            onChange={(e) => setNewItemType(e.target.value as RilievoItemType)}
                        >
                            {allowedTypes.map(typ => (
                                <option key={typ} value={typ}>{RILIEVO_TYPE_LABELS[typ]}</option>
                            ))}
                        </select>
                        <input
                            className="input text-sm py-1 flex-1"
                            placeholder={t('rilievo.name_placeholder')}
                            value={newItemLabel}
                            onChange={(e) => setNewItemLabel(e.target.value)}
                            onKeyDown={(e) => { if (e.key === 'Enter') handleAddChild(item.id); }}
                            autoFocus
                        />
                        <button
                            type="button"
                            className="btn btn-primary py-1 px-3 text-xs min-h-[32px]"
                            onClick={() => handleAddChild(item.id)}
                        >
                            {t('rilievo.btn_add')}
                        </button>
                        <button
                            type="button"
                            className="p-1 text-text-muted hover:text-text-primary"
                            onClick={() => setAddingChildFor(null)}
                        >
                            <XMarkIcon className="h-4 w-4"/>
                        </button>
                    </div>
                )}

                {hasChildren && isExpanded && (
                    <div>
                        {children.map(child => renderItem(child, depth + 1))}
                    </div>
                )}
            </div>
        );
    };

    const renderSelectedCard = () => {
        if (!selectedItemData) return null;

        const photos = getPhotosForItem(selectedItemData.id);
        const audios = getAudiosForItem(selectedItemData.id);
        const measurements = getMeasurementsForItem(selectedItemData.id);
        const statusCfg = RILIEVO_STATUS_CONFIG[selectedItemData.status];

        return (
            <div className="border border-border-default rounded-xl bg-surface-card p-4 space-y-4">
                {/* Header card */}
                <div className="flex items-center justify-between">
                    <div>
                        <h4 className="text-sm font-bold text-text-primary">{selectedItemData.label}</h4>
                        {selectedItemData.detail && (
                            <p className="text-xs text-text-muted mt-0.5">{selectedItemData.detail}</p>
                        )}
                    </div>
                    <span className={`badge ${statusCfg.bg === 'bg-success' ? 'badge-success' : statusCfg.bg === 'bg-warning' ? 'badge-warning' : statusCfg.bg === 'bg-info' ? 'badge-info' : ''}`}>
                        {t(statusCfg.label)}
                    </span>
                </div>

                {/* 4 bottoni azione */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-2">
                    <button
                        type="button"
                        className="btn btn-outline flex items-center justify-center gap-1.5 text-xs min-h-[40px]"
                        onClick={() => setShowPhotoModal(true)}
                    >
                        <CameraIcon className="h-4 w-4"/>
                        {t('rilievo.btn_capture')}
                    </button>
                    <button
                        type="button"
                        className="btn btn-outline flex items-center justify-center gap-1.5 text-xs min-h-[40px]"
                        onClick={() => fileInputRef.current?.click()}
                    >
                        <ArrowUpTrayIcon className="h-4 w-4"/>
                        {t('rilievo.btn_upload')}
                    </button>
                    <button
                        type="button"
                        className="btn btn-outline flex items-center justify-center gap-1.5 text-xs min-h-[40px]"
                        onClick={() => setShowAudioModal(true)}
                    >
                        <MicrophoneIcon className="h-4 w-4"/>
                        {t('rilievo.btn_audio')}
                    </button>
                    <button
                        type="button"
                        className="btn btn-outline flex items-center justify-center gap-1.5 text-xs min-h-[40px]"
                        onClick={() => setShowMeasurementModal(true)}
                    >
                        <ArrowsPointingOutIcon className="h-4 w-4"/>
                        {t('rilievo.btn_measure')}
                    </button>
                </div>

                <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    multiple
                    className="hidden"
                    onChange={handleFileUpload}
                />

                {/* Checklist */}
                {selectedItemData.checks.length > 0 && (
                    <div className="space-y-1.5">
                        <h5 className="text-xs font-semibold text-text-muted uppercase tracking-wider">{t('rilievo.checklist')}</h5>
                        {selectedItemData.checks.map(check => {
                            const Icon = RILIEVO_CHECK_ICON[check.type] || PencilSquareIcon;
                            return (
                                <div
                                    key={check.id}
                                    className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm cursor-pointer transition-colors ${
                                        check.done
                                            ? 'bg-success-light/30 text-success-dark'
                                            : 'bg-surface-page text-text-secondary hover:bg-surface-hover'
                                    }`}
                                    onClick={() => toggleCheck(selectedItemData.id, check.id)}
                                >
                                    <Icon className="h-4 w-4 shrink-0"/>
                                    <span className="flex-1">{check.label}</span>
                                    {check.value && <span className="text-xs font-semibold">{check.value}</span>}
                                    {check.done ? (
                                        <CheckCircleIcon className="h-4 w-4 text-success shrink-0"/>
                                    ) : (
                                        <span className="h-4 w-4 rounded-full border-2 border-border-strong shrink-0"/>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                )}

                {/* Foto associate */}
                {photos.length > 0 && (
                    <div className="space-y-1.5">
                        <h5 className="text-xs font-semibold text-text-muted uppercase tracking-wider">{t('rilievo.photos')} ({photos.length})</h5>
                        {photos.map(p => (
                            <div
                                key={p.id}
                                className="flex items-center gap-2 px-3 py-2 bg-surface-page rounded-lg text-sm cursor-pointer hover:bg-surface-hover transition-colors"
                                onClick={() => setEditingPhoto(p)}
                            >
                                {p.uri ? (
                                    <img src={p.uri} alt={p.note || 'Foto'} className="h-8 w-8 rounded object-cover shrink-0"/>
                                ) : (
                                    <CameraIcon className="h-4 w-4 text-primary-500 shrink-0"/>
                                )}
                                <span className="flex-1 text-text-primary truncate">{p.note || t('rilievo.photo_default')}</span>
                                <span className="text-xs text-text-muted">{new Date(p.timestamp).toLocaleTimeString()}</span>
                                <button
                                    type="button"
                                    onClick={(e) => { e.stopPropagation(); deletePhoto(p.id); }}
                                    className="p-1 text-text-disabled hover:text-error hover:bg-error-light rounded transition-colors min-h-[32px] min-w-[32px] flex items-center justify-center"
                                    aria-label={t('rilievo.modal_delete_photo')}
                                >
                                    <TrashIcon className="h-3.5 w-3.5"/>
                                </button>
                            </div>
                        ))}
                    </div>
                )}

                {/* Audio associati */}
                {audios.length > 0 && (
                    <div className="space-y-1.5">
                        <h5 className="text-xs font-semibold text-text-muted uppercase tracking-wider">{t('rilievo.audios')} ({audios.length})</h5>
                        {audios.map(a => (
                            <div
                                key={a.id}
                                className="flex items-center gap-2 px-3 py-2 bg-surface-page rounded-lg text-sm cursor-pointer hover:bg-surface-hover transition-colors"
                                onClick={() => setEditingAudio(a)}
                            >
                                <MicrophoneIcon className="h-4 w-4 text-primary-500 shrink-0"/>
                                <span className="flex-1 text-text-primary truncate">{a.transcription || t('rilievo.audio_default')}</span>
                                <span className="text-xs text-text-muted">{a.duration}s</span>
                                <span className="text-xs text-text-muted">{new Date(a.timestamp).toLocaleTimeString()}</span>
                                <button
                                    type="button"
                                    onClick={(e) => { e.stopPropagation(); deleteAudio(a.id); }}
                                    className="p-1 text-text-disabled hover:text-error hover:bg-error-light rounded transition-colors min-h-[32px] min-w-[32px] flex items-center justify-center"
                                    aria-label={t('rilievo.modal_delete_audio')}
                                >
                                    <TrashIcon className="h-3.5 w-3.5"/>
                                </button>
                            </div>
                        ))}
                    </div>
                )}

                {/* Misurazioni associate */}
                {measurements.length > 0 && (
                    <div className="space-y-1.5">
                        <h5 className="text-xs font-semibold text-text-muted uppercase tracking-wider">{t('rilievo.measurements')} ({measurements.length})</h5>
                        {measurements.map(m => (
                            <div
                                key={m.id}
                                className="flex items-center gap-2 px-3 py-2 bg-surface-page rounded-lg text-sm cursor-pointer hover:bg-surface-hover transition-colors"
                                onClick={() => setEditingMeasurement(m)}
                            >
                                <ArrowsPointingOutIcon className="h-4 w-4 text-primary-500 shrink-0"/>
                                <span className="flex-1 text-text-primary">{m.label}</span>
                                <span className="text-sm font-bold text-text-primary">{m.value} {m.unit}</span>
                                <button
                                    type="button"
                                    onClick={(e) => { e.stopPropagation(); deleteMeasurement(m.id); }}
                                    className="p-1 text-text-disabled hover:text-error hover:bg-error-light rounded transition-colors min-h-[32px] min-w-[32px] flex items-center justify-center"
                                    aria-label={t('rilievo.modal_delete_measurement')}
                                >
                                    <TrashIcon className="h-3.5 w-3.5"/>
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        );
    };

    return (
        <div className="card mt-4 p-0 overflow-hidden">
            <div className="p-4 sm:p-6 space-y-4">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <span className="flex items-center justify-center h-10 w-10 rounded-xl bg-primary-100 text-primary-600">
                            <ClipboardDocumentCheckIcon className="h-5 w-5"/>
                        </span>
                        <div>
                            <h3 className="text-lg font-bold text-text-primary">{t('rilievo.title')}</h3>
                            <p className="text-sm text-text-muted">{t('rilievo.subtitle')}</p>
                        </div>
                    </div>
                    <button
                        type="button"
                        onClick={reset}
                        className="btn btn-ghost p-2 min-h-[44px] min-w-[44px] text-text-muted hover:text-error"
                        aria-label={t('rilievo.reset')}
                    >
                        <TrashIcon className="h-4 w-4"/>
                    </button>
                </div>

                {/* Progress bar */}
                <div className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs">
                        <span className="text-text-muted font-medium">{t('rilievo.completion')}</span>
                        <span className={`font-bold ${total === 100 ? 'text-success-dark' : total > 0 ? 'text-warning-dark' : 'text-text-muted'}`}>
                            {total}%
                        </span>
                    </div>
                    <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
                        <div
                            className={`h-full rounded-full transition-all duration-500 ${
                                total === 100 ? 'bg-success' : total > 0 ? 'bg-warning' : 'bg-slate-300'
                            }`}
                            style={{width: `${total}%`}}
                        />
                    </div>
                </div>

                {/* Stats */}
                <div className="flex flex-wrap gap-4 text-xs">
                    {(['pending', 'in_progress', 'done', 'to_verify'] as const).map(status => {
                        const count = items.filter(i => i.status === status && i.checks.length > 0).length;
                        if (count === 0) return null;
                        const cfg = RILIEVO_STATUS_CONFIG[status];
                        return (
                            <div key={status} className="flex items-center gap-1.5">
                                <span className={`h-2 w-2 rounded-full ${cfg.bg}`}/>
                                <span className={`font-medium ${cfg.color}`}>{count} {t(cfg.label)}</span>
                            </div>
                        );
                    })}
                </div>

                {/* Layout: Albero + Card */}
                <div className="flex flex-col lg:flex-row gap-4">
                    <div className="lg:w-1/2 border border-border-light rounded-xl overflow-hidden bg-surface-card max-h-[400px] lg:h-[600px] overflow-y-auto">
                        {roots.map(root => renderItem(root))}
                    </div>

                    <div className="lg:w-1/2 lg:h-[600px] lg:overflow-y-auto">
                        {selectedItemData ? renderSelectedCard() : (
                            <div className="border border-dashed border-border-strong rounded-xl p-8 text-center">
                                <ClipboardDocumentCheckIcon className="h-10 w-10 text-text-disabled mx-auto mb-2"/>
                                <p className="text-sm text-text-muted">{t('rilievo.select_element')}</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Modali creazione */}
                {showPhotoModal && selectedItemId && (
                    <RilievoPhotoModal
                        itemId={selectedItemId}
                        onSave={addPhoto}
                        onClose={() => setShowPhotoModal(false)}
                    />
                )}
                {showAudioModal && selectedItemId && (
                    <RilievoAudioModal
                        itemId={selectedItemId}
                        onSave={addAudio}
                        onClose={() => setShowAudioModal(false)}
                    />
                )}
                {showMeasurementModal && selectedItemId && (
                    <RilievoMeasurementModal
                        itemId={selectedItemId}
                        onSave={addMeasurement}
                        onClose={() => setShowMeasurementModal(false)}
                    />
                )}

                {/* Modali editing */}
                {editingPhoto && (
                    <RilievoEditPhotoModal
                        photo={editingPhoto}
                        onSave={(updates) => updatePhoto(editingPhoto.id, updates)}
                        onDelete={() => deletePhoto(editingPhoto.id)}
                        onClose={() => setEditingPhoto(null)}
                    />
                )}
                {editingAudio && (
                    <RilievoEditAudioModal
                        audio={editingAudio}
                        onSave={(updates) => updateAudio(editingAudio.id, updates)}
                        onDelete={() => deleteAudio(editingAudio.id)}
                        onClose={() => setEditingAudio(null)}
                    />
                )}
                {editingMeasurement && (
                    <RilievoEditMeasurementModal
                        measurement={editingMeasurement}
                        onSave={(updates) => updateMeasurement(editingMeasurement.id, updates)}
                        onDelete={() => deleteMeasurement(editingMeasurement.id)}
                        onClose={() => setEditingMeasurement(null)}
                    />
                )}
            </div>
        </div>
    );
};

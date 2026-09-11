import {FC, useEffect, useRef, useState} from "react";
import {useTranslation} from "react-i18next";
import {
    XMarkIcon, ChevronLeftIcon, CheckCircleIcon,
    CameraIcon, MicrophoneIcon, ArrowsPointingOutIcon, ArrowUpTrayIcon, TrashIcon,
} from "@heroicons/react/24/outline";
import {RILIEVO_CHECK_ICON, RILIEVO_STATUS_CONFIG} from "../../../../constants/rilievo.constant.ts";
import {PencilSquareIcon} from "@heroicons/react/24/outline";
import type {RilievoItem} from "../../../../features/rilievo/rilievo.type.ts";
import type {FloorPlanElementModalProps, FloorPlanModalStep} from "./floorPlanModal.type.ts";

export const FloorPlanElementModal: FC<FloorPlanElementModalProps> = ({
    items, initialItemId, onSelectItem, onRemoveMarker, onClose,
    photos, audios, measurements,
    onToggleCheck, onDeletePhoto, onDeleteAudio, onDeleteMeasurement,
    onShowPhotoModal, onShowAudioModal, onShowMeasurementModal, onFileUpload,
    onEditPhoto, onEditAudio, onEditMeasurement,
    lastSelectedFloorId, onFloorSelected, isExistingMarker, placedItemIds,
}) => {
    const {t} = useTranslation();
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Blocca scroll del body quando la modale è aperta
    useEffect(() => {
        document.body.style.overflow = 'hidden';
        return () => { document.body.style.overflow = ''; };
    }, []);

    const [step, setStep] = useState<FloorPlanModalStep>(initialItemId ? 'detail' : 'floor');
    const [selectedFloorId, setSelectedFloorId] = useState<string | null>(lastSelectedFloorId);
    const [selectedParentId, setSelectedParentId] = useState<string | null>(null);
    const [selectedItemId, setSelectedItemId] = useState<string | null>(initialItemId || null);

    const getChildren = (parentId: string) =>
        items.filter(i => i.parentId === parentId).sort((a, b) => a.order - b.order);

    // Raccoglie tutti i discendenti di un nodo
    const getAllDescendants = (parentId: string): RilievoItem[] => {
        const result: RilievoItem[] = [];
        const collect = (pid: string) => {
            for (const child of items.filter(i => i.parentId === pid)) {
                result.push(child);
                collect(child.id);
            }
        };
        collect(parentId);
        return result;
    };

    const floors = items.filter(i => i.type === 'floor').sort((a, b) => a.order - b.order);
    const children = selectedFloorId ? getChildren(selectedFloorId) : [];
    const elements = selectedParentId
        ? [items.find(i => i.id === selectedParentId)!, ...getAllDescendants(selectedParentId)]
            .filter(i => i && !placedItemIds.has(i.id))
            .sort((a, b) => a.order - b.order)
        : [];

    const selectedItem = selectedItemId ? items.find(i => i.id === selectedItemId) : null;
    const itemPhotos = selectedItemId ? photos.filter(p => p.itemId === selectedItemId) : [];
    const itemAudios = selectedItemId ? audios.filter(a => a.itemId === selectedItemId) : [];
    const itemMeasurements = selectedItemId ? measurements.filter(m => m.itemId === selectedItemId) : [];

    const handleSelectFloor = (floorId: string) => {
        setSelectedFloorId(floorId);
        onFloorSelected(floorId);
        // Se il piano ha figli, mostra la lista. Altrimenti seleziona direttamente il piano.
        const floorChildren = getChildren(floorId);
        if (floorChildren.length > 0) {
            setStep('room');
        } else {
            handleSelectElement(floorId);
        }
    };

    const handleSelectChild = (childId: string) => {
        const childItem = items.find(i => i.id === childId);
        if (!childItem) return;
        // Se ha sotto-figli, mostra la lista dei discendenti
        const grandChildren = getChildren(childId);
        if (grandChildren.length > 0) {
            setSelectedParentId(childId);
            setStep('element');
        } else {
            // Nessun figlio: seleziona direttamente
            handleSelectElement(childId);
        }
    };

    const handleSelectElement = (itemId: string) => {
        setSelectedItemId(itemId);
        onSelectItem(itemId);
        setStep('detail');
    };

    const handleBack = () => {
        if (step === 'detail') { setStep(selectedParentId ? 'element' : 'room'); setSelectedItemId(null); }
        else if (step === 'element') { setStep('room'); setSelectedParentId(null); }
        else if (step === 'room') { setStep('floor'); setSelectedFloorId(null); }
        else onClose();
    };

    const stepTitle = () => {
        if (step === 'floor') return t('floorPlan.select_floor');
        if (step === 'room') {
            const floor = items.find(i => i.id === selectedFloorId);
            return floor?.label || t('floorPlan.select_room');
        }
        if (step === 'element') {
            const parent = items.find(i => i.id === selectedParentId);
            return parent?.label || t('floorPlan.select_element');
        }
        return selectedItem?.label || '';
    };

    const renderList = (listItems: RilievoItem[], onSelect: (id: string) => void) => (
        <div className="space-y-1">
            {listItems.map(item => {
                const statusCfg = RILIEVO_STATUS_CONFIG[item.status];
                return (
                    <button
                        key={item.id}
                        type="button"
                        onClick={() => onSelect(item.id)}
                        className="w-full flex items-center gap-3 px-4 py-3 text-left rounded-lg hover:bg-surface-hover transition-colors min-h-[48px]"
                    >
                        <span className={`h-2.5 w-2.5 rounded-full shrink-0 ${statusCfg.bg}`}/>
                        <div className="flex-1 min-w-0">
                            <span className="text-sm font-medium text-text-primary block truncate">{item.label}</span>
                            {item.detail && (
                                <span className="text-xs text-text-muted block truncate">{item.detail}</span>
                            )}
                        </div>
                        <span className="text-xs text-text-muted shrink-0">{item.type}</span>
                    </button>
                );
            })}
        </div>
    );

    const renderDetailCard = () => {
        if (!selectedItem) return null;
        const statusCfg = RILIEVO_STATUS_CONFIG[selectedItem.status];

        return (
            <div className="space-y-4">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-bold text-text-primary">{selectedItem.label}</h4>
                        {selectedItem.detail && (
                            <p className="text-xs text-text-muted mt-0.5">{selectedItem.detail}</p>
                        )}
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                        <span className={`badge ${statusCfg.bg === 'bg-success' ? 'badge-success' : statusCfg.bg === 'bg-warning' ? 'badge-warning' : statusCfg.bg === 'bg-info' ? 'badge-info' : ''}`}>
                            {t(statusCfg.label)}
                        </span>
                        {isExistingMarker && (
                            <button
                                type="button"
                                onClick={onRemoveMarker}
                                className="p-1.5 rounded-lg text-text-disabled hover:text-error hover:bg-error-light transition-colors min-h-[36px] min-w-[36px] flex items-center justify-center"
                                aria-label={t('floorPlan.remove_marker')}
                                title={t('floorPlan.remove_marker')}
                            >
                                <TrashIcon className="h-4 w-4"/>
                            </button>
                        )}
                    </div>
                </div>

                {/* 4 bottoni azione */}
                <div className="grid grid-cols-2 gap-2">
                    <button type="button" className="btn btn-outline flex items-center justify-center gap-1.5 text-xs min-h-[44px]" onClick={onShowPhotoModal}>
                        <CameraIcon className="h-4 w-4"/>{t('rilievo.btn_capture')}
                    </button>
                    <button type="button" className="btn btn-outline flex items-center justify-center gap-1.5 text-xs min-h-[44px]" onClick={() => fileInputRef.current?.click()}>
                        <ArrowUpTrayIcon className="h-4 w-4"/>{t('rilievo.btn_upload')}
                    </button>
                    <button type="button" className="btn btn-outline flex items-center justify-center gap-1.5 text-xs min-h-[44px]" onClick={onShowAudioModal}>
                        <MicrophoneIcon className="h-4 w-4"/>{t('rilievo.btn_audio')}
                    </button>
                    <button type="button" className="btn btn-outline flex items-center justify-center gap-1.5 text-xs min-h-[44px]" onClick={onShowMeasurementModal}>
                        <ArrowsPointingOutIcon className="h-4 w-4"/>{t('rilievo.btn_measure')}
                    </button>
                </div>

                <input ref={fileInputRef} type="file" accept="image/*" multiple className="hidden" onChange={onFileUpload}/>

                {/* Checklist */}
                {selectedItem.checks.length > 0 && (
                    <div className="space-y-1.5">
                        <h5 className="text-xs font-semibold text-text-muted uppercase tracking-wider">{t('rilievo.checklist')}</h5>
                        {selectedItem.checks.map(check => {
                            const Icon = RILIEVO_CHECK_ICON[check.type] || PencilSquareIcon;
                            return (
                                <div
                                    key={check.id}
                                    className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm cursor-pointer transition-colors ${
                                        check.done
                                            ? 'bg-success-light/30 text-success-dark'
                                            : 'bg-surface-page text-text-secondary hover:bg-surface-hover'
                                    }`}
                                    onClick={() => onToggleCheck(selectedItem.id, check.id)}
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

                {/* Foto */}
                {itemPhotos.length > 0 && (
                    <div className="space-y-1.5">
                        <h5 className="text-xs font-semibold text-text-muted uppercase tracking-wider">{t('rilievo.photos')} ({itemPhotos.length})</h5>
                        {itemPhotos.map(p => (
                            <div key={p.id} className="flex items-center gap-2 px-3 py-2 bg-surface-page rounded-lg text-sm cursor-pointer hover:bg-surface-hover transition-colors" onClick={() => onEditPhoto(p)}>
                                {p.uri ? <img src={p.uri} alt={p.note || ''} className="h-8 w-8 rounded object-cover shrink-0"/> : <CameraIcon className="h-4 w-4 text-primary-500 shrink-0"/>}
                                <span className="flex-1 text-text-primary truncate">{p.note || t('rilievo.photo_default')}</span>
                                <span className="text-xs text-text-muted">{new Date(p.timestamp).toLocaleTimeString()}</span>
                                <button type="button" onClick={(e) => { e.stopPropagation(); onDeletePhoto(p.id); }} className="p-1 text-text-disabled hover:text-error rounded min-h-[32px] min-w-[32px] flex items-center justify-center">
                                    <TrashIcon className="h-3.5 w-3.5"/>
                                </button>
                            </div>
                        ))}
                    </div>
                )}

                {/* Audio */}
                {itemAudios.length > 0 && (
                    <div className="space-y-1.5">
                        <h5 className="text-xs font-semibold text-text-muted uppercase tracking-wider">{t('rilievo.audios')} ({itemAudios.length})</h5>
                        {itemAudios.map(a => (
                            <div key={a.id} className="flex items-center gap-2 px-3 py-2 bg-surface-page rounded-lg text-sm cursor-pointer hover:bg-surface-hover transition-colors" onClick={() => onEditAudio(a)}>
                                <MicrophoneIcon className="h-4 w-4 text-primary-500 shrink-0"/>
                                <span className="flex-1 text-text-primary truncate">{a.transcription || t('rilievo.audio_default')}</span>
                                <span className="text-xs text-text-muted">{a.duration}s</span>
                                <button type="button" onClick={(e) => { e.stopPropagation(); onDeleteAudio(a.id); }} className="p-1 text-text-disabled hover:text-error rounded min-h-[32px] min-w-[32px] flex items-center justify-center">
                                    <TrashIcon className="h-3.5 w-3.5"/>
                                </button>
                            </div>
                        ))}
                    </div>
                )}

                {/* Misurazioni */}
                {itemMeasurements.length > 0 && (
                    <div className="space-y-1.5">
                        <h5 className="text-xs font-semibold text-text-muted uppercase tracking-wider">{t('rilievo.measurements')} ({itemMeasurements.length})</h5>
                        {itemMeasurements.map(m => (
                            <div key={m.id} className="flex items-center gap-2 px-3 py-2 bg-surface-page rounded-lg text-sm cursor-pointer hover:bg-surface-hover transition-colors" onClick={() => onEditMeasurement(m)}>
                                <ArrowsPointingOutIcon className="h-4 w-4 text-primary-500 shrink-0"/>
                                <span className="flex-1 text-text-primary">{m.label}</span>
                                <span className="text-sm font-bold text-text-primary">{m.value} {m.unit}</span>
                                <button type="button" onClick={(e) => { e.stopPropagation(); onDeleteMeasurement(m.id); }} className="p-1 text-text-disabled hover:text-error rounded min-h-[32px] min-w-[32px] flex items-center justify-center">
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
        <div className="fixed inset-0 z-40 flex items-stretch sm:items-center justify-center bg-black/50">
            <div className="bg-surface-card sm:rounded-2xl shadow-xl w-full sm:max-w-lg h-full sm:h-auto sm:max-h-[85vh] flex flex-col">
                {/* Header */}
                <div className="flex items-center gap-2 px-4 py-3 border-b border-border-light safe-area-top">
                    <button
                        type="button"
                        onClick={handleBack}
                        className="p-1.5 rounded-lg text-text-muted hover:text-text-primary hover:bg-surface-hover min-h-[44px] min-w-[44px] flex items-center justify-center"
                    >
                        {step === 'floor' ? <XMarkIcon className="h-5 w-5"/> : <ChevronLeftIcon className="h-5 w-5"/>}
                    </button>
                    <h3 className="text-sm font-bold text-text-primary flex-1 truncate">{stepTitle()}</h3>
                    <button
                        type="button"
                        onClick={onClose}
                        className="p-1.5 rounded-lg text-text-muted hover:text-text-primary hover:bg-surface-hover min-h-[44px] min-w-[44px] flex items-center justify-center"
                    >
                        <XMarkIcon className="h-5 w-5"/>
                    </button>
                </div>

                {/* Body */}
                <div className="flex-1 overflow-y-auto overscroll-contain p-4">
                    {step === 'floor' && renderList(floors, handleSelectFloor)}
                    {step === 'room' && renderList(children.filter(c => !placedItemIds.has(c.id)), handleSelectChild)}
                    {step === 'element' && renderList(elements, handleSelectElement)}
                    {step === 'detail' && renderDetailCard()}
                </div>
            </div>
        </div>
    );
};

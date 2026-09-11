import {FC, useEffect, useRef, useState} from "react";
import {useTranslation} from "react-i18next";
import {
    XMarkIcon, ChevronLeftIcon, CheckCircleIcon,
    CameraIcon, MicrophoneIcon, ArrowsPointingOutIcon, ArrowUpTrayIcon, TrashIcon, PencilSquareIcon,
} from "@heroicons/react/24/outline";
import {RILIEVO_CHECK_ICON, RILIEVO_STATUS_CONFIG} from "../../../../constants/rilievo.constant.ts";
import type {RilievoItem} from "../../../../features/rilievo/rilievo.type.ts";
import type {FloorPlanElementModalProps, FloorPlanModalStep} from "./floorPlanModal.type.ts";

export const FloorPlanElementModal: FC<FloorPlanElementModalProps> = ({
    items, initialItemId, onConfirm, onRemoveMarker, onClose,
    photos, audios, measurements,
    onToggleCheck, onDeletePhoto, onDeleteAudio, onDeleteMeasurement,
    onShowPhotoModal, onShowAudioModal, onShowMeasurementModal, onFileUpload,
    onEditPhoto, onEditAudio, onEditMeasurement,
    lastSelectedFloorId, onFloorSelected, isExistingMarker, placedItemIds,
}) => {
    const {t} = useTranslation();
    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        document.body.style.overflow = 'hidden';
        return () => { document.body.style.overflow = ''; };
    }, []);

    // Navigazione: stack di parentId attraversati. L'ultimo è il livello corrente.
    // Vuoto = primo livello (figli del building root)
    const [navStack, setNavStack] = useState<string[]>([]);
    const [step, setStep] = useState<FloorPlanModalStep>(initialItemId ? 'detail' : 'floor');
    const [selectedItemId, setSelectedItemId] = useState<string | null>(initialItemId || null);

    // Ricorda l'ultimo piano selezionato per comodità
    const hasSetFloor = useRef(false);

    // --- Helpers ---

    const getChildrenOf = (parentId: string): RilievoItem[] =>
        items.filter(i => i.parentId === parentId).sort((a, b) => a.order - b.order);

    const getAvailableChildrenOf = (parentId: string): RilievoItem[] =>
        getChildrenOf(parentId).filter(i => !placedItemIds.has(i.id));

    const getRootBuilding = (): RilievoItem | undefined =>
        items.find(i => i.parentId === null);

    // --- Dati correnti per lo step 'floor' (lista navigazione) ---

    const currentParentId = navStack.length > 0 ? navStack[navStack.length - 1] : getRootBuilding()?.id;
    const currentList = currentParentId ? getAvailableChildrenOf(currentParentId) : [];
    const currentParent = currentParentId ? items.find(i => i.id === currentParentId) : null;

    // --- Dati per lo step 'detail' ---

    const selectedItem = selectedItemId ? items.find(i => i.id === selectedItemId) : null;
    const itemPhotos = selectedItemId ? photos.filter(p => p.itemId === selectedItemId) : [];
    const itemAudios = selectedItemId ? audios.filter(a => a.itemId === selectedItemId) : [];
    const itemMeasurements = selectedItemId ? measurements.filter(m => m.itemId === selectedItemId) : [];

    // --- Azioni ---

    const navigateInto = (itemId: string) => {
        // Salva il piano selezionato (primo livello di navigazione)
        if (!hasSetFloor.current) {
            onFloorSelected(itemId);
            hasSetFloor.current = true;
        }

        const availableChildren = getAvailableChildrenOf(itemId);
        if (availableChildren.length > 0) {
            // Ha figli disponibili → naviga dentro
            setNavStack(prev => [...prev, itemId]);
        } else {
            // Nodo foglia o tutti i figli piazzati → seleziona direttamente
            selectElement(itemId);
        }
    };

    const selectElement = (itemId: string) => {
        setSelectedItemId(itemId);
        setStep('detail');
    };

    const handleBack = () => {
        if (step === 'detail') {
            setSelectedItemId(null);
            setStep('floor');
        } else if (navStack.length > 0) {
            setNavStack(prev => prev.slice(0, -1));
        } else {
            onClose();
        }
    };

    // --- Titolo header ---

    const headerTitle = (): string => {
        if (step === 'detail') return selectedItem?.label || '';
        if (navStack.length > 0) return currentParent?.label || '';
        return t('floorPlan.select_floor');
    };

    const showBackButton = (): boolean => {
        if (step === 'detail' && isExistingMarker) return false;
        if (step === 'detail') return true;
        return navStack.length > 0;
    };

    // --- Render lista navigazione ---

    const renderList = () => (
        <div className="space-y-1">
            {currentList.map(item => {
                const statusCfg = RILIEVO_STATUS_CONFIG[item.status];
                return (
                    <button
                        key={item.id}
                        type="button"
                        onClick={() => navigateInto(item.id)}
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
            {currentList.length === 0 && (
                <p className="text-sm text-text-muted text-center py-6">{t('floorPlan.no_elements')}</p>
            )}
        </div>
    );

    // --- Render card dettaglio ---

    const renderDetailCard = () => {
        if (!selectedItem) return null;
        const statusCfg = RILIEVO_STATUS_CONFIG[selectedItem.status];

        return (
            <div className="space-y-4">
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

                {selectedItem.checks.length > 0 && (
                    <div className="space-y-1.5">
                        <h5 className="text-xs font-semibold text-text-muted uppercase tracking-wider">{t('rilievo.checklist')}</h5>
                        {selectedItem.checks.map(check => {
                            const Icon = RILIEVO_CHECK_ICON[check.type] || PencilSquareIcon;
                            return (
                                <div
                                    key={check.id}
                                    className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm cursor-pointer transition-colors ${
                                        check.done ? 'bg-success-light/30 text-success-dark' : 'bg-surface-page text-text-secondary hover:bg-surface-hover'
                                    }`}
                                    onClick={() => onToggleCheck(selectedItem.id, check.id)}
                                >
                                    <Icon className="h-4 w-4 shrink-0"/>
                                    <span className="flex-1">{check.label}</span>
                                    {check.value && <span className="text-xs font-semibold">{check.value}</span>}
                                    {check.done
                                        ? <CheckCircleIcon className="h-4 w-4 text-success shrink-0"/>
                                        : <span className="h-4 w-4 rounded-full border-2 border-border-strong shrink-0"/>
                                    }
                                </div>
                            );
                        })}
                    </div>
                )}

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
                <div className="flex items-center gap-2 px-4 py-3 border-b border-border-light safe-area-top">
                    {showBackButton() && (
                        <button
                            type="button"
                            onClick={handleBack}
                            className="p-1.5 rounded-lg text-text-muted hover:text-text-primary hover:bg-surface-hover min-h-[44px] min-w-[44px] flex items-center justify-center"
                        >
                            <ChevronLeftIcon className="h-5 w-5"/>
                        </button>
                    )}
                    <h3 className="text-sm font-bold text-text-primary flex-1 truncate">{headerTitle()}</h3>
                    <button
                        type="button"
                        onClick={onClose}
                        className="p-1.5 rounded-lg text-text-muted hover:text-text-primary hover:bg-surface-hover min-h-[44px] min-w-[44px] flex items-center justify-center"
                    >
                        <XMarkIcon className="h-5 w-5"/>
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto overscroll-contain p-4">
                    {step === 'floor' && renderList()}
                    {step === 'detail' && renderDetailCard()}
                </div>

                {/* Footer: Salva/Annulla solo per nuovi marker (non per edit di marker esistenti) */}
                {step === 'detail' && !isExistingMarker && selectedItemId && (
                    <div className="grid grid-cols-2 gap-3 px-4 py-3 border-t border-border-light">
                        <button type="button" onClick={onClose} className="btn btn-ghost min-h-[44px]">
                            {t('common.cancel')}
                        </button>
                        <button
                            type="button"
                            onClick={() => { onConfirm(selectedItemId); onClose(); }}
                            className="btn btn-primary min-h-[44px]"
                        >
                            {t('common.save')}
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

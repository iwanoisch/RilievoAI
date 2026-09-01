import {FC, useCallback, useEffect, useState} from "react";
import {useNavigate, useParams} from "react-router-dom";
import {PageTitle} from "../../common/page-title/PageTitle.tsx";
import {useFloorPlan} from "../../features/floorPlan/hooks/useFloorPlan.ts";
import {useSurvey} from "../../features/survey/hooks/useSurvey.ts";
import {useEdificio} from "../../features/edificio/useEdificio.ts";
import {FloorPlanViewer} from "../floor-plan-viewer/FloorPlanViewer.tsx";
import {MarkerDetailModal} from "../../pages/floor-plan/modals/MarkerDetailModal.tsx";
import {useTranslation} from "react-i18next";
import {ArrowLeftIcon, ChevronDownIcon, MapPinIcon, TrashIcon, XMarkIcon} from "@heroicons/react/24/solid";
import type {PhotoMarker} from "../../features/floorPlan/slice/floorPlan.type.ts";
import type {MarkerDetailState} from "../../pages/floor-plan/floorPlan.type.ts";
import type {FloorPlanDetailProps} from "./floorPlanDetail.type.ts";

export const FloorPlanDetail: FC<FloorPlanDetailProps> = ({onBack}) => {
    const {t} = useTranslation();
    const navigate = useNavigate();
    const {documentId} = useParams<{documentId: string}>();
    const {
        documents, selectedDocument, selectedPage,
        selectDocument, deleteDocument, selectPage, deletePage,
        addMarker, deleteMarker, updateDocument,
    } = useFloorPlan();

    // Se arriviamo via route, seleziona il documento dal parametro URL
    useEffect(() => {
        if (documentId && (!selectedDocument || selectedDocument.id !== documentId)) {
            const doc = documents.find(d => d.id === documentId);
            if (doc) {
                selectDocument(doc.id);
            } else {
                navigate('/poc', {replace: true});
            }
        }
    }, [documentId, selectedDocument, documents, selectDocument, navigate]);

    const handleBack = () => {
        if (onBack) {
            onBack();
        } else {
            navigate('/poc');
        }
    };

    const handleDelete = async () => {
        if (!selectedDocument) return;
        await deleteDocument(selectedDocument.id);
        handleBack();
    };
    const {photos} = useSurvey();
    const {elements} = useEdificio();

    const [isPlacingMode, setIsPlacingMode] = useState(false);
    const [placingPhotoId, setPlacingPhotoId] = useState<string | null>(null);
    const [markerDetail, setMarkerDetail] = useState<MarkerDetailState>({marker: null});
    const [isPhotosOpen, setIsPhotosOpen] = useState(true);

    const unplacedPhotos = selectedPage
        ? photos.filter(photo => !selectedPage.photoMarkers.some(m => m.photoId === photo.id))
        : [];

    const handleMarkerClick = useCallback((marker: PhotoMarker) => {
        setMarkerDetail({marker});
    }, []);

    const handleStartPlacing = (photoId: string) => {
        setPlacingPhotoId(photoId);
        setIsPlacingMode(true);
    };

    const handlePlaceMarker = useCallback((x: number, y: number) => {
        if (!placingPhotoId || !selectedPage) return;
        const marker: PhotoMarker = {photoId: placingPhotoId, x, y, confidence: 50};
        addMarker(selectedPage.id, marker);
        setIsPlacingMode(false);
        setPlacingPhotoId(null);
    }, [placingPhotoId, selectedPage, addMarker]);

    const handleUpdateAngle = (photoId: string, angle: number) => {
        if (!selectedPage) return;
        const existing = selectedPage.photoMarkers.find(m => m.photoId === photoId);
        if (existing) addMarker(selectedPage.id, {...existing, directionAngle: angle});
    };

    const handleDeleteMarker = (photoId: string) => {
        if (!selectedPage) return;
        deleteMarker(selectedPage.id, photoId);
    };

    const handleRepositionMarker = (photoId: string) => {
        setPlacingPhotoId(photoId);
        setIsPlacingMode(true);
        if (selectedPage) deleteMarker(selectedPage.id, photoId);
    };

    if (!selectedDocument || !selectedPage) {
        return (
            <div className="w-full px-4 sm:px-6 lg:px-8 py-6 bg-gradient-to-br from-primary-50/50 via-primary-100/30 to-slate-50 min-h-screen">
                <div className="mx-auto w-full max-w-5xl flex items-center justify-center py-20">
                    <div className="relative h-10 w-10">
                        <div className="absolute inset-0 rounded-full border-4 border-primary-100"/>
                        <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-primary-500 motion-safe:animate-spin"/>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="w-full px-4 sm:px-6 lg:px-8 py-6 bg-gradient-to-br from-primary-50/50 via-primary-100/30 to-slate-50 min-h-screen">
            <div className="mx-auto w-full max-w-5xl">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <button onClick={handleBack} className="btn btn-ghost p-2 min-h-[44px] min-w-[44px]" aria-label={t('general.back')}>
                            <ArrowLeftIcon className="h-5 w-5"/>
                        </button>
                        <PageTitle title={selectedDocument.name} subtitle={t('floorPlan.subtitle')}/>
                    </div>
                    <button
                        onClick={handleDelete}
                        className="btn btn-ghost text-error hover:bg-error-light flex items-center gap-2 min-h-[44px]"
                        aria-label={t('common.delete')}
                    >
                        <TrashIcon className="h-5 w-5"/>
                    </button>
                </div>

                {/* Info documento */}
                <div className="mt-4 card p-3 flex flex-col sm:flex-row sm:items-center gap-3">
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                        <span className="badge badge-info text-xs uppercase">{selectedDocument.fileType}</span>
                        <span className="text-xs text-text-muted">
                            {t('floorPlan.pages_count', {count: selectedDocument.pages.length})}
                        </span>
                        <span className="text-xs text-text-muted">
                            {new Date(selectedDocument.createdAt).toLocaleDateString()}
                        </span>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                        <span className="text-xs text-text-muted whitespace-nowrap">{t('floorPlan.associated_building')}:</span>
                        <select
                            value={selectedDocument.buildingId}
                            onChange={e => updateDocument(selectedDocument.id, {buildingId: e.target.value})}
                            className="input text-xs py-1 px-2 min-w-[140px]"
                        >
                            <option value="">{t('floorPlan.no_building')}</option>
                            {Object.values(elements).filter(el => el.type === 'building').map(b => (
                                <option key={b.id} value={b.id}>{b.label}</option>
                            ))}
                        </select>
                    </div>
                </div>

                {/* Tab pagine */}
                {selectedDocument.pages.length > 1 && (
                    <div className="mt-4 flex gap-2 overflow-x-auto pb-2">
                        {selectedDocument.pages.map((page, idx) => (
                            <div key={page.id} className="flex items-center gap-1">
                                <button
                                    onClick={() => selectPage(page.id)}
                                    className={`px-4 py-2.5 text-xs font-medium rounded-full whitespace-nowrap transition-colors min-h-[44px]
                                        ${selectedPage.id === page.id
                                        ? 'bg-primary-500 text-white'
                                        : 'bg-surface-hover text-text-secondary hover:bg-slate-200'
                                    }`}
                                >
                                    {t('floorPlan.plan')} {idx + 1}
                                </button>
                                <button
                                    onClick={() => deletePage(selectedDocument.id, page.id)}
                                    className="p-1.5 rounded-lg text-text-muted hover:text-error hover:bg-error-light transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center"
                                    aria-label={t('common.delete')}
                                >
                                    <XMarkIcon className="h-4 w-4"/>
                                </button>
                            </div>
                        ))}
                    </div>
                )}

                {/* Accordion foto */}
                <div className="mt-4 card">
                    <button
                        onClick={() => setIsPhotosOpen(!isPhotosOpen)}
                        className="w-full flex items-center justify-between min-h-[44px]"
                    >
                        <h3 className="text-sm font-semibold text-text-secondary">
                            {unplacedPhotos.length > 0
                                ? `${t('floorPlan.unplaced_photos')} (${unplacedPhotos.length})`
                                : selectedPage.photoMarkers.length > 0
                                    ? `${t('floorPlan.placed_photos')} (${selectedPage.photoMarkers.length})`
                                    : t('floorPlan.unplaced_photos')
                            }
                        </h3>
                        <ChevronDownIcon className={`h-5 w-5 text-text-muted transition-transform duration-200 ${isPhotosOpen ? 'rotate-180' : ''}`}/>
                    </button>

                    <div className={`overflow-hidden transition-all duration-200 ${isPhotosOpen ? 'max-h-[300px] mt-3' : 'max-h-0'}`}>
                        {unplacedPhotos.length > 0 && (
                            <div className="max-h-[200px] overflow-y-auto grid grid-cols-4 sm:grid-cols-6 gap-2 mb-3">
                                {unplacedPhotos.map(photo => (
                                    <button
                                        key={photo.id}
                                        onClick={() => handleStartPlacing(photo.id)}
                                        className="aspect-square rounded-lg overflow-hidden border border-border-default hover:border-primary-400 transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 relative"
                                        aria-label={t('floorPlan.place_photo')}
                                    >
                                        <img src={photo.thumbnailPath || photo.mediaPath} alt="" className="w-full h-full object-cover"/>
                                        <MapPinIcon className="absolute bottom-1 right-1 h-4 w-4 text-white drop-shadow"/>
                                    </button>
                                ))}
                            </div>
                        )}

                        {unplacedPhotos.length === 0 && selectedPage.photoMarkers.length === 0 && (
                            <p className="text-xs text-text-muted italic">{t('floorPlan.instructions_no_markers')}</p>
                        )}

                        {selectedPage.photoMarkers.length > 0 && (
                            <p className="text-xs text-text-muted">{t('floorPlan.instructions_with_markers')}</p>
                        )}

                        {unplacedPhotos.length > 0 && selectedPage.photoMarkers.length === 0 && (
                            <p className="text-xs text-text-muted mt-1">{t('floorPlan.instructions_no_markers')}</p>
                        )}
                    </div>
                </div>

                {/* Banner placing mode */}
                {isPlacingMode && (
                    <div className="mt-3 card p-3 flex items-center justify-between bg-info-light border-info">
                        <p className="text-sm text-info-dark">{t('floorPlan.click_to_place')}</p>
                        <button onClick={() => { setIsPlacingMode(false); setPlacingPhotoId(null); }} className="btn btn-outline text-xs">
                            {t('common.cancel')}
                        </button>
                    </div>
                )}

                {/* Planimetria */}
                <div className="mt-3">
                    <FloorPlanViewer
                        imageSrc={selectedPage.imagePath}
                        markers={selectedPage.photoMarkers}
                        onMarkerClick={handleMarkerClick}
                        onPlaceMarker={handlePlaceMarker}
                        isPlacingMode={isPlacingMode}
                    />
                </div>
            </div>

            {markerDetail.marker && (
                <MarkerDetailModal
                    marker={markerDetail.marker}
                    onClose={() => setMarkerDetail({marker: null})}
                    onUpdateAngle={handleUpdateAngle}
                    onDelete={handleDeleteMarker}
                    onReposition={handleRepositionMarker}
                />
            )}
        </div>
    );
};

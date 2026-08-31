import {FC, useCallback, useRef} from "react";
import {TransformWrapper, TransformComponent} from "react-zoom-pan-pinch";
import {useTranslation} from "react-i18next";
import type {FloorPlanViewerProps} from "./floorPlanViewer.type.ts";
import type {PhotoMarker} from "../../features/floorPlan/slice/floorPlan.type.ts";
import {CONFIDENCE_COLORS} from "../../constants/confidence.constant.ts";
import {getConfidenceLevel} from "../../utility/confidence-utils.ts";

export const FloorPlanViewer: FC<FloorPlanViewerProps> = ({
    imageSrc,
    markers,
    onMarkerClick,
    onPlaceMarker,
    isPlacingMode = false,
}) => {
    const {t} = useTranslation();
    const imageRef = useRef<HTMLImageElement>(null);

    const handleImageClick = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
        if (!isPlacingMode || !onPlaceMarker || !imageRef.current) return;

        const rect = imageRef.current.getBoundingClientRect();
        const x = ((e.clientX - rect.left) / rect.width) * 100;
        const y = ((e.clientY - rect.top) / rect.height) * 100;
        onPlaceMarker(x, y);
    }, [isPlacingMode, onPlaceMarker]);

    const renderMarker = (marker: PhotoMarker) => {
        const level = getConfidenceLevel(marker.confidence);
        const colorClass = CONFIDENCE_COLORS[level];

        return (
            <button
                key={marker.photoId}
                className={`absolute w-6 h-6 rounded-full border-2 ${colorClass} opacity-80 hover:opacity-100
                           transition-opacity -translate-x-1/2 -translate-y-1/2 focus:outline-none focus:ring-2 focus:ring-primary-500
                           min-w-[24px] min-h-[24px]`}
                style={{left: `${marker.x}%`, top: `${marker.y}%`}}
                onClick={(e) => {
                    e.stopPropagation();
                    onMarkerClick?.(marker);
                }}
                aria-label={`${t('floorPlan.photo_marker')} - ${marker.confidence}%`}
            >
                {marker.directionAngle !== undefined && (
                    <div
                        className="absolute w-0 h-0 border-l-[4px] border-l-transparent border-r-[4px] border-r-transparent border-b-[8px] border-b-white
                                   left-1/2 -translate-x-1/2 -top-2.5"
                        style={{transform: `translateX(-50%) rotate(${marker.directionAngle}deg)`}}
                        aria-hidden="true"
                    />
                )}
            </button>
        );
    };

    return (
        <div className={`relative w-full rounded-xl overflow-hidden border border-border-default bg-slate-100
                        ${isPlacingMode ? 'cursor-crosshair' : ''}`}>
            <TransformWrapper
                initialScale={1}
                minScale={0.5}
                maxScale={5}
                wheel={{step: 0.1}}
                pinch={{step: 5}}
                disabled={isPlacingMode}
            >
                <TransformComponent wrapperClass="!w-full" contentClass="!w-full">
                    <div className="relative w-full" onClick={handleImageClick}>
                        <img
                            ref={imageRef}
                            src={imageSrc}
                            alt={t('floorPlan.floor_plan_image')}
                            className="w-full h-auto select-none"
                            draggable={false}
                        />
                        {markers.map(renderMarker)}
                    </div>
                </TransformComponent>
            </TransformWrapper>
        </div>
    );
};

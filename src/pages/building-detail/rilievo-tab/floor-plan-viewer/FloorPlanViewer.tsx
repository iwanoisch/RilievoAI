import {FC, useCallback, useRef} from "react";
import {useTranslation} from "react-i18next";
import {TransformWrapper, TransformComponent} from "react-zoom-pan-pinch";
import {RILIEVO_MARKER_STATUS_COLORS} from "../../../../constants/rilievo.constant.ts";
import type {FloorPlanViewerProps} from "./floorPlanViewer.type.ts";

export const FloorPlanViewer: FC<FloorPlanViewerProps> = ({
    image, markers, items, onTapEmpty, onTapMarker,
}) => {
    const {t} = useTranslation();
    const containerRef = useRef<HTMLDivElement>(null);
    const imgRef = useRef<HTMLImageElement>(null);
    const pointerStartRef = useRef<{x: number; y: number; time: number} | null>(null);

    const handlePointerDown = useCallback((e: React.PointerEvent) => {
        pointerStartRef.current = {x: e.clientX, y: e.clientY, time: Date.now()};
    }, []);

    const handlePointerUp = useCallback((e: React.PointerEvent) => {
        const start = pointerStartRef.current;
        pointerStartRef.current = null;
        if (!start) return;

        const dx = Math.abs(e.clientX - start.x);
        const dy = Math.abs(e.clientY - start.y);
        const elapsed = Date.now() - start.time;

        // Tap: poco movimento (<10px) e breve (<300ms)
        if (dx < 10 && dy < 10 && elapsed < 300 && imgRef.current) {
            const rect = imgRef.current.getBoundingClientRect();

            // Verifica che il tap sia sull'immagine
            if (e.clientX < rect.left || e.clientX > rect.right || e.clientY < rect.top || e.clientY > rect.bottom) return;

            const posX = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
            const posY = Math.max(0, Math.min(1, (e.clientY - rect.top) / rect.height));

            // Hit test marker
            const hitMarker = markers.find(m => {
                const mx = m.posX * rect.width + rect.left;
                const my = m.posY * rect.height + rect.top;
                return Math.sqrt((e.clientX - mx) ** 2 + (e.clientY - my) ** 2) < 18;
            });

            if (hitMarker) {
                onTapMarker(hitMarker);
            } else {
                onTapEmpty(posX, posY);
            }
        }
    }, [markers, onTapEmpty, onTapMarker]);

    const dataUrl = `data:${image.mimeType};base64,${image.base64}`;

    return (
        <div
            ref={containerRef}
            className="relative h-[300px] sm:h-[400px] bg-slate-100 rounded-xl overflow-hidden border border-border-light touch-none"
            onPointerDown={handlePointerDown}
            onPointerUp={handlePointerUp}
        >
            <TransformWrapper
                initialScale={1}
                minScale={0.5}
                maxScale={6}
                centerOnInit
            >
                <TransformComponent
                    wrapperStyle={{width: '100%', height: '100%'}}
                    contentStyle={{width: '100%', height: '100%', position: 'relative'}}
                >
                    <img
                        ref={imgRef}
                        src={dataUrl}
                        alt={image.name}
                        className="w-full h-full object-contain"
                        draggable={false}
                    />

                    {/* Marker overlay */}
                    {markers.map(marker => {
                        const item = items.find(i => i.id === marker.itemId);
                        if (!item) return null;
                        const color = RILIEVO_MARKER_STATUS_COLORS[item.status] || '#94a3b8';
                        const shortLabel = item.label.length > 10 ? item.label.slice(0, 10) + '..' : item.label;

                        // Trova la direzione con più spazio libero da altri marker
                        const dirs: Array<{dir: string; score: number}> = [
                            {dir: 'right', score: 0},
                            {dir: 'left', score: 0},
                            {dir: 'bottom', score: 0},
                            {dir: 'top', score: 0},
                        ];
                        // Penalizza direzioni verso i bordi
                        if (marker.posX > 0.8) dirs[0].score -= 100;
                        if (marker.posX < 0.2) dirs[1].score -= 100;
                        if (marker.posY > 0.85) dirs[2].score -= 100;
                        if (marker.posY < 0.15) dirs[3].score -= 100;
                        // Penalizza direzioni dove ci sono altri marker vicini
                        for (const other of markers) {
                            if (other.id === marker.id) continue;
                            const dx = other.posX - marker.posX;
                            const dy = other.posY - marker.posY;
                            const dist = Math.sqrt(dx * dx + dy * dy);
                            if (dist > 0.15) continue;
                            const penalty = 50 / (dist + 0.01);
                            if (dx > 0) dirs[0].score -= penalty; // altro a destra
                            if (dx < 0) dirs[1].score -= penalty; // altro a sinistra
                            if (dy > 0) dirs[2].score -= penalty; // altro sotto
                            if (dy < 0) dirs[3].score -= penalty; // altro sopra
                        }
                        const best = dirs.sort((a, b) => b.score - a.score)[0].dir;

                        const labelStyles: Record<string, React.CSSProperties> = {
                            right:  {left: '3px', top: '-2px'},
                            left:   {right: '8px', top: '-2px'},
                            bottom: {left: '-3px', top: '3px'},
                            top:    {left: '-3px', bottom: '8px'},
                        };

                        return (
                            <div
                                key={marker.id}
                                className="absolute cursor-pointer"
                                style={{
                                    left: `${marker.posX * 100}%`,
                                    top: `${marker.posY * 100}%`,
                                }}
                            >
                                <div
                                    className="rounded-full"
                                    style={{
                                        width: '5px',
                                        height: '5px',
                                        backgroundColor: color,
                                        border: '1px solid white',
                                        transform: 'translate(-50%, -50%)',
                                    }}
                                />
                                <div
                                    className="absolute pointer-events-none select-none"
                                    style={labelStyles[best]}
                                >
                                    <span
                                        className="whitespace-nowrap text-white font-medium flex items-center justify-center"
                                        style={{
                                            fontSize: '2px',
                                            lineHeight: '2px',
                                            padding: '1px 1px',
                                            backgroundColor: 'rgba(0,0,0,0.55)',
                                            borderRadius: '1px',
                                        }}
                                    >
                                        {shortLabel}
                                    </span>
                                </div>
                            </div>
                        );
                    })}
                </TransformComponent>
            </TransformWrapper>

            {/* Hint */}
            <div className="absolute bottom-2 left-1/2 -translate-x-1/2 pointer-events-none whitespace-nowrap">
                <span className="text-[10px] text-text-muted bg-surface-card/80 px-3 py-1 rounded-full">
                    {t('floorPlan.tap_hint')}
                </span>
            </div>
        </div>
    );
};

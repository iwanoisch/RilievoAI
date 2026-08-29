import { useRef, useEffect, useState } from "react";

type SignaturePadProps = {
    onChange?: (base64: string) => void;
    onConfirm?: () => void;
};

export default function SignaturePad({ onChange, onConfirm }: SignaturePadProps) {

    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [isDrawing, setIsDrawing] = useState(false);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        ctx.lineWidth = 2;
        ctx.lineCap = "round";
        ctx.strokeStyle = "black";
    }, []);

    useEffect(() => {
        const canvas = canvasRef.current;

        if (!canvas) return;

        // Blocca lo scroll mentre si firma
        const preventScroll = (e: TouchEvent) => {
            if (e.cancelable) e.preventDefault();
        };

        canvas.addEventListener("touchmove", preventScroll, { passive: false });
        canvas.addEventListener("touchstart", preventScroll, { passive: false });

        return () => {
            canvas.removeEventListener("touchmove", preventScroll);
            canvas.removeEventListener("touchstart", preventScroll);
        };
    }, []);

    /** Estrae coordinate del tocco o mouse in maniera typesafe */
    const getCoords = (
        e: MouseEvent | TouchEvent,
        canvas: HTMLCanvasElement
    ) => {
        const rect = canvas.getBoundingClientRect();

        if (e instanceof TouchEvent) {
            return {
                x: e.touches[0].clientX - rect.left,
                y: e.touches[0].clientY - rect.top,
            };
        }

        return {
            x: (e as MouseEvent).offsetX,
            y: (e as MouseEvent).offsetY,
        };
    };

    const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
        setIsDrawing(true);

        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        const coords = getCoords(e.nativeEvent, canvas);
        ctx.beginPath();
        ctx.moveTo(coords.x, coords.y);
    };
    const clear = () => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        ctx.clearRect(0, 0, canvas.width, canvas.height);
        onChange?.("");
    };
    const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
        if (!isDrawing) return;

        const canvas = canvasRef.current;
        const ctx = canvas?.getContext("2d");
        if (!canvas || !ctx) return;

        const coords = getCoords(e.nativeEvent, canvas);
        ctx.lineTo(coords.x, coords.y);
        ctx.stroke();
    };

    const stopDrawing = () => {
        setIsDrawing(false);

        const dataUrl = canvasRef.current?.toDataURL("image/png",0.5);
        if (dataUrl && onChange) onChange(dataUrl); // firma salvata in Base64
    };

    return (
        <>
        <div className="flex border flex-col items-center gap-2">
            <canvas
                ref={canvasRef}
                width={350}
                height={200}
                onMouseDown={startDrawing}
                onMouseMove={draw}
                onMouseUp={stopDrawing}
                onMouseLeave={stopDrawing}
                onTouchStart={startDrawing}
                onTouchMove={draw}
                onTouchEnd={stopDrawing}
            />
        </div>
            <div className="flex w-full justify-between mt-2">
            <button
                type="button"
                onClick={clear}
                className="px-3 py-1 mt-2 text-sm bg-red-600 text-white font-semibold  rounded hover:bg-red-700"
            >
                Cancella
            </button>
                <button
                    type="button"
                    onClick={onConfirm}
                    className="px-3 py-1 mt-2 text-sm bg-green-600 text-white font-semibold rounded hover:bg-green-700"
                >
                    Conferma
                </button>
            </div>
        </>
    );
}

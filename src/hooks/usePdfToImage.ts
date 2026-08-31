import {useState, useCallback} from "react";
import * as pdfjsLib from 'pdfjs-dist';
import {PDFJS_WASM_URL, PDFJS_CMAP_URL, PDFJS_STANDARD_FONT_URL} from "../constants/pdfjs.constant.ts";
import type {PdfPage} from "./usePdfToImage.type.ts";

export type {PdfPage};

export const usePdfToImage = () => {
    const [isProcessing, setIsProcessing] = useState(false);

    const loadPdf = async (file: File) => {
        const arrayBuffer = await file.arrayBuffer();
        return pdfjsLib.getDocument({
            data: arrayBuffer,
            wasmUrl: PDFJS_WASM_URL,
            cMapUrl: PDFJS_CMAP_URL,
            cMapPacked: true,
            standardFontDataUrl: PDFJS_STANDARD_FONT_URL,
            useWorkerFetch: false,
        } as Parameters<typeof pdfjsLib.getDocument>[0]).promise;
    };

    const renderPage = async (page: pdfjsLib.PDFPageProxy): Promise<HTMLCanvasElement> => {
        const scale = 2;
        const viewport = page.getViewport({scale});

        const canvas = document.createElement('canvas');
        canvas.width = Math.floor(viewport.width);
        canvas.height = Math.floor(viewport.height);

        const ctx = canvas.getContext('2d');
        if (!ctx) throw new Error('Canvas context not available');

        await page.render({
            canvasContext: ctx,
            viewport,
        } as Parameters<typeof page.render>[0]).promise;

        return canvas;
    };

    const convertPdfToImage = useCallback(async (file: File): Promise<string | null> => {
        setIsProcessing(true);
        try {
            const pdf = await loadPdf(file);

            const pageCanvases: HTMLCanvasElement[] = [];
            let totalHeight = 0;
            let maxWidth = 0;

            for (let i = 1; i <= pdf.numPages; i++) {
                const page = await pdf.getPage(i);
                const canvas = await renderPage(page);
                pageCanvases.push(canvas);
                totalHeight += canvas.height;
                if (canvas.width > maxWidth) maxWidth = canvas.width;
            }

            if (pageCanvases.length === 0) return null;

            const finalCanvas = document.createElement('canvas');
            finalCanvas.width = maxWidth;
            finalCanvas.height = totalHeight;

            const finalCtx = finalCanvas.getContext('2d');
            if (!finalCtx) return null;

            finalCtx.fillStyle = '#ffffff';
            finalCtx.fillRect(0, 0, maxWidth, totalHeight);

            let yOffset = 0;
            for (const pageCanvas of pageCanvases) {
                finalCtx.drawImage(pageCanvas, 0, yOffset);
                yOffset += pageCanvas.height;
            }

            return finalCanvas.toDataURL('image/png');
        } catch (error) {
            console.error('[usePdfToImage] convertPdfToImage error:', error);
            return null;
        } finally {
            setIsProcessing(false);
        }
    }, []);

    const convertPdfToPages = useCallback(async (file: File): Promise<PdfPage[]> => {
        setIsProcessing(true);
        try {
            const pdf = await loadPdf(file);
            const pages: PdfPage[] = [];

            for (let i = 1; i <= pdf.numPages; i++) {
                const page = await pdf.getPage(i);
                const canvas = await renderPage(page);
                pages.push({
                    pageNumber: i,
                    imageSrc: canvas.toDataURL('image/png'),
                });
            }

            return pages;
        } catch (error) {
            console.error('[usePdfToImage] convertPdfToPages error:', error);
            return [];
        } finally {
            setIsProcessing(false);
        }
    }, []);

    return {isProcessing, convertPdfToImage, convertPdfToPages};
};

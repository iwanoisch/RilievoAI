import JSZip from "jszip";
import * as pdfjsLib from 'pdfjs-dist';
import {PDFJS_WASM_URL, PDFJS_CMAP_URL, PDFJS_STANDARD_FONT_URL} from "../constants/pdfjs.constant.ts";
import type {AiExtractedFile} from "../features/ai/ai.type.ts";

const SUPPORTED_MIME_TYPES: Record<string, string> = {
    'pdf': 'application/pdf',
    'png': 'image/png',
    'jpg': 'image/jpeg',
    'jpeg': 'image/jpeg',
    'gif': 'image/gif',
    'webp': 'image/webp',
    'doc': 'application/msword',
    'docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'xls': 'application/vnd.ms-excel',
    'xlsx': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'txt': 'text/plain',
    'csv': 'text/csv',
};

const MAX_SINGLE_FILE_MB = 25;
const MAX_SINGLE_FILE_BYTES = MAX_SINGLE_FILE_MB * 1024 * 1024;
const MAX_PDF_DIRECT_MB = 5;
const MAX_PDF_DIRECT_BYTES = MAX_PDF_DIRECT_MB * 1024 * 1024;
const PDF_PAGE_SCALE = 1.5;
const MAX_ZIP_SIZE_MB = 200;
const MAX_ZIP_SIZE_BYTES = MAX_ZIP_SIZE_MB * 1024 * 1024;

const getExtension = (filename: string): string =>
    filename.split('.').pop()?.toLowerCase() ?? '';

const getMimeType = (filename: string): string =>
    SUPPORTED_MIME_TYPES[getExtension(filename)] ?? 'application/octet-stream';

const isSupported = (filename: string): boolean =>
    getExtension(filename) in SUPPORTED_MIME_TYPES;

const fileToBase64 = (file: File): Promise<string> =>
    new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => {
            const result = reader.result as string;
            resolve(result.split(',')[1]);
        };
        reader.onerror = reject;
        reader.readAsDataURL(file);
    });

const fileToArrayBuffer = (file: File): Promise<ArrayBuffer> =>
    new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as ArrayBuffer);
        reader.onerror = reject;
        reader.readAsArrayBuffer(file);
    });

const pdfToPageImages = async (pdfData: ArrayBuffer, filename: string): Promise<AiExtractedFile[]> => {
    const pdf = await pdfjsLib.getDocument({
        data: pdfData,
        wasmUrl: PDFJS_WASM_URL,
        cMapUrl: PDFJS_CMAP_URL,
        standardFontDataUrl: PDFJS_STANDARD_FONT_URL,
    }).promise;

    const pages: AiExtractedFile[] = [];
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) return [];

    for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const viewport = page.getViewport({scale: PDF_PAGE_SCALE});
        canvas.width = viewport.width;
        canvas.height = viewport.height;
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        await page.render({canvasContext: ctx, viewport}).promise;

        const dataUrl = canvas.toDataURL('image/jpeg', 0.85);
        const base64 = dataUrl.split(',')[1];

        pages.push({
            name: `${filename}_p${i}.jpg`,
            mimeType: 'image/jpeg',
            base64,
        });
    }

    canvas.remove();
    return pages;
};

export interface ExtractionResult {
    files: AiExtractedFile[];
    skipped: SkippedFile[];
    totalSizeMb: number;
}

export interface SkippedFile {
    name: string;
    reason: 'too_large' | 'unsupported' | 'zip_too_large';
    sizeMb?: number;
}

export const extractFilesFromZip = async (zipFile: File): Promise<ExtractionResult> => {
    if (zipFile.size > MAX_ZIP_SIZE_BYTES) {
        return {
            files: [],
            skipped: [{name: zipFile.name, reason: 'zip_too_large', sizeMb: Math.round(zipFile.size / 1024 / 1024)}],
            totalSizeMb: 0,
        };
    }

    const zip = await JSZip.loadAsync(zipFile);
    const files: AiExtractedFile[] = [];
    const skipped: SkippedFile[] = [];
    let totalSize = 0;

    for (const [path, entry] of Object.entries(zip.files)) {
        if (entry.dir) continue;
        const filename = path.split('/').pop() ?? path;

        if (!isSupported(filename)) {
            skipped.push({name: filename, reason: 'unsupported'});
            continue;
        }

        const data = await entry.async('base64');
        const rawSize = data.length * 0.75;

        if (rawSize > MAX_SINGLE_FILE_BYTES) {
            skipped.push({name: filename, reason: 'too_large', sizeMb: Math.round(rawSize / 1024 / 1024)});
            continue;
        }

        if (getExtension(filename) === 'pdf' && rawSize > MAX_PDF_DIRECT_BYTES) {
            const arrayBuffer = await entry.async('arraybuffer');
            const pageImages = await pdfToPageImages(arrayBuffer, filename);
            files.push(...pageImages);
            totalSize += pageImages.reduce((sum, p) => sum + p.base64.length * 0.75, 0);
            continue;
        }

        files.push({name: filename, mimeType: getMimeType(filename), base64: data});
        totalSize += rawSize;
    }

    return {files, skipped, totalSizeMb: Math.round(totalSize / 1024 / 1024)};
};

export const extractFilesFromList = async (
    fileList: File[],
    onProgress?: (percent: number, fileName: string) => void
): Promise<ExtractionResult> => {
    const files: AiExtractedFile[] = [];
    const skipped: SkippedFile[] = [];
    let totalSize = 0;
    const total = fileList.length;

    for (let i = 0; i < fileList.length; i++) {
        const file = fileList[i];
        onProgress?.(Math.round((i / total) * 100), file.name);
        if (file.name.toLowerCase().endsWith('.zip')) {
            const zipResult = await extractFilesFromZip(file);
            files.push(...zipResult.files);
            skipped.push(...zipResult.skipped);
            totalSize += zipResult.totalSizeMb * 1024 * 1024;
            continue;
        }

        if (!isSupported(file.name)) {
            skipped.push({name: file.name, reason: 'unsupported'});
            continue;
        }

        if (file.size > MAX_SINGLE_FILE_BYTES) {
            skipped.push({name: file.name, reason: 'too_large', sizeMb: Math.round(file.size / 1024 / 1024)});
            continue;
        }

        if (getExtension(file.name) === 'pdf' && file.size > MAX_PDF_DIRECT_BYTES) {
            const arrayBuffer = await fileToArrayBuffer(file);
            const pageImages = await pdfToPageImages(arrayBuffer, file.name);
            files.push(...pageImages);
            totalSize += pageImages.reduce((sum, p) => sum + p.base64.length * 0.75, 0);
            continue;
        }

        const base64 = await fileToBase64(file);
        files.push({name: file.name, mimeType: getMimeType(file.name), base64});
        totalSize += file.size;
    }

    onProgress?.(100, '');
    return {files, skipped, totalSizeMb: Math.round(totalSize / 1024 / 1024)};
};

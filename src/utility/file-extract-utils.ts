import JSZip from "jszip";
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

export const extractFilesFromZip = async (zipFile: File): Promise<AiExtractedFile[]> => {
    const zip = await JSZip.loadAsync(zipFile);
    const extracted: AiExtractedFile[] = [];

    for (const [path, entry] of Object.entries(zip.files)) {
        if (entry.dir) continue;
        const filename = path.split('/').pop() ?? path;
        if (!isSupported(filename)) continue;

        const data = await entry.async('base64');
        extracted.push({
            name: filename,
            mimeType: getMimeType(filename),
            base64: data,
        });
    }

    return extracted;
};

export const extractFilesFromList = async (files: File[]): Promise<AiExtractedFile[]> => {
    const extracted: AiExtractedFile[] = [];

    for (const file of files) {
        if (file.name.toLowerCase().endsWith('.zip')) {
            const zipFiles = await extractFilesFromZip(file);
            extracted.push(...zipFiles);
        } else if (isSupported(file.name)) {
            const base64 = await fileToBase64(file);
            extracted.push({
                name: file.name,
                mimeType: getMimeType(file.name),
                base64,
            });
        }
    }

    return extracted;
};

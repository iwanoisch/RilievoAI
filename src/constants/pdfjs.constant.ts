import * as pdfjsLib from 'pdfjs-dist';
import pdfjsWorkerUrl from 'pdfjs-dist/build/pdf.worker.min.mjs?url';

// Configura il worker globalmente (side-effect una tantum)
pdfjsLib.GlobalWorkerOptions.workerSrc = pdfjsWorkerUrl;

// Deriva i path da workerSrc (Vite risolve ?url import da node_modules)
const PDFJS_BASE = pdfjsWorkerUrl.replace(/build\/.*$/, '');
export const PDFJS_WASM_URL = PDFJS_BASE + 'wasm/';
export const PDFJS_CMAP_URL = PDFJS_BASE + 'cmaps/';
export const PDFJS_STANDARD_FONT_URL = PDFJS_BASE + 'standard_fonts/';

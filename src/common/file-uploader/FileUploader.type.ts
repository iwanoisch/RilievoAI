export interface FileUploaderProps {
    onFilesSelected?: (files: FileWithPreview[]) => void;
    onUpload?: (files: FileWithPreview[]) => Promise<void>;
    maxFiles?: number;
    maxFileSize?: number; // in bytes
    className?: string;
    hideUploadButton?: boolean;
}

export interface FileWithPreview extends File {
    preview?: string;
    description?: string;
}

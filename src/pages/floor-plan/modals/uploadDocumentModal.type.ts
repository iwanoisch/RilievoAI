export interface UploadDocumentModalProps {
    isProcessing: boolean;
    isDragging: boolean;
    onFileSelect: () => void;
    onDragOver: (e: React.DragEvent) => void;
    onDragLeave: (e: React.DragEvent) => void;
    onDrop: (e: React.DragEvent) => void;
    onClose: () => void;
}

import React, {useState, useRef, DragEvent, ChangeEvent} from 'react';
import {FileUploaderProps, FileWithPreview} from "./FileUploader.type.ts";
import {TrashIcon} from "@heroicons/react/24/outline";
import {useAlert} from "../alert/useAlert.ts";
import {LoaderDots} from "../loader-dots/LoaderDots.tsx";

const FileUploader: React.FC<FileUploaderProps> = ({
                                                       onFilesSelected,
                                                       onUpload,
                                                       maxFiles = 10,
                                                       maxFileSize = 50 * 1024 * 1024, // 50MB default
                                                       className = '',
                                                       hideUploadButton = false
                                                   }) => {
    const [selectedFiles, setSelectedFiles] = useState<FileWithPreview[]>([]);
    const [isUploading, setIsUploading] = useState(false);
    const [isDragActive, setIsDragActive] = useState(false);
    const {showAlert} = useAlert();
    const [errors, setErrors] = useState<string[]>([]);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const allDescriptionsFilled = selectedFiles.every(f => f.description && f.description.trim() !== '');
    const [animationStart, setAnimationStart] = useState<boolean>(false);

    const validateFile = (file: File): string | null => {
        if (file.size > maxFileSize) {
            return `${file.name}: File troppo grande (max ${formatFileSize(maxFileSize)})`;
        }
        return null;
    };

    const processFiles = (files: FileList | File[]) => {
        const fileArray = Array.from(files);
        const newErrors: string[] = [];
        const validFiles: FileWithPreview[] = [];

        fileArray.forEach(file => {
            const error = validateFile(file);
            if (error) {
                newErrors.push(error);
            } else {
                const fileWithPreview = Object.assign(file, {
                    preview: file.type.startsWith('image/') ? URL.createObjectURL(file) : undefined
                });
                validFiles.push(fileWithPreview);
            }
        });

        const totalFiles = [...selectedFiles, ...validFiles];
        const filesToKeep = totalFiles.slice(0, maxFiles);

        if (totalFiles.length > maxFiles) {
            newErrors.push(`Massimo ${maxFiles} file consentiti. ${totalFiles.length - maxFiles} file ignorati.`);
        }

        setSelectedFiles(filesToKeep);
        setErrors(newErrors);
        onFilesSelected?.(filesToKeep);
    };

    // Drag handlers
    const handleDragEnter = (e: DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragActive(true);
    };

    const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        // Only set to false if we're leaving the dropzone entirely
        if (!e.currentTarget.contains(e.relatedTarget as Node)) {
            setIsDragActive(false);
        }
    };

    const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
    };

    const handleDrop = (e: DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragActive(false);

        const files = e.dataTransfer.files;
        if (files && files.length > 0) {
            processFiles(files);
        }
    };

    // File input handler
    const handleDescriptionChange = (index: number, value: string) => {
        const updatedFiles = [...selectedFiles];
        updatedFiles[index].description = value;
        setSelectedFiles(updatedFiles);
    };

    const handleFileInput = (e: ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (files && files.length > 0) {
            processFiles(files);
        }
        // Reset input value to allow selecting the same file again
        e.target.value = '';
    };

    const handleClick = () => {
        fileInputRef.current?.click();
    };

    const removeFile = (index: number) => {
        const newFiles = selectedFiles.filter((_, i) => i !== index);
        setSelectedFiles(newFiles);
        onFilesSelected?.(newFiles);

        // Clear errors when files are removed
        if (newFiles.length === 0) {
            setErrors([]);
        }
    };

    const handleUpload = async () => {

        if (selectedFiles.length === 0 || !onUpload) return;

        if (!allDescriptionsFilled) {
            showAlert({
                type: 'error',
                title: 'Descrizione assente',
                message: 'Uno o più file senza descrizione',
                duration: 3000,
                position: 'top-right',
            });
        } else {
            setAnimationStart(true);
            setIsUploading(true);
            try {
                await onUpload(selectedFiles);
                setSelectedFiles([]);
                setErrors([]);
            } catch (error) {
                console.error('Upload failed:', error);
                setErrors(['Errore durante il caricamento. Riprova.']);
            } finally {
                setIsUploading(false);
            }
        }
    };

    const formatFileSize = (bytes: number) => {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    };

    const getFileIcon = (fileName: string) => {
        const extension = fileName.split('.').pop()?.toLowerCase();
        const iconClass = "w-8 h-8 mx-auto mb-2";

        switch (extension) {
            case 'pdf':
                return <div
                    className={`${iconClass} bg-red-100 text-red-600 rounded-lg flex items-center justify-center font-bold text-xs`}>PDF</div>;
            case 'doc':
            case 'docx':
                return <div
                    className={`${iconClass} bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center font-bold text-xs`}>DOC</div>;
            case 'xls':
            case 'xlsx':
                return <div
                    className={`${iconClass} bg-green-100 text-green-600 rounded-lg flex items-center justify-center font-bold text-xs`}>XLS</div>;
            case 'jpg':
            case 'jpeg':
            case 'png':
            case 'gif':
            case 'webp':
                return <div
                    className={`${iconClass} bg-primary-100 text-amber-600 rounded-lg flex items-center justify-center font-bold text-xs`}>IMG</div>;
            case 'mp4':
            case 'avi':
            case 'mov':
                return <div
                    className={`${iconClass} bg-yellow-100 text-yellow-600 rounded-lg flex items-center justify-center font-bold text-xs`}>VID</div>;
            case 'zip':
            case 'rar':
            case '7z':
                return <div
                    className={`${iconClass} bg-slate-100 text-slate-600 rounded-lg flex items-center justify-center font-bold text-xs`}>ZIP</div>;
            default:
                return <div
                    className={`${iconClass} bg-slate-100 text-slate-600 rounded-lg flex items-center justify-center font-bold text-xs`}>FILE</div>;
        }
    };

    return (
        <div className={`w-full max-w-2xl mx-auto ${className}`}>
            {/* Dropzone Area */}
            <div
                onDragEnter={handleDragEnter}
                onDragLeave={handleDragLeave}
                onDragOver={handleDragOver}
                onDrop={handleDrop}
                onClick={handleClick}
                className={`
          relative border-2 border-dashed rounded-2xl p-6 md:p-10 text-center cursor-pointer
          transition-all duration-300 ease-in-out transform
          ${isDragActive
                    ? 'border-blue-400 bg-blue-50 scale-[1.02] shadow-lg'
                    : 'border-slate-300 bg-slate-50 hover:border-slate-400 hover:bg-slate-100 hover:scale-[1.01]'
                }
          ${selectedFiles.length > 0 ? 'border-green-300 bg-green-50' : ''}
        `}
            >
                <input
                    ref={fileInputRef}
                    type="file"
                    multiple
                    onChange={handleFileInput}
                    className="sr-only"
                    aria-label="Seleziona file"
                />

                {/* Upload Icon */}
                <div className="mb-4">
                    {isDragActive ? (
                        <div
                            className="w-16 h-16 md:w-20 md:h-20 mx-auto bg-primary-500 rounded-full flex items-center justify-center animate-pulse">
                            <svg className="w-8 h-8 md:w-10 md:h-10 text-white" fill="none" stroke="currentColor"
                                 viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                      d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"/>
                            </svg>
                        </div>
                    ) : (
                        <div
                            className="w-16 h-16 md:w-20 md:h-20 mx-auto bg-gradient-to-br from-primary-500 to-primary-600 rounded-full flex items-center justify-center shadow-lg">
                            <svg className="w-8 h-8 md:w-10 md:h-10 text-white" fill="none" stroke="currentColor"
                                 viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                      d="M12 6v6m0 0v6m0-6h6m-6 0H6"/>
                            </svg>
                        </div>
                    )}
                </div>

                {/* Text Content */}
                <div className="space-y-2">
                    <h3 className="text-lg md:text-xl font-semibold text-slate-900">
                        {isDragActive ? 'Rilascia qui i file' : 'Carica i tuoi file'}
                    </h3>

                    <div className="text-sm md:text-base text-slate-600">
            <span className="font-medium text-primary-600 hover:text-primary-700 transition-colors">
              Clicca per selezionare
            </span>
                        <span className="hidden sm:inline"> o trascina e rilascia</span>
                    </div>

                    <p className="text-xs md:text-sm text-slate-500">
                        Tutti i tipi di file supportati • Max {formatFileSize(maxFileSize)} per file
                    </p>

                    {selectedFiles.length > 0 && (
                        <p className="text-sm font-medium text-green-600">
                            {selectedFiles.length} file{selectedFiles.length > 1 ? ' selezionati' : ' selezionato'}
                        </p>
                    )}
                </div>

                {/* Pulse Animation Overlay */}
                {isDragActive && (
                    <div className="absolute inset-0 rounded-2xl bg-blue-400 opacity-10 animate-ping"></div>
                )}
            </div>

            {/* Error Messages */}
            {errors.length > 0 && (
                <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                    <h4 className="text-sm font-medium text-red-800 mb-2">Attenzione:</h4>
                    {errors.map((error, index) => (
                        <div key={index} className="text-xs text-red-600 mb-1">
                            {error}
                        </div>
                    ))}
                </div>
            )}

            {/* Selected Files List */}
            {selectedFiles.length > 0 && (
                <div className="mt-6 space-y-3">
                    <h4 className="text-lg font-semibold text-slate-900">File selezionati</h4>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                        {selectedFiles.map((file, index) => (
                            <div key={`${file.name}-${index}`} className="relative group">
                                <div
                                    className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow">
                                    {/* File Icon */}
                                    {getFileIcon(file.name)}
                                    {/* File Info */}
                                    <div className="space-y-1">
                                        <p className="text-md font-medium text-slate-900 py-0.5 break-all" title={file.name}>
                                            {file.name}
                                        </p>
                                        <div className="space-y-1 py-0.5">
                                            <input
                                                type="text"
                                                placeholder="Descrizione del file..."
                                                autoFocus={true}
                                                value={file.description || ''}
                                                onChange={(e) => handleDescriptionChange(index, e.target.value)}
                                                className="w-full border border-slate-500 animate-pulse p-0.5 rounded-md text-sm focus:ring-2 focus:ring-primary-600 focus:outline-none"
                                            />
                                        </div>
                                        <p className="text-xs text-slate-500">
                                            {formatFileSize(file.size)}
                                        </p>
                                    </div>
                                    {/* Remove Button */}
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            removeFile(index);
                                        }}
                                        className="absolute -top-1 -right-1 p-2 text-red-500 hover:text-red-700 transition-colors opacity-100  md:group-hover:opacity-100"
                                        aria-label={`Rimuovi ${file.name}`}
                                    >
                                        <TrashIcon className="h-6 w-6"/>
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                    {animationStart &&
                        <div className="flex justify-center pt-4">
                          <LoaderDots/>
                        </div>
                    }

                    {/* Upload Button */}
                    {onUpload && !hideUploadButton && (
                        <div className="flex justify-center pt-4">
                            <button
                                onClick={handleUpload}
                                disabled={isUploading || selectedFiles.length === 0}
                                className={`
                  px-8 py-3 rounded-full font-semibold text-white text-sm md:text-base
                  transition-all duration-200 transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-primary-300
                  ${isUploading || selectedFiles.length === 0
                                    ? 'bg-slate-400 cursor-not-allowed'
                                    : 'bg-gradient-to-br from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 shadow-lg hover:shadow-xl'
                                }
                `}
                                aria-label="Carica file selezionati"
                            >
                                {isUploading ? (
                                    <div className="flex items-center space-x-2">
                                        <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor"
                                                    strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor"
                                                  d="m4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        <span>Caricamento...</span>
                                    </div>
                                ) : (
                                    `Carica ${selectedFiles.length} file${selectedFiles.length > 1 ? '' : ''}`
                                )}
                            </button>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default FileUploader;

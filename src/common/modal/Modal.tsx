import {Dialog, DialogBackdrop, DialogPanel} from "@headlessui/react";
import * as React from "react";
import {ModalHeader} from "./ModalHeader";
import {ModalBody} from "./ModalBody";
import {ModalFooter} from "./ModalFooter";
import {XMarkIcon} from "@heroicons/react/24/solid";

type ModalSize = "sm" | "md" | "lg" | "xl" | "2xl" | "full";
type ModalPosition = "center" | "top" | "top-right" | "bottom";

type ModalProps = {
    isOpen: boolean;
    onClose?: () => void;
    children?: React.ReactNode;
    size?: ModalSize;
    position?: ModalPosition;
    // Backwards compatible props
    title?: string;
    hideCloseButton?: boolean;
    contentClassName?: string;
    // Fullscreen mode - looks like a page, not a modal
    fullscreen?: boolean;
};

// Dimensioni rimappate con logica:
// sm:  ~450px - per conferme, alert, form piccoli
// md:  ~550px - per form semplici (3-4 campi)
// lg:  ~700px - per form complessi, tabelle piccole
// xl:  ~900px - per contenuti ampi, form a 2 colonne
// 2xl: ~1100px - per tabelle, contenuti molto ampi
// full: tutta la larghezza disponibile
const sizeClasses: Record<ModalSize, string> = {
    sm: "sm:max-w-[450px]",
    md: "sm:max-w-[550px]",
    lg: "sm:max-w-[700px]",
    xl: "sm:max-w-[900px]",
    "2xl": "sm:max-w-[1100px]",
    full: "sm:max-w-[calc(100vw-2rem)] sm:w-full",
};

const positionClasses: Record<ModalPosition, string> = {
    center: "items-center",
    top: "items-start pt-10",
    "top-right": "items-start justify-end pt-4 pr-4 sm:pt-10 sm:pr-10",
    bottom: "items-end pb-4 sm:pb-10",
};

const ModalComponent = ({
    isOpen,
    onClose,
    children,
    size = "md",
    position = "center",
    // Backwards compatible props
    title,
    hideCloseButton = false,
    contentClassName = "",
    fullscreen = false,
}: ModalProps) => {
    if (!isOpen) return null;

    const handleClose = onClose ?? (() => {});

    // Fullscreen mode - looks like a page
    if (fullscreen) {
        return (
            <Dialog open={isOpen} onClose={handleClose} className="relative z-[9998]">
                <div className="fixed inset-0 overflow-y-auto">
                    <DialogPanel className="w-full min-h-screen bg-white">
                        {children}
                    </DialogPanel>
                </div>
            </Dialog>
        );
    }

    return (
        <Dialog open={isOpen} onClose={handleClose} className="relative z-[9998]">
            {/* Sfondo */}
            <DialogBackdrop className="fixed inset-0 bg-slate-900/40" />

            {/* Contenitore principale */}
            <div className={`fixed inset-0 w-screen overflow-y-auto flex ${positionClasses[position]} justify-center p-4`}>
                <DialogPanel
                    className={`w-full min-h-screen sm:min-h-0 bg-white shadow-2xl border border-slate-200 ${sizeClasses[size]} max-h-[95vh] flex flex-col rounded-none sm:rounded-md`}
                >
                    {/* Backwards compatible: header semplice se title è passato */}
                    {title && (
                        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
                            <h3 className="text-lg font-bold text-slate-900 uppercase tracking-tight">
                                {title}
                            </h3>
                            {!hideCloseButton && onClose && (
                                <button
                                    onClick={onClose}
                                    className="p-2 text-slate-400 hover:text-slate-900 transition-colors rounded-md hover:bg-slate-100"
                                    aria-label="Chiudi"
                                >
                                    <XMarkIcon className="h-5 w-5" />
                                </button>
                            )}
                        </div>
                    )}
                    {/* Backwards compatible: content wrapper se title è passato */}
                    {title ? (
                        <div className={`flex-1 overflow-y-auto ${contentClassName}`}>
                            {children}
                        </div>
                    ) : (
                        children
                    )}
                </DialogPanel>
            </div>
        </Dialog>
    );
};

// Compound Component Pattern
export const Modal = Object.assign(ModalComponent, {
    Header: ModalHeader,
    Body: ModalBody,
    Footer: ModalFooter,
});

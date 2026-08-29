import {ReactNode} from "react";


export type ModalDialogType = 'success' | 'error' | 'warning' | 'info';

export interface ModalDialogProps extends ModalDialogOptions {
    onClose: () => void;
}

export interface ModalDialogOptions {
    id?: string;
    type: ModalDialogType;
    title?: string;
    message: string;
    focusBlocked?: boolean;
    duration?: number; // in milliseconds
    links?: ModalLinks[];
    position?: ModalDialogPosition;
}

export interface ModalLinks {
    text: string;
    onClick: () => void;
    variant?: 'primary' | 'danger' | 'link' | 'cancel' | 'single'; // Stile opzionale
}

export interface ModalDialogContextProps {
    showModalDialog: (options: ModalDialogOptions) => string;
    hideModalDialog: (id: string) => void;
    hideAllModalsDialog: () => void;
}

export interface ModalDialogProviderProps {
    children: ReactNode;
    position?: ModalDialogPosition;
    duration?: number;
}

export type ModalDialogPosition =
    | 'top-right'
    | 'top-left'
    | 'bottom-right'
    | 'bottom-left'
    | 'top-center'
    | 'bottom-center'
    | 'center-center';
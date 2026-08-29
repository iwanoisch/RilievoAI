import {ReactNode} from "react";

export interface AlertProps extends AlertOptions {
    onClose: () => void;
}

export type AlertType = 'success' | 'error' | 'warning' | 'info';

export interface AlertOptions {
    id?: string;
    type: AlertType;
    title?: string;
    message: string;
    duration?: number; // in milliseconds
    links?: AlertLinks[];
    position?: AlertPosition;
}

export interface AlertLinks {
    text: string;
    onClick: () => void;
    variant?: 'primary' | 'secondary' | 'link'; // Stile opzionale
}

export interface AlertContextProps {
    showAlert: (options: AlertOptions) => string;
    hideAlert: (id: string) => void;
    hideAllAlerts: () => void;
}

export interface AlertProviderProps {
    children: ReactNode;
    position?: AlertPosition;
    duration?: number;
}

export type AlertPosition =
    | 'top-right'
    | 'top-left'
    | 'bottom-right'
    | 'bottom-left'
    | 'top-center'
    | 'bottom-center'
    | 'center-center';

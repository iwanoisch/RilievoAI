import {CheckCircleIcon, ExclamationTriangleIcon, InformationCircleIcon, XCircleIcon} from "@heroicons/react/24/solid";
import {ModalDialogPosition} from "../common/modal-dialog/ModalDialog.type.ts";

export const modalDialog = {
    success: {
        icon: CheckCircleIcon,
        borderColor: 'border-green-400',
        bgColor: 'bg-green-50',
        iconColor: 'text-green-400',
        textColor: 'text-green-700',
        color: 'green',
        buttonClasses: {
            link: 'text-blue-700 font-medium underline hover:opacity-80 focus:ring-2',
            danger:'inline-flex w-full justify-center rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-xs hover:bg-red-500 sm:ml-3 sm:w-auto',
            cancel  : 'mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-slate-900 shadow-xs inset-ring-1 inset-ring-slate-300 hover:bg-slate-50 sm:mt-0 sm:w-auto',
            primary: 'inline-flex w-full justify-center rounded-md bg-primary-500 px-3 py-2 text-sm font-semibold text-white shadow-xs hover:bg-primary-500 sm:ml-3 sm:w-auto',
            single : 'inline-flex w-full justify-center rounded-md bg-primary-500 px-3 py-2 text-sm font-semibold text-white shadow-xs hover:bg-primary-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600',
        }
    },
    error: {
        icon: XCircleIcon,
        borderColor: 'border-red-400',
        bgColor: 'bg-red-50',
        iconColor: 'text-red-400',
        textColor: 'text-red-700',
        color: 'red',
        buttonClasses: {
            link: 'text-blue-700 font-medium underline hover:opacity-80 focus:ring-2',
            danger:'inline-flex w-full justify-center rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-xs hover:bg-red-500 sm:ml-3 sm:w-auto',
            cancel  : 'mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-slate-900 shadow-xs inset-ring-1 inset-ring-slate-300 hover:bg-slate-50 sm:mt-0 sm:w-auto',
            primary: 'inline-flex w-full justify-center rounded-md bg-primary-500 px-3 py-2 text-sm font-semibold text-white shadow-xs hover:bg-primary-500 sm:ml-3 sm:w-auto',
            single : 'inline-flex w-full justify-center rounded-md bg-primary-500 px-3 py-2 text-sm font-semibold text-white shadow-xs hover:bg-primary-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600',

        }
    },
    warning: {
        icon: ExclamationTriangleIcon,
        borderColor: 'border-yellow-400',
        bgColor: 'bg-yellow-50',
        iconColor: 'text-yellow-400',
        textColor: 'text-yellow-700',
        color: 'yellow',
        buttonClasses: {
            link: 'text-blue-700 font-medium underline hover:opacity-80 focus:ring-2',
            danger:'inline-flex w-full justify-center rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-xs hover:bg-red-500 sm:ml-3 sm:w-auto',
            cancel  : 'mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-slate-900 shadow-xs inset-ring-1 inset-ring-slate-300 hover:bg-slate-50 sm:mt-0 sm:w-auto',
            primary: 'inline-flex w-full justify-center rounded-md bg-primary-500 px-3 py-2 text-sm font-semibold text-white shadow-xs hover:bg-primary-500 sm:ml-3 sm:w-auto',
            single : 'inline-flex w-full justify-center rounded-md bg-primary-500 px-3 py-2 text-sm font-semibold text-white shadow-xs hover:bg-primary-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600',

        }
    },
    info: {
        icon: InformationCircleIcon,
        borderColor: 'border-blue-400',
        bgColor: 'bg-blue-50',
        iconColor: 'text-primary-600',
        textColor: 'text-blue-700',
        color: 'blue',
        buttonClasses: {
            link: 'text-blue-700 font-medium underline hover:opacity-80 focus:ring-2',
            danger:'inline-flex w-full justify-center rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-xs hover:bg-red-500 sm:ml-3 sm:w-auto',
            cancel  : 'mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-slate-900 shadow-xs inset-ring-1 inset-ring-slate-300 hover:bg-slate-50 sm:mt-0 sm:w-auto',
            primary: 'inline-flex w-full justify-center rounded-md bg-primary-500 px-3 py-2 text-sm font-semibold text-white shadow-xs hover:bg-primary-500 sm:ml-3 sm:w-auto',
            single : 'inline-flex w-full justify-center rounded-md bg-primary-500 px-3 py-2 text-sm font-semibold text-white shadow-xs hover:bg-primary-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600',

        }
    },
} as const;

export type ModalDialogConfig = typeof modalDialog;

export const positionClasses: Record<ModalDialogPosition, string> = {
    'top-right': 'top-4 right-4',
    'top-left': 'top-4 left-4',
    'bottom-right': 'bottom-4 right-4',
    'bottom-left': 'bottom-4 left-4',
    'top-center': 'top-4 left-1/2 transform -translate-x-1/2',
    'bottom-center': 'bottom-4 left-1/2 transform -translate-x-1/2',
    'center-center': 'top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2',
};

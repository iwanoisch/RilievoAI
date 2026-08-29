import {CheckCircleIcon, ExclamationTriangleIcon, InformationCircleIcon, XCircleIcon} from "@heroicons/react/24/solid";
import {AlertPosition} from "../common/alert/Alert.type.ts";

export const alertConfig = {
    success: {
        icon: CheckCircleIcon,
        borderColor: 'border-green-400',
        bgColor: 'bg-green-50',
        iconColor: 'text-green-400',
        textColor: 'text-green-700',
        color: 'green',
        buttonClasses: {
            link: 'text-green-700 font-medium underline hover:opacity-80 focus:ring-2',
            primary: 'bg-green-50 bg-opacity-20 hover:bg-opacity-30 text-green-700 focus:ring-2 font-medium text-green-800 hover:bg-green-100 focus:ring-green-600 focus:ring-offset-2 focus:ring-offset-green-50 focus:outline-hidden',
            secondary: 'ring-1 ring-green-300 bg-green-50 bg-opacity-20 hover:bg-opacity-30 text-green-700 focus:ring-2 font-medium text-green-800 hover:bg-green-100 focus:ring-green-600 focus:ring-offset-2 focus:ring-offset-green-50 focus:outline-hidden'
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
            link: 'text-red-700 font-medium underline hover:opacity-80 focus:ring-2',
            primary: 'bg-red-50 bg-opacity-20 hover:bg-opacity-30 text-red-700 focus:ring-2 font-medium text-red-800 hover:bg-red-100 focus:ring-red-600 focus:ring-offset-2 focus:ring-offset-red-50 focus:outline-hidden',
            secondary: 'ring-1 ring-red-300 bg-red-50 bg-opacity-20 hover:bg-opacity-30 text-red-700 focus:ring-2 font-medium text-red-800 hover:bg-red-100 focus:ring-red-600 focus:ring-offset-2 focus:ring-offset-red-50 focus:outline-hidden'
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
            link: 'text-yellow-700 font-medium underline hover:opacity-80 focus:ring-2',
            primary: 'bg-yellow-50 bg-opacity-20 hover:bg-opacity-30 text-yellow-700 focus:ring-2 font-medium text-yellow-800 hover:bg-yellow-100 focus:ring-yellow-600 focus:ring-offset-2 focus:ring-offset-yellow-50 focus:outline-hidden',
            secondary: 'ring-1 ring-yellow-300 bg-yellow-50 bg-opacity-20 hover:bg-opacity-30 text-yellow-700 focus:ring-2 font-medium text-yellow-800 hover:bg-yellow-100 focus:ring-yellow-600 focus:ring-offset-2 focus:ring-offset-yellow-50 focus:outline-hidden'
        }
    },
    info: {
        icon: InformationCircleIcon,
        borderColor: 'border-blue-400',
        bgColor: 'bg-blue-50',
        iconColor: 'text-blue-400',
        textColor: 'text-blue-700',
        color: 'blue',
        buttonClasses: {
            link: 'text-blue-700 font-medium underline hover:opacity-80 focus:ring-2',
            primary: 'bg-blue-50 bg-opacity-20 hover:bg-opacity-30 text-blue-700 focus:ring-2 font-medium text-blue-800 hover:bg-blue-100 focus:ring-blue-600 focus:ring-offset-2 focus:ring-offset-blue-50 focus:outline-hidden',
            secondary: 'ring-1 ring-blue-300 bg-blue-50 bg-opacity-20 hover:bg-opacity-30 text-blue-700 focus:ring-2 font-medium text-blue-800 hover:bg-blue-100 focus:ring-blue-600 focus:ring-offset-2 focus:ring-offset-blue-50 focus:outline-hidden'
        }
    },
} as const;

export type AlertConfig = typeof alertConfig;


export const positionClasses: Record<AlertPosition, string> = {
    'top-right': 'top-4 right-4',
    'top-left': 'top-4 left-4',
    'bottom-right': 'bottom-4 right-4',
    'bottom-left': 'bottom-4 left-4',
    'top-center': 'top-4 left-1/2 transform -translate-x-1/2',
    'bottom-center': 'bottom-4 left-1/2 transform -translate-x-1/2',
    'center-center': 'top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2',
};

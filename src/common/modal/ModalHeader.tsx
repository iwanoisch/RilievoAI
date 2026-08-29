import * as React from "react";
import {XMarkIcon} from "@heroicons/react/24/solid";

type ModalHeaderProps = {
    icon?: React.ComponentType<React.SVGProps<SVGSVGElement>>;
    iconColor?: string;
    title: string;
    subtitle?: string;
    onClose?: () => void;
    className?: string;
};

export const ModalHeader = ({
    icon: Icon,
    iconColor = "text-primary-500",
    title,
    subtitle,
    onClose,
    className = "",
}: ModalHeaderProps) => {
    return (
        <div className={`p-6 border-b border-slate-100 flex items-center justify-between ${className}`}>
            <div className="flex items-center gap-3">
                {Icon && (
                    <div className="p-2.5 border border-slate-200 rounded-xl bg-white">
                        <Icon className={`h-6 w-6 ${iconColor}`} aria-hidden="true" />
                    </div>
                )}
                <div>
                    <h3 className="text-lg font-bold text-slate-900 uppercase tracking-tight">
                        {title}
                    </h3>
                    {subtitle && (
                        <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider mt-0.5">
                            {subtitle}
                        </p>
                    )}
                </div>
            </div>
            {onClose && (
                <button
                    onClick={onClose}
                    className="p-2 text-slate-400 hover:text-slate-900 transition-colors rounded-md hover:bg-slate-100"
                    aria-label="Chiudi"
                >
                    <XMarkIcon className="h-5 w-5" />
                </button>
            )}
        </div>
    );
};
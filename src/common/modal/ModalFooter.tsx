import * as React from "react";

type ModalFooterProps = {
    onCancel?: () => void;
    onSubmit?: () => void;
    cancelText?: string;
    submitText?: string;
    submitDisabled?: boolean;
    submitLoading?: boolean;
    className?: string;
    children?: React.ReactNode;
};

export const ModalFooter = ({
    onCancel,
    onSubmit,
    cancelText = "Annulla",
    submitText = "Salva",
    submitDisabled = false,
    submitLoading = false,
    className = "",
    children,
}: ModalFooterProps) => {
    // Se vengono passati children, renderizza quelli invece dei pulsanti standard
    if (children) {
        return (
            <div className={`mt-auto pt-6 px-6 pb-6 border-t border-slate-100 flex justify-end items-center gap-3 ${className}`}>
                {children}
            </div>
        );
    }

    return (
        <div className={`mt-auto pt-6 px-6 pb-6 border-t border-slate-100 flex justify-end items-center gap-3 ${className}`}>
            {onCancel && (
                <button
                    type="button"
                    onClick={onCancel}
                    className="px-5 py-2.5 text-xs font-semibold text-slate-500 uppercase tracking-wider hover:text-slate-900 hover:bg-slate-50 rounded-md transition-all"
                >
                    {cancelText}
                </button>
            )}
            {onSubmit && (
                <button
                    type="button"
                    onClick={onSubmit}
                    disabled={submitDisabled || submitLoading}
                    className="px-6 py-2.5 bg-primary-500 text-white rounded-md text-xs font-semibold uppercase tracking-wider shadow-sm hover:bg-primary-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                    {submitLoading ? (
                        <span className="flex items-center gap-2">
                            <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                            </svg>
                            {submitText}
                        </span>
                    ) : (
                        submitText
                    )}
                </button>
            )}
        </div>
    );
};
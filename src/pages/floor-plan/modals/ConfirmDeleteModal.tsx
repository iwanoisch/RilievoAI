import {FC} from "react";
import {useTranslation} from "react-i18next";
import {ExclamationTriangleIcon} from "@heroicons/react/24/outline";
import type {ConfirmDeleteModalProps} from "./confirmDeleteModal.type.ts";

export const ConfirmDeleteModal: FC<ConfirmDeleteModalProps> = ({title, message, onConfirm, onClose}) => {
    const {t} = useTranslation();

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={onClose}>
            <div className="card w-full max-w-md" onClick={e => e.stopPropagation()}>
                <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 rounded-lg bg-error-light text-error">
                        <ExclamationTriangleIcon className="h-6 w-6"/>
                    </div>
                    <h2 className="text-lg font-semibold text-text-primary">{title}</h2>
                </div>

                <p className="text-sm text-text-secondary mb-6">{message}</p>

                <div className="flex justify-end gap-3">
                    <button onClick={onClose} className="btn btn-ghost min-h-[44px]">
                        {t('common.cancel')}
                    </button>
                    <button
                        onClick={() => { onConfirm(); onClose(); }}
                        className="btn bg-error text-white hover:bg-red-700 min-h-[44px]"
                    >
                        {t('common.delete')}
                    </button>
                </div>
            </div>
        </div>
    );
};

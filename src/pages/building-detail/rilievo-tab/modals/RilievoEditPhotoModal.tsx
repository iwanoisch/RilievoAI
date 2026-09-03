import {FC, useState} from "react";
import {useTranslation} from "react-i18next";
import {XMarkIcon} from "@heroicons/react/24/solid";
import {TrashIcon} from "@heroicons/react/24/outline";
import type {RilievoEditPhotoModalProps} from "./rilievoModals.type.ts";

export const RilievoEditPhotoModal: FC<RilievoEditPhotoModalProps> = ({photo, onSave, onDelete, onClose}) => {
    const {t} = useTranslation();
    const [note, setNote] = useState(photo.note || '');

    const handleSave = () => {
        onSave({note: note.trim() || undefined});
        onClose();
    };

    const handleDelete = () => {
        onDelete();
        onClose();
    };

    return (
        <div className="fixed inset-0 z-50 bg-surface-page flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-border-default bg-surface-card">
                <h2 className="text-base font-semibold text-slate-700">
                    {t('rilievo.modal_edit_photo')}
                </h2>
                <button
                    onClick={onClose}
                    className="p-2 rounded-lg hover:bg-surface-hover transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center"
                    aria-label={t('rilievo.modal_cancel')}
                >
                    <XMarkIcon className="h-6 w-6 text-slate-500"/>
                </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-4">
                <div className="mx-auto w-full max-w-lg flex flex-col gap-4">
                    <div className="w-full rounded-xl overflow-hidden bg-slate-100 flex items-center justify-center">
                        <img
                            src={photo.uri}
                            alt={photo.note || 'Foto'}
                            className="max-w-full max-h-[50vh] object-contain"
                        />
                    </div>

                    <div>
                        <label htmlFor="rilievo-edit-photo-note" className="text-sm text-slate-600 mb-1 block">
                            {t('rilievo.modal_note')}
                        </label>
                        <input
                            id="rilievo-edit-photo-note"
                            name="rilievo-edit-photo-note"
                            type="text"
                            value={note}
                            onChange={(e) => setNote(e.target.value)}
                            className="input"
                            placeholder={t('rilievo.modal_note_placeholder')}
                        />
                    </div>

                    <p className="text-xs text-text-muted">
                        {new Date(photo.timestamp).toLocaleString()}
                    </p>

                    <button
                        type="button"
                        className="flex items-center gap-2 text-sm text-error hover:text-error-dark transition-colors min-h-[44px]"
                        onClick={handleDelete}
                    >
                        <TrashIcon className="h-4 w-4"/>
                        {t('rilievo.modal_delete_photo')}
                    </button>
                </div>
            </div>

            {/* Footer */}
            <div className="px-4 py-3 border-t border-border-default bg-surface-card flex gap-2">
                <button onClick={onClose} className="btn btn-outline flex-1 min-h-[44px]">
                    {t('rilievo.modal_cancel')}
                </button>
                <button onClick={handleSave} className="btn btn-primary flex-1 min-h-[44px]">
                    {t('rilievo.modal_save')}
                </button>
            </div>
        </div>
    );
};

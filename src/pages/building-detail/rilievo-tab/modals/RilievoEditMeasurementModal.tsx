import {FC, useState} from "react";
import {useTranslation} from "react-i18next";
import {XMarkIcon} from "@heroicons/react/24/solid";
import {TrashIcon} from "@heroicons/react/24/outline";
import {RILIEVO_MEASUREMENT_QUICK_LABELS} from "../../../../constants/rilievo.constant.ts";
import type {RilievoEditMeasurementModalProps} from "./rilievoModals.type.ts";

export const RilievoEditMeasurementModal: FC<RilievoEditMeasurementModalProps> = ({measurement, onSave, onDelete, onClose}) => {
    const {t} = useTranslation();
    const [label, setLabel] = useState(measurement.label);
    const [value, setValue] = useState(measurement.value.toString());
    const [unit, setUnit] = useState(measurement.unit);
    const [source, setSource] = useState(measurement.source);

    const handleSave = () => {
        const numVal = parseFloat(value.replace(',', '.'));
        if (isNaN(numVal) || numVal <= 0 || !label.trim()) return;
        onSave({label: label.trim(), value: numVal, unit, source});
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
                    {t('rilievo.modal_edit_measurement')}
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
                    {/* Quick labels */}
                    <div className="flex flex-wrap gap-1.5">
                        {RILIEVO_MEASUREMENT_QUICK_LABELS.map(ql => (
                            <button
                                key={ql}
                                type="button"
                                className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors min-h-[36px] ${
                                    label === ql
                                        ? 'bg-primary-500 text-white'
                                        : 'bg-surface-hover text-text-secondary hover:bg-primary-50 hover:text-primary-600'
                                }`}
                                onClick={() => setLabel(ql)}
                            >
                                {ql}
                            </button>
                        ))}
                    </div>

                    <div>
                        <label htmlFor="rilievo-edit-meas-label" className="text-sm text-slate-600 mb-1 block">
                            {t('rilievo.modal_meas_label')}
                        </label>
                        <input
                            id="rilievo-edit-meas-label"
                            name="rilievo-edit-meas-label"
                            className="input"
                            value={label}
                            onChange={(e) => setLabel(e.target.value)}
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label htmlFor="rilievo-edit-meas-value" className="text-sm text-slate-600 mb-1 block">
                                {t('rilievo.modal_meas_value')}
                            </label>
                            <input
                                id="rilievo-edit-meas-value"
                                name="rilievo-edit-meas-value"
                                className="input"
                                type="text"
                                inputMode="decimal"
                                value={value}
                                onChange={(e) => setValue(e.target.value)}
                                onKeyDown={(e) => { if (e.key === 'Enter') handleSave(); }}
                            />
                        </div>
                        <div>
                            <label htmlFor="rilievo-edit-meas-unit" className="text-sm text-slate-600 mb-1 block">
                                {t('rilievo.modal_meas_unit')}
                            </label>
                            <select
                                id="rilievo-edit-meas-unit"
                                name="rilievo-edit-meas-unit"
                                className="input"
                                value={unit}
                                onChange={(e) => setUnit(e.target.value as 'm' | 'cm' | 'mm')}
                            >
                                <option value="m">m</option>
                                <option value="cm">cm</option>
                                <option value="mm">mm</option>
                            </select>
                        </div>
                    </div>

                    <div>
                        <label htmlFor="rilievo-edit-meas-source" className="text-sm text-slate-600 mb-1 block">
                            {t('rilievo.modal_meas_source')}
                        </label>
                        <select
                            id="rilievo-edit-meas-source"
                            name="rilievo-edit-meas-source"
                            className="input"
                            value={source}
                            onChange={(e) => setSource(e.target.value as 'manual' | 'voice' | 'laser' | 'ai_estimate')}
                        >
                            <option value="manual">{t('rilievo.source_manual')}</option>
                            <option value="voice">{t('rilievo.source_voice')}</option>
                            <option value="laser">{t('rilievo.source_laser')}</option>
                            <option value="ai_estimate">{t('rilievo.source_ai')}</option>
                        </select>
                    </div>

                    <p className="text-xs text-text-muted">
                        {new Date(measurement.timestamp).toLocaleString()}
                    </p>

                    <button
                        type="button"
                        className="flex items-center gap-2 text-sm text-error hover:text-error-dark transition-colors min-h-[44px]"
                        onClick={handleDelete}
                    >
                        <TrashIcon className="h-4 w-4"/>
                        {t('rilievo.modal_delete_measurement')}
                    </button>
                </div>
            </div>

            {/* Footer */}
            <div className="px-4 py-3 border-t border-border-default bg-surface-card flex gap-2">
                <button onClick={onClose} className="btn btn-outline flex-1 min-h-[44px]">
                    {t('rilievo.modal_cancel')}
                </button>
                <button
                    onClick={handleSave}
                    disabled={!value || !label.trim()}
                    className="btn btn-primary flex-1 min-h-[44px]"
                >
                    {t('rilievo.modal_save')}
                </button>
            </div>
        </div>
    );
};

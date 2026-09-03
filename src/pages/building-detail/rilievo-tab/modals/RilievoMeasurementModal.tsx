import {FC, useEffect, useState} from "react";
import {useTranslation} from "react-i18next";
import {XMarkIcon} from "@heroicons/react/24/solid";
import {RILIEVO_MEASUREMENT_QUICK_LABELS} from "../../../../constants/rilievo.constant.ts";
import type {RilievoMeasureModalProps} from "./rilievoModals.type.ts";
import type {RilievoMeasurement} from "../../../../features/rilievo/rilievo.type.ts";

export const RilievoMeasurementModal: FC<RilievoMeasureModalProps> = ({itemId, onSave, onClose}) => {
    const {t} = useTranslation();

    const [label, setLabel] = useState('');
    const [value, setValue] = useState('');
    const [unit, setUnit] = useState<'m' | 'cm' | 'mm'>('m');
    const [source, setSource] = useState<'manual' | 'voice' | 'laser' | 'ai_estimate'>('manual');

    useEffect(() => {
        const handleKey = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose();
        };
        window.addEventListener('keydown', handleKey);
        return () => window.removeEventListener('keydown', handleKey);
    }, [onClose]);

    const handleSave = () => {
        const numVal = parseFloat(value.replace(',', '.'));
        if (isNaN(numVal) || numVal <= 0 || !label.trim()) return;

        const measurement: RilievoMeasurement = {
            id: `meas-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
            itemId,
            label: label.trim(),
            value: numVal,
            unit,
            source,
            timestamp: new Date().toISOString(),
        };
        onSave(measurement);
        onClose();
    };

    return (
        <div className="fixed inset-0 z-50 bg-surface-page flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-border-default bg-surface-card">
                <h2 className="text-base font-semibold text-slate-700">
                    {t('rilievo.modal_measurement_title')}
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

                    {/* Label */}
                    <div>
                        <label htmlFor="rilievo-meas-label" className="text-sm text-slate-600 mb-1 block">
                            {t('rilievo.modal_meas_label')}
                        </label>
                        <input
                            id="rilievo-meas-label"
                            name="rilievo-meas-label"
                            className="input"
                            value={label}
                            onChange={(e) => setLabel(e.target.value)}
                            placeholder={t('rilievo.meas_label_placeholder')}
                            autoFocus
                        />
                    </div>

                    {/* Value + Unit */}
                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label htmlFor="rilievo-meas-value" className="text-sm text-slate-600 mb-1 block">
                                {t('rilievo.modal_meas_value')}
                            </label>
                            <input
                                id="rilievo-meas-value"
                                name="rilievo-meas-value"
                                className="input"
                                type="text"
                                inputMode="decimal"
                                value={value}
                                onChange={(e) => setValue(e.target.value)}
                                onKeyDown={(e) => { if (e.key === 'Enter') handleSave(); }}
                                placeholder="0.00"
                            />
                        </div>
                        <div>
                            <label htmlFor="rilievo-meas-unit" className="text-sm text-slate-600 mb-1 block">
                                {t('rilievo.modal_meas_unit')}
                            </label>
                            <select
                                id="rilievo-meas-unit"
                                name="rilievo-meas-unit"
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

                    {/* Source */}
                    <div>
                        <label htmlFor="rilievo-meas-source" className="text-sm text-slate-600 mb-1 block">
                            {t('rilievo.modal_meas_source')}
                        </label>
                        <select
                            id="rilievo-meas-source"
                            name="rilievo-meas-source"
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
                </div>
            </div>

            {/* Footer */}
            <div className="px-4 py-3 border-t border-border-default bg-surface-card flex gap-2">
                <button onClick={onClose} className="btn btn-outline flex-1 min-h-[44px]">
                    {t('rilievo.modal_cancel')}
                </button>
                <button
                    onClick={handleSave}
                    disabled={!value || !label.trim() || parseFloat(value.replace(',', '.')) <= 0}
                    className="btn btn-primary flex-1 min-h-[44px]"
                >
                    {t('rilievo.modal_save')}
                </button>
            </div>
        </div>
    );
};

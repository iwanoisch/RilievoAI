import {FC, useState} from "react";
import {ArrowsPointingOutIcon, XMarkIcon} from "@heroicons/react/24/outline";
import {RILIEVO_MEASUREMENT_QUICK_LABELS} from "../../constants/rilievo.constant.ts";
import type {RilievoMeasurementInputProps} from "./rilievoMeasurementInput.type.ts";

export const RilievoMeasurementInput: FC<RilievoMeasurementInputProps> = ({itemId, onAdd}) => {
    const [open, setOpen] = useState(false);
    const [label, setLabel] = useState('');
    const [value, setValue] = useState('');
    const [unit, setUnit] = useState<'m' | 'cm' | 'mm'>('m');

    const handleSubmit = () => {
        const numVal = parseFloat(value.replace(',', '.'));
        if (isNaN(numVal) || !label.trim()) return;

        onAdd({
            id: `meas-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
            itemId,
            label: label.trim(),
            value: numVal,
            unit,
            source: 'manual',
            timestamp: new Date().toISOString(),
        });
        setLabel('');
        setValue('');
        setOpen(false);
    };

    if (!open) {
        return (
            <button
                type="button"
                className="btn btn-outline flex items-center gap-1.5 text-xs min-h-[40px]"
                onClick={() => setOpen(true)}
            >
                <ArrowsPointingOutIcon className="h-4 w-4"/>
                Misura
            </button>
        );
    }

    return (
        <div className="w-full rounded-lg border border-border-default bg-surface-page p-3 space-y-2.5">
            <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-text-muted uppercase tracking-wider">Nuova misurazione</span>
                <button type="button" className="p-1 text-text-muted hover:text-text-primary" onClick={() => setOpen(false)}>
                    <XMarkIcon className="h-4 w-4"/>
                </button>
            </div>

            {/* Quick labels */}
            <div className="flex flex-wrap gap-1.5">
                {RILIEVO_MEASUREMENT_QUICK_LABELS.map(ql => (
                    <button
                        key={ql}
                        type="button"
                        className={`px-2.5 py-1 rounded-full text-xs font-medium transition-colors min-h-[28px] ${
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

            {/* Inputs */}
            <div className="flex items-center gap-2">
                <input
                    className="input text-sm py-1.5 flex-1"
                    placeholder="Etichetta (es: Lunghezza parete)"
                    value={label}
                    onChange={(e) => setLabel(e.target.value)}
                    autoFocus
                />
            </div>
            <div className="flex items-center gap-2">
                <input
                    className="input text-sm py-1.5 w-28"
                    placeholder="0.00"
                    type="text"
                    inputMode="decimal"
                    value={value}
                    onChange={(e) => setValue(e.target.value)}
                    onKeyDown={(e) => { if (e.key === 'Enter') handleSubmit(); }}
                />
                <select
                    className="input text-sm py-1.5 w-16"
                    value={unit}
                    onChange={(e) => setUnit(e.target.value as 'm' | 'cm' | 'mm')}
                >
                    <option value="m">m</option>
                    <option value="cm">cm</option>
                    <option value="mm">mm</option>
                </select>
                <button
                    type="button"
                    className="btn btn-primary py-1.5 px-4 text-sm min-h-[36px]"
                    onClick={handleSubmit}
                >
                    Aggiungi
                </button>
            </div>
        </div>
    );
};

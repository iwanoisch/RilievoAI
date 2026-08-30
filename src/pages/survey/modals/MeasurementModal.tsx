import {FC, useEffect, useState} from "react";
import {useSurvey} from "../../../features/survey/hooks/useSurvey.ts";
import {useBuilding} from "../../../features/building/hooks/useBuilding.ts";
import {XMarkIcon} from "@heroicons/react/24/solid";
import {useTranslation} from "react-i18next";
import type {MeasurementModalProps} from "./measurementModal.type.ts";
import type {Measurement} from "../../../features/survey/slice/survey.type.ts";

export const MeasurementModal: FC<MeasurementModalProps> = ({editData, onClose}) => {
    const {t} = useTranslation();
    const {currentSession, addMeasurement} = useSurvey();
    const {elements} = useBuilding();
    const elementList = Object.values(elements);

    const isEditMode = !!editData;

    const [type, setType] = useState<Measurement['type']>(editData?.type || 'distance');
    const [value, setValue] = useState(editData ? String(editData.value) : '');
    const [unit, setUnit] = useState<Measurement['unit']>(editData?.unit || 'm');
    const [elementId, setElementId] = useState(editData?.elementId || '');
    const [instrument, setInstrument] = useState(editData?.instrumentId || 'manual');

    // Chiudi con Escape
    useEffect(() => {
        const handleKey = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose();
        };
        window.addEventListener('keydown', handleKey);
        return () => window.removeEventListener('keydown', handleKey);
    }, [onClose]);

    const handleSave = () => {
        if (!value || Number(value) <= 0) return;

        if (isEditMode && editData) {
            addMeasurement({
                ...editData,
                type,
                value: Number(value),
                unit,
                elementId: elementId || undefined,
                instrumentId: instrument,
            });
        } else if (currentSession) {
            const measurement: Measurement = {
                id: crypto.randomUUID(),
                sessionId: currentSession.id,
                type,
                value: Number(value),
                unit,
                elementId: elementId || undefined,
                instrumentId: instrument,
                timestamp: new Date().toISOString(),
                confidence: 80,
                dataStatus: 'RAW',
            };
            addMeasurement(measurement);
        }
        onClose();
    };

    return (
        <div className="fixed inset-0 z-50 bg-surface-page flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-border-default bg-surface-card">
                <h2 className="text-base font-semibold text-slate-700">
                    {isEditMode ? t('common.edit') : t('survey.measure')}
                </h2>
                <button
                    onClick={onClose}
                    className="p-2 rounded-lg hover:bg-surface-hover transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center"
                    aria-label={t('common.close')}
                >
                    <XMarkIcon className="h-6 w-6 text-slate-500"/>
                </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-4">
                <div className="mx-auto w-full max-w-lg flex flex-col gap-4">
                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="text-sm text-slate-600 mb-1 block">{t('survey.measurement_type')}</label>
                            <select value={type} onChange={(e) => setType(e.target.value as Measurement['type'])} className="input">
                                <option value="distance">{t('survey.distance')}</option>
                                <option value="height">{t('survey.height')}</option>
                                <option value="thickness">{t('survey.thickness')}</option>
                                <option value="other">{t('survey.other')}</option>
                            </select>
                        </div>
                        <div>
                            <label className="text-sm text-slate-600 mb-1 block">{t('survey.measurement_unit')}</label>
                            <select value={unit} onChange={(e) => setUnit(e.target.value as Measurement['unit'])} className="input">
                                <option value="mm">mm</option>
                                <option value="cm">cm</option>
                                <option value="m">m</option>
                            </select>
                        </div>
                    </div>

                    <div>
                        <label className="text-sm text-slate-600 mb-1 block">{t('survey.measurement_value')}</label>
                        <input
                            type="number"
                            value={value}
                            onChange={(e) => setValue(e.target.value)}
                            min="0"
                            step="0.01"
                            placeholder="0.00"
                            className="input"
                            autoFocus
                        />
                    </div>

                    <div>
                        <label className="text-sm text-slate-600 mb-1 block">{t('survey.measurement_element')}</label>
                        <select value={elementId} onChange={(e) => setElementId(e.target.value)} className="input">
                            <option value="">--</option>
                            {elementList.map((el) => (
                                <option key={el.id} value={el.id}>{el.label}</option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="text-sm text-slate-600 mb-1 block">{t('survey.measurement_instrument')}</label>
                        <select value={instrument} onChange={(e) => setInstrument(e.target.value)} className="input">
                            <option value="manual">{t('survey.manual')}</option>
                            <option value="tape">{t('survey.tape')}</option>
                            <option value="laser">{t('survey.laser')}</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* Footer */}
            <div className="px-4 py-3 border-t border-border-default bg-surface-card flex gap-2">
                <button onClick={onClose} className="btn btn-outline flex-1">{t('common.cancel')}</button>
                <button onClick={handleSave} disabled={!value || Number(value) <= 0} className="btn btn-primary flex-1">
                    {t('common.save')}
                </button>
            </div>
        </div>
    );
};

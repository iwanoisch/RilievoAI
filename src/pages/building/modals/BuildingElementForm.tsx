import {FC, useEffect, useState} from "react";
import {useBuilding} from "../../../features/building/hooks/useBuilding.ts";
import {XMarkIcon} from "@heroicons/react/24/solid";
import {useTranslation} from "react-i18next";
import type {BuildingElementFormProps} from "./buildingElementForm.type.ts";
import type {BuildingElement, ElementType} from "../../../features/building/slice/building.type.ts";
import {BUILDING_ELEMENT_TYPES} from "../../../constants/building-element-types.constant.ts";
import {BUILDING_ELEMENT_CONFIG} from "../../../constants/building-element-config.constant.ts";

export const BuildingElementForm: FC<BuildingElementFormProps> = ({editData, parentId, defaultType, onClose}) => {
    const {t} = useTranslation();
    const {elements, addElement, updateElement} = useBuilding();
    const elementList = Object.values(elements);

    const isEditMode = !!editData;

    const [label, setLabel] = useState(editData?.label || '');
    const [type, setType] = useState<ElementType>(editData?.type || defaultType || 'room');
    const [selectedParentId, setSelectedParentId] = useState(editData?.parentId || parentId || '');
    const [fieldValues, setFieldValues] = useState<Record<string, string>>(() => {
        if (!editData) return {};
        const values: Record<string, string> = {};
        const config = BUILDING_ELEMENT_CONFIG[editData.type];
        for (const field of config.fields) {
            const val = (editData as unknown as Record<string, unknown>)[field.key];
            if (val !== undefined && val !== null) {
                values[field.key] = String(val);
            }
        }
        return values;
    });

    const currentConfig = BUILDING_ELEMENT_CONFIG[type];

    // Reset field values quando cambia il tipo
    useEffect(() => {
        if (!isEditMode) setFieldValues({});
    }, [type, isEditMode]);

    // Chiudi con Escape
    useEffect(() => {
        const handleKey = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose();
        };
        window.addEventListener('keydown', handleKey);
        return () => window.removeEventListener('keydown', handleKey);
    }, [onClose]);

    const updateField = (key: string, value: string) => {
        setFieldValues(prev => ({...prev, [key]: value}));
    };

    const handleSave = async () => {
        if (!label.trim()) return;

        const now = new Date().toISOString();

        const element: Record<string, unknown> = {
            id: editData?.id || crypto.randomUUID(),
            label: label.trim(),
            parentId: type === 'building' ? null : (selectedParentId || null),
            type,
            dataStatus: editData?.dataStatus || 'RAW',
            confidence: editData?.confidence || 100,
            sessionId: editData?.sessionId || 'manual',
            createdAt: editData?.createdAt || now,
            updatedAt: now,
            ...currentConfig.defaultChildren,
        };

        for (const field of currentConfig.fields) {
            const val = fieldValues[field.key];
            if (val !== undefined && val !== '') {
                element[field.key] = field.type === 'number' ? Number(val) : val;
            }
        }

        if (isEditMode) {
            await updateElement(element as unknown as BuildingElement);
        } else {
            await addElement(element as unknown as BuildingElement);
        }
        onClose();
    };

    return (
        <div className="fixed inset-0 z-50 bg-surface-page flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-border-default bg-surface-card">
                <h2 className="text-base font-semibold text-text-primary">
                    {isEditMode ? t('common.edit') : t('building.add_element')}
                </h2>
                <button
                    onClick={onClose}
                    className="p-2 rounded-lg hover:bg-surface-hover transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center"
                    aria-label={t('common.close')}
                >
                    <XMarkIcon className="h-6 w-6 text-text-muted"/>
                </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-4">
                <div className="mx-auto w-full max-w-lg flex flex-col gap-4">
                    <div>
                        <label className="text-sm text-text-secondary mb-1 block">{t('building.label')} *</label>
                        <input
                            type="text"
                            value={label}
                            onChange={(e) => setLabel(e.target.value)}
                            className="input"
                            placeholder={t('building.label_placeholder')}
                            autoFocus
                        />
                    </div>

                    <div>
                        <label className="text-sm text-text-secondary mb-1 block">{t('building.element_type')}</label>
                        <select
                            value={type}
                            onChange={(e) => setType(e.target.value as ElementType)}
                            className="input"
                            disabled={isEditMode}
                        >
                            {BUILDING_ELEMENT_TYPES.map(elType => (
                                <option key={elType} value={elType}>{t('building.' + elType)}</option>
                            ))}
                        </select>
                    </div>

                    {type !== 'building' && (
                        <div>
                            <label className="text-sm text-text-secondary mb-1 block">{t('building.parent_element')}</label>
                            <select
                                value={selectedParentId}
                                onChange={(e) => setSelectedParentId(e.target.value)}
                                className="input"
                            >
                                <option value="">{t('building.no_parent')}</option>
                                {elementList
                                    .filter(el => el.id !== editData?.id)
                                    .map(el => (
                                        <option key={el.id} value={el.id}>
                                            {el.label} ({t('building.' + el.type)})
                                        </option>
                                    ))
                                }
                            </select>
                        </div>
                    )}

                    {/* Campi dinamici dal config */}
                    {currentConfig.fields.map(field => (
                        <div key={field.key}>
                            <label className="text-sm text-text-secondary mb-1 block">
                                {t(field.labelKey)}
                                {field.unit && <span className="text-text-muted ml-1">({field.unit})</span>}
                            </label>
                            {field.type === 'select' && field.options ? (
                                <select
                                    value={fieldValues[field.key] || ''}
                                    onChange={(e) => updateField(field.key, e.target.value)}
                                    className="input"
                                >
                                    <option value="">--</option>
                                    {field.options.map(opt => (
                                        <option key={opt.value} value={opt.value}>{t(opt.labelKey)}</option>
                                    ))}
                                </select>
                            ) : (
                                <input
                                    type={field.type === 'number' ? 'number' : 'text'}
                                    value={fieldValues[field.key] || ''}
                                    onChange={(e) => updateField(field.key, e.target.value)}
                                    className="input"
                                    step={field.type === 'number' ? '0.01' : undefined}
                                    min={field.type === 'number' ? '0' : undefined}
                                />
                            )}
                        </div>
                    ))}
                </div>
            </div>

            {/* Footer */}
            <div className="px-4 py-3 border-t border-border-default bg-surface-card flex gap-2">
                <button onClick={onClose} className="btn btn-outline flex-1">{t('common.cancel')}</button>
                <button
                    onClick={handleSave}
                    disabled={!label.trim()}
                    className="btn btn-primary flex-1"
                >
                    {t('common.save')}
                </button>
            </div>
        </div>
    );
};

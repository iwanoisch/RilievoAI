import {FC, useState} from "react";
import {useTranslation} from "react-i18next";
import {
    DocumentTextIcon,
    ArrowUpTrayIcon,
    TrashIcon,
    ChevronRightIcon,
    PlusIcon,
} from "@heroicons/react/24/outline";
import {PaperClipIcon} from "@heroicons/react/24/solid";
import {RadioGroup, Radio, Field, Label} from "@headlessui/react";
import {ARAZIO_SECTIONS, EMPTY_VALUTAZIONE} from "../../constants/arazio-sections.constant.ts";
import {useArazio} from "../../features/arazio/useArazio.ts";
import {useAlert} from "../../common/alert/useAlert.ts";
import {formatFileSize} from "../../utility/arazio-utils.ts";
import type {ArazioFieldConfig, ArazioGroupConfig, ArazioRepeatableInstance, ArazioValutazione} from "../../features/arazio/arazio.type.ts";
import type {ArazioSectionFormProps} from "./arazioTab.type.ts";

export const ArazioSectionForm: FC<ArazioSectionFormProps> = ({buildingId, sectionId}) => {
    const {t} = useTranslation();
    const arazio = useArazio();
    const {showAlert} = useAlert();
    const [saving, setSaving] = useState(false);
    const [expandedInstances, setExpandedInstances] = useState<Record<string, boolean>>({});

    const config = ARAZIO_SECTIONS.find(s => s.id === sectionId);
    const sectionData = arazio.getSectionData(buildingId, sectionId);

    if (!config) return null;

    const fid = (key: string, instanceId?: string) =>
        instanceId ? `arazio-${sectionId}-${instanceId}-${key}` : `arazio-${sectionId}-${key}`;

    const toggleInstance = (instanceId: string) => {
        setExpandedInstances(prev => ({...prev, [instanceId]: !prev[instanceId]}));
    };

    const handleSaveDraft = async () => {
        setSaving(true);
        const result = await arazio.saveDraft(buildingId, sectionId);
        setSaving(false);
        if (result) showAlert({title: t('arazio.draft_saved'), type: 'success', message: ''});
    };

    const handleSaveComplete = async () => {
        setSaving(true);
        const result = await arazio.saveAndComplete(buildingId, sectionId);
        setSaving(false);
        if (result) showAlert({title: t('arazio.section_completed'), type: 'success', message: ''});
    };

    const handleCancel = () => {
        // TODO: reload from server
    };

    // ── Render field ──
    const renderField = (
        field: ArazioFieldConfig,
        getValue: () => string,
        onChange: (val: string) => void,
        idPrefix: string,
        instanceId?: string,
    ) => {
        const fieldValue = getValue();
        const id = fid(field.key, instanceId);

        switch (field.type) {
            case 'heading':
                return null;

            case 'checkbox':
                return (
                    <label htmlFor={id} className="flex items-center gap-2.5 min-h-[44px] cursor-pointer">
                        <input
                            id={id}
                            name={id}
                            type="checkbox"
                            checked={fieldValue === 'true'}
                            onChange={(e) => onChange(e.target.checked ? 'true' : '')}
                            className="h-5 w-5 rounded border-border-strong text-primary-500 focus:ring-primary-500/30 accent-primary-500 cursor-pointer"
                        />
                        <span className="text-sm text-text-secondary">{field.label}</span>
                    </label>
                );

            case 'file': {
                const isMultiple = field.multiple !== false;
                const attachments = sectionData.attachments.filter(a =>
                    a.fieldKey === field.key && (instanceId ? a.instanceId === instanceId : !a.instanceId)
                );
                const hasFile = attachments.length > 0;
                const showUploadButton = isMultiple || !hasFile;
                return (
                    <div className="space-y-3">
                        <p className="flex items-center gap-1.5 text-xs font-medium text-text-muted">
                            <PaperClipIcon className="h-3.5 w-3.5 text-primary-400"/>
                            {field.label}
                        </p>
                        {hasFile && (
                            <ul className="space-y-1.5">
                                {attachments.map(att => (
                                    <li key={att.id} className="group flex items-center gap-3 text-sm bg-surface-page rounded-lg border border-border-light px-3 py-2 transition-colors hover:border-border-default">
                                        <span className="flex items-center justify-center h-8 w-8 rounded-lg bg-primary-50 shrink-0">
                                            <DocumentTextIcon className="h-5 w-5 text-primary-500"/>
                                        </span>
                                        <div className="flex-1 min-w-0">
                                            <a href={att.url} target="_blank" rel="noreferrer" className="block text-sm font-medium text-text-primary truncate hover:text-primary-600 hover:underline">
                                                {att.name}
                                            </a>
                                            <span className="text-xs text-text-muted">{formatFileSize(att.size)}</span>
                                        </div>
                                        <button
                                            type="button"
                                            onClick={() => arazio.removeAttachment(buildingId, sectionId, att.id)}
                                            className="p-1.5 rounded-lg text-text-disabled hover:text-error hover:bg-error-light transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center"
                                            aria-label={t('common.delete')}
                                        >
                                            <TrashIcon className="h-5 w-5"/>
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        )}
                        {showUploadButton && (
                            <label htmlFor={id} className="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-primary-600 bg-primary-50 border border-dashed border-primary-200 rounded-lg cursor-pointer hover:bg-primary-100 hover:border-primary-300 transition-colors min-h-[44px]">
                                <ArrowUpTrayIcon className="h-4 w-4"/>
                                {t('arazio.upload_file')}
                                <input
                                    id={id}
                                    name={id}
                                    multiple={isMultiple}
                                    className="hidden"
                                    type="file"
                                    accept={field.accept}
                                    onChange={(e) => {
                                        const files = e.target.files;
                                        if (files && files.length > 0) {
                                            arazio.addAttachments(buildingId, sectionId, field.key, Array.from(files), instanceId);
                                            e.target.value = '';
                                        }
                                    }}
                                />
                            </label>
                        )}
                        {!isMultiple && hasFile && (
                            <label htmlFor={`${id}-replace`} className="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-text-secondary bg-surface-card border border-dashed border-border-strong rounded-lg cursor-pointer hover:bg-surface-hover transition-colors min-h-[44px]">
                                <ArrowUpTrayIcon className="h-4 w-4"/>
                                {t('arazio.replace_file')}
                                <input
                                    id={`${id}-replace`}
                                    name={`${id}-replace`}
                                    className="hidden"
                                    type="file"
                                    accept={field.accept}
                                    onChange={(e) => {
                                        const files = e.target.files;
                                        if (files && files.length > 0) {
                                            attachments.forEach(att => arazio.removeAttachment(buildingId, sectionId, att.id));
                                            arazio.addAttachments(buildingId, sectionId, field.key, [files[0]], instanceId);
                                            e.target.value = '';
                                        }
                                    }}
                                />
                            </label>
                        )}
                    </div>
                );
            }

            case 'textarea':
                return <textarea id={id} name={id} className="input w-full text-sm min-h-[80px] resize-y" value={fieldValue} placeholder={field.placeholder} onChange={(e) => onChange(e.target.value)}/>;

            case 'select':
                return (
                    <select id={id} name={id} className="input w-full text-sm" value={fieldValue} onChange={(e) => onChange(e.target.value)}>
                        <option value="">{t('arazio.select_placeholder')}</option>
                        {field.options?.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                    </select>
                );

            case 'radio':
                return (
                    <RadioGroup name={id} value={fieldValue} onChange={onChange} className="flex flex-wrap gap-x-5 gap-y-2 mt-1" aria-labelledby={`${id}-label`}>
                        {field.options?.map(opt => (
                            <Field key={opt.value} className="flex items-center gap-2.5 min-h-[44px]">
                                <Radio value={opt.value} className="group flex h-5 w-5 items-center justify-center rounded-full border-2 border-border-strong bg-surface-card cursor-pointer transition-colors focus:outline-none data-[focus]:ring-2 data-[focus]:ring-primary-500/30 data-[focus]:ring-offset-1 data-[checked]:border-primary-500 data-[checked]:bg-primary-500">
                                    <span className="invisible h-2 w-2 rounded-full bg-white group-data-[checked]:visible"/>
                                </Radio>
                                <Label className="text-sm text-text-secondary cursor-pointer">{opt.label}</Label>
                            </Field>
                        ))}
                    </RadioGroup>
                );

            default:
                return <input id={id} name={id} className="input w-full text-sm" type={field.type === 'number' ? 'number' : field.type === 'date' ? 'date' : 'text'} value={fieldValue} placeholder={field.placeholder} onChange={(e) => onChange(e.target.value)}/>;
        }
    };

    // ── Render griglia campi ──
    const renderFieldGrid = (
        fields: ArazioFieldConfig[],
        getValue: (key: string) => string,
        onChange: (key: string, val: string) => void,
        idPrefix: string,
        instanceId?: string,
    ) => (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
            {fields.map((field) => {
                if (field.type === 'heading') {
                    return (
                        <div key={field.key} className="md:col-span-2 pt-2">
                            <h5 className="text-xs font-semibold uppercase tracking-wider text-primary-700 border-b border-primary-100 pb-1">{field.label}</h5>
                        </div>
                    );
                }
                if (field.type === 'checkbox') {
                    return (
                        <div key={field.key} className={field.colSpan === 2 ? 'md:col-span-2' : ''}>
                            {renderField(field, () => getValue(field.key), (v) => onChange(field.key, v), idPrefix, instanceId)}
                        </div>
                    );
                }
                const id = fid(field.key, instanceId);
                return (
                    <div key={field.key} className={field.colSpan === 2 ? 'md:col-span-2' : ''}>
                        <label
                            id={field.type === 'radio' ? `${id}-label` : undefined}
                            htmlFor={field.type === 'radio' || field.type === 'file' ? undefined : id}
                            className="block text-xs font-medium text-text-secondary mb-1.5"
                        >
                            {field.label}
                            {field.required && <span className="text-primary-500 ml-0.5">*</span>}
                        </label>
                        {renderField(field, () => getValue(field.key), (v) => onChange(field.key, v), idPrefix, instanceId)}
                    </div>
                );
            })}
        </div>
    );

    // ── Render valutazione ──
    const renderValutazione = (
        valutazione: ArazioValutazione,
        onChangeVal: (key: keyof ArazioValutazione, value: string) => void,
        idSuffix: string,
    ) => (
        <div className="mt-4 rounded-xl border border-warning/30 bg-warning-light/30 p-4">
            <p className="text-xs font-semibold uppercase tracking-wider text-warning-dark mb-3">{t('arazio.valutazione_record')}</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                {([
                    ['responsabile', t('arazio.val_responsabile'), 'text'],
                    ['scadenza', t('arazio.val_scadenza'), 'date'],
                ] as const).map(([key, label, type]) => (
                    <div key={key}>
                        <label htmlFor={`val-${idSuffix}-${key}`} className="block text-xs font-medium text-text-muted mb-1">{label}</label>
                        <input id={`val-${idSuffix}-${key}`} name={`val-${idSuffix}-${key}`} className="input w-full text-sm" type={type} value={valutazione[key]} onChange={(e) => onChangeVal(key, e.target.value)}/>
                    </div>
                ))}
                {([
                    ['criticita', t('arazio.val_criticita'), [{v: 'si', l: t('arazio.yes')}, {v: 'no', l: t('arazio.no')}]],
                    ['priorita', t('arazio.val_priorita'), [{v: 'a', l: 'A'}, {v: 'b', l: 'B'}, {v: 'c', l: 'C'}]],
                    ['rischio', t('arazio.val_rischio'), [{v: '1', l: '1'}, {v: '2', l: '2'}, {v: '3', l: '3'}, {v: '4', l: '4'}, {v: '5', l: '5'}]],
                    ['impatto', t('arazio.val_impatto'), [{v: '1', l: '1'}, {v: '2', l: '2'}, {v: '3', l: '3'}, {v: '4', l: '4'}, {v: '5', l: '5'}]],
                ] as [keyof ArazioValutazione, string, {v: string; l: string}[]][]).map(([key, label, opts]) => (
                    <div key={key}>
                        <label htmlFor={`val-${idSuffix}-${key}`} className="block text-xs font-medium text-text-muted mb-1">{label}</label>
                        <select id={`val-${idSuffix}-${key}`} name={`val-${idSuffix}-${key}`} className="input w-full text-sm" value={valutazione[key]} onChange={(e) => onChangeVal(key, e.target.value)}>
                            <option value="">&mdash;</option>
                            {opts.map(o => <option key={o.v} value={o.v}>{o.l}</option>)}
                        </select>
                    </div>
                ))}
                <div className="sm:col-span-2">
                    <label htmlFor={`val-${idSuffix}-azione`} className="block text-xs font-medium text-text-muted mb-1">{t('arazio.val_azione')}</label>
                    <input id={`val-${idSuffix}-azione`} name={`val-${idSuffix}-azione`} className="input w-full text-sm" type="text" value={valutazione.azioneRichiesta} onChange={(e) => onChangeVal('azioneRichiesta', e.target.value)}/>
                </div>
            </div>
        </div>
    );

    // ── Render sotto-gruppo standard (dentro istanza ripetibile) ──
    const renderNestedStandardGroup = (subGroup: ArazioGroupConfig, parentGroupKey: string, parentInstance: ArazioRepeatableInstance) => {
        const valutazione = parentInstance.subGroupValutazioni[subGroup.key] ?? EMPTY_VALUTAZIONE;

        return (
            <div key={subGroup.key}>
                <div className="flex items-center justify-between border-b border-border-default pb-2 mb-4">
                    <h4 className="text-xs font-semibold text-text-muted uppercase tracking-wider">
                        {subGroup.label}
                        {subGroup.required && (
                            <span className="ml-2 text-primary-500 normal-case font-medium">{t('arazio.required')}</span>
                        )}
                    </h4>
                </div>
                {renderFieldGrid(
                    subGroup.fields,
                    (key) => parentInstance.values[key] ?? '',
                    (key, val) => arazio.updateRepeatableField(buildingId, sectionId, parentGroupKey, parentInstance.id, key, val),
                    `${parentGroupKey}-${parentInstance.id}-${subGroup.key}`,
                    parentInstance.id,
                )}
                {subGroup.hasValutazione && renderValutazione(
                    valutazione,
                    (key, val) => arazio.updateSubGroupValutazione(buildingId, sectionId, parentGroupKey, parentInstance.id, subGroup.key, key, val),
                    `${parentGroupKey}-${parentInstance.id}-${subGroup.key}`,
                )}
            </div>
        );
    };

    // ── Render sotto-gruppo ripetibile (nidificato dentro istanza) ──
    const renderNestedRepeatableGroup = (subGroup: ArazioGroupConfig, parentGroupKey: string, parentInstance: ArazioRepeatableInstance) => {
        const subInstances = parentInstance.subRepeatables[subGroup.key] ?? [];

        return (
            <div key={subGroup.key} className="space-y-3">
                <div className="flex items-center justify-between border-b border-border-default pb-2">
                    <h4 className="text-xs font-semibold text-text-muted uppercase tracking-wider">
                        {subGroup.label}
                        <span className="ml-2 text-primary-500 normal-case font-medium">{t('arazio.repeatable')}</span>
                    </h4>
                    <button
                        type="button"
                        onClick={() => arazio.addSubRepeatableInstance(buildingId, sectionId, parentGroupKey, parentInstance.id, subGroup.key)}
                        className="inline-flex items-center gap-1 text-xs font-medium text-primary-700 hover:text-primary-800 min-h-[44px]"
                    >
                        <PlusIcon className="h-3.5 w-3.5"/>
                        {t('arazio.add')} {subGroup.label.toLowerCase()}
                    </button>
                </div>

                {subInstances.map((subInst, idx) => {
                    const isSubExpanded = expandedInstances[subInst.id] !== false;
                    return (
                        <div key={subInst.id} className="rounded-lg border border-border-default bg-surface-page/50 overflow-hidden">
                            <div className="flex items-center justify-between px-3 py-2.5 cursor-pointer hover:bg-surface-hover transition-colors" onClick={() => toggleInstance(subInst.id)}>
                                <div className="flex items-center gap-2 min-w-0">
                                    <ChevronRightIcon className={`h-4 w-4 text-text-disabled shrink-0 transition-transform ${isSubExpanded ? 'rotate-90' : ''}`}/>
                                    <span className="text-sm font-medium text-text-primary shrink-0">
                                        {subGroup.label} #{idx + 1}
                                    </span>
                                </div>
                                <button
                                    type="button"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        arazio.removeSubRepeatableInstance(buildingId, sectionId, parentGroupKey, parentInstance.id, subGroup.key, subInst.id);
                                    }}
                                    className="p-1.5 rounded-lg text-text-disabled hover:text-error hover:bg-error-light transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center"
                                    aria-label={t('common.delete')}
                                >
                                    <TrashIcon className="h-5 w-5"/>
                                </button>
                            </div>
                            {isSubExpanded && (
                                <div className="px-3 pb-3 pt-2 border-t border-border-light">
                                    {renderFieldGrid(
                                        subGroup.fields,
                                        (key) => subInst.values[key] ?? '',
                                        (key, val) => arazio.updateSubRepeatableField(buildingId, sectionId, parentGroupKey, parentInstance.id, subGroup.key, subInst.id, key, val),
                                        `${parentGroupKey}-${parentInstance.id}-${subGroup.key}-${subInst.id}`,
                                        subInst.id,
                                    )}
                                    {subGroup.hasValutazione && renderValutazione(
                                        subInst.valutazione,
                                        (key, val) => arazio.updateSubRepeatableValutazione(buildingId, sectionId, parentGroupKey, parentInstance.id, subGroup.key, subInst.id, key, val),
                                        `${parentGroupKey}-${parentInstance.id}-${subGroup.key}-${subInst.id}`,
                                    )}
                                </div>
                            )}
                        </div>
                    );
                })}

                {subInstances.length === 0 && (
                    <p className="text-sm text-text-muted italic py-2">{t('arazio.no_instances')}</p>
                )}
            </div>
        );
    };

    // ── Render gruppo ripetibile ──
    const renderRepeatableGroup = (group: ArazioGroupConfig) => {
        const instances = sectionData.repeatables[group.key] ?? [];

        return (
            <div key={group.key} className="space-y-3">
                <div className="flex items-center justify-between border-b border-border-default pb-2">
                    <h4 className="text-xs font-semibold text-text-muted uppercase tracking-wider">
                        {group.label}
                        <span className="ml-2 text-primary-500 normal-case font-medium">{t('arazio.repeatable')}</span>
                    </h4>
                    <button
                        type="button"
                        onClick={() => arazio.addRepeatableInstance(buildingId, sectionId, group.key)}
                        className="inline-flex items-center gap-1 text-xs font-medium text-primary-700 hover:text-primary-800 min-h-[44px]"
                    >
                        <PlusIcon className="h-3.5 w-3.5"/>
                        {t('arazio.add')} {group.label.toLowerCase()}
                    </button>
                </div>

                {instances.map((instance, idx) => {
                    const isExpanded = expandedInstances[instance.id] !== false;
                    return (
                        <div key={instance.id} className="rounded-lg border border-border-default bg-surface-card overflow-hidden">
                            {/* Accordion header */}
                            <div className="flex items-center justify-between px-4 py-3 cursor-pointer hover:bg-surface-hover transition-colors" onClick={() => toggleInstance(instance.id)}>
                                <div className="flex items-center gap-2 min-w-0">
                                    <ChevronRightIcon className={`h-4 w-4 text-text-disabled shrink-0 transition-transform ${isExpanded ? 'rotate-90' : ''}`}/>
                                    <span className="text-sm font-medium text-text-primary shrink-0">
                                        {group.label} #{idx + 1}
                                    </span>
                                </div>
                                <button
                                    type="button"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        arazio.removeRepeatableInstance(buildingId, sectionId, group.key, instance.id);
                                    }}
                                    className="p-1.5 rounded-lg text-text-disabled hover:text-error hover:bg-error-light transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center"
                                    aria-label={t('common.delete')}
                                >
                                    <TrashIcon className="h-5 w-5"/>
                                </button>
                            </div>

                            {/* Accordion content */}
                            {isExpanded && (
                                <div className="px-4 pb-4 pt-2 border-t border-border-light space-y-6">
                                    {/* Campi diretti del gruppo */}
                                    {group.fields.length > 0 && renderFieldGrid(
                                        group.fields,
                                        (key) => instance.values[key] ?? '',
                                        (key, val) => arazio.updateRepeatableField(buildingId, sectionId, group.key, instance.id, key, val),
                                        `${group.key}-${instance.id}`,
                                        instance.id,
                                    )}
                                    {group.hasValutazione && renderValutazione(
                                        instance.valutazione,
                                        (key, val) => arazio.updateRepeatableValutazione(buildingId, sectionId, group.key, instance.id, key, val),
                                        `${group.key}-${instance.id}`,
                                    )}

                                    {/* Sub-groups nidificati */}
                                    {group.subGroups?.map(subGroup =>
                                        subGroup.repeatable
                                            ? renderNestedRepeatableGroup(subGroup, group.key, instance)
                                            : renderNestedStandardGroup(subGroup, group.key, instance)
                                    )}
                                </div>
                            )}
                        </div>
                    );
                })}

                {instances.length === 0 && (
                    <p className="text-sm text-text-muted italic py-3">{t('arazio.no_instances')}</p>
                )}
            </div>
        );
    };

    // ── Render gruppo standard ──
    const renderStandardGroup = (group: ArazioGroupConfig) => {
        const groupValutazione = sectionData.groupValutazioni[group.key] ?? {...EMPTY_VALUTAZIONE};

        return (
            <div key={group.key}>
                <div className="flex items-center justify-between border-b border-border-default pb-2 mb-4">
                    <h4 className="text-xs font-semibold text-text-muted uppercase tracking-wider">
                        {group.label}
                        {group.required && (
                            <span className="ml-2 text-primary-500 normal-case font-medium">{t('arazio.required')}</span>
                        )}
                    </h4>
                    {group.optional && (
                        <button
                            type="button"
                            onClick={() => arazio.removeOptionalGroup(buildingId, sectionId, group.key)}
                            className="inline-flex items-center gap-1 text-xs font-medium text-primary-700 hover:text-primary-800 min-h-[44px]"
                        >
                            <TrashIcon className="h-3.5 w-3.5"/>
                            {t('arazio.remove_section')}
                        </button>
                    )}
                </div>

                {renderFieldGrid(
                    group.fields,
                    (key) => sectionData.values[key] ?? '',
                    (key, val) => arazio.updateSection(buildingId, sectionId, {
                        values: {...sectionData.values, [key]: val},
                    }),
                    group.key,
                )}

                {group.hasValutazione && renderValutazione(
                    groupValutazione,
                    (key, val) => arazio.updateGroupValutazione(buildingId, sectionId, group.key, key, val),
                    group.key,
                )}
            </div>
        );
    };

    return (
        <div>
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
                <div className="flex items-center gap-3">
                    <span className="flex items-center justify-center h-9 w-9 rounded-xl bg-primary-100 text-primary-600 shrink-0">
                        <DocumentTextIcon className="h-5 w-5"/>
                    </span>
                    <h3 className="text-base font-bold text-text-primary">
                        {config.number}. {config.label}
                    </h3>
                </div>
                <span className={`badge self-start ${
                    sectionData.status === 'completed' ? 'badge-success'
                        : sectionData.status === 'draft' ? 'badge-warning'
                            : 'badge-info'
                }`}>
                    {t(`arazio.status_${sectionData.status}`)}
                </span>
            </div>

            {/* Gruppi */}
            <div className="space-y-8">
                {config.groups
                    .filter(group => !group.optional || sectionData.visibleOptionalGroups.includes(group.key))
                    .map((group) =>
                        group.repeatable ? renderRepeatableGroup(group) : renderStandardGroup(group)
                    )}

                {/* Select per aggiungere gruppi opzionali */}
                {(() => {
                    const hiddenOptional = config.groups.filter(
                        g => g.optional && !sectionData.visibleOptionalGroups.includes(g.key)
                    );
                    if (hiddenOptional.length === 0) return null;
                    return (
                        <select
                            id={`${sectionId}-add-section`}
                            name={`${sectionId}-add-section`}
                            className="input text-sm max-w-xs"
                            value=""
                            onChange={(e) => {
                                if (e.target.value) {
                                    arazio.addOptionalGroup(buildingId, sectionId, e.target.value);
                                }
                            }}
                        >
                            <option value="">+ {t('arazio.add_section')}</option>
                            {hiddenOptional.map(g => (
                                <option key={g.key} value={g.key}>{g.label}</option>
                            ))}
                        </select>
                    );
                })()}
            </div>

            {/* Bottoni */}
            <div className="flex flex-col-reverse sm:flex-row justify-end gap-3 pt-6 mt-6 border-t border-border-default">
                <button className="btn btn-ghost min-h-[44px]" onClick={handleCancel} disabled={saving}>
                    {t('arazio.cancel')}
                </button>
                <button className="btn btn-outline min-h-[44px]" onClick={handleSaveDraft} disabled={saving}>
                    {t('arazio.save_draft')}
                </button>
                <button className="btn btn-primary min-h-[44px]" onClick={handleSaveComplete} disabled={saving}>
                    {t('arazio.save_complete')}
                </button>
            </div>
        </div>
    );
};

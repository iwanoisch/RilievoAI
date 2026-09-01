import {FC, useEffect, useState} from "react";
import {useTranslation} from "react-i18next";
import {XMarkIcon, BuildingOffice2Icon} from "@heroicons/react/24/outline";
import type {CreateBuildingModalProps} from "./createBuildingModal.type.ts";
import type {BuildingCardData, BuildingStatus} from "../../../features/buildings/buildings.type.ts";
import {useBuildings} from "../../../features/buildings/useBuildings.ts";
import {getNextBuildingsId} from "../../../utility/id-utils.ts";
import {BUILDING_STATUS_LABEL, BUILDING_TYPE_KEYS, BUILDING_STATUS_OPTIONS} from "../../../constants/buildings.constant.ts";
import {fileToImageData} from "../../../utility/image-utils.ts";

export const CreateBuildingModal: FC<CreateBuildingModalProps> = ({onClose, onCreated}) => {
    const {t} = useTranslation();
    const {createBuilding} = useBuildings();

    const [name, setName] = useState('');
    const [address, setAddress] = useState('');
    const [city, setCity] = useState('');
    const [buildingType, setBuildingType] = useState('');
    const [description, setDescription] = useState('');
    const [yearBuilt, setYearBuilt] = useState<number | undefined>(undefined);
    const [floorsCount, setFloorsCount] = useState<number>(1);
    const [deadline, setDeadline] = useState('');
    const [status, setStatus] = useState<BuildingStatus>('active');
    const [imageUrl, setImageUrl] = useState<string | undefined>(undefined);

    const isValid = name.trim() !== '' && address.trim() !== '' && city.trim() !== '';

    useEffect(() => {
        const handleKeyDown = (e: globalThis.KeyboardEvent) => {
            if (e.key === 'Escape') onClose();
        };
        document.addEventListener('keydown', handleKeyDown);
        return () => document.removeEventListener('keydown', handleKeyDown);
    }, [onClose]);

    const handleSubmit = async () => {
        if (!isValid) return;

        const id = getNextBuildingsId();
        const code = `ED-${id.padStart(4, '0')}`;
        const building: BuildingCardData = {
            id,
            code,
            name: name.trim(),
            address: address.trim(),
            city: city.trim(),
            buildingType: buildingType || t('buildings.type_other'),
            description: description.trim() || undefined,
            yearBuilt,
            floorsCount,
            completionPercent: 0,
            criticalityCount: 0,
            status,
            createdAt: new Date().toISOString(),
            deadline: deadline ? new Date(deadline).toISOString() : undefined,
            imageUrl,
        };

        await createBuilding(building);
        onCreated(id);
    };

    return (
        <div className="fixed inset-0 z-50 bg-surface-page flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-border-default bg-surface-card">
                <h2 className="text-base font-semibold text-slate-700">{t('buildings.create_title')}</h2>
                <button
                    onClick={onClose}
                    className="p-2 rounded-lg hover:bg-surface-hover transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center"
                    aria-label={t('common.close')}
                >
                    <XMarkIcon className="h-6 w-6 text-slate-500"/>
                </button>
            </div>

            {/* Form */}
            <div className="flex-1 overflow-y-auto p-4">
                <div className="mx-auto w-full max-w-lg grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Immagine */}
                    <div className="sm:col-span-2">
                        <label className="text-sm text-slate-600 mb-1 block">
                            {t('buildings.field_image')}
                        </label>
                        <div className="flex items-center gap-4">
                            <div className="w-24 h-24 rounded-lg bg-gradient-to-br from-slate-200 to-slate-300 flex items-center justify-center overflow-hidden flex-shrink-0">
                                {imageUrl ? (
                                    <img src={imageUrl} alt="" className="w-full h-full object-cover"/>
                                ) : (
                                    <BuildingOffice2Icon className="h-10 w-10 text-slate-400"/>
                                )}
                            </div>
                            <div className="flex flex-col gap-2">
                                <label className="btn btn-outline text-sm min-h-[44px] cursor-pointer inline-flex items-center justify-center">
                                    {t('buildings.upload_image')}
                                    <input
                                        type="file"
                                        accept=".png,.jpg,.jpeg,.webp"
                                        className="hidden"
                                        onChange={async (e) => {
                                            const file = e.target.files?.[0];
                                            if (!file) return;
                                            const result = await fileToImageData(file);
                                            setImageUrl(result.mediaPath);
                                        }}
                                    />
                                </label>
                                {imageUrl && (
                                    <button
                                        type="button"
                                        onClick={() => setImageUrl(undefined)}
                                        className="text-xs text-error hover:underline"
                                    >
                                        {t('buildings.remove_image')}
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Nome */}
                    <div className="sm:col-span-2">
                        <label className="text-sm text-slate-600 mb-1 block">
                            {t('buildings.field_name')} <span className="text-error">*</span>
                        </label>
                        <input
                            type="text"
                            className="input w-full"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            autoFocus
                        />
                    </div>

                    {/* Indirizzo */}
                    <div>
                        <label className="text-sm text-slate-600 mb-1 block">
                            {t('buildings.field_address')} <span className="text-error">*</span>
                        </label>
                        <input
                            type="text"
                            className="input w-full"
                            value={address}
                            onChange={(e) => setAddress(e.target.value)}
                        />
                    </div>

                    {/* Città */}
                    <div>
                        <label className="text-sm text-slate-600 mb-1 block">
                            {t('buildings.field_city')} <span className="text-error">*</span>
                        </label>
                        <input
                            type="text"
                            className="input w-full"
                            value={city}
                            onChange={(e) => setCity(e.target.value)}
                        />
                    </div>

                    {/* Tipo edificio */}
                    <div>
                        <label className="text-sm text-slate-600 mb-1 block">
                            {t('buildings.field_type')}
                        </label>
                        <select
                            className="input w-full"
                            value={buildingType}
                            onChange={(e) => setBuildingType(e.target.value)}
                        >
                            <option value="">{t('buildings.field_type')}</option>
                            {BUILDING_TYPE_KEYS.map((key) => (
                                <option key={key} value={t(`buildings.${key}`)}>
                                    {t(`buildings.${key}`)}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Numero piani */}
                    <div>
                        <label className="text-sm text-slate-600 mb-1 block">
                            {t('buildings.field_floors')}
                        </label>
                        <input
                            type="number"
                            className="input w-full"
                            value={floorsCount}
                            onChange={(e) => setFloorsCount(Math.max(1, Number(e.target.value)))}
                            min={1}
                        />
                    </div>

                    {/* Anno costruzione */}
                    <div>
                        <label className="text-sm text-slate-600 mb-1 block">
                            {t('buildings.field_year_built')}
                        </label>
                        <input
                            type="number"
                            className="input w-full"
                            value={yearBuilt ?? ''}
                            onChange={(e) => setYearBuilt(e.target.value ? Number(e.target.value) : undefined)}
                            placeholder="es. 1890"
                        />
                    </div>

                    {/* Descrizione */}
                    <div className="sm:col-span-2">
                        <label className="text-sm text-slate-600 mb-1 block">
                            {t('buildings.field_description')}
                        </label>
                        <textarea
                            className="input w-full resize-none"
                            rows={3}
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                        />
                    </div>

                    {/* Scadenza */}
                    <div>
                        <label className="text-sm text-slate-600 mb-1 block">
                            {t('buildings.field_deadline')}
                        </label>
                        <input
                            type="date"
                            className="input w-full"
                            value={deadline}
                            onChange={(e) => setDeadline(e.target.value)}
                        />
                    </div>

                    {/* Stato */}
                    <div>
                        <label className="text-sm text-slate-600 mb-1 block">
                            {t('buildings.field_status')}
                        </label>
                        <select
                            className="input w-full"
                            value={status}
                            onChange={(e) => setStatus(e.target.value as BuildingStatus)}
                        >
                            {BUILDING_STATUS_OPTIONS.map((opt) => (
                                <option key={opt} value={opt}>{t(BUILDING_STATUS_LABEL[opt])}</option>
                            ))}
                        </select>
                    </div>
                </div>
            </div>

            {/* Footer */}
            <div className="px-4 py-3 border-t border-border-default bg-surface-card flex gap-2">
                <button onClick={onClose} className="btn btn-outline flex-1">{t('common.cancel')}</button>
                <button onClick={handleSubmit} className="btn btn-primary flex-1" disabled={!isValid}>{t('buildings.create')}</button>
            </div>
        </div>
    );
};

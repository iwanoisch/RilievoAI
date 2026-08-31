import {FC, useState} from "react";
import {PageTitle} from "../../common/page-title/PageTitle.tsx";
import {useBuilding} from "../../features/building/hooks/useBuilding.ts";
import {BuildingTree} from "../../components/building-tree/BuildingTree.tsx";
import {BuildingElementDetail} from "../../components/building-element-detail/BuildingElementDetail.tsx";
import {BuildingElementForm} from "./modals/BuildingElementForm.tsx";
import {useTranslation} from "react-i18next";
import {PlusIcon} from "@heroicons/react/24/solid";
import type {BuildingElement, DataStatus} from "../../features/building/slice/building.type.ts";
import type {BuildingModalState} from "./building.type.ts";

export const Building: FC = () => {
    const {t} = useTranslation();
    const {elements, selectedElementId, selectElement, deleteElement, updateElement} = useBuilding();
    const [modal, setModal] = useState<BuildingModalState>({isOpen: false});

    const selectedElement = selectedElementId ? elements[selectedElementId] : null;

    const handleSelectElement = (element: BuildingElement) => {
        selectElement(element.id);
    };

    const handleAddElement = (parentId?: string | null) => {
        setModal({isOpen: true, parentId});
    };

    const handleEditElement = (element: BuildingElement) => {
        setModal({isOpen: true, editData: element});
    };

    const handleDeleteElement = async (elementId: string) => {
        await deleteElement(elementId);
        selectElement(null);
    };

    const handleStatusChange = async (elementId: string, status: DataStatus) => {
        const el = elements[elementId];
        if (!el) return;
        await updateElement({...el, dataStatus: status, updatedAt: new Date().toISOString()});
    };

    const handleCloseModal = () => {
        setModal({isOpen: false});
    };

    return (
        <div className="w-full px-4 sm:px-6 lg:px-8 py-6 bg-gradient-to-br from-primary-50/50 via-primary-100/30 to-slate-50 min-h-screen">
            <div className="mx-auto w-full max-w-5xl">
                <div className="flex items-center justify-between">
                    <PageTitle title={t('building.title')} subtitle={t('building.subtitle')}/>
                    <button
                        onClick={() => handleAddElement(null)}
                        className="btn btn-primary flex items-center gap-2 min-h-[44px]"
                        aria-label={t('building.add_element')}
                    >
                        <PlusIcon className="h-5 w-5"/>
                        <span className="hidden sm:inline">{t('building.add_element')}</span>
                    </button>
                </div>

                <div className="mt-6 grid grid-cols-1 lg:grid-cols-3 gap-4">
                    {/* Albero */}
                    <div className="lg:col-span-1 card">
                        <h3 className="text-sm font-semibold text-text-secondary mb-3">{t('building.structure')}</h3>
                        <BuildingTree onSelectElement={handleSelectElement} selectedElementId={selectedElementId}/>
                        {selectedElement && (
                            <button
                                onClick={() => handleAddElement(selectedElement.id)}
                                className="btn btn-ghost w-full mt-3 min-h-[44px]"
                            >
                                <PlusIcon className="h-4 w-4 mr-1"/>
                                {t('building.add_child')}
                            </button>
                        )}
                    </div>

                    {/* Dettaglio */}
                    <div className="lg:col-span-2 card">
                        {selectedElement ? (
                            <BuildingElementDetail element={selectedElement} onEdit={handleEditElement} onDelete={handleDeleteElement} onStatusChange={handleStatusChange}/>
                        ) : (
                            <div className="py-12 text-center">
                                <p className="text-sm text-text-muted">{t('building.select_element')}</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Modale form */}
            {modal.isOpen && (
                <BuildingElementForm
                    editData={modal.editData}
                    parentId={modal.parentId}
                    onClose={handleCloseModal}
                />
            )}
        </div>
    );
};

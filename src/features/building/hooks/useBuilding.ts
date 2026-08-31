import {useAppDispatch, useAppSelector} from "../../../store/store.ts";
import {loadElements, setElement, removeElement, setSelectedElementId, setBuildingError, resetBuilding} from "../slice/buildingSlice.ts";
import type {BuildingElement} from "../slice/building.type.ts";
import {MOCK_BUILDING_ELEMENTS} from "../../../dataMock/MOCK_BUILDING.ts";

export const useBuilding = () => {
    const dispatch = useAppDispatch();
    const buildingState = useAppSelector(state => state.building);

    const fetchBuilding = async (_buildingId: string) => {
        try {
            // Se ci sono già elementi nello state, non sovrascrivere con i mock
            if (Object.keys(buildingState.elements).length > 0) {
                return {data: Object.values(buildingState.elements)};
            }

            // TODO real api: const response = await get<BuildingElement[]>(`/buildings/${buildingId}/elements`);
            const elements = MOCK_BUILDING_ELEMENTS;

            const elementsMap: Record<string, BuildingElement> = {};
            for (const el of elements) {
                elementsMap[el.id] = el;
            }
            const root = elements.find(el => el.type === 'building');
            dispatch(loadElements({elements: elementsMap, rootBuildingId: root?.id ?? null}));
            return {data: elements};
        } catch (error) {
            const message = error instanceof Error ? error.message : 'Errore nel caricamento edificio';
            dispatch(setBuildingError(message));
            return null;
        }
    };

    const addElement = async (element: BuildingElement) => {
        try {
            // TODO real api: const response = await post<BuildingElement>('/buildings/elements', element);
            dispatch(setElement(element));
            return {data: element};
        } catch (error) {
            const message = error instanceof Error ? error.message : 'Errore sconosciuto';
            dispatch(setBuildingError(message));
            return null;
        }
    };

    const updateElement = async (element: BuildingElement) => {
        try {
            // TODO real api: const response = await put<BuildingElement>(`/buildings/elements/${element.id}`, element);
            dispatch(setElement(element));
            return {data: element};
        } catch (error) {
            const message = error instanceof Error ? error.message : 'Errore sconosciuto';
            dispatch(setBuildingError(message));
            return null;
        }
    };

    const deleteElement = async (elementId: string) => {
        try {
            // TODO real api: await del(`/buildings/elements/${elementId}`);
            dispatch(removeElement(elementId));
            return {success: true};
        } catch (error) {
            const message = error instanceof Error ? error.message : 'Errore sconosciuto';
            dispatch(setBuildingError(message));
            return null;
        }
    };

    const selectElement = (elementId: string | null) => {
        dispatch(setSelectedElementId(elementId));
    };

    const getChildren = (parentId: string): BuildingElement[] => {
        return Object.values(buildingState.elements).filter(el => el.parentId === parentId);
    };

    const getElementByType = (type: BuildingElement['type']): BuildingElement[] => {
        return Object.values(buildingState.elements).filter(el => el.type === type);
    };

    const reset = () => {
        dispatch(resetBuilding());
    };

    return {
        ...buildingState,
        fetchBuilding,
        addElement,
        updateElement,
        deleteElement,
        selectElement,
        getChildren,
        getElementByType,
        reset,
    };
};

import {useAppDispatch, useAppSelector} from "../../../store/store.ts";
import {useApiClient} from "../../../hooks/useApiClient.ts";
import {loadElements, setElement, removeElement, setSelectedElementId, setBuildingError, resetBuilding} from "../slice/buildingSlice.ts";
import type {BuildingElement} from "../slice/building.type.ts";
import {MOCK_BUILDING_ELEMENTS} from "../../../dataMock/MOCK_BUILDING.ts";

export const useBuilding = () => {
    const dispatch = useAppDispatch();
    const buildingState = useAppSelector(state => state.building);
    const {get, post, put, del} = useApiClient();

    const fetchBuilding = async (buildingId: string) => {
        try {
            const response = await get<BuildingElement[]>(`/buildings/${buildingId}/elements`);
            if (!response) {
                // Fallback mock
                _loadFromArray(MOCK_BUILDING_ELEMENTS);
                return {data: MOCK_BUILDING_ELEMENTS};
            }
            _loadFromArray(response);
            return {data: response};
        } catch (error) {
            const message = error instanceof Error ? error.message : 'Errore nel caricamento edificio';
            dispatch(setBuildingError(message));
            // Fallback mock
            _loadFromArray(MOCK_BUILDING_ELEMENTS);
            return null;
        }
    };

    const _loadFromArray = (elements: BuildingElement[]) => {
        const elementsMap: Record<string, BuildingElement> = {};
        for (const el of elements) {
            elementsMap[el.id] = el;
        }
        const root = elements.find(el => el.type === 'building');
        dispatch(loadElements({elements: elementsMap, rootBuildingId: root?.id ?? null}));
    };

    const addElement = async (element: BuildingElement) => {
        try {
            const response = await post<BuildingElement>('/buildings/elements', element);
            dispatch(setElement(response ?? element));
            return {data: response ?? element};
        } catch (error) {
            const message = error instanceof Error ? error.message : 'Errore nella creazione elemento';
            dispatch(setBuildingError(message));
            return null;
        }
    };

    const updateElement = async (element: BuildingElement) => {
        try {
            const response = await put<BuildingElement>(`/buildings/elements/${element.id}`, element);
            dispatch(setElement(response ?? element));
            return {data: response ?? element};
        } catch (error) {
            const message = error instanceof Error ? error.message : 'Errore nell\'aggiornamento elemento';
            dispatch(setBuildingError(message));
            return null;
        }
    };

    const deleteElement = async (elementId: string) => {
        try {
            await del(`/buildings/elements/${elementId}`);
            dispatch(removeElement(elementId));
            return {success: true};
        } catch (error) {
            const message = error instanceof Error ? error.message : 'Errore nella rimozione elemento';
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

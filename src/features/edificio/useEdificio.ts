import {useAppDispatch, useAppSelector} from "../../store/store.ts";
import {loadElements, setElement, removeElement, setSelectedElementId, setEdificioError, resetEdificio} from "./edificioSlice.ts";
import type {EdificioElement} from "./edificio.type.ts";
import {MOCK_EDIFICIO_ELEMENTS} from "../../dataMock/MOCK_EDIFICIO.ts";

export const useEdificio = () => {
    const dispatch = useAppDispatch();
    const edificioState = useAppSelector(state => state.edificio);

    const fetchEdificio = async (_edificioId: string) => {
        try {
            // Se ci sono già elementi nello state, non sovrascrivere con i mock
            if (Object.keys(edificioState.elements).length > 0) {
                return {data: Object.values(edificioState.elements)};
            }

            // TODO real api: const response = await get<EdificioElement[]>(`/edifici/${_edificioId}/elements`);
            const elements = MOCK_EDIFICIO_ELEMENTS;

            const elementsMap: Record<string, EdificioElement> = {};
            for (const el of elements) {
                elementsMap[el.id] = el;
            }
            const root = elements.find(el => el.type === 'building');
            dispatch(loadElements({elements: elementsMap, rootBuildingId: root?.id ?? null}));
            return {data: elements};
        } catch (error) {
            const message = error instanceof Error ? error.message : 'Errore nel caricamento edificio';
            dispatch(setEdificioError(message));
            return null;
        }
    };

    const addElement = async (element: EdificioElement) => {
        try {
            // TODO real api: const response = await post<EdificioElement>('/edifici/elements', element);
            dispatch(setElement(element));
            return {data: element};
        } catch (error) {
            const message = error instanceof Error ? error.message : 'Errore sconosciuto';
            dispatch(setEdificioError(message));
            return null;
        }
    };

    const updateElement = async (element: EdificioElement) => {
        try {
            // TODO real api: const response = await put<EdificioElement>(`/edifici/elements/${element.id}`, element);
            dispatch(setElement(element));
            return {data: element};
        } catch (error) {
            const message = error instanceof Error ? error.message : 'Errore sconosciuto';
            dispatch(setEdificioError(message));
            return null;
        }
    };

    const deleteElement = async (elementId: string) => {
        try {
            // TODO real api: await del(`/edifici/elements/${elementId}`);
            dispatch(removeElement(elementId));
            return {success: true};
        } catch (error) {
            const message = error instanceof Error ? error.message : 'Errore sconosciuto';
            dispatch(setEdificioError(message));
            return null;
        }
    };

    const selectElement = (elementId: string | null) => {
        dispatch(setSelectedElementId(elementId));
    };

    const getChildren = (parentId: string): EdificioElement[] => {
        return Object.values(edificioState.elements).filter(el => el.parentId === parentId);
    };

    const getElementByType = (type: EdificioElement['type']): EdificioElement[] => {
        return Object.values(edificioState.elements).filter(el => el.type === type);
    };

    const reset = () => {
        dispatch(resetEdificio());
    };

    return {
        ...edificioState,
        fetchEdificio,
        addElement,
        updateElement,
        deleteElement,
        selectElement,
        getChildren,
        getElementByType,
        reset,
    };
};

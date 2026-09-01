import {useAppDispatch, useAppSelector} from "../../store/store.ts";
import {setBuildings, setSelectedBuildingId, setBuildingsError} from "./buildingsSlice.ts";
import type {BuildingCardData} from "./buildings.type.ts";

export const useBuildings = () => {
    const dispatch = useAppDispatch();
    const state = useAppSelector(state => state.buildings);

    const getBuildings = async () => {
        try {
            // TODO real api: const response = await get<BuildingCardData[]>('/buildings');
            // Mock: non sovrascrive i dati esistenti
            return {data: state.buildings};
        } catch (error) {
            const message = error instanceof Error ? error.message : 'Errore sconosciuto';
            dispatch(setBuildingsError(message));
            return null;
        }
    };

    const getBuilding = async (id: string) => {
        try {
            // TODO real api: const response = await get<BuildingCardData>(`/buildings/${id}`);
            const building = state.buildings.find(b => b.id === id);
            if (!building) return null;
            return {data: building};
        } catch (error) {
            const message = error instanceof Error ? error.message : 'Errore sconosciuto';
            dispatch(setBuildingsError(message));
            return null;
        }
    };

    const createBuilding = async (building: BuildingCardData) => {
        try {
            // TODO real api: const response = await post<BuildingCardData>('/buildings', building);
            dispatch(setBuildings([...state.buildings, building]));
            return {data: building};
        } catch (error) {
            const message = error instanceof Error ? error.message : 'Errore sconosciuto';
            dispatch(setBuildingsError(message));
            return null;
        }
    };

    const updateBuilding = async (building: BuildingCardData) => {
        try {
            // TODO real api: const response = await put<BuildingCardData>(`/buildings/${building.id}`, building);
            dispatch(setBuildings(state.buildings.map(b => b.id === building.id ? building : b)));
            return {data: building};
        } catch (error) {
            const message = error instanceof Error ? error.message : 'Errore sconosciuto';
            dispatch(setBuildingsError(message));
            return null;
        }
    };

    const deleteBuilding = async (id: string) => {
        try {
            // TODO real api: await del(`/buildings/${id}`);
            dispatch(setBuildings(state.buildings.filter(b => b.id !== id)));
            return {success: true};
        } catch (error) {
            const message = error instanceof Error ? error.message : 'Errore sconosciuto';
            dispatch(setBuildingsError(message));
            return null;
        }
    };

    const selectBuilding = (id: string | null) => {
        dispatch(setSelectedBuildingId(id));
    };

    return {
        ...state,
        getBuildings,
        getBuilding,
        createBuilding,
        updateBuilding,
        deleteBuilding,
        selectBuilding,
    };
};

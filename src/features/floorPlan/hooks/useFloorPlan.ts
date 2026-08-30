import {useAppDispatch, useAppSelector} from "../../../store/store.ts";
import {setFloorPlan, removeFloorPlan, setSelectedFloorPlanId, setPhotoMarker, removePhotoMarker, setFloorPlanError, resetFloorPlan} from "../slice/floorPlanSlice.ts";
import type {FloorPlan, PhotoMarker} from "../slice/floorPlan.type.ts";
import {MOCK_FLOOR_PLANS} from "../../../dataMock/MOCK_FLOOR_PLAN.ts";

export const useFloorPlan = () => {
    const dispatch = useAppDispatch();
    const floorPlanState = useAppSelector(state => state.floorPlan);

    const fetchFloorPlans = async (_buildingId: string) => {
        try {
            // TODO real api: const response = await get<FloorPlan[]>(`/buildings/${buildingId}/floorplans`);
            MOCK_FLOOR_PLANS.forEach(fp => dispatch(setFloorPlan(fp)));
            return {data: MOCK_FLOOR_PLANS};
        } catch (error) {
            const message = error instanceof Error ? error.message : 'Errore sconosciuto';
            dispatch(setFloorPlanError(message));
            return null;
        }
    };

    const addFloorPlan = async (floorPlan: FloorPlan) => {
        try {
            // TODO real api: const response = await post<FloorPlan>('/floorplans', floorPlan);
            dispatch(setFloorPlan(floorPlan));
            return {data: floorPlan};
        } catch (error) {
            const message = error instanceof Error ? error.message : 'Errore sconosciuto';
            dispatch(setFloorPlanError(message));
            return null;
        }
    };

    const updateFloorPlan = async (floorPlan: FloorPlan) => {
        try {
            // TODO real api: const response = await put<FloorPlan>(`/floorplans/${floorPlan.id}`, floorPlan);
            dispatch(setFloorPlan(floorPlan));
            return {data: floorPlan};
        } catch (error) {
            const message = error instanceof Error ? error.message : 'Errore sconosciuto';
            dispatch(setFloorPlanError(message));
            return null;
        }
    };

    const deleteFloorPlan = async (floorPlanId: string) => {
        try {
            // TODO real api: await del(`/floorplans/${floorPlanId}`);
            dispatch(removeFloorPlan(floorPlanId));
            return {success: true};
        } catch (error) {
            const message = error instanceof Error ? error.message : 'Errore sconosciuto';
            dispatch(setFloorPlanError(message));
            return null;
        }
    };

    const selectFloorPlan = (floorPlanId: string | null) => {
        dispatch(setSelectedFloorPlanId(floorPlanId));
    };

    const addMarker = (floorPlanId: string, marker: PhotoMarker) => {
        dispatch(setPhotoMarker({floorPlanId, marker}));
    };

    const deleteMarker = (floorPlanId: string, photoId: string) => {
        dispatch(removePhotoMarker({floorPlanId, photoId}));
    };

    const getFloorPlanByFloorId = (floorId: string): FloorPlan | undefined => {
        return Object.values(floorPlanState.floorPlans).find(fp => fp.floorId === floorId);
    };

    const reset = () => {
        dispatch(resetFloorPlan());
    };

    return {
        ...floorPlanState,
        fetchFloorPlans,
        addFloorPlan,
        updateFloorPlan,
        deleteFloorPlan,
        selectFloorPlan,
        addMarker,
        deleteMarker,
        getFloorPlanByFloorId,
        reset,
    };
};

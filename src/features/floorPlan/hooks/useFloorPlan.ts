import {useAppDispatch, useAppSelector} from "../../../store/store.ts";
import {useApiClient} from "../../../hooks/useApiClient.ts";
import {setFloorPlan, removeFloorPlan, setSelectedFloorPlanId, setPhotoMarker, removePhotoMarker, setFloorPlanError, resetFloorPlan} from "../slice/floorPlanSlice.ts";
import type {FloorPlan, PhotoMarker} from "../slice/floorPlan.type.ts";
import {MOCK_FLOOR_PLANS} from "../../../dataMock/MOCK_FLOOR_PLAN.ts";

export const useFloorPlan = () => {
    const dispatch = useAppDispatch();
    const floorPlanState = useAppSelector(state => state.floorPlan);
    const {get, post, del} = useApiClient();

    const fetchFloorPlans = async (buildingId: string) => {
        try {
            const response = await get<FloorPlan[]>(`/buildings/${buildingId}/floorplans`);
            if (response) {
                response.forEach(fp => dispatch(setFloorPlan(fp)));
                return {data: response};
            }
            // Fallback mock
            MOCK_FLOOR_PLANS.forEach(fp => dispatch(setFloorPlan(fp)));
            return {data: MOCK_FLOOR_PLANS};
        } catch (error) {
            const message = error instanceof Error ? error.message : 'Errore caricamento planimetrie';
            dispatch(setFloorPlanError(message));
            MOCK_FLOOR_PLANS.forEach(fp => dispatch(setFloorPlan(fp)));
            return null;
        }
    };

    const addFloorPlan = async (floorPlan: FloorPlan) => {
        try {
            const response = await post<FloorPlan>('/floorplans', floorPlan);
            dispatch(setFloorPlan(response ?? floorPlan));
            return {data: response ?? floorPlan};
        } catch (error) {
            const message = error instanceof Error ? error.message : 'Errore creazione planimetria';
            dispatch(setFloorPlanError(message));
            return null;
        }
    };

    const deleteFloorPlan = async (floorPlanId: string) => {
        try {
            await del(`/floorplans/${floorPlanId}`);
            dispatch(removeFloorPlan(floorPlanId));
            return {success: true};
        } catch (error) {
            const message = error instanceof Error ? error.message : 'Errore rimozione planimetria';
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
        deleteFloorPlan,
        selectFloorPlan,
        addMarker,
        deleteMarker,
        getFloorPlanByFloorId,
        reset,
    };
};

import {useAppDispatch, useAppSelector} from "../../../store/store.ts";
import {useApiClient} from "../../../hooks/useApiClient.ts";
import {setAnchor, removeAnchor, setLandmark, removeLandmark, setSpatialAnchorError, resetSpatialAnchor} from "../slice/spatialAnchorSlice.ts";
import type {SpatialAnchor, Landmark} from "../slice/spatialAnchor.type.ts";
import {MOCK_SPATIAL_ANCHORS, MOCK_LANDMARKS} from "../../../dataMock/MOCK_SPATIAL_ANCHOR.ts";

export const useSpatialAnchors = () => {
    const dispatch = useAppDispatch();
    const spatialAnchorState = useAppSelector(state => state.spatialAnchor);
    const {get, post, del} = useApiClient();

    const fetchAnchors = async (buildingId: string) => {
        try {
            const response = await get<{anchors: SpatialAnchor[]; landmarks: Landmark[]}>(`/buildings/${buildingId}/spatial`);
            if (response) {
                response.anchors.forEach(a => dispatch(setAnchor(a)));
                response.landmarks.forEach(l => dispatch(setLandmark(l)));
                return {data: response};
            }
            // Fallback mock
            MOCK_SPATIAL_ANCHORS.forEach(a => dispatch(setAnchor(a)));
            MOCK_LANDMARKS.forEach(l => dispatch(setLandmark(l)));
            return null;
        } catch (error) {
            const message = error instanceof Error ? error.message : 'Errore caricamento anchor';
            dispatch(setSpatialAnchorError(message));
            MOCK_SPATIAL_ANCHORS.forEach(a => dispatch(setAnchor(a)));
            MOCK_LANDMARKS.forEach(l => dispatch(setLandmark(l)));
            return null;
        }
    };

    const addAnchor = async (anchor: SpatialAnchor) => {
        try {
            const response = await post<SpatialAnchor>('/spatial/anchors', anchor);
            dispatch(setAnchor(response ?? anchor));
            return {data: response ?? anchor};
        } catch (error) {
            const message = error instanceof Error ? error.message : 'Errore creazione anchor';
            dispatch(setSpatialAnchorError(message));
            return null;
        }
    };

    const deleteAnchor = async (anchorId: string) => {
        try {
            await del(`/spatial/anchors/${anchorId}`);
            dispatch(removeAnchor(anchorId));
            return {success: true};
        } catch (error) {
            const message = error instanceof Error ? error.message : 'Errore rimozione anchor';
            dispatch(setSpatialAnchorError(message));
            return null;
        }
    };

    const addLandmark = async (landmark: Landmark) => {
        try {
            const response = await post<Landmark>('/spatial/landmarks', landmark);
            dispatch(setLandmark(response ?? landmark));
            return {data: response ?? landmark};
        } catch (error) {
            const message = error instanceof Error ? error.message : 'Errore creazione landmark';
            dispatch(setSpatialAnchorError(message));
            return null;
        }
    };

    const deleteLandmark = async (landmarkId: string) => {
        try {
            await del(`/spatial/landmarks/${landmarkId}`);
            dispatch(removeLandmark(landmarkId));
            return {success: true};
        } catch (error) {
            const message = error instanceof Error ? error.message : 'Errore rimozione landmark';
            dispatch(setSpatialAnchorError(message));
            return null;
        }
    };

    const reset = () => {
        dispatch(resetSpatialAnchor());
    };

    return {
        ...spatialAnchorState,
        fetchAnchors,
        addAnchor,
        deleteAnchor,
        addLandmark,
        deleteLandmark,
        reset,
    };
};

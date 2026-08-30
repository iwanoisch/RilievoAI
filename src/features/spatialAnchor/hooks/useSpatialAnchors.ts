import {useAppDispatch, useAppSelector} from "../../../store/store.ts";
import {setAnchor, removeAnchor, setLandmark, removeLandmark, setSpatialAnchorError, resetSpatialAnchor} from "../slice/spatialAnchorSlice.ts";
import type {SpatialAnchor, Landmark} from "../slice/spatialAnchor.type.ts";
import {MOCK_SPATIAL_ANCHORS, MOCK_LANDMARKS} from "../../../dataMock/MOCK_SPATIAL_ANCHOR.ts";

export const useSpatialAnchors = () => {
    const dispatch = useAppDispatch();
    const spatialAnchorState = useAppSelector(state => state.spatialAnchor);

    const fetchAnchors = async (_buildingId: string) => {
        try {
            // TODO real api: const response = await get<{anchors: SpatialAnchor[]; landmarks: Landmark[]}>(`/buildings/${buildingId}/spatial`);
            MOCK_SPATIAL_ANCHORS.forEach(a => dispatch(setAnchor(a)));
            MOCK_LANDMARKS.forEach(l => dispatch(setLandmark(l)));
            return {data: {anchors: MOCK_SPATIAL_ANCHORS, landmarks: MOCK_LANDMARKS}};
        } catch (error) {
            const message = error instanceof Error ? error.message : 'Errore sconosciuto';
            dispatch(setSpatialAnchorError(message));
            return null;
        }
    };

    const addAnchor = async (anchor: SpatialAnchor) => {
        try {
            // TODO real api: const response = await post<SpatialAnchor>('/spatial/anchors', anchor);
            dispatch(setAnchor(anchor));
            return {data: anchor};
        } catch (error) {
            const message = error instanceof Error ? error.message : 'Errore sconosciuto';
            dispatch(setSpatialAnchorError(message));
            return null;
        }
    };

    const updateAnchor = async (anchor: SpatialAnchor) => {
        try {
            // TODO real api: const response = await put<SpatialAnchor>(`/spatial/anchors/${anchor.id}`, anchor);
            dispatch(setAnchor(anchor));
            return {data: anchor};
        } catch (error) {
            const message = error instanceof Error ? error.message : 'Errore sconosciuto';
            dispatch(setSpatialAnchorError(message));
            return null;
        }
    };

    const deleteAnchor = async (anchorId: string) => {
        try {
            // TODO real api: await del(`/spatial/anchors/${anchorId}`);
            dispatch(removeAnchor(anchorId));
            return {success: true};
        } catch (error) {
            const message = error instanceof Error ? error.message : 'Errore sconosciuto';
            dispatch(setSpatialAnchorError(message));
            return null;
        }
    };

    const addLandmark = async (landmark: Landmark) => {
        try {
            // TODO real api: const response = await post<Landmark>('/spatial/landmarks', landmark);
            dispatch(setLandmark(landmark));
            return {data: landmark};
        } catch (error) {
            const message = error instanceof Error ? error.message : 'Errore sconosciuto';
            dispatch(setSpatialAnchorError(message));
            return null;
        }
    };

    const updateLandmark = async (landmark: Landmark) => {
        try {
            // TODO real api: const response = await put<Landmark>(`/spatial/landmarks/${landmark.id}`, landmark);
            dispatch(setLandmark(landmark));
            return {data: landmark};
        } catch (error) {
            const message = error instanceof Error ? error.message : 'Errore sconosciuto';
            dispatch(setSpatialAnchorError(message));
            return null;
        }
    };

    const deleteLandmark = async (landmarkId: string) => {
        try {
            // TODO real api: await del(`/spatial/landmarks/${landmarkId}`);
            dispatch(removeLandmark(landmarkId));
            return {success: true};
        } catch (error) {
            const message = error instanceof Error ? error.message : 'Errore sconosciuto';
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
        updateAnchor,
        deleteAnchor,
        addLandmark,
        updateLandmark,
        deleteLandmark,
        reset,
    };
};

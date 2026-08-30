import {useAppDispatch, useAppSelector} from "../../../store/store.ts";
import {useApiClient} from "../../../hooks/useApiClient.ts";
import {setMeasurementEntry, removeMeasurementEntry, setMeasurementError, resetMeasurement} from "../slice/measurementSlice.ts";
import type {MeasurementEntry} from "../slice/measurement.type.ts";

export const useMeasurements = () => {
    const dispatch = useAppDispatch();
    const measurementState = useAppSelector(state => state.measurement);
    const {get, post, del} = useApiClient();

    const fetchMeasurements = async (sessionId: string) => {
        try {
            const response = await get<MeasurementEntry[]>(`/survey/sessions/${sessionId}/measurements`);
            if (response) {
                response.forEach(m => dispatch(setMeasurementEntry(m)));
                return {data: response};
            }
            return null;
        } catch (error) {
            const message = error instanceof Error ? error.message : 'Errore caricamento misure';
            dispatch(setMeasurementError(message));
            return null;
        }
    };

    const addMeasurement = async (measurement: MeasurementEntry) => {
        try {
            const response = await post<MeasurementEntry>('/measurements', measurement);
            dispatch(setMeasurementEntry(response ?? measurement));
            return {data: response ?? measurement};
        } catch (error) {
            const message = error instanceof Error ? error.message : 'Errore creazione misura';
            dispatch(setMeasurementError(message));
            return null;
        }
    };

    const deleteMeasurement = async (measurementId: string) => {
        try {
            await del(`/measurements/${measurementId}`);
            dispatch(removeMeasurementEntry(measurementId));
            return {success: true};
        } catch (error) {
            const message = error instanceof Error ? error.message : 'Errore rimozione misura';
            dispatch(setMeasurementError(message));
            return null;
        }
    };

    const getMeasurementsByElement = (elementId: string): MeasurementEntry[] => {
        return Object.values(measurementState.measurements).filter(m => m.elementId === elementId);
    };

    const reset = () => {
        dispatch(resetMeasurement());
    };

    return {
        ...measurementState,
        fetchMeasurements,
        addMeasurement,
        deleteMeasurement,
        getMeasurementsByElement,
        reset,
    };
};

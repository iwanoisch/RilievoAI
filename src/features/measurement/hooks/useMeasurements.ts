import {useAppDispatch, useAppSelector} from "../../../store/store.ts";
import {setMeasurementEntry, removeMeasurementEntry, setMeasurementError, resetMeasurement} from "../slice/measurementSlice.ts";
import type {MeasurementEntry} from "../slice/measurement.type.ts";

export const useMeasurements = () => {
    const dispatch = useAppDispatch();
    const measurementState = useAppSelector(state => state.measurement);

    const fetchMeasurements = async (_sessionId: string) => {
        try {
            // TODO real api: const response = await get<MeasurementEntry[]>(`/survey/sessions/${sessionId}/measurements`);
            return null;
        } catch (error) {
            const message = error instanceof Error ? error.message : 'Errore sconosciuto';
            dispatch(setMeasurementError(message));
            return null;
        }
    };

    const addMeasurement = async (measurement: MeasurementEntry) => {
        try {
            // TODO real api: const response = await post<MeasurementEntry>('/measurements', measurement);
            dispatch(setMeasurementEntry(measurement));
            return {data: measurement};
        } catch (error) {
            const message = error instanceof Error ? error.message : 'Errore sconosciuto';
            dispatch(setMeasurementError(message));
            return null;
        }
    };

    const updateMeasurement = async (measurement: MeasurementEntry) => {
        try {
            // TODO real api: const response = await put<MeasurementEntry>(`/measurements/${measurement.id}`, measurement);
            dispatch(setMeasurementEntry(measurement));
            return {data: measurement};
        } catch (error) {
            const message = error instanceof Error ? error.message : 'Errore sconosciuto';
            dispatch(setMeasurementError(message));
            return null;
        }
    };

    const deleteMeasurement = async (measurementId: string) => {
        try {
            // TODO real api: await del(`/measurements/${measurementId}`);
            dispatch(removeMeasurementEntry(measurementId));
            return {success: true};
        } catch (error) {
            const message = error instanceof Error ? error.message : 'Errore sconosciuto';
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
        updateMeasurement,
        deleteMeasurement,
        getMeasurementsByElement,
        reset,
    };
};

import {useAppDispatch, useAppSelector} from "../../../store/store.ts";
import {setSchede, setTransferHistory, setFascicoloError, resetFascicolo} from "../slice/fascicoloSlice.ts";
import type {FascicoloScheda, TransferRecord, TransferRecordDetail} from "../slice/fascicolo.type.ts";

export const useFascicolo = () => {
    const dispatch = useAppDispatch();
    const state = useAppSelector(state => state.fascicolo);

    const loadSchede = (schede: FascicoloScheda[]) => {
        dispatch(setSchede(schede));
    };

    const toggleObservationExclusion = (elementId: string, observationId: string) => {
        const updated = state.schede.map(s => {
            if (s.elementId !== elementId) return s;
            return {
                ...s,
                observations: s.observations.map(o =>
                    o.id === observationId ? {...o, excluded: !o.excluded} : o
                ),
            };
        });
        dispatch(setSchede(updated));
    };

    const transferSchede = async (schede: FascicoloScheda[], sessionId: string, buildingId: string) => {
        try {
            // TODO real api: await post('/fascicolo/transfer', { schede, sessionId, buildingId });
            const details: TransferRecordDetail[] = schede.map(s => ({
                elementId: s.elementId,
                elementLabel: s.elementLabel,
                fieldsTransferred: s.fields.length,
                observationsTransferred: s.observations.filter(o => !o.excluded).length,
                status: 'success' as const,
            }));

            const record: TransferRecord = {
                id: String(Date.now()),
                buildingId,
                sessionId,
                timestamp: new Date().toISOString(),
                schedeCount: schede.length,
                observationsCount: details.reduce((sum, d) => sum + d.observationsTransferred, 0),
                status: 'success',
                details,
            };

            const updatedSchede = state.schede.map(s => {
                const transferred = schede.find(ts => ts.elementId === s.elementId);
                return transferred ? {...s, transferStatus: 'transferred' as const} : s;
            });

            dispatch(setSchede(updatedSchede));
            dispatch(setTransferHistory([...state.transferHistory, record]));
            return {data: record};
        } catch (error) {
            const message = error instanceof Error ? error.message : 'Errore sconosciuto';
            dispatch(setFascicoloError(message));
            return null;
        }
    };

    const getHistoryByBuilding = (buildingId: string): TransferRecord[] => {
        return state.transferHistory.filter(r => r.buildingId === buildingId);
    };

    const reset = () => {
        dispatch(resetFascicolo());
    };

    return {
        ...state,
        loadSchede,
        toggleObservationExclusion,
        transferSchede,
        getHistoryByBuilding,
        reset,
    };
};

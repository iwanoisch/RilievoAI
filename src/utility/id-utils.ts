import {store} from "../store/store.ts";

export const getNextBuildingsId = (): string => {
    const fresh = store.getState().buildings;
    const allIds = fresh.buildings.map(b => Number(b.id) || 0);
    return String(allIds.length > 0 ? Math.max(...allIds) + 1 : 1);
};

import {createSlice} from "@reduxjs/toolkit";
import type {PayloadAction} from "@reduxjs/toolkit";
import type {BuildingCardData, BuildingsState} from "./buildings.type.ts";

const initialState: BuildingsState = {
    buildings: [],
    selectedBuildingId: null,
    error: null,
};

const buildingsSlice = createSlice({
    name: 'buildings',
    initialState,
    reducers: {
        setBuildings: (state, action: PayloadAction<BuildingCardData[]>) => {
            state.buildings = action.payload;
        },
        setSelectedBuildingId: (state, action: PayloadAction<string | null>) => {
            state.selectedBuildingId = action.payload;
        },
        setBuildingsError: (state, action: PayloadAction<string | null>) => {
            state.error = action.payload;
        },
    },
});

export const {setBuildings, setSelectedBuildingId, setBuildingsError} = buildingsSlice.actions;
export default buildingsSlice.reducer;

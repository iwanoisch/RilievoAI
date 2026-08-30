import {default as initReducer} from "./init/slice/initSlice.ts";
import {default as authReducer} from "./auth/slice/authSlice.ts";
import {default as buildingReducer} from "./building/slice/buildingSlice.ts";
import {default as surveyReducer} from "./survey/slice/surveySlice.ts";
import {default as floorPlanReducer} from "./floorPlan/slice/floorPlanSlice.ts";
import {default as spatialAnchorReducer} from "./spatialAnchor/slice/spatialAnchorSlice.ts";
import {default as measurementReducer} from "./measurement/slice/measurementSlice.ts";

export const reducers = {
    init: initReducer,
    auth: authReducer,
    building: buildingReducer,
    survey: surveyReducer,
    floorPlan: floorPlanReducer,
    spatialAnchor: spatialAnchorReducer,
    measurement: measurementReducer,
};

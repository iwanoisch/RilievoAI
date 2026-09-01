import {default as initReducer} from "./init/slice/initSlice.ts";
import {default as authReducer} from "./auth/slice/authSlice.ts";
import {default as edificioReducer} from "./edificio/edificioSlice.ts";
import {default as surveyReducer} from "./survey/slice/surveySlice.ts";
import {default as floorPlanReducer} from "./floorPlan/slice/floorPlanSlice.ts";
import {default as spatialAnchorReducer} from "./spatialAnchor/slice/spatialAnchorSlice.ts";
import {default as measurementReducer} from "./measurement/slice/measurementSlice.ts";
import {default as fascicoloReducer} from "./fascicolo/slice/fascicoloSlice.ts";
import {default as aiReducer} from "./ai/slice/aiSlice.ts";
import {default as buildingsReducer} from "./buildings/buildingsSlice.ts";

export const reducers = {
    init: initReducer,
    auth: authReducer,
    edificio: edificioReducer,
    survey: surveyReducer,
    floorPlan: floorPlanReducer,
    spatialAnchor: spatialAnchorReducer,
    measurement: measurementReducer,
    fascicolo: fascicoloReducer,
    ai: aiReducer,
    buildings: buildingsReducer,
};

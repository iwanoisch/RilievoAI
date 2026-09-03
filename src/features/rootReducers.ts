import {default as initReducer} from "./init/slice/initSlice.ts";
import {default as authReducer} from "./auth/slice/authSlice.ts";
import {default as edificioReducer} from "./edificio/edificioSlice.ts";
import {default as surveyReducer} from "./survey/slice/surveySlice.ts";
import {default as floorPlanReducer} from "./floorPlan/slice/floorPlanSlice.ts";
import {default as spatialAnchorReducer} from "./spatialAnchor/slice/spatialAnchorSlice.ts";
import {default as measurementReducer} from "./measurement/slice/measurementSlice.ts";
import {default as fascicoloReducer} from "./fascicolo/slice/fascicoloSlice.ts";
import {default as fakeAiReducer} from "./fake_ai/slice/aiSlice.ts";
import {default as aiReducer} from "./ai/aiSlice.ts";
import {default as buildingsReducer} from "./buildings/buildingsSlice.ts";
import {default as anagraficaReducer} from "./anagrafica/anagraficaSlice.ts";
import {default as rilievoReducer} from "./rilievo/rilievoSlice.ts";

export const reducers = {
    init: initReducer,
    auth: authReducer,
    edificio: edificioReducer,
    survey: surveyReducer,
    floorPlan: floorPlanReducer,
    spatialAnchor: spatialAnchorReducer,
    measurement: measurementReducer,
    fascicolo: fascicoloReducer,
    fakeAi: fakeAiReducer,
    ai: aiReducer,
    buildings: buildingsReducer,
    anagrafica: anagraficaReducer,
    rilievo: rilievoReducer,
};

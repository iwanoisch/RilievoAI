import {default as initReducer} from "./init/slice/initSlice.ts";
import {default as authReducer} from "./auth/slice/authSlice.ts";
import {default as aiReducer} from "./ai/aiSlice.ts";
import {default as buildingsReducer} from "./buildings/buildingsSlice.ts";
import {default as anagraficaReducer} from "./anagrafica/anagraficaSlice.ts";
import {default as rilievoReducer} from "./rilievo/rilievoSlice.ts";

export const reducers = {
    init: initReducer,
    auth: authReducer,
    ai: aiReducer,
    buildings: buildingsReducer,
    anagrafica: anagraficaReducer,
    rilievo: rilievoReducer,
};

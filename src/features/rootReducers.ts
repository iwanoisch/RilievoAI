import {default as initReducer} from "./init/slice/initSlice.ts";
import {default as authReducer} from "./auth/slice/authSlice.ts";

export const reducers = {
    init: initReducer,
    auth: authReducer,
};

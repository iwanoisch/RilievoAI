import {createSlice, PayloadAction} from '@reduxjs/toolkit'
import {AuthState, User} from "./auth.type.ts";
import {Token} from "../api/auth.type.ts";
import {Company} from "../../../types/shared.type.ts";

const initialState: AuthState = {
    isAuthenticated: false,
    user: null,
    token: null,
    isLoading: false,
    error: null
}

export const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {

        loginStart: (state) => {
            state.isLoading = true;
            state.error = null;
        },

        loginSuccess: (state, action: PayloadAction<{ user: User, token: string }>) => {
            state.isAuthenticated = true;
            state.user = action.payload.user;
            state.token = action.payload.token;
            state.isLoading = false;
            state.error = null;
        },

        loginFailure: (state, action: PayloadAction<string>) => {
            state.isAuthenticated = false;
            state.user = null;
            state.token = null;
            state.isLoading = false;
            state.error = action.payload;
        },

        logout: (state) => {
            state.isAuthenticated = false;
            state.isLoading = false;
            state.user = null;
            state.token = null;
            state.error = null;
        },

        restoreAuth: (state, action: PayloadAction<{ user: User; token: Token | string }>) => {
            state.isAuthenticated = true;
            state.user = action.payload.user;
            state.token = action.payload.token;
            state.isLoading = false;
        },
        userError: (state, action: PayloadAction<string | null>) => {
            state.error = action.payload;
        },

        setUserCompany: (state, action: PayloadAction<{ company: Company }>) => {
                state.user!.company_id = action.payload.company.id;
                state.user!.relations!.company = action.payload.company;
        },
    }
})

export const {
    loginStart,
    loginSuccess,
    loginFailure,
    logout,
    restoreAuth,
    userError,
    setUserCompany
} = authSlice.actions;

export default authSlice.reducer;

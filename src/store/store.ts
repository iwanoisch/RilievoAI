import {
    persistStore,
    persistReducer,
    createMigrate,
    FLUSH,
    REHYDRATE,
    PAUSE,
    PERSIST,
    PURGE,
    REGISTER,
} from 'redux-persist';
import type {PersistedState} from 'redux-persist/es/types';
import storage from 'redux-persist/lib/storage';
import {TypedUseSelectorHook, useDispatch, useSelector} from "react-redux";
import {combineReducers, configureStore} from "@reduxjs/toolkit";
import {reducers} from "../features/rootReducers.ts";


const rootReducer = combineReducers({
    ...reducers,
})

const migrateArazioToAnagrafica = (state: PersistedState): PersistedState => {
    const s = state as PersistedState & Record<string, unknown>;
    if (s && 'arazio' in s && !('anagrafica' in s)) {
        const {arazio, ...rest} = s;
        return {...rest, anagrafica: arazio} as PersistedState;
    }
    return state;
};

const migrateAiRilievoToPerBuilding = (state: PersistedState): PersistedState => {
    const s = state as PersistedState & Record<string, unknown>;
    if (!s) return state;

    // Find buildingId from anagrafica sections
    let buildingId = 'legacy';
    const anag = s.anagrafica as {sections?: Array<{buildingId?: string}>} | undefined;
    if (anag?.sections?.[0]?.buildingId) {
        buildingId = anag.sections[0].buildingId;
    }

    // Migrate flat AI state to per-building
    const ai = s.ai as Record<string, unknown> | undefined;
    if (ai && 'status' in ai && !('byBuilding' in ai)) {
        s.ai = {activeBuildingId: buildingId, byBuilding: {[buildingId]: ai}};
    }

    // Migrate flat rilievo state to per-building
    const ril = s.rilievo as Record<string, unknown> | undefined;
    if (ril && 'items' in ril && !('byBuilding' in ril)) {
        s.rilievo = {activeBuildingId: buildingId, byBuilding: {[buildingId]: ril}};
    }

    return s as PersistedState;
};

const migrations = {
    0: migrateArazioToAnagrafica,
    1: migrateArazioToAnagrafica,
    2: migrateArazioToAnagrafica,
    3: migrateAiRilievoToPerBuilding,
};

const persistConfig = {
    key: 'root',
    version: 3,
    storage,
    whitelist: ['auth', 'survey', 'buildings', 'anagrafica', 'ai', 'rilievo'],
    migrate: createMigrate(migrations, {debug: false}),
};

const persistedReducer = persistReducer(persistConfig, rootReducer);


export const store = configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: {
                ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
            },
            immutableCheck: {warnAfter: 128},
        }),
});

export const persistor = persistStore(store);

// Tipi per RootState e AppDispatch
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

// Hook personalizzato per useDispatch con tipi corretti
export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

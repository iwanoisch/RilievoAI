# Pattern React e Redux - RilievoAI

## Redux Toolkit

### Struttura Feature
Ogni feature segue questa struttura:
```
src/features/nomeFeature/
├── slice/
│   ├── nomeFeature.type.ts      # Interfacce e tipi
│   └── nomeFeatureSlice.ts      # Slice Redux
├── hooks/
│   └── useNomeFeature.ts        # Hook principale
└── api/                         # (opzionale)
    └── nomeFeature.api.ts
```

### Slice Pattern — NIENTE LOGICA negli slice
Gli slice devono essere **puri setter**, senza logica (no findIndex, find, filter, if/else, push condizionale).
Tutta la logica di ricerca, filtraggio e aggiornamento condizionale va negli **hook**.

```typescript
// ✅ CORRETTO — Slice puro setter
reducers: {
    setItems: (state, action: PayloadAction<Item[]>) => {
        state.items = action.payload;
    },
    setSelectedId: (state, action: PayloadAction<string | null>) => {
        state.selectedId = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
        state.error = action.payload;
    },
}

// ❌ SBAGLIATO — Logica nello slice
reducers: {
    addOrUpdateItem: (state, action: PayloadAction<Item>) => {
        const idx = state.items.findIndex(i => i.id === action.payload.id);
        if (idx !== -1) {
            state.items[idx] = action.payload;  // ❌ logica!
        } else {
            state.items.push(action.payload);   // ❌ logica!
        }
    },
}
```

La logica va nell'hook:
```typescript
// ✅ CORRETTO — Logica nell'hook
const addItem = async (item: Item) => {
    const updated = [...items];
    const idx = updated.findIndex(i => i.id === item.id);
    if (idx !== -1) {
        updated[idx] = item;
    } else {
        updated.push(item);
    }
    dispatch(setItems(updated));
};
```

### Hooks Pattern
Gli hook incapsulano dispatch, selector e API. Il loading è gestito tramite useEffect nei componenti, non nello state Redux:

```typescript
import {useAppDispatch, useAppSelector} from "../../../store/store.ts";
import {useApiClient} from "../../../hooks/useApiClient.ts";

export const useNomeFeature = () => {
    const dispatch = useAppDispatch();
    const state = useAppSelector(state => state.nomeFeature);
    const {get, post} = useApiClient();

    const fetchData = async () => {
        try {
            const response = await get<ResponseType>('/endpoint');
            if (!response) {
                dispatch(setError('Errore nel caricamento'));
                return null;
            }
            dispatch(loadData(response));
            return {data: response};
        } catch (error) {
            const message = error instanceof Error ? error.message : 'Errore sconosciuto';
            dispatch(setError(message));
            return null;
        }
    };

    return {
        ...state,
        fetchData,
    };
};
```

## Context Providers

### Alert System
```typescript
import { useAlert } from '../../../common/alert/AlertProvider';

const { showAlert } = useAlert();
showAlert('success', 'Operazione completata');
```

### Theme
```typescript
import { useTheme } from '../../../common/theme-selector/ThemeContext';

const { theme, setTheme, isDark } = useTheme();
```

### Language
```typescript
import { useLanguage } from '../../../common/language-selector/LanguageContext';

const { language, changeLanguage } = useLanguage();
```

## Componenti Common

I componenti riutilizzabili sono in `src/common/` organizzati in cartelle:
```
src/common/
├── alert/
├── drawer/
├── file-uploader/
├── pagination/
└── ...
```

## Lazy Loading

Le pagine devono essere caricate lazy tranne HomePage, Login, CompanyUser:
```typescript
const ProjectPage = lazy(() => import('../pages/ProjectPage'));
```

# Pattern React e Redux - Cantieri Client

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

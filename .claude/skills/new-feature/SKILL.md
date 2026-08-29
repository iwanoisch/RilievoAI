---
name: new-feature
description: Crea la struttura per una nuova feature Redux
allowed-tools: Read, Write, Glob
argument-hint: "<nome-feature>"
---

# Crea Nuova Feature

Genera la struttura completa per una nuova feature Redux Toolkit.

## Argomento

- `$ARGUMENTS` - Nome della feature in camelCase (es. `notifications`)

## Struttura da Generare

```
src/features/$ARGUMENTS/
├── slice/
│   ├── $ARGUMENTS.type.ts       # Interfacce e tipi
│   └── $ARGUMENTSSlice.ts       # Slice Redux
└── hooks/
    └── use$ARGUMENTS.ts         # Hook principale
```

## Template: $ARGUMENTS.type.ts

```typescript
export interface $ARGUMENTSState {
  items: $ARGUMENTSItem[] | null;
  selected: $ARGUMENTSItem | null;
}

export interface $ARGUMENTSItem {
  id: number;
  // Aggiungi campi
}

export interface Edit$ARGUMENTSResource {
  id: number;
  changes: Partial<$ARGUMENTSItem>;
}
```

## Template: $ARGUMENTSSlice.ts

```typescript
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { $ARGUMENTSState, $ARGUMENTSItem, Edit$ARGUMENTSResource } from './$ARGUMENTS.type';

const initialState: $ARGUMENTSState = {
  items: null,
  selected: null,
};

export const $ARGUMENTSSlice = createSlice({
  name: '$ARGUMENTS',
  initialState,
  reducers: {
    set$ARGUMENTS: (state, action: PayloadAction<$ARGUMENTSItem[]>) => {
      state.items = action.payload;
    },
    add$ARGUMENTS: (state, action: PayloadAction<$ARGUMENTSItem>) => {
      if (state.items) {
        state.items.unshift(action.payload);
      }
    },
    edit$ARGUMENTS: (state, action: PayloadAction<Edit$ARGUMENTSResource>) => {
      if (state.items) {
        const index = state.items.findIndex(p => Number(p.id) === action.payload.id);
        if (index !== -1) {
          state.items[index] = { ...state.items[index], ...action.payload.changes };
        }
      }
    },
    delete$ARGUMENTS: (state, action: PayloadAction<number>) => {
      if (state.items) {
        state.items = state.items.filter(p => Number(p.id) !== action.payload);
      }
    },
    select$ARGUMENTS: (state, action: PayloadAction<$ARGUMENTSItem>) => {
      state.selected = action.payload;
    },
  },
});

export const {
  set$ARGUMENTS,
  add$ARGUMENTS,
  edit$ARGUMENTS,
  delete$ARGUMENTS,
  select$ARGUMENTS,
} = $ARGUMENTSSlice.actions;

export default $ARGUMENTSSlice.reducer;
```

## Template: use$ARGUMENTS.ts

```typescript
import {useAppDispatch, useAppSelector} from "../../../store/store.ts";
import {useApiClient} from "../../../hooks/useApiClient.ts";
import {
  set$ARGUMENTS,
  add$ARGUMENTS,
  edit$ARGUMENTS,
  delete$ARGUMENTS,
  select$ARGUMENTS,
} from "../slice/$ARGUMENTSSlice.ts";
import {ApiRequestBody} from "../../../hooks/useApiClient.type.ts";

export const use$ARGUMENTS = () => {
    const dispatch = useAppDispatch();
    const state = useAppSelector(state => state.$ARGUMENTS);
    const {get, post} = useApiClient();

    const fetch$ARGUMENTS = async () => {
        const response = await get<$ARGUMENTSItem[]>('/endpoint');
        if (response) {
            dispatch(set$ARGUMENTS(response));
        }
        return response;
    };

    const save$ARGUMENTS = async (body: ApiRequestBody) => {
        const item = await post<$ARGUMENTSItem>('/endpoint/store/-1', body);
        if (item) {
            dispatch(add$ARGUMENTS(item));
        }
        return item;
    };

    return {
        ...state,
        fetch$ARGUMENTS,
        save$ARGUMENTS,
    };
};
```

## Passi

1. Crea la cartella `src/features/$ARGUMENTS/`
2. Crea le sottocartelle `slice/` e `hooks/`
3. Genera i file template
4. Registra lo slice in `src/features/rootReducers.ts`

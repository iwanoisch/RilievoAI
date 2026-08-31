# Convenzioni di Codice - RilievoAI

## TypeScript

- Usare tipi espliciti per parametri e return delle funzioni
- Preferire `interface` a `type` per oggetti
- I file di tipi seguono il pattern `nomeFeature.type.ts`
- Variabili inutilizzate devono essere prefissate con `_`

## Naming Conventions

- **Componenti React**: PascalCase (es. `ProjectCard.tsx`)
- **Hook**: camelCase con prefisso `use` (es. `useProjects.ts`)
- **Slices Redux**: camelCase con suffisso `Slice.ts` (es. `groupStageSlice.ts`)
- **Types**: camelCase con suffisso `.type.ts` (es. `groupStage.type.ts`)
- **Costanti**: file in `src/constants/nome-file.constant.ts`, valori in SCREAMING_SNAKE_CASE

## Costanti — MAI inline nei componenti

Le costanti (mapping, lookup, configurazioni statiche) vanno SEMPRE in `src/constants/`:

```typescript
// ❌ SBAGLIATO — costanti inline nel componente
const TYPE_ICONS = { photo: CameraIcon } as const;
const STATUS_LABELS = { RAW: 'status_raw' } as const;

// ✅ CORRETTO — in src/constants/nome-file.constant.ts
export const TYPE_ICONS = { photo: CameraIcon };
export const STATUS_LABELS: Record<DataStatus, string> = { RAW: 'status_raw' };
```

**NON usare `as const`** — usare tipi espliciti (`Record<K, V>`, interface, etc.)

## Import

Usare import relativi con `../`:
```typescript
import {useAppDispatch, useAppSelector} from "../../../store/store.ts";
import {useApiClient} from "../../../hooks/useApiClient.ts";
```

## Struttura Componenti

```typescript
// 1. Import esterni
import React from 'react';

// 2. Import interni relativi
import { useAuth } from '../../../features/auth/hooks/useAuth';

// 3. Import tipi
import type { UserProps } from './User.type';

// 4. Componente
export const User: React.FC<UserProps> = ({ name }) => {
  return <div>{name}</div>;
};
```

## ESLint

Il progetto usa ESLint. Prima di committare:
```bash
npm run lint
```

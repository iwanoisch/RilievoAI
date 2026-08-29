---
paths:
  - "src/features/**/hooks/*.ts"
  - "src/hooks/useApiClient.ts"
---

# Pattern API - Cantieri Client

## useApiClient Hook

Le chiamate API usano `useApiClient` direttamente negli hook delle feature:

```typescript
import {useApiClient} from "../../../hooks/useApiClient.ts";

const {get, post} = useApiClient();

// GET con query params
const queryParams: Record<string, string> = {};
queryParams.relations = "stages";
const response = await get<ResponseType>('/endpoint', undefined, queryParams);

// POST
const result = await post<ResponseType>('/endpoint', body);
```

## Comportamento Automatico

L'hook gestisce automaticamente:
- Iniezione Bearer token da Redux auth state
- Redirect a `/login` su risposta 401
- Base URL da `VITE_API_BASE_URL`

## Pattern negli Hook Feature

Le chiamate API sono integrate direttamente negli hook delle feature, non in file separati:

```typescript
export const useGroupStage = () => {
    const dispatch = useAppDispatch();
    const groupState = useAppSelector(state => state.groups);
    const {get, post} = useApiClient();

    const getGroups = async (project_id?: string) => {
        dispatch(groupStageStart());
        try {
            const queryParams: Record<string, string> = {};
            if (project_id) queryParams.project_id = project_id;

            const response = await get<PaginationApiRaw<Resource>>('/project/stage_group/index', undefined, queryParams);

            dispatch(loadGroupStage(response));
            return {groups: response};
        } catch (error) {
            const message = error instanceof Error ? error.message : 'Errore sconosciuto';
            dispatch(groupStageError(message));
            return null;
        }
    };

    return {
        ...groupState,
        getGroups,
    };
};
```

## Error Handling

Gestire sempre gli errori con dispatch e return:

```typescript
try {
    const data = await get<Type>('/endpoint');
    dispatch(loadData(data));
    return {data};
} catch (error) {
    const message = error instanceof Error ? error.message : 'Errore sconosciuto';
    dispatch(setError(message));
    return null;
}
```

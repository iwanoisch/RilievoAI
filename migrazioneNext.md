# Migrazione a Next.js - Analisi State Management

## Stato Attuale (Redux Toolkit)

- **11 slice**, 58 campi totali, 69 azioni
- **~81% è server state** (dati da API), solo ~19% è client state (loading, error, UI)
- Solo 2 slice persistite (auth, files)
- Complessità complessiva: **media**

### Slice Attuali

| Slice | Campi | Tipo Prevalente |
|-------|-------|-----------------|
| init | 1 | Client State |
| auth | 5 | Server State |
| project | 5 | Server State |
| workspace | 5 | Server State |
| activities | 8 | Server State |
| fileManager | 8 | Server State |
| company | 9 | Server State |
| type | 3 | Server State |
| dataList | 5 | Server State |
| groupStage | 5 | Server State |
| projectsPartner | 4 | Server State |

## In Next.js, Redux sarebbe eccessivo

La risposta breve è: **no, non servirebbe**. Ecco perché:

### 1. Server State → TanStack Query (React Query)

La stragrande maggioranza dello stato (projects, activities, companies, workspaces, files, types, dataList, groups, partners) è **cache di dati server**. In Next.js si userebbe:

- **Server Components** per il fetch iniziale
- **TanStack Query** per cache, revalidation, pagination, loading/error states
- Questo eliminerebbe **9 slice su 11** e tutto il boilerplate `isLoading`/`error`/`pagination` ripetuto

### 2. Auth → NextAuth.js o middleware Next.js

Lo slice `auth` verrebbe sostituito dal sistema di autenticazione nativo di Next.js (middleware + session).

### 3. Client State rimasto → Zustand o semplici Context

Il poco di stato client che resta (tema, lingua, init) è già gestito da Context providers. Non serve Redux per questo.

## Architettura Suggerita per Next.js

```
Redux Toolkit (11 slice)  →  eliminato

Server State              →  TanStack Query + Server Components
Auth                      →  NextAuth.js / middleware
Theme/Language            →  Context (già così)
UI State (modals, alerts) →  Context (già così)
File persistence          →  TanStack Query + localStorage semplice
```

## Vantaggio del Pattern Hook Attuale

Il fatto che il 97% dei componenti acceda allo stato tramite hook custom (`useProjects()`, `useAuth()`, etc.) è un **enorme vantaggio** per la migrazione: basta reimplementare gli hook internamente (da Redux a TanStack Query) senza toccare i componenti che li consumano.

## Conclusione

Redux Toolkit risolve problemi che Next.js + TanStack Query risolvono nativamente e meglio. La complessità dell'app è media e non giustifica Redux in un contesto Next.js.

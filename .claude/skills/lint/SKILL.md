---
name: lint
description: Esegue ESLint e corregge automaticamente gli errori
disable-model-invocation: true
allowed-tools: Bash, Read, Edit
argument-hint: "[--fix]"
---

# Lint Codebase

Esegui ESLint sul progetto RilievoAI.

## Utilizzo

- `/lint` - Solo controllo, mostra errori
- `/lint --fix` - Correggi automaticamente dove possibile

## Comandi

```bash
# Solo controllo
npm run lint

# Con fix automatico (se richiesto)
npm run lint -- --fix
```

## Regole Principali

- Variabili inutilizzate devono essere prefissate con `_`
- Import React non necessario con React 19
- Preferire const a let quando possibile

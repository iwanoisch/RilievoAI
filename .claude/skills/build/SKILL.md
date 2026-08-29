---
name: build
description: Esegue build di produzione con controlli TypeScript
disable-model-invocation: true
allowed-tools: Bash, Read
argument-hint: "[--preview]"
---

# Build Production

Esegui la build di produzione per RilievoAI.

## Passi

1. Esegui il linting per verificare errori
2. Esegui la build TypeScript + Vite
3. Se `$ARGUMENTS` contiene `--preview`, avvia il server di preview

```bash
# Lint
npm run lint

# Build
npm run build

# Preview (opzionale)
npm run preview
```

## Output

La build viene generata in `dist/` con:
- Chunk separati per React, state management, UI libs, i18n, utils, calendar, charts
- File `.htaccess` copiato da `static/`
- Versione app iniettata da package.json

---
name: install-sentry
description: Installa e configura Sentry per React + Vite + TypeScript
allowed-tools: Read, Write, Edit, Bash, AskUserQuestion
argument-hint: ""
---

# Installa Sentry

Installa e configura Sentry per error tracking e performance monitoring in un progetto React + Vite + TypeScript.

## Versioni Testate

| Pacchetto | Versione | Data |
|-----------|----------|------|
| @sentry/react | ^10.43.0 | 2025-03 |
| @sentry/vite-plugin | ^5.1.1 | 2025-03 |

## Prerequisiti

- Progetto React con Vite
- TypeScript
- Account Sentry con progetto già creato

## Informazioni Richieste

Prima di procedere, chiedi all'utente:

1. **VITE_SENTRY_DSN** - Il DSN del progetto Sentry (formato: `https://xxx@xxx.ingest.sentry.io/xxx`)
2. **Sentry Org** - Nome organizzazione Sentry (visibile nell'URL: `sentry.io/organizations/{org}/`)
3. **Sentry Project** - Nome progetto Sentry (visibile nell'URL)

L'utente dovrà anche configurare `SENTRY_AUTH_TOKEN` nel CI/CD (non chiederlo, è sensibile).

## Passi

### 1. Installa dipendenze

```bash
npm install @sentry/react
npm install -D @sentry/vite-plugin
```

### 2. Crea `src/sentry.ts`

```typescript
import * as Sentry from "@sentry/react";

Sentry.init({
    dsn: import.meta.env.VITE_SENTRY_DSN,
    environment: import.meta.env.MODE,
    sendDefaultPii: true,
    integrations: [
        Sentry.browserTracingIntegration(),
        Sentry.replayIntegration(),
    ],
    // Performance Monitoring - 10% in prod, 100% in dev
    tracesSampleRate: import.meta.env.MODE === 'production' ? 0.1 : 1.0,
    // Session Replay - campiona 10% delle sessioni
    replaysSessionSampleRate: 0.1,
    // Cattura il 100% delle sessioni con errori
    replaysOnErrorSampleRate: 1.0,
});

export default Sentry;
```

### 3. Importa in entry point

Aggiungi come **prima riga** in `src/Main.tsx` (o `src/main.tsx`):

```typescript
import './sentry';
```

### 4. Configura `vite.config.ts`

Aggiungi l'import:
```typescript
import { sentryVitePlugin } from '@sentry/vite-plugin'
```

Aggiungi il plugin (deve essere l'ULTIMO nella lista plugins):
```typescript
sentryVitePlugin({
    org: "___ORG___",
    project: "___PROJECT___",
    authToken: process.env.SENTRY_AUTH_TOKEN,
    telemetry: false,
    silent: true,
    sourcemaps: {
        filesToDeleteAfterUpload: ["./dist/**/*.map"],
    },
}),
```

Aggiungi sourcemap hidden nel build:
```typescript
build: {
    sourcemap: "hidden",
    // ... resto config
}
```

### 5. Configura variabili d'ambiente

Aggiungi al file `.env`:
```env
VITE_SENTRY_DSN=___DSN___
```

### 6. Aggiungi a `.gitignore` (se non presente)

```
.env
.env.local
```

### 7. Fix warning CJS (opzionale)

Se appare il warning:
```
The CJS build of Vite's Node API is deprecated.
```

Modifica lo script `dev` in `package.json`:
```json
"scripts": {
    "dev": "VITE_CJS_IGNORE_WARNING=true vite",
}
```

## Verifica Installazione

Dopo l'installazione, per testare:

```typescript
// In qualsiasi componente, temporaneamente:
import * as Sentry from "@sentry/react";
Sentry.captureMessage("Test Sentry installation");
```

Poi controlla su sentry.io che il messaggio arrivi.

## Note

- Il `SENTRY_AUTH_TOKEN` va configurato come variabile d'ambiente nel CI/CD (GitHub Actions, Vercel, etc.)
- Le source maps vengono caricate su Sentry e poi eliminate dal build per sicurezza
- In development il sample rate è 100%, in production 10%

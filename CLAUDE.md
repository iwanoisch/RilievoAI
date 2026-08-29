# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Cantieri Client is a construction site management application ("gestione cantieri") built with React 19, TypeScript, and Vite. It provides project/workspace management, activity tracking, calendar views, file management, and multi-company collaboration features.

## Commands

```bash
# Development (runs ESLint first, then Vite dev server)
npm run dev

# Production build (TypeScript check + Vite build)
npm run build

# Lint
npm run lint

# Preview production build locally
npm run preview
```

## Architecture

### State Management
- **Redux Toolkit** with feature-based slice organization in `src/features/`
- **Redux Persist** hydrates `auth` and `files` slices from localStorage
- Each feature follows the pattern: `*.type.ts` (interfaces), `*.slice.ts` (reducers/actions), `*.hooks/` (custom hooks), `*.api/` (API calls)

**Feature slices**: init, auth, project, projectsPartner, type, company, activities, files, dataList, groups, workspace

### API Layer
- `src/hooks/useApiClient.ts` - Generic typed API client hook
- Auto-injects Bearer token from Redux auth state
- Auto-redirects to `/login` on 401 responses
- Base URL from `VITE_API_BASE_URL` environment variable

### Routing
- React Router v7 with lazy loading in `src/AppRouting.tsx`
- Nested routes: Workspace → Project → Activity patterns
- Eager loading for: HomePage, Login, CompanyUser
- Lazy loading for all other routes with Suspense fallback

### Internationalization
- i18next with Italian (it), English (en), Arabic (ar) support
- Translation files: `/public/locales/{{lng}}/translation.json`
- Per-user language preference stored in localStorage
- Access via `useLanguage()` hook from `src/common/language-selector/LanguageContext.tsx`

### Theme System
- Custom React Context in `src/common/theme-selector/ThemeContext.tsx`
- Light themes: default, blue, green, indigo, teal, rose, slate
- Dark themes: dark, midnight
- Per-user theme preference in localStorage
- Applied via data attributes on `<html>` element

### Provider Hierarchy (Main.tsx)
```
Redux Provider → PersistGate → ThemeProvider → LanguageProvider → AlertProvider → ModalDialogProvider → AppRouting
```

## Directory Structure

```
src/
├── common/          # 47 reusable UI components (modals, forms, tables, cards, navigation)
├── components/      # Feature components (layout, panels, tabs)
├── features/        # Redux feature modules
├── hooks/           # Custom hooks (useApiClient, useAutoPopulate, useIsDarkMode, usePdfGenerator)
├── pages/           # 20 page components
├── store/           # Redux store configuration
├── styles/          # theme.css, calendar.css
├── utility/         # Utility functions
├── i18n.ts          # i18n configuration
├── Main.tsx         # App entry with providers
└── AppRouting.tsx   # Route definitions
```

## Key Patterns

- Feature hooks encapsulate API calls and Redux dispatch (e.g., `useProjects()`, `useAuth()`, `useActivities()`)
- Global alerts via `useAlert()` context hook
- Modal dialogs via `useModalDialog()` context hook
- Unused variables prefixed with `_` (ESLint configured to allow)

## Build Notes

- Vite with Tailwind CSS v4 plugin
- Manual chunks configured for React, state management, UI libs, i18n, utils, calendar, charts
- `.htaccess` copied from `static/` during production build
- App version injected via `__APP_VERSION__` global from package.json


-------
# Ricreare il Design di un Sito Web

## Flusso di Lavoro

Quando l'utente fornisce un'immagine di riferimento (screenshot) e, opzionalmente, alcune classi CSS o note di stile:

1. **Genera** un singolo file usando Tailwind. Includi tutto il contenuto inline - nessun file esterno a meno che non venga richiesto.
2. **Fai uno screenshot** della pagina renderizzata usando Puppeteer (`npx puppeteer screenshot index.html --fullpage` o equivalente). Se la pagina ha sezioni distinte, cattura anche quelle singolarmente.
3. **Confronta** il tuo screenshot con l'immagine di riferimento. Controlla le differenze in:
    - Spaziatura e padding (misura in px)
    - Dimensioni dei font, pesi e altezze di riga
    - Colori (valori hex esatti)
    - Allineamento e posizionamento
    - Bordi arrotondati, ombre ed effetti
    - Comportamento responsive
    - Dimensioni e posizionamento di immagini/icone
4. **Correggi** ogni differenza trovata. Modifica il codice HTML/Tailwind.
5. **Rifai lo screenshot** e confronta di nuovo.
6. **Ripeti** i passaggi 3-5 finché il risultato non è entro ~2-3px dal riferimento ovunque.

NON fermarti dopo un solo passaggio. Fai sempre almeno 2 giri di confronto. Fermati solo quando l'utente lo dice o quando non ci sono più differenze visibili.

## Impostazioni Tecniche di Default

- Design mobile-first responsive

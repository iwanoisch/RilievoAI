# TODO - Correzioni Contrasto Colori

## Istruzioni
Questo file contiene la lista completa delle modifiche da effettuare per risolvere i problemi di contrasto.
Le attività sono organizzate per **priorità** e **tipo di modifica**.

---

## TASK 1: Sfondi Semi-Trasparenti (PRIORITÀ ALTA)
**Modifica:** `bg-white/60` → `bg-white` | `bg-white/80` → `bg-white`

### File: `src/pages/activity/Activity.tsx`
- [ ] Linea 193: `bg-white/80` → `bg-white`
- [ ] Linea 208: `bg-white/80` → `bg-white`
- [ ] Linea 229: `bg-white/80` → `bg-white`
- [ ] Linea 333: `bg-white/60` → `bg-white`
- [ ] Linea 347: `bg-white/60` → `bg-white`
- [ ] Linea 372: `bg-white/60` → `bg-white`

### File: `src/components/panels/generalPanel/GeneralPanel.tsx`
- [ ] Linea 236: `bg-white/80` → `bg-white`
- [ ] Linea 249: `bg-white/80` → `bg-white`
- [ ] Linea 271: `bg-white/80` → `bg-white`
- [ ] Linea 295: `bg-white/80` → `bg-white`
- [ ] Linea 316: `bg-white/80` → `bg-white`
- [ ] Linea 331: `bg-white/80` → `bg-white`
- [ ] Linea 362: `bg-white/60` → `bg-white`
- [ ] Linea 390: `bg-white/60` → `bg-white`
- [ ] Linea 429: `bg-white/60` → `bg-white`
- [ ] Linea 444: `bg-white/60` → `bg-white`
- [ ] Linea 469: `bg-white/60` → `bg-white`
- [ ] Linea 497: `bg-white/60` → `bg-white`
- [ ] Linea 513: `bg-white/60` → `bg-white`
- [ ] Linea 530: `bg-white/60` → `bg-white`
- [ ] Linea 549: `bg-white/60` → `bg-white`
- [ ] Linea 564: `bg-white/60` → `bg-white`
- [ ] Linea 587: `bg-white/60` → `bg-white`

### File: `src/components/tabs/activityTab/ActivityTab.tsx`
- [ ] Linea 301: `bg-white/80` → `bg-white`
- [ ] Linea 315: `bg-white/80` → `bg-white`
- [ ] Linea 329: `bg-white/80` → `bg-white`

### File: `src/components/tabs/reportTab/ReportTab.tsx`
- [ ] Linea 224: `bg-white/80` → `bg-white`

### File: `src/components/panels/fileManagerPanel/FileManagerPanel.tsx`
- [ ] Linea 337: `bg-white/80` → `bg-white`
- [ ] Linea 351: `bg-white/80` → `bg-white`
- [ ] Linea 365: `bg-white/80` → `bg-white`
- [ ] Linea 381: `bg-white/80` → `bg-white`

### File: `src/components/panels/partnerPanel/PartnerPanel.tsx`
- [ ] Linea 489: `bg-white/80` → `bg-white`
- [ ] Linea 503: `bg-white/80` → `bg-white`

### File: `src/pages/projects/Projects.tsx`
- [ ] Linea 389: `bg-white/80` → `bg-white`
- [ ] Linea 403: `bg-white/80` → `bg-white`

### File: `src/pages/company-user/CompanyUser.tsx`
- [ ] Linea 325: `bg-white/80` → `bg-white`

### File: `src/common/company-table/CompanyTable.tsx`
- [ ] Linea 333: `bg-white/80` → `bg-white`
- [ ] Linea 348: `bg-white/80` → `bg-white`

---

## TASK 2: Testo Troppo Piccolo (PRIORITÀ ALTA)
**Modifica:** `text-[9px]` → `text-xs` | `text-[10px]` → `text-xs`

### File: `src/common/stat-card/StatCard.tsx`
- [ ] Linea 9: `text-[9px] sm:text-[10px] lg:text-xs` → `text-xs` e `text-gray-400` → `text-gray-600`

### File: `src/components/entitySelector/EntitySelector.tsx`
- [ ] Linea 183: `text-[10px]` → `text-xs` e `text-gray-400` → `text-gray-500`
- [ ] Linea 237: `text-[10px]` → `text-xs` e `text-gray-400` → `text-gray-500`
- [ ] Linea 241: `text-[10px]` → `text-xs` e `text-gray-400` → `text-gray-500`
- [ ] Linea 280: `text-[9px]` → `text-xs` e `text-gray-400` → `text-gray-500`
- [ ] Linea 286: `text-[9px]` → `text-xs` e `text-gray-300` → `text-gray-400`
- [ ] Linea 298: `text-[10px]` → `text-xs` e `text-gray-400` → `text-gray-500`

### File: `src/common/modal-activity-detail/ModalActivityDetail.tsx`
- [ ] Linea 57: `text-[10px]` → `text-xs` e `text-gray-400` → `text-gray-500`
- [ ] Linea 69: `text-[10px]` → `text-xs` e `text-gray-400` → `text-gray-500`
- [ ] Linea 101: `text-[10px]` → `text-xs` e `text-gray-400` → `text-gray-500`

### File: `src/common/page-title/PageTitle.tsx`
- [ ] Linea 33: `text-[9px] sm:text-[10px]` → `text-xs` (questo è un badge, valutare se mantenerlo piccolo)

### File: `src/components/panels/activityPanel/ActivityPanel.tsx`
- [ ] Linea 77: `text-[9px] sm:text-[10px]` → `text-xs sm:text-sm` (tab buttons)

---

## TASK 3: Icone Stato Disabilitato (PRIORITÀ MEDIA)
**Modifica:** `text-gray-300` → `text-gray-400`

### File: `src/components/panels/partnerPanel/PartnerPanel.tsx`
- [ ] Linea 340: `text-gray-300` → `text-gray-400`
- [ ] Linea 344: `text-gray-300` → `text-gray-400`
- [ ] Linea 352: `text-gray-300` → `text-gray-400`
- [ ] Linea 356: `text-gray-300` → `text-gray-400`

### File: `src/pages/company-user/CompanyUser.tsx`
- [ ] Linea 205: `text-gray-300` → `text-gray-400`

### File: `src/pages/dashboard/Dashboard.tsx`
- [ ] Linea 168: `text-gray-300` → `text-gray-400`
- [ ] Linea 491: `text-gray-300` → `text-gray-400`

### File: `src/common/simple-calendar/SimpleCalendar.tsx`
- [ ] Linea 210: `text-gray-300` → `text-gray-400`

### File: `src/components/entitySelector/EntitySelector.tsx`
- [ ] Linea 249: `text-gray-300` → `text-gray-400`

---

## TASK 4: Placeholder Input (PRIORITÀ MEDIA)
**Modifica:** `placeholder:text-gray-400` → `placeholder:text-gray-500`

### File con costante `inputClassName` (modifica singola per file):
- [ ] `src/pages/create-partner/CreatePartner.tsx` - Linea 86
- [ ] `src/pages/company/CompanyDetailModal/CompanyDetailModal.tsx` - Linea 14
- [ ] `src/pages/projects/NewProjectModal/NewProjectModal.tsx` - Linea 47
- [ ] `src/pages/company-user/ModalAddUser.tsx` - Linea 7
- [ ] `src/common/profile-edit-form-drawer/ProfileEditModal.tsx` - Linea 18
- [ ] `src/common/modal-company-select/CompanyEditModal.tsx` - Linea 19
- [ ] `src/components/tabs/reportTab/modalAddReport/ModalAddReport.tsx` - Linea 30
- [ ] `src/common/report-preview/New/DynamicReportPreview.tsx` - Linea 201

### File con placeholder inline:
- [ ] `src/pages/login/Login.tsx` - Linee 99, 125
- [ ] `src/pages/invitation-page/InvitationPage.tsx` - Linee 283, 300, 325
- [ ] `src/common/main-menu-bar/MainMenuBar.tsx` - Linea 102

---

## TASK 5: Testi Secondari e Label (PRIORITÀ BASSA)
**Modifica:** `text-gray-400` → `text-gray-500` (solo per testi, non icone)

### File: `src/common/modal/ModalHeader.tsx`
- [ ] Linea 34: `text-gray-400` → `text-gray-500`

### File: `src/common/simple-meter/SimpleMeter.tsx`
- [ ] Linea 27: `text-gray-400` → `text-gray-500`

### File: `src/common/logo-selection/LogoSelection.tsx`
- [ ] Linea 138: `text-gray-400` → `text-gray-500`
- [ ] Linea 223: `text-gray-400` → `text-gray-500`

### File: `src/components/tabs/ganttTab/GanttTab.tsx`
- [ ] Linea 91: `text-gray-400` → `text-gray-500`
- [ ] Linea 154: `text-gray-400` → `text-gray-500`

---

## RIEPILOGO QUANTITÀ

| Task | Descrizione | File | Modifiche |
|------|-------------|------|-----------|
| 1 | Sfondi semi-trasparenti | 10 | ~40 |
| 2 | Testo troppo piccolo | 5 | ~15 |
| 3 | Icone stato disabilitato | 5 | ~10 |
| 4 | Placeholder input | 11 | ~15 |
| 5 | Testi secondari | 4 | ~6 |
| **TOTALE** | | **~25 file** | **~86 modifiche** |

---

## COME PROCEDERE

### Opzione A: Step by Step
Procedi task per task, confermando dopo ogni blocco completato.

### Opzione B: Batch per File
Posso modificare tutti i problemi di un singolo file in una volta sola.

### Opzione C: Tutto Insieme
Procedo con tutte le modifiche in autonomia (consigliato per efficienza).

---

## NOTE

1. **Non modificare icone decorative** - Le icone come `ChevronDownIcon`, `MagnifyingGlassIcon` usate come decorazione possono restare `text-gray-400`

2. **Valutare caso per caso** - Alcuni `text-gray-400` potrebbero essere intenzionali per hover states o transizioni

3. **Test visivo consigliato** - Dopo le modifiche, verificare visivamente le pagine principali


⏺ Tutte le modifiche completate. Aggiorno la todo list.

⏺ Tutte le correzioni di contrasto sono state completate. Ecco il riepilogo:

TASK 1 - Sfondi semi-trasparenti ✅
- bg-white/60 e bg-white/80 → bg-white
- 10 file modificati (~40 modifiche)

TASK 2 - Dimensioni font ⏭️ (escluso su richiesta)

TASK 3 - Icone stato disabilitato ✅
- text-gray-300 → text-gray-400
- 5 file modificati (~10 modifiche)

TASK 4 - Placeholder input ✅
- placeholder:text-gray-400 → placeholder:text-gray-500
- 11 file modificati (~15 modifiche)

TASK 5 - Testi secondari ✅
- text-gray-400 → text-gray-500
- 4 file modificati (~6 modifiche)

Totale: ~70 modifiche in ~25 file

Il contrasto è ora migliorato per conformarsi meglio agli standard WCAG (~4.5:1 per testo normale).

---

## SEZIONE 6: Mappatura Font Size

### Riferimento Classi Tailwind Standard

| Classe Tailwind | rem | px | Uso Tipico |
|-----------------|-----|----|-----------|
| `text-xs` | 0.75rem | 12px | Label, badge, caption, hint |
| `text-sm` | 0.875rem | 14px | Testo secondario, form label |
| `text-base` | 1rem | 16px | Testo body default |
| `text-lg` | 1.125rem | 18px | Sottotitoli, heading piccoli |
| `text-xl` | 1.25rem | 20px | Heading sezione |
| `text-2xl` | 1.5rem | 24px | Titoli pagina |
| `text-3xl` | 1.875rem | 30px | Titoli grandi |
| `text-4xl` | 2.25rem | 36px | Hero title |
| `text-5xl` | 3rem | 48px | Display title |

### Font Size Non-Standard Trovati nel Codebase

#### Componenti React (src/)

| File | Linea | Classe Attuale | Equivalente Tailwind | Note |
|------|-------|----------------|---------------------|------|
| `src/common/stat-card/StatCard.tsx` | 9 | `text-[9px] sm:text-[10px] lg:text-xs` | `text-xs` | Label stat card |
| `src/common/page-title/PageTitle.tsx` | 33 | `text-[9px] sm:text-[10px]` | `text-xs` | Badge nel titolo |
| `src/common/logo-selection/LogoSelection.tsx` | 177 | `text-[10px]` | `text-xs` | Badge "Principale" |
| `src/common/modal-activity-detail/ModalActivityDetail.tsx` | 57 | `text-[10px]` | `text-xs` | Label uppercase |
| `src/common/modal-activity-detail/ModalActivityDetail.tsx` | 69 | `text-[10px]` | `text-xs` | Label uppercase |
| `src/common/modal-activity-detail/ModalActivityDetail.tsx` | 90 | `text-[11px]` | `text-xs` | Testo descrittivo |
| `src/common/modal-activity-detail/ModalActivityDetail.tsx` | 101 | `text-[10px]` | `text-xs` | Label uppercase |
| `src/pages/project/Project.tsx` | 148 | `text-[11px]` | `text-xs` | Tab navigation |
| `src/components/draggableButton/DraggableButton.tsx` | 104 | `text-[11px]` | `text-xs` | Tooltip label |
| `src/components/entitySelector/EntitySelector.tsx` | 183 | `text-[10px]` | `text-xs` | Label uppercase |
| `src/components/entitySelector/EntitySelector.tsx` | 237 | `text-[10px]` | `text-xs` | Label uppercase |
| `src/components/entitySelector/EntitySelector.tsx` | 241 | `text-[10px]` | `text-xs` | Testo secondario |
| `src/components/entitySelector/EntitySelector.tsx` | 252 | `text-[12px]` | `text-xs` | Info text (già 12px) |
| `src/components/entitySelector/EntitySelector.tsx` | 280 | `text-[9px]` | `text-xs` | Label uppercase |
| `src/components/entitySelector/EntitySelector.tsx` | 286 | `text-[9px]` | `text-xs` | Label uppercase |
| `src/components/entitySelector/EntitySelector.tsx` | 298 | `text-[10px]` | `text-xs` | Label uppercase |
| `src/components/panels/activityPanel/ActivityPanel.tsx` | 77 | `text-[9px] sm:text-[10px]` | `text-xs sm:text-sm` | Tab buttons |
| `src/components/panels/activityDetailPanel/ActivityDetailPanel.tsx` | 93 | `text-[11px]` | `text-xs` | Tab navigation |

#### CSS Personalizzato (src/styles/calendar.css)

| Linea | Valore CSS | rem | px | Equivalente Tailwind |
|-------|-----------|-----|----|--------------------|
| 32 | `font-size: 0.8125rem` | 0.8125rem | 13px | tra `text-xs` e `text-sm` |
| 83 | `font-size: 1rem` | 1rem | 16px | `text-base` ✓ |
| 102 | `font-size: 0.75rem` | 0.75rem | 12px | `text-xs` ✓ |
| 158 | `font-size: 0.875rem` | 0.875rem | 14px | `text-sm` ✓ |
| 170 | `font-size: 0.75rem` | 0.75rem | 12px | `text-xs` ✓ |
| 183 | `font-size: 0.75rem` | 0.75rem | 12px | `text-xs` ✓ |
| 224 | `font-size: 0.75rem` | 0.75rem | 12px | `text-xs` ✓ |
| 234 | `font-size: 0.875rem` | 0.875rem | 14px | `text-sm` ✓ |
| 299 | `font-size: 0.75rem` | 0.75rem | 12px | `text-xs` ✓ |
| 344 | `font-size: 0.9375rem` | 0.9375rem | 15px | tra `text-sm` e `text-base` |
| 369 | `font-size: 0.75rem` | 0.75rem | 12px | `text-xs` ✓ |
| 375 | `font-size: 0.65rem` | 0.65rem | 10.4px | sotto `text-xs` ⚠️ |
| 380 | `font-size: 0.75rem` | 0.75rem | 12px | `text-xs` ✓ |
| 385 | `font-size: 0.65rem` | 0.65rem | 10.4px | sotto `text-xs` ⚠️ |
| 390 | `font-size: 0.65rem` | 0.65rem | 10.4px | sotto `text-xs` ⚠️ |
| 397 | `font-size: 0.75rem` | 0.75rem | 12px | `text-xs` ✓ |

---

### Riepilogo Font Non-Standard

| Dimensione | Occorrenze | Conversione Consigliata |
|------------|------------|------------------------|
| `text-[9px]` | 4 | `text-xs` (12px) |
| `text-[10px]` | 10 | `text-xs` (12px) |
| `text-[11px]` | 4 | `text-xs` (12px) |
| `text-[12px]` | 1 | `text-xs` (12px) - già equivalente |
| `0.65rem` (CSS) | 3 | `text-xs` (0.75rem) |
| `0.8125rem` (CSS) | 1 | `text-sm` (0.875rem) o custom |
| `0.9375rem` (CSS) | 1 | `text-base` (1rem) o custom |

---

### Note sulla Conversione

1. **text-[9px] e text-[10px]** - Sono sotto il minimo raccomandato WCAG. Convertire a `text-xs` (12px) migliora l'accessibilità.

2. **text-[11px]** - Molto vicino a 12px, può essere convertito a `text-xs` senza impatto visivo significativo.

3. **text-[12px]** - Equivale esattamente a `text-xs`, usare la classe Tailwind per coerenza.

4. **CSS 0.65rem** - Usato per eventi calendario in vista compatta. Valutare se necessario per layout.

5. **Responsive** - Le classi come `text-[9px] sm:text-[10px] lg:text-xs` possono essere semplificate a `text-xs` se il design lo permette.

# Analisi Problemi di Contrasto Colori

## Panoramica

Dopo un'analisi approfondita del codebase, ho identificato diverse aree dove il contrasto tra testo e sfondo potrebbe risultare insufficiente, causando difficoltà di lettura specialmente su alcuni schermi o in condizioni di luce particolari.

---

## Problemi Identificati

### 1. Placeholder degli Input (`text-gray-400` su sfondo chiaro)

**Severità: Media**

Il colore `text-gray-400` (#9CA3AF) usato per i placeholder ha un rapporto di contrasto di circa **2.5:1** su sfondo bianco, inferiore al minimo raccomandato di **4.5:1** per testo normale (WCAG AA).

**File interessati:**
- `src/pages/login/Login.tsx`
- `src/pages/invitation-page/InvitationPage.tsx`
- `src/components/panels/partnerPanel/PartnerPanel.tsx`
- `src/components/panels/generalPanel/GeneralPanel.tsx`
- `src/pages/projects/Projects.tsx`
- `src/components/tabs/activityTab/ActivityTab.tsx`
- E molti altri...

**Esempio problematico:**
```tsx
placeholder:text-gray-400
```

**Soluzione consigliata:**
```tsx
placeholder:text-gray-500  // Contrasto ~4.5:1
```

---

### 2. Label delle Form (`text-gray-500` con `text-xs`)

**Severità: Media-Bassa**

Le label usano `text-xs` (12px) con `text-gray-500`. Il testo piccolo richiede un contrasto maggiore per essere leggibile.

**File interessati:**
- `src/pages/create-partner/CreatePartner.tsx`
- `src/pages/projects/NewProjectModal/NewProjectModal.tsx`
- `src/common/profile-edit-form-drawer/ProfileEditModal.tsx`
- `src/common/modal-company-select/CompanyEditModal.tsx`

**Esempio problematico:**
```tsx
className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2"
```

**Soluzione consigliata:**
```tsx
className="block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-2"
```

---

### 3. Sfondi Semi-Trasparenti (`bg-white/60`, `bg-white/80`)

**Severità: Alta**

Gli sfondi con opacità ridotta possono causare problemi di contrasto imprevedibili a seconda dello sfondo sottostante.

**File interessati:**
- `src/pages/activity/Activity.tsx` (linee 333, 347, 372)
- `src/components/panels/generalPanel/GeneralPanel.tsx` (multiple linee)

**Esempio problematico:**
```tsx
className="bg-white/60 backdrop-blur-sm ... text-gray-900"
```

**Soluzione consigliata:**
```tsx
className="bg-white/90 backdrop-blur-sm ... text-gray-900"
// Oppure rimuovere completamente l'opacità:
className="bg-white backdrop-blur-sm ... text-gray-900"
```

---

### 4. Icone Stato Disabilitato (`text-gray-300`)

**Severità: Media**

Il colore `text-gray-300` (#D1D5DB) per indicare stati disabilitati ha un contrasto molto basso (~1.6:1) su sfondo bianco.

**File interessati:**
- `src/components/panels/partnerPanel/PartnerPanel.tsx` (linee 340, 344, 352, 356)
- `src/pages/company-user/CompanyUser.tsx` (linea 205)
- `src/pages/dashboard/Dashboard.tsx` (linea 168)

**Esempio problematico:**
```tsx
<XCircleIcon className="h-4 w-4 text-gray-300"/>
```

**Soluzione consigliata:**
```tsx
<XCircleIcon className="h-4 w-4 text-gray-400"/>
```

---

### 5. Testo Secondario/Descrittivo (`text-gray-400`)

**Severità: Media**

Descrizioni e testi secondari usano `text-gray-400` che può risultare difficile da leggere.

**File interessati:**
- `src/common/modal-activity-detail/ModalActivityDetail.tsx`
- `src/common/logo-selection/LogoSelection.tsx`
- `src/common/simple-meter/SimpleMeter.tsx`

**Esempio problematico:**
```tsx
<span className="text-sm text-gray-400">di {size} GB</span>
```

**Soluzione consigliata:**
```tsx
<span className="text-sm text-gray-500">di {size} GB</span>
```

---

### 6. StatCard Label Molto Piccole

**Severità: Alta**

In `StatCard.tsx` le label usano dimensioni molto piccole (`text-[9px]`, `text-[10px]`) con `text-gray-400`.

**File interessato:**
- `src/common/stat-card/StatCard.tsx`

**Esempio problematico:**
```tsx
<h5 className="text-[9px] sm:text-[10px] lg:text-xs font-semibold text-gray-400 uppercase tracking-wide">
```

**Soluzione consigliata:**
```tsx
<h5 className="text-[10px] sm:text-xs lg:text-sm font-semibold text-gray-600 uppercase tracking-wide">
```

---

### 7. Subtitle nel Modal Header

**Severità: Bassa**

Il sottotitolo del Modal usa `text-gray-400` con `text-xs`.

**File interessato:**
- `src/common/modal/ModalHeader.tsx`

**Esempio problematico:**
```tsx
<p className="text-xs text-gray-400 font-semibold uppercase tracking-wider mt-0.5">
```

**Soluzione consigliata:**
```tsx
<p className="text-xs text-gray-500 font-semibold uppercase tracking-wider mt-0.5">
```

---

## Tabella Riassuntiva Soluzioni

| Classe Attuale | Problema | Classe Consigliata |
|----------------|----------|-------------------|
| `text-gray-300` | Contrasto ~1.6:1 | `text-gray-400` |
| `text-gray-400` | Contrasto ~2.5:1 | `text-gray-500` |
| `placeholder:text-gray-400` | Contrasto ~2.5:1 | `placeholder:text-gray-500` |
| `bg-white/60` | Opacità insufficiente | `bg-white/90` o `bg-white` |
| `bg-white/80` | Opacità borderline | `bg-white/90` o `bg-white` |
| `text-[9px]` | Troppo piccolo | `text-[10px]` o `text-xs` |

---

## Raccomandazioni Generali

### 1. Creare Classi Utility Centralizzate

Creare un file di utility per i colori del testo:

```css
/* In un file CSS globale o tailwind.config.js */
.text-secondary {
  @apply text-gray-600;  /* Per testo secondario */
}

.text-muted {
  @apply text-gray-500;  /* Per testo meno importante */
}

.text-hint {
  @apply text-gray-500;  /* Per placeholder e hint */
}
```

### 2. Aumentare Font Size Minimi

Evitare `text-[9px]` e `text-[10px]`. Il minimo consigliato è `text-xs` (12px).

### 3. Rimuovere o Aumentare Opacità Sfondi

Sostituire `bg-white/60` con `bg-white/90` o `bg-white` per garantire contrasto consistente.

### 4. Test Accessibilità

Utilizzare strumenti come:
- **Chrome DevTools** → Lighthouse → Accessibility
- **axe DevTools** (estensione browser)
- **Contrast Checker** online

---

## Priorità di Intervento

1. **Alta**: Sfondi semi-trasparenti (`bg-white/60`) - Impatto immediato sulla leggibilità
2. **Alta**: StatCard con `text-[9px]` - Testo quasi illeggibile su alcuni schermi
3. **Media**: Placeholder `text-gray-400` - Molto comune in tutto il progetto
4. **Media**: Icone stato disabilitato `text-gray-300` - Poca visibilità dello stato
5. **Bassa**: Label form `text-gray-500` - Già borderline ma accettabile con `font-semibold`

---

## Stima Impatto

La correzione di questi problemi richiederebbe modifiche in circa **30-40 file** ma la maggior parte sono sostituzioni semplici (es. `text-gray-400` → `text-gray-500`).

Consiglio di procedere per priorità, iniziando dai problemi ad alta severità che impattano la leggibilità generale dell'applicazione.

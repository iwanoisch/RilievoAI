# Design System - RilievoAI

Documentazione completa del design system utilizzato nell'applicazione.

---

## Stack Tecnologico

| Tecnologia | Versione | Utilizzo |
|------------|----------|----------|
| React | 19.x | Framework UI |
| TypeScript | 5.7.x | Type safety |
| Tailwind CSS | 4.x | Styling utility-first |
| Headless UI | 2.2.x | Componenti accessibili |
| Heroicons | 2.2.x | Icone |
| Framer Motion | 12.x | Animazioni |
| React Router | 7.x | Routing |
| Redux Toolkit | 2.6.x | State management |
| i18next | 25.x | Internazionalizzazione |

---

## Tipografia

### Font Family

```css
/* Font principale */
font-family: 'Inter', sans-serif;

/* Font per codice */
font-family: 'Fira Code', monospace;
```

**Importazione:**
```css
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Fira+Code:wght@400;500&display=swap');
```

### Scala Tipografica

| Elemento | Desktop | Tablet | Mobile | Weight |
|----------|---------|--------|--------|--------|
| h1 | `text-5xl` (3rem) | `text-4xl` (2.25rem) | `text-3xl` (1.875rem) | `font-bold` (700) |
| h2 | `text-3xl` (1.875rem) | `text-2xl` (1.5rem) | `text-2xl` | `font-bold` (700) |
| h3 | `text-xl` (1.25rem) | - | - | `font-bold` (700) |
| Body | `text-base` (1rem) | - | - | `font-normal` (400) |
| Small | `text-sm` (0.875rem) | - | - | `font-medium` (500) |
| XS | `text-xs` (0.75rem) | - | - | `font-medium` (500) |

---

## Palette Colori

### Colori Primari (Brand Arancione)

| Nome | Classe Tailwind | Valore HEX | RGB | Utilizzo |
|------|-----------------|------------|-----|----------|
| **Primary** | `orange-500` / `bg-[#F28F16]` | `#F28F16` | `rgb(242, 143, 22)` | Bottoni primari, CTA, accenti, badge |
| **Primary Dark** | `orange-600` / `bg-[#d97e12]` | `#d97e12` | `rgb(217, 126, 18)` | Hover su bottoni primari |
| **Primary Light** | `orange-50` | `#fef3e2` | - | Sfondi soft, hover states |
| **Primary BG** | `orange-100` | `#fde6c4` | - | Background selezionato |

```html
<!-- Esempi utilizzo colore primario -->
<button class="bg-[#F28F16] hover:bg-[#d97e12] text-white">Primary Button</button>
<div class="bg-orange-50 text-[#F28F16]">Badge</div>
<div class="bg-[#F28F16]/10 text-[#F28F16]">Soft background</div>
```

### Colori Neutrali (Palette Slate)

| Nome | Classe Tailwind | Valore HEX | Utilizzo |
|------|-----------------|------------|----------|
| Background | `slate-50` | `#F8FAFC` | Sfondo pagina |
| Surface | `white` | `#FFFFFF` | Card, modal, contenitori |
| Border | `slate-100` / `slate-200` | `#F1F5F9` / `#E2E8F0` | Bordi e divisori |
| Text Primary | `slate-900` | `#0F172A` | Testo principale, titoli |
| Text Secondary | `slate-800` | `#1E293B` | Testo importante |
| Text Body | `slate-600` | `#475569` | Testo corpo |
| Text Muted | `slate-500` | `#64748B` | Testo secondario |
| Text Label | `slate-400` | `#94A3B8` | Label, placeholder |
| Text Disabled | `slate-300` | `#CBD5E1` | Icone disabilitate |

### Colori Semantici (Status)

| Stato | Background | Text | Bordo | Utilizzo |
|-------|------------|------|-------|----------|
| **Successo** | `bg-green-100` / `bg-emerald-50` | `text-green-800` / `text-emerald-600` | `border-green-200` | Completato, confermato |
| **Warning** | `bg-amber-100` / `bg-orange-100` | `text-amber-800` / `text-orange-800` | `border-amber-200` | In corso, attenzione |
| **Errore** | `bg-red-100` | `text-red-800` | `border-red-200` | Scaduto, errore, rifiutato |
| **Info** | `bg-blue-100` | `text-blue-800` | `border-blue-200` | In attesa, informativo |
| **Neutro** | `bg-gray-100` | `text-gray-800` | `border-gray-200` | Nuovo, default |

### Colori per Stato Badge

```typescript
// Status color mapping
const getStatusColor = (status: string) => {
    switch (status) {
        case 'Scaduto':     return 'bg-red-100 text-red-800';
        case 'Urgente':     return 'bg-orange-100 text-orange-800';
        case 'In corso':    return 'bg-blue-100 text-blue-800';
        case 'Nuovo':       return 'bg-gray-100 text-gray-800';
        case 'Completato':  return 'bg-green-100 text-green-800';
        default:            return 'bg-gray-100 text-gray-800';
    }
};
```

### Colori per Tipo Progetto

```typescript
const colorMap = {
    1: { bg: 'bg-emerald-100', border: 'border-sky-200', text: 'text-sky-800' },
    2: { bg: 'bg-amber-100', border: 'border-amber-200', text: 'text-amber-800' },
    3: { bg: 'bg-sky-100', border: 'border-emerald-200', text: 'text-emerald-800' },
    4: { bg: 'bg-orange-100', border: 'border-orange-200', text: 'text-orange-800' },
    5: { bg: 'bg-rose-100', border: 'border-rose-200', text: 'text-rose-800' },
    6: { bg: 'bg-indigo-100', border: 'border-indigo-200', text: 'text-indigo-800' },
    default: { bg: 'bg-slate-200', border: 'border-slate-200', text: 'text-slate-800' }
};
```

### Colori per StatCard

| Tipo | Icon Color | Background |
|------|------------|------------|
| Totale | `text-blue-600` | `bg-blue-50` |
| In Corso | `text-amber-600` | `bg-amber-50` |
| Completato | `text-emerald-600` | `bg-emerald-50` |
| Nuovo | `text-purple-600` | `bg-purple-50` |

---

## Spaziatura

### Sistema di Spacing (Tailwind default)

| Token | Valore | Utilizzo |
|-------|--------|----------|
| `p-2` / `gap-2` | 0.5rem (8px) | Spacing minimo |
| `p-3` / `gap-3` | 0.75rem (12px) | Spacing piccolo |
| `p-4` / `gap-4` | 1rem (16px) | Spacing standard |
| `p-6` / `gap-6` | 1.5rem (24px) | Spacing medio |
| `p-8` / `gap-8` | 2rem (32px) | Spacing grande |
| `mb-8` / `my-8` | 2rem (32px) | Margini sezioni |

### Padding Responsivo

```css
/* Pattern standard per contenitori */
px-4 sm:px-6 lg:px-8  /* Padding orizzontale */
py-5 sm:py-6          /* Padding verticale */
```

---

## Layout

### Container

```html
<div class="w-full px-4 sm:px-6 lg:px-8 py-6">
    <div class="mx-auto w-full max-w-7xl">
        <!-- Contenuto -->
    </div>
</div>
```

### Background Pagina

```css
/* Sfondo con gradiente sottile */
bg-gradient-to-br from-gray-50 to-gray-100 min-h-screen
```

### Sidebar Layout

| Stato | Padding Left Desktop |
|-------|---------------------|
| Non autenticato | Nessuno (`''`) |
| Autenticato + Sidebar espansa | `lg:pl-72` (18rem) |
| Autenticato + Sidebar collassata | `lg:pl-20` (5rem) |

### Grid Responsive

```html
<!-- Grid 2 colonne mobile, 4 desktop -->
<div class="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">

<!-- Grid card progetti -->
<ul class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
```

---

## Componenti

### Card

```css
/* Card base */
.card {
    @apply bg-white rounded-xl p-6 shadow-card;
    @apply transition-all hover:shadow-lg;
}

/* Card con bordo */
bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden
```

### Bottoni

#### Bottone Primario
```html
<button class="inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2.5
               text-sm font-semibold text-white shadow-sm
               bg-[#F28F16] hover:bg-[#d97e12]
               focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-300
               transition-colors duration-200
               disabled:opacity-40 disabled:cursor-not-allowed">
    <PlusIcon class="h-5 w-5" />
    Nuovo Progetto
</button>
```

#### Bottone Secondario (Slate)
```html
<button class="px-6 py-4 bg-slate-900 text-white rounded-lg font-semibold
               shadow-lg hover:bg-slate-800 transition-all">
    Azione Secondaria
</button>
```

#### Bottone Outline
```html
<button class="w-full md:w-auto flex justify-center rounded-lg px-3 py-1.5
               text-sm/6 font-semibold text-[#F28F16] shadow-xs
               border-2 border-[#F28F16] hover:bg-[#F28F16] hover:text-white
               focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#F28F16]
               transition-all">
    Annulla
</button>
```

### Badge/Chip

```html
<!-- Badge stato -->
<span class="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
    Completato
</span>

<!-- Badge contatore -->
<span class="bg-blue-100 text-blue-700 text-xs px-2.5 py-1 rounded-full font-semibold">
    12
</span>
```

### Input

```html
<input class="block w-full rounded-md px-3 py-1.5
              text-base text-slate-900 bg-slate-50
              border-2 border-slate-100
              placeholder:text-slate-400
              focus:border-[#F28F16] focus:bg-white
              transition-all sm:text-sm/6" />
```

### Select

```html
<select class="col-start-1 row-start-1 w-full appearance-none rounded-md
               bg-slate-50 py-1.5 pr-8 pl-3
               text-base text-slate-900
               border-2 border-slate-100
               focus:border-[#F28F16] focus:bg-white
               transition-all sm:text-sm/6">
```

### StatCard

```tsx
<div class="p-2.5 sm:p-3 lg:p-4 rounded-lg lg:rounded-xl
            border border-gray-100 bg-white shadow-sm
            hover:shadow-md transition-all duration-200">
    <div class="flex items-center justify-between gap-2">
        <div class="min-w-0 flex-1">
            <h5 class="text-[9px] sm:text-[10px] lg:text-xs font-semibold
                       text-gray-400 uppercase tracking-wide mb-0.5 lg:mb-1 truncate">
                Label
            </h5>
            <span class="text-base sm:text-lg lg:text-2xl font-bold text-gray-800">
                42
            </span>
        </div>
        <div class="p-1.5 sm:p-2 lg:p-3 rounded-full bg-blue-50 shadow-sm flex-shrink-0">
            <Icon class="h-3.5 w-3.5 sm:h-4 sm:w-4 lg:h-5 lg:w-5 text-blue-600" />
        </div>
    </div>
</div>
```

### Section Header con Icona

```html
<div class="flex items-center gap-3 mb-4">
    <div class="p-2 bg-blue-100 rounded-lg">
        <FolderIcon class="h-5 w-5 text-blue-600" />
    </div>
    <h2 class="text-xl font-bold text-gray-900">Titolo Sezione</h2>
</div>
```

### Empty State

```html
<div class="text-center py-12">
    <FolderIcon class="h-12 w-12 text-slate-300 mx-auto mb-4" />
    <h3 class="text-sm font-medium text-slate-900 mb-1">Nessun progetto</h3>
    <p class="text-sm text-slate-500 mb-4">Inizia creando il tuo primo progetto</p>
    <button class="inline-flex items-center gap-2 text-sm font-medium
                   text-[#F28F16] hover:text-[#d97e12]">
        <PlusIcon class="h-4 w-4" />
        Crea il primo progetto
    </button>
</div>
```

### Tooltip

```css
/* Base CSS */
.tooltip {
    @apply invisible absolute;
}
.has-tooltip:hover .tooltip {
    @apply visible z-50;
}
```

```html
<div class="has-tooltip group relative">
    <span>Testo troncato...</span>
    <div class="tooltip absolute z-50 hidden group-hover:block
                min-w-[100px] w-auto px-3 py-2
                text-sm font-medium text-gray-900
                bg-white border border-gray-200 rounded-lg shadow-lg -mt-9">
        Testo completo del tooltip
    </div>
</div>
```

---

## Ombre

```css
/* Card shadow */
--shadow-card: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);

/* Button shadow */
--shadow-button: 0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1);

/* Tailwind equivalenti */
shadow-sm   /* Ombra leggera */
shadow-md   /* Ombra media */
shadow-lg   /* Ombra grande (hover) */
```

---

## Border Radius

| Token | Valore | Utilizzo |
|-------|--------|----------|
| `rounded-md` | 0.375rem (6px) | Input, select, bottoni piccoli |
| `rounded-lg` | 0.5rem (8px) | Bottoni, card piccole |
| `rounded-xl` | 0.75rem (12px) | Card, contenitori principali |
| `rounded-full` | 9999px | Badge, avatar, icone circolari |

---

## Transizioni

```css
/* Transizione standard */
transition-all duration-200

/* Transizione colori */
transition-colors duration-200

/* Transizione layout (sidebar) */
transition-all duration-300 ease-in-out
```

---

## Breakpoint Responsive

| Breakpoint | Min Width | Prefisso |
|------------|-----------|----------|
| Mobile | 0px | (default) |
| Small | 640px | `sm:` |
| Medium | 768px | `md:` |
| Large | 1024px | `lg:` |
| XL | 1280px | `xl:` |

### Pattern Mobile-First

```html
<!-- Esempio: padding responsivo -->
<div class="px-4 sm:px-6 lg:px-8">

<!-- Esempio: grid responsivo -->
<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">

<!-- Esempio: testo responsivo -->
<h1 class="text-lg sm:text-xl lg:text-2xl">
```

---

## Accessibilità

### Focus States

```css
/* Focus visibile per bottoni */
focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-300

/* Focus visibile per input */
focus:border-[#F28F16] focus:bg-white

/* Focus per elementi interattivi custom */
focus:outline-none focus:ring-2 focus:ring-inset focus:ring-[#F28F16]
```

### ARIA Attributes

```html
<!-- Sezioni -->
<section aria-label="Lista progetti">

<!-- Bottoni con icone -->
<button aria-label="Aggiungi progetto">
    <PlusIcon aria-hidden="true" />
</button>

<!-- Elementi espandibili -->
<button aria-expanded={isOpen} aria-controls="panel-id">

<!-- Liste -->
<ul role="list">
```

### Elementi Decorativi

```html
<!-- Icone decorative -->
<Icon aria-hidden="true" class="h-5 w-5" />

<!-- Divisori decorativi -->
<hr aria-hidden="true" class="..." />
```

---

## Icone

### Libreria: Heroicons

**Import:**
```tsx
import {
    FolderIcon,
    PlusIcon,
    PencilSquareIcon,
    TrashIcon,
    CheckCircleIcon,
    ClockIcon,
    ChevronDownIcon
} from "@heroicons/react/24/solid";

// Per outline
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
```

### Dimensioni Standard

| Contesto | Classe | Dimensione |
|----------|--------|------------|
| In bottoni | `h-5 w-5` | 20px |
| In badge | `h-4 w-4` | 16px |
| Empty state | `h-12 w-12` | 48px |
| StatCard (responsive) | `h-3.5 w-3.5 sm:h-4 sm:w-4 lg:h-5 lg:w-5` | 14-20px |

---

## Animazioni

### Float Animation

```css
@keyframes float {
    0%, 100% { transform: translateY(0); }
    50% { transform: translateY(-8px); }
}

/* Utilizzo */
animation: float 3s ease-in-out infinite;
```

### Hover Effects

```css
/* Card hover */
hover:shadow-lg

/* Bottone primario hover */
hover:bg-[#d97e12]

/* Link hover */
hover:text-[#d97e12]

/* Bottone secondario hover */
hover:bg-slate-800

/* Scale su click */
active:scale-95
```

---

## File Struttura CSS

```
src/
├── styles/
│   └── theme.css          # Tema principale, variabili, componenti base
├── index.css              # Import Tailwind base
└── App.css                # Stili specifici app (se necessario)
```

### theme.css Structure

```css
/* 1. Font imports */
@import url('...');

/* 2. Tailwind import */
@import "../node_modules/tailwindcss/dist/lib.d.mts";

/* 3. Theme variables */
@theme {
    --color-primary: . . .;
    --shadow-card: . . .;
    --animation-float: . . .;
}

/* 4. Base layer */
@layer base {
    html {
        ...
    }

    body {
        ...
    }

    h1, h2 {
        ...
    }
}

/* 5. Components layer */
@layer components {
    .card {
        ...
    }

    .btn {
        ...
    }
}

/* 6. Keyframes */
@keyframes float {

...

}
```

---

## Quick Reference - Classi Più Usate

```
Brand:        #F28F16 (arancione)
Brand hover:  #d97e12 (arancione scuro)
Text:         slate-900 → slate-400
BG:           white, slate-50
Border:       slate-100, slate-200
Success:      green-500/600, green-50
Error:        red-500/600, red-50
Warning:      amber-500/600, amber-50
```

```html
<!-- Container principale -->
w-full px-4 sm:px-6 lg:px-8 py-6 bg-gradient-to-br from-slate-50 to-slate-100 min-h-screen

<!-- Card container -->
bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden

<!-- Titolo sezione -->
text-lg sm:text-xl font-bold text-slate-900

<!-- Testo descrittivo -->
text-sm text-slate-500

<!-- Bottone primario -->
inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-semibold text-white bg-[#F28F16] hover:bg-[#d97e12] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-300 disabled:opacity-40 disabled:cursor-not-allowed

<!-- Badge -->
px-2 py-1 rounded-full text-xs font-medium

<!-- Input -->
block w-full rounded-md px-3 py-1.5 text-base bg-slate-50 border-2 border-slate-100 focus:border-[#F28F16] focus:bg-white

<!-- Grid responsivo -->
grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4
```

---

*Documento generato per il progetto RilievoAI v1.0.0*

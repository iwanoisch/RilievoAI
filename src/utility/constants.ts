import {
    ExclamationCircleIcon,
    ExclamationTriangleIcon,
    CalendarIcon,
    PlayCircleIcon,
    CheckCircleIcon,
    SparklesIcon,
    QuestionMarkCircleIcon
} from "@heroicons/react/24/outline";

// Storage keys
export const SIDEBAR_STORAGE_KEY = "sidebar-collapsed";

// ============================================
// Criticità Attività - Costanti
// ============================================

// Soglia giorni per considerare un'attività "in scadenza"
export const ACTIVITY_DAYS_THRESHOLD = 7;

// Tipi di criticità
export type CriticalityLevel =
    | 'completed'    // Completata (verde)
    | 'expired'      // Status = "Scaduto" (rosso)
    | 'urgent'       // Status = "Urgente" (ambra)
    | 'overdue'      // Data passata (rosa/rosso)
    | 'upcoming'     // Entro X giorni (arancione)
    | 'in_progress'  // In corso (blu)
    | 'new'          // Nuovo (grigio)
    | 'default';     // Default (indigo)

// Configurazione colori per ogni livello di criticità
export const CRITICALITY_COLORS: Record<CriticalityLevel, {
    bg: string;           // Background per card/badge
    text: string;         // Colore testo
    border: string;       // Colore bordo
    hex: string;          // Colore hex per calendario
    hexText: string;      // Colore hex testo per calendario (light mode)
    hexTextDark: string;  // Colore hex testo per calendario (dark mode) - WCAG 4.5:1
}> = {
    completed: {
        bg: 'bg-emerald-50',
        text: 'text-emerald-600',
        border: 'border-emerald-200',
        hex: '#10b981',
        hexText: '#065f46',
        hexTextDark: '#6ee7b7'  // emerald-300
    },
    expired: {
        bg: 'bg-red-50',
        text: 'text-red-600',
        border: 'border-red-200',
        hex: '#ef4444',
        hexText: '#991b1b',
        hexTextDark: '#fca5a5'  // red-300
    },
    urgent: {
        bg: 'bg-amber-50',
        text: 'text-amber-600',
        border: 'border-amber-200',
        hex: '#f97316',
        hexText: '#9a3412',
        hexTextDark: '#fcd34d'  // amber-300
    },
    overdue: {
        bg: 'bg-rose-50',
        text: 'text-rose-600',
        border: 'border-rose-200',
        hex: '#f43f5e',
        hexText: '#9f1239',
        hexTextDark: '#fda4af'  // rose-300
    },
    upcoming: {
        bg: 'bg-primary-50',
        text: 'text-primary-600',
        border: 'border-primary-200',
        hex: '#fb923c',
        hexText: '#c2410c',
        hexTextDark: '#fdba74'  // orange-300
    },
    in_progress: {
        bg: 'bg-blue-50',
        text: 'text-blue-600',
        border: 'border-blue-200',
        hex: '#3b82f6',
        hexText: '#1e40af',
        hexTextDark: '#93c5fd'  // blue-300
    },
    new: {
        bg: 'bg-slate-50',
        text: 'text-slate-600',
        border: 'border-slate-200',
        hex: '#6b7280',
        hexText: '#374151',
        hexTextDark: '#cbd5e1'  // slate-300
    },
    default: {
        bg: 'bg-sky-50',
        text: 'text-sky-600',
        border: 'border-sky-200',
        hex: '#0ea5e9',
        hexText: '#075985',
        hexTextDark: '#7dd3fc'  // sky-300
    }
};

// Priorità per ordinamento (più basso = più critico)
export const CRITICALITY_PRIORITY: Record<CriticalityLevel, number> = {
    completed: 99,    // Le completate in fondo
    expired: 1,       // Più critico
    urgent: 2,
    overdue: 3,
    upcoming: 4,
    in_progress: 5,
    new: 6,
    default: 7
};

// Mappa icone per ogni livello di criticità
export const CRITICALITY_ICONS: Record<CriticalityLevel, typeof ExclamationCircleIcon> = {
    completed: CheckCircleIcon,
    expired: ExclamationCircleIcon,
    urgent: ExclamationTriangleIcon,
    overdue: ExclamationCircleIcon,
    upcoming: CalendarIcon,
    in_progress: PlayCircleIcon,
    new: SparklesIcon,
    default: QuestionMarkCircleIcon
};

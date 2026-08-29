export const colorMap : Record<string | 'default', { bg: string; border: string; text: string }> = {
    1: {
        bg: 'bg-emerald-100',
        border: 'border-sky-200',
        text: 'text-sky-800'
    },
    2: {
        bg: 'bg-amber-100',
        border: 'border-amber-200',
        text: 'text-amber-800'
    },
    3: {
        bg: 'bg-sky-100',
        border: 'border-emerald-200',
        text: 'text-emerald-800'
    },
    4: {
        bg: 'bg-primary-100',
        border: 'border-primary-200',
        text: 'text-primary-800'
    },
    5: {
        bg: 'bg-rose-100 ',
        border: 'border-rose-200',
        text: 'text-rose-800'
    },
    6: {
        bg: 'bg-primary-100',
        border: 'border-primary-200',
        text: 'text-primary-800'
    },
    7: {
        bg: 'bg-primary-100',
        border: 'border-primary-200',
        text: 'text-primary-800'
    },
    8: {
        bg: 'bg-fuchsia-100',
        border: 'border-fuchsia-200',
        text: 'text-fuchsia-800'
    },
    9: {
        bg: 'bg-pink-100',
        border: 'border-pink-200',
        text: 'text-pink-800'
    },
    10: {
        bg: 'bg-teal-100',
        border: 'border-teal-200',
        text: 'text-teal-800'
    },
    11: {
        bg: 'bg-cyan-100',
        border: 'border-cyan-200',
        text: 'text-cyan-800'
    },
    12: {
        bg: 'bg-lime-100',
        border: 'border-lime-200',
        text: 'text-lime-800'
    },
    default: {
        bg: 'bg-slate-200 ',
        border: 'border-slate-200',
        text: 'text-slate-800'
    }
};

export type ProjectTypeMap = keyof typeof colorMap;

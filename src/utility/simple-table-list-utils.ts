export const getStatusColor = (status: string | null) => {
    switch (status) {
        case 'Scaduto':
            return 'bg-red-100 text-red-800';
        case 'Urgente':
            return 'bg-primary-100 text-primary-800';
        case 'In corso':
            return 'bg-blue-100 text-blue-800';
        case 'Nuovo':
            return 'bg-slate-100 text-slate-800';
        case 'Completato':
            return 'bg-green-100 text-green-800'
        default:
            return 'bg-slate-100 text-slate-800';
    }
};

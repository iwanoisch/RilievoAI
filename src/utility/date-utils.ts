
export const formatDate_DD_MM_YYYY = (dateString: string | null): string => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('it-IT');
};

export const formateDate_DD_MM_YYYY_HH_MM = (dateString :string) : string =>{
    if (!dateString) return "";
    const date = new Date(dateString)
    return date.toLocaleDateString('it-IT') + " " + date.toLocaleTimeString('it-IT', {timeStyle:"short"})
}

export const formatDate_DD_MMM_YYYY = (dateString: string | null | undefined) => {
    if (!dateString) return 'N/D';
    const date = new Date(dateString);
    return date.toLocaleDateString('it-IT', {
        day: '2-digit',
        month: 'short',
        year: 'numeric'
    }).toUpperCase();
};

export const formatBackendDateToInput = (dateString: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return '';
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
};

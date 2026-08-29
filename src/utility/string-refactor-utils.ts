

export const NormalizedCodeVat = (code_vat : string) => {

    const raw = (code_vat || '').trim();
    if (!raw) return;
    return raw.toUpperCase().startsWith('IT')
        ? `IT${raw.slice(2)}`
        : `IT${raw}`;
}
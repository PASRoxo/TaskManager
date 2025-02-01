export function formatDateYYYYMMDD(date: Date): string {
    const isoString = date.toISOString();
    const separDate = isoString.split('T')[0].split('-');
    const year = separDate[0];
    const month = separDate[1];
    const day = separDate[2];
    return `${year}-${month}-${day}`;
}

export function isEmptyString(str: string): boolean {
    return str.trim() === "";
}
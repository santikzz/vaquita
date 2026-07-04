// money is always integer minor units (cents) end to end

export function formatMoney(minor: number, currency: string): string {
    return new Intl.NumberFormat('es-AR', {
        style: 'currency',
        currency,
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    }).format(minor / 100);
}

// signed variant for balances: +$1.500,00 / −$1.500,00
export function formatMoneySigned(minor: number, currency: string): string {
    const sign = minor > 0 ? '+' : minor < 0 ? '−' : '';
    return sign + formatMoney(Math.abs(minor), currency);
}

// "18500" (whole units typed by the user) -> 1850000 minor units
export function wholeToMinor(input: string): number {
    const digits = input.replace(/[^0-9]/g, '');
    return (parseInt(digits, 10) || 0) * 100;
}

// group digits for the big amount input display: 18500 -> "18.500"
export function formatWhole(input: string): string {
    const n = parseInt(input.replace(/[^0-9]/g, ''), 10);
    return Number.isNaN(n) ? '0' : n.toLocaleString('es-AR');
}

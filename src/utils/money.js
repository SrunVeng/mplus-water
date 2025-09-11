export const currency = (n) => `$${(Number(n) || 0).toFixed(2)}`;


export const DEFAULT_CURRENCY = "USD";

export function formatAmount(value, locale = undefined) {
    if (value === null || value === undefined || value === "") return null;
    if (typeof value === "number") {
        try {
            return new Intl.NumberFormat(locale, { maximumFractionDigits: 2 }).format(value);
        } catch {
            return value.toString();
        }
    }
    return value; // already a string
}

export function currencyGlyph(code = DEFAULT_CURRENCY) {
    return code === "KHR" ? "៛" : "$";
}

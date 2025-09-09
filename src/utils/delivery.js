export const isPhnomPenh = (p) => (p || "").trim().toLowerCase().includes("phnom penh");

export function calcDeliveryFee(amount, province) {
    if (amount > 100) return 0;
    return isPhnomPenh(province) ? 2 : 5;
}

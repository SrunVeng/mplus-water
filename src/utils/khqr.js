// src/utils/khqr.js

export function normalizeQrPayload(raw) {
    if (!raw) return null;
    return {
        qrString: raw.qrString ?? "",
        amount: typeof raw.amount === "number" ? raw.amount : Number(raw.amount || 0),
        currency: raw.currency || "USD",
        merchantName: raw.merchantName || "",
        status: raw.status ?? null,
    };
}

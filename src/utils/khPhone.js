// Cambodia phone normalization: 012847987 -> 85512847987; accepts +855 and 855
export function formatPhoneKH(raw) {
    if (!raw) return "";
    let s = String(raw).replace(/\s|-/g, "");
    if (s.startsWith("+855")) s = s.slice(1);
    if (s.startsWith("855")) return s;
    if (s.startsWith("0")) return "855" + s.slice(1);
    return "855" + s;
}

export function displayPhoneKH(raw) {
    if (!raw) return "";
    let s = formatPhoneKH(raw);
    return s.replace(/^855/, ""); // show back as 0xx...
}

export function isValidPhoneKH(phoneRaw) {
    const raw = (phoneRaw || "").replace(/\s+/g, "");
    return /^(\+?855|0)\d{8,9}$/.test(raw);
}


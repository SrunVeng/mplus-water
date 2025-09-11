// src/utils/dom.js

/** clamp a number between min and max */
export const clamp = (n, min, max) => Math.min(max, Math.max(min, n));

/** responsive QR pixels based on viewport width, returns an integer */
export function computeResponsiveQrPixels(vw) {
    // phones get a large QR; desktops keep it sane
    // clamp(160px, 60vw, 232px)
    return Math.floor(clamp(vw * 0.60, 160, 232));
}

import { useEffect, useRef, useState } from "react";

/**
 * useMeasure
 * Returns a ref for a DOM element + its current content width.
 * Uses ResizeObserver; falls back gracefully if unavailable.
 */
export function useMeasure() {
    const ref = useRef(null);
    const [width, setWidth] = useState(0);

    useEffect(() => {
        if (!ref.current) return;

        // If ResizeObserver is not supported, set once on mount.
        if (typeof ResizeObserver === "undefined") {
            setWidth(ref.current.getBoundingClientRect().width || 0);
            return;
        }

        const ro = new ResizeObserver((entries) => {
            const entry = entries[0];
            if (!entry) return;
            setWidth(entry.contentRect.width || 0);
        });

        ro.observe(ref.current);
        return () => ro.disconnect();
    }, []);

    return [ref, width];
}

/**
 * computeQrPixels
 * Converts wrapper width -> pixel-perfect QR size for crisp rendering.
 * min/max clamp avoids awkward tiny/huge matrices.
 */
export function computeQrPixels(wrapperWidth) {
    // tiny breathing room to avoid layout jitter
    const inner = Math.max(0, (wrapperWidth || 0) - 4);
    // 160–416px is a good practical range for phones → desktops
    return Math.round(Math.min(Math.max(inner, 160), 416));
}

/**
 * computeCenterBadgeSize
 * Badge scales with QR size; clamped to a reasonable range.
 */
export function computeCenterBadgeSize(qrPixels) {
    const s = Math.round((qrPixels || 160) * 0.22);
    return Math.min(Math.max(s, 28), 72);
}

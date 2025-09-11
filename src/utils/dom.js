import { useEffect, useRef, useState } from "react";

/**
 * useMeasure
 * Returns [ref, width] for the element; uses ResizeObserver.
 */
export function useMeasure() {
    const ref = useRef(null);
    const [width, setWidth] = useState(0);

    useEffect(() => {
        if (!ref.current) return;

        // Fallback for environments without RO
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
 * computeQrPixelsFromWidth
 * Convert measured container width -> crisp QR pixel size.
 * Render the QR at explicit pixels so the modules stay sharp.
 */
export function computeQrPixelsFromWidth(
    containerWidth,
    {
        min = 144,   // good lower bound for scan reliability
        max = 400,   // bump to 512 if you want larger on desktop
        padding = 3, // tiny breathing room
        scale = 0.90 // slightly under container to account for rounding/margins
    } = {}
) {
    const w = Math.max(0, Number(containerWidth) || 0);
    const inner = Math.max(0, (w - padding) * scale);
    const px = Math.floor(inner);
    return Math.max(min, Math.min(max, px));
}

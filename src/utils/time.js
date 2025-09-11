// src/utils/time.js
import { useEffect, useRef, useState } from "react";

/** Returns mm:ss parts from ms */
export function timeParts(ms = 0) {
    const clamped = Math.max(0, ms);
    const totalSeconds = Math.floor(clamped / 1000);
    const m = Math.floor(totalSeconds / 60);
    const s = totalSeconds % 60;
    return {
        mm: String(m).padStart(2, "0"),
        ss: String(s).padStart(2, "0"),
    };
}

/** Countdown from totalMs to 0; calls onEnd exactly once. */
export function useCountdown(totalMs, onEnd) {
    const [remaining, setRemaining] = useState(totalMs);
    const endedRef = useRef(false);

    useEffect(() => {
        const start = performance.now();
        const tick = (t) => {
            const elapsed = t - start;
            const left = Math.max(0, totalMs - elapsed);
            setRemaining(left);
            if (left <= 0 && !endedRef.current) {
                endedRef.current = true;
                onEnd?.();
                return;
            }
            rafId.current = requestAnimationFrame(tick);
        };
        const rafId = { current: requestAnimationFrame(tick) };
        return () => cancelAnimationFrame(rafId.current);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [totalMs]);

    return remaining;
}

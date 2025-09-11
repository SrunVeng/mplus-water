// src/utils/time.js
import { useEffect, useRef, useState } from "react";

export function useCountdown(totalMs, onExpired) {
    const [remaining, setRemaining] = useState(() => Math.max(0, totalMs || 0));
    const expiredCalledRef = useRef(false);

    useEffect(() => {
        setRemaining(Math.max(0, totalMs || 0));
        expiredCalledRef.current = false;
    }, [totalMs]);

    useEffect(() => {
        if (remaining <= 0) {
            if (!expiredCalledRef.current && typeof onExpired === "function") {
                expiredCalledRef.current = true;
                onExpired();
            }
            return; // no timer if already expired
        }

        // Use a high-resolution but not-too-frequent tick
        const startedAt = Date.now();
        const startRemaining = remaining;

        const id = setInterval(() => {
            const elapsed = Date.now() - startedAt;
            const next = Math.max(0, startRemaining - elapsed);
            setRemaining(next);

            if (next <= 0) {
                clearInterval(id);
                if (!expiredCalledRef.current && typeof onExpired === "function") {
                    expiredCalledRef.current = true;
                    onExpired();
                }
            }
        }, 250);

        return () => clearInterval(id);
    }, [remaining, onExpired]);

    return remaining;
}

/**
 * timeParts
 * Converts milliseconds -> { mm, ss } (zero-padded strings).
 */
export function timeParts(ms) {
    const totalSec = Math.max(0, Math.floor((ms || 0) / 1000));
    const mm = Math.floor(totalSec / 60);
    const ss = totalSec % 60;
    return {
        mm: String(mm).padStart(2, "0"),
        ss: String(ss).padStart(2, "0"),
    };
}

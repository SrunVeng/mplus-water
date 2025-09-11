// utils/uiUtils.js
import { useState, useEffect } from "react";

// clamp a number between lo and hi
export const clamp = (n, lo, hi) => Math.max(lo, Math.min(hi, n));

// countdown hook that ticks down until 0
export const useCountdown = (totalMs, onEnd) => {
    const [remaining, setRemaining] = useState(() =>
        clamp(totalMs, 0, Number.MAX_SAFE_INTEGER)
    );
    useEffect(() => {
        const start = Date.now();
        const end = start + totalMs;
        let done = false;
        const id = setInterval(() => {
            const left = clamp(end - Date.now(), 0, totalMs);
            setRemaining(left);
            if (!done && left === 0) {
                done = true;
                onEnd?.();
                clearInterval(id);
            }
        }, 250);
        return () => clearInterval(id);
    }, [totalMs, onEnd]);
    return remaining;
};

// format ms → mm:ss
export const timeParts = (ms) => ({
    mm: String(Math.floor(ms / 60000)).padStart(2, "0"),
    ss: String(Math.floor((ms % 60000) / 1000)).padStart(2, "0"),
});

// compute sand heights
export const sandLevels = (remainingMs, totalMs) => {
    const TRI_H = 60, TOP_Y = 20, BOT_Y = 140;
    const pct = clamp((remainingMs / totalMs) * 100, 0, 100);
    const topH = (pct / 100) * TRI_H;
    const botH = ((100 - pct) / 100) * TRI_H;
    const botY = BOT_Y - botH;
    return { pct, TOP_Y, BOT_Y, TRI_H, topH, botH, botY };
};



export function cn(...classes) {
    return classes.filter(Boolean).join(" ");
}

export function statusTone(tone) {
    switch (tone) {
        case "emerald":
            return { text: "text-emerald-700", bg: "bg-emerald-50", ring: "ring-emerald-200" };
        case "rose":
            return { text: "text-rose-700", bg: "bg-rose-50", ring: "ring-rose-200" };
        case "amber":
            return { text: "text-amber-800", bg: "bg-amber-50", ring: "ring-amber-200" };
        case "sky":
            return { text: "text-sky-700", bg: "bg-sky-50", ring: "ring-sky-200" };
        default:
            return { text: "text-slate-700", bg: "bg-slate-50", ring: "ring-slate-200" };
    }
}

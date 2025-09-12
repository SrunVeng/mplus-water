import { useEffect, useMemo, useRef, useState } from "react";
import { useTranslation } from "react-i18next";

export default function ProductSlider({ images = [] }) {
    const [idx, setIdx] = useState(0);
    const timer = useRef(null);

    // swipe/drag refs
    const startX = useRef(0);
    const isDragging = useRef(false);

    const { t } = useTranslation();
    const safe = useMemo(() => images.filter(Boolean), [images]);

    useEffect(() => {
        clearInterval(timer.current);
        if (safe.length > 1) {
            timer.current = setInterval(
                () => setIdx((i) => (i + 1) % safe.length),
                4000
            );
        }
        return () => clearInterval(timer.current);
    }, [safe.length]);

    const go = (n) => setIdx((n + safe.length) % safe.length);

    const threshold = 50; // px

    // --- Touch swipe ---
    const onTouchStart = (e) => {
        startX.current = e.touches[0].clientX;
        clearInterval(timer.current); // pause auto-rotate while interacting
    };

    const onTouchEnd = (e) => {
        const diff = startX.current - e.changedTouches[0].clientX;
        if (Math.abs(diff) > threshold) {
            diff > 0 ? go(idx + 1) : go(idx - 1);
        }
    };

    // --- Mouse drag (desktop) ---
    const onMouseDown = (e) => {
        isDragging.current = true;
        startX.current = e.clientX;
        clearInterval(timer.current);
    };

    const onMouseUp = (e) => {
        if (!isDragging.current) return;
        isDragging.current = false;
        const diff = startX.current - e.clientX;
        if (Math.abs(diff) > threshold) {
            diff > 0 ? go(idx + 1) : go(idx - 1);
        }
    };

    const onMouseLeave = () => {
        isDragging.current = false;
    };

    return (
        <div
            className="relative overflow-hidden rounded-3xl ring-1 ring-slate-200 shadow-soft select-none"
            onTouchStart={onTouchStart}
            onTouchEnd={onTouchEnd}
            onMouseDown={onMouseDown}
            onMouseUp={onMouseUp}
            onMouseLeave={onMouseLeave}
            role="region"
            aria-roledescription="carousel"
            aria-label={t("a11y.productCarousel", "Product images")}
        >
            <div className="relative w-full h-[360px]">
                {safe.map((src, i) => (
                    <img
                        key={src}
                        src={src}
                        alt={t("a11y.slide", { num: i + 1 })}
                        className={`absolute inset-0 w-full h-full object-cover rounded-3xl transition-opacity duration-500 ${
                            i === idx ? "opacity-100" : "opacity-0"
                        }`}
                        loading={i === 0 ? "eager" : "lazy"}
                        draggable={false}
                    />
                ))}
            </div>

            {/* Prev */}
            <button
                onClick={() => go(idx - 1)}
                className="absolute left-3 top-1/2 -translate-y-1/2 inline-flex items-center justify-center h-10 w-10 rounded-full bg-white/80 ring-1 ring-slate-200 hover:bg-white"
                aria-label={t("a11y.prev", "Previous")}
            >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"
                     fill="none" stroke="currentColor" strokeWidth="2" className="h-5 w-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7"/>
                </svg>
            </button>

            {/* Next */}
            <button
                onClick={() => go(idx + 1)}
                className="absolute right-3 top-1/2 -translate-y-1/2 inline-flex items-center justify-center h-10 w-10 rounded-full bg-white/80 ring-1 ring-slate-200 hover:bg-white"
                aria-label={t("a11y.next", "Next")}
            >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"
                     fill="none" stroke="currentColor" strokeWidth="2" className="h-5 w-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7"/>
                </svg>
            </button>

            {/* Dots */}
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-2">
                {safe.map((_, i) => (
                    <button
                        key={i}
                        onClick={() => go(i)}
                        className={`h-2.5 w-2.5 rounded-full ${
                            i === idx ? "bg-brand-600" : "bg-white ring-1 ring-slate-300"
                        }`}
                        aria-label={t("a11y.slide", { num: i + 1 })}
                        aria-current={i === idx ? "true" : "false"}
                    />
                ))}
            </div>
        </div>
    );
}

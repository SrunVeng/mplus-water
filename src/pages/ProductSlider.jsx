import { useEffect, useMemo, useRef, useState } from 'react'


export default function ProductSlider({ images = [] }) {
    const [idx, setIdx] = useState(0)
    const timer = useRef(null)
    const safe = useMemo(() => images.filter(Boolean), [images])


    useEffect(() => {
        clearInterval(timer.current)
        if (safe.length > 1) {
            timer.current = setInterval(() => setIdx((i) => (i + 1) % safe.length), 4000)
        }
        return () => clearInterval(timer.current)
    }, [safe.length])


    const go = (n) => setIdx((n + safe.length) % safe.length)


    return (
        <div className="relative overflow-hidden rounded-3xl ring-1 ring-slate-200 shadow-soft">
            <div className="relative w-full h-[360px]">
                {safe.map((src, i) => (
                    <img
                        key={src}
                        src={src}
                        alt={`Product ${i + 1}`}
                        className={`absolute inset-0 w-full h-full object-cover rounded-3xl transition-opacity duration-500 ${i === idx ? 'opacity-100' : 'opacity-0'}`}
                        loading={i === 0 ? 'eager' : 'lazy'}
                    />
                ))}
            </div>
            <button onClick={() => go(idx - 1)} className="absolute left-3 top-1/2 -translate-y-1/2 inline-flex items-center justify-center h-10 w-10 rounded-full bg-white/80 ring-1 ring-slate-200 hover:bg-white" aria-label="Prev">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-5 w-5"><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7"/></svg>
            </button>
            <button onClick={() => go(idx + 1)} className="absolute right-3 top-1/2 -translate-y-1/2 inline-flex items-center justify-center h-10 w-10 rounded-full bg-white/80 ring-1 ring-slate-200 hover:bg-white" aria-label="Next">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-5 w-5"><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7"/></svg>
            </button>
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-2">
                {safe.map((_, i) => (
                    <button key={i} onClick={() => go(i)} className={`h-2.5 w-2.5 rounded-full ${i === idx ? 'bg-brand-600' : 'bg-white ring-1 ring-slate-300'}`} aria-label={`Slide ${i+1}`} />
                ))}
            </div>
        </div>
    )
}
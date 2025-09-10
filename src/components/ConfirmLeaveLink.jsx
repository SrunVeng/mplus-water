import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

export default function ConfirmLeaveLink({
                                             to,
                                             children,
                                             title = "Are you sure?",
                                             confirmText = "This action may cause you to lose progress.",
                                             className,
                                             confirmLabel = "Leave",
                                             cancelLabel = "Stay",
                                             onAfterNavigate, // optional cleanup after navigation
                                         }) {
    const navigate = useNavigate();
    const [open, setOpen] = useState(false);
    const cancelRef = useRef(null);

    useEffect(() => {
        if (open) cancelRef.current?.focus();
    }, [open]);

    const handleConfirm = () => {
        setOpen(false);
        if (to) navigate(to);
        onAfterNavigate?.();
    };

    const onKeyDown = (e) => {
        if (e.key === "Escape") setOpen(false);
    };

    return (
        <>
            {/* Trigger */}
            <button type="button" className={className} onClick={() => setOpen(true)}>
                {children}
            </button>

            {/* Modal */}
            <AnimatePresence>
                {open && (
                    <div
                        className="fixed inset-0 z-50"
                        role="dialog"
                        aria-modal="true"
                        aria-labelledby="confirm-leave-title"
                        onKeyDown={onKeyDown}
                    >
                        {/* Backdrop */}
                        <motion.div
                            className="absolute inset-0 bg-black/50"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                        />

                        {/* Centering wrapper */}
                        <div className="absolute inset-0 flex items-center justify-center px-4">
                            {/* Modal card */}
                            <motion.div
                                className="w-full max-w-md rounded-2xl bg-white shadow-xl ring-1 ring-slate-200"
                                initial={{ opacity: 0, scale: 0.95, y: 8 }}
                                animate={{
                                    opacity: 1,
                                    scale: 1,
                                    y: 0,
                                    transition: { type: "spring", stiffness: 380, damping: 28 },
                                }}
                                exit={{ opacity: 0, scale: 0.98, y: 6 }}
                            >
                                <div className="p-6">
                                    <div className="flex items-start gap-3">
                                        <div className="mt-1 grid h-8 w-8 place-items-center rounded-full bg-amber-100 text-amber-700">
                                            {/* Warning icon */}
                                            <svg
                                                viewBox="0 0 20 20"
                                                className="h-4 w-4"
                                                fill="currentColor"
                                                aria-hidden="true"
                                            >
                                                <path
                                                    fillRule="evenodd"
                                                    d="M8.257 3.099c.765-1.36 2.721-1.36 3.486 0l6.518 11.59c.75 1.334-.213 2.996-1.743 2.996H3.482c-1.53 0-2.493-1.662-1.743-2.996l6.518-11.59zM11 14a1 1 0 10-2 0 1 1 0 002 0zm-.75-6.5a.75.75 0 00-1.5 0v4a.75.75 0 001.5 0v-4z"
                                                    clipRule="evenodd"
                                                />
                                            </svg>
                                        </div>
                                        <div className="flex-1">
                                            <h2
                                                id="confirm-leave-title"
                                                className="text-base font-semibold text-slate-900"
                                            >
                                                {title}
                                            </h2>
                                            <p className="mt-1 text-sm text-slate-600">{confirmText}</p>
                                        </div>
                                    </div>

                                    <div className="mt-6 flex justify-end gap-3">
                                        <button
                                            ref={cancelRef}
                                            onClick={() => setOpen(false)}
                                            className="px-4 py-2 rounded-xl border border-slate-300 text-slate-700 hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-slate-300"
                                        >
                                            {cancelLabel}
                                        </button>
                                        <button
                                            onClick={handleConfirm}
                                            className="px-4 py-2 rounded-xl bg-red-600 text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-300"
                                        >
                                            {confirmLabel}
                                        </button>
                                    </div>
                                </div>
                            </motion.div>
                        </div>
                    </div>
                )}
            </AnimatePresence>
        </>
    );
}

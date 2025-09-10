// src/components/utils.js
import React from "react";
import { Link, useLocation } from "react-router-dom";

export const STEPS = [
    { id: 1, label: "Info",     to: "/order/info" },
    { id: 2, label: "Products", to: "/order/products" },
    { id: 3, label: "Review",   to: "/order/review" },
    { id: 4, label: "Payment",  to: "/order/payment" },
];

function getActiveId(pathname, current, steps) {
    if (typeof current === "number") return current;
    return steps.find((s) => pathname === s.to)?.id || 1;
}

function getEffectiveMax(activeId, maxAllowedStep = 1) {
    // Once you're on or past Review (3), allow navigating to Payment (4)
    return activeId >= 3 ? 4 : maxAllowedStep;
}

function buildItems(steps, activeId, effectiveMax) {
    return steps.map((s, i) => {
        const isActive = activeId === s.id;
        const isDone   = activeId > s.id;
        const status   = isActive ? "active" : isDone ? "done" : "upcoming";
        const isUnlocked = s.id <= effectiveMax;
        const connectorDone = activeId > s.id;

        return { step: s, status, isUnlocked, connectorDone };
    });
}

export function useProgressSteps({ current, maxAllowedStep = 1 } = {}) {
    const { pathname } = useLocation();
    const steps = STEPS;
    const activeId = getActiveId(pathname, current, steps);
    const effectiveMax = getEffectiveMax(activeId, maxAllowedStep);
    const items = buildItems(steps, activeId, effectiveMax);

    return { steps, activeId, effectiveMax, items };
}

// --- UI subcomponents ---

export function StepPill({ step, status, isUnlocked, onBlockedAttempt }) {
    const base =
        "group relative inline-flex items-center gap-1.5 rounded-full px-3 py-1 ring-1 transition sm:gap-2 sm:px-4 sm:py-1.5";

    // CHANGED: active state uses brand main color instead of slate
    const styles =
        status === "active"
            ? "bg-brand-600 text-white ring-brand-600 shadow-[0_1px_0_0_rgba(255,255,255,0.06)_inset,0_6px_18px_-8px_rgba(30,64,175,0.40)]"
            : status === "done"
                ? "bg-emerald-50 text-emerald-800 ring-emerald-200 hover:bg-emerald-100"
                : "bg-white text-slate-700 ring-slate-200 " +
                (isUnlocked ? "hover:bg-slate-50" : "opacity-60");

    const numberStyles =
        status === "active"
            ? "bg-white/15 text-white ring-white/20"
            : status === "done"
                ? "bg-emerald-100 text-emerald-700 ring-emerald-200"
                : "bg-slate-100 text-slate-700 ring-slate-200";

    const labelHiddenOnMobile = status !== "active" ? "hidden sm:inline" : "";

    const handleClick = (e) => {
        if (!isUnlocked) {
            e.preventDefault();
            e.stopPropagation();
            onBlockedAttempt?.(step);
        }
    };

    return (
        <Link
            to={isUnlocked ? step.to : "#"}
            onClick={handleClick}
            aria-current={status === "active" ? "step" : undefined}
            aria-disabled={!isUnlocked}
            tabIndex={isUnlocked ? 0 : -1}
            className={`${base} ${styles} ${!isUnlocked ? "cursor-not-allowed" : ""}`}
        >
      <span
          className={`grid h-5 w-5 place-items-center rounded-full text-[10px] font-semibold ring-1 sm:h-6 sm:w-6 sm:text-[11px] ${numberStyles}`}
      >
        {status === "done" ? (
            <svg aria-hidden="true" viewBox="0 0 20 20" className="h-3 w-3 sm:h-3.5 sm:w-3.5" fill="none">
                <path
                    d="M5 10.5l3 3 7-7"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                />
            </svg>
        ) : (
            step.id
        )}
      </span>

            <span className={`font-medium ${labelHiddenOnMobile}`}>{step.label}</span>

            <span
                className="pointer-events-none absolute inset-0 rounded-full ring-2 ring-transparent group-focus-visible:ring-slate-300"
                aria-hidden="true"
            />
        </Link>
    );
}

export function Connector({ done }) {
    return (
        <span className="relative inline-block h-[2px] w-6 sm:w-10 shrink-0">
      <span className="absolute inset-0 rounded-full bg-slate-200" />
      <span
          className={`absolute inset-0 rounded-full transition-all ${
              done ? "bg-gradient-to-r from-emerald-400 to-emerald-600" : "bg-transparent"
          }`}
          style={{ width: done ? "100%" : 0 }}
          aria-hidden="true"
      />
    </span>
    );
}

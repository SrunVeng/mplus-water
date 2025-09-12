// src/components/ProgressSteps.jsx
import React from "react";
import { useTranslation } from "react-i18next";
import { useProgressSteps, StepPill, Connector } from "../utils/progessbar.jsx";

export default function ProgressSteps(props) {
    const { t } = useTranslation("progress");
    const { activeId, steps, items } = useProgressSteps(props);

    return (
        <nav aria-label={t("aria_label", { defaultValue: "Progress" })}>
            <p className="mb-2 text-xs text-slate-600 sm:hidden">
                {t("mobile_label", {
                    step: activeId,
                    total: steps.length,
                    defaultValue: "Step {{step}} of {{total}}",
                })}
            </p>

            <ol
                className="
          -mx-2 flex items-center gap-2 overflow-x-auto px-2 pb-1 text-[13px]
          sm:mx-0 sm:gap-3 sm:overflow-visible sm:px-0 sm:text-sm
          [scrollbar-width:none] [-ms-overflow-style:none]
        "
                style={{ scrollbarWidth: "none" }}
            >
                <style>{`ol::-webkit-scrollbar{display:none}`}</style>

                {items.map(({ step, status, isUnlocked, connectorDone }, i) => (
                    <li key={step.id} className="flex items-center gap-2 sm:gap-3 shrink-0">
                        <StepPill
                            step={step}
                            status={status}
                            isUnlocked={isUnlocked}
                            onBlockedAttempt={props.onBlockedAttempt}
                            // Optional: pass localized aria-labels to StepPill if it supports them
                            ariaLabel={t("step_aria", {
                                index: i + 1,
                                total: items.length,
                                defaultValue: "Step {{index}} of {{total}}",
                            })}
                        />
                        {i < items.length - 1 && <Connector done={connectorDone} />}
                    </li>
                ))}
            </ol>
        </nav>
    );
}

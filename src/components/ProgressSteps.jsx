// src/components/ProgressSteps.jsx
import React from "react";
import { useProgressSteps, StepPill, Connector } from "../utils/progessbar.jsx";

export default function ProgressSteps(props) {
    const { activeId, steps, items } = useProgressSteps(props);

    return (
        <nav aria-label="Progress">
            <p className="mb-2 text-xs text-slate-600 sm:hidden">
                Step {activeId} of {steps.length}
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
                        />
                        {i < items.length - 1 && <Connector done={connectorDone} />}
                    </li>
                ))}
            </ol>
        </nav>
    );
}

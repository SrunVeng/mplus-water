import React from "react";
import { cn } from "../../utils/uiUtils.js";

/**
 * Floating label shell for *non-native* inputs (e.g., PhoneInputKH)
 * that may not support placeholder=" ".
 * Provide `isFilled` to control the label position.
 */
export default function FloatingField({
                                          label,
                                          required,
                                          icon,
                                          hint,
                                          isFilled = false,
                                          children,
                                          containerClassName = "",
                                          fieldClassName = "",
                                          labelClassName = "",
                                      }) {
    const hasIcon = Boolean(icon);

    return (
        <div className={cn("space-y-1.5", containerClassName)}>
            {hint ? <div className="flex justify-end"><span className="text-xs text-slate-500">{hint}</span></div> : null}

            <div className="relative group">
                {hasIcon && (
                    <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
            {icon}
          </span>
                )}

                <div className={cn(hasIcon && "pl-10")}>
                    {/* Your custom input goes here */}
                    {React.cloneElement(children, {
                        className: cn(
                            "w-full h-12 rounded-xl border text-sm border-slate-300 focus:border-brand-600 focus:ring-1 focus:ring-brand-600 transition px-3 bg-white",
                            children.props.className,
                        ),
                    })}
                </div>

                <label
                    className={cn(
                        "absolute text-slate-500 text-sm transition-all px-1 bg-white",
                        isFilled ? "top-1.5 text-xs" : "top-1/2 -translate-y-1/2",
                        "group-focus-within:top-1.5 group-focus-within:text-xs group-focus-within:text-brand-600",
                        hasIcon ? "left-10" : "left-3",
                        labelClassName
                    )}
                >
                    {label}
                    {required ? <span className="text-rose-600"> *</span> : null}
                </label>

                {/* Animated outline on focus */}
                <span
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-0 rounded-xl ring-0 ring-brand-600 transition-[box-shadow] group-focus-within:ring-2 group-focus-within:ring-brand-600/30"
                />
            </div>
        </div>
    );
}

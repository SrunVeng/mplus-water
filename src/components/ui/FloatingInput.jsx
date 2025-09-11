import React, { useId } from "react";
import { cn } from "../../utils/uiUtils.js";

/**
 * Native input with floating label + border animation.
 * Uses placeholder=" " + peer to animate label on focus and when filled.
 */
export default function FloatingInput({
                                          id,
                                          label,
                                          required,
                                          icon,
                                          type = "text",
                                          value,
                                          onChange,
                                          placeholder = " ",
                                          inputClassName = "",
                                          containerClassName = "",
                                          labelClassName = "",
                                          ...rest
                                      }) {
    const hasIcon = Boolean(icon);
    const autoId = useId();
    const inputId = id ?? `fi-${autoId}`;

    return (
        <div className={cn("relative group", containerClassName)}>
            {hasIcon && (
                <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
          {icon}
        </span>
            )}

            <input
                id={inputId}
                type={type}
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                required={required}
                aria-required={required || undefined}
                className={cn(
                    "peer w-full h-12 rounded-xl border text-sm",
                    "border-slate-300 focus:border-brand-600 focus:ring-1 focus:ring-brand-600",
                    "transition px-3 bg-white",
                    hasIcon && "pl-10",
                    inputClassName
                )}
                {...rest}
            />

            {/* Floating label */}
            <label
                htmlFor={inputId}
                className={cn(
                    "absolute text-slate-500 text-sm transition-all px-1 bg-white",
                    "top-1/2 -translate-y-1/2",
                    "peer-focus:top-1.5 peer-focus:text-xs peer-focus:text-brand-600",
                    "peer-[&:not(:placeholder-shown)]:top-1.5 peer-[&:not(:placeholder-shown)]:text-xs",
                    hasIcon ? "left-10" : "left-3",
                    labelClassName
                )}
            >
                {label}
                {required ? <span className="text-rose-600"> *</span> : null}
            </label>

            {/* Animated border ring on focus */}
            <span
                aria-hidden="true"
                className={cn(
                    "pointer-events-none absolute inset-0 rounded-xl ring-0 ring-brand-600 transition-[box-shadow]",
                    "group-focus-within:ring-2 group-focus-within:ring-brand-600/30"
                )}
            />
        </div>
    );
}

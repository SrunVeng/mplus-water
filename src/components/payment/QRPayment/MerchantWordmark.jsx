import React, { useMemo } from "react";
import { formatAmount } from "../../../utils/money";

/**
 * MerchantWordmark
 * - Merchant name (small)
 * - Amount (large + bold)
 * - Currency (slightly larger, vertically centered)
 */
export default function MerchantWordmark({
                                             name,
                                             amount,
                                             currency,
                                             inline = false,
                                             className = "",
                                             style = {},
                                         }) {
    const formattedAmount = useMemo(() => formatAmount(amount), [amount]);

    const sizes = {
        name: {
            base: "text-[16px] leading-6",
            sm: "sm:text-[17px] sm:leading-6",
            md: "md:text-[18px] md:leading-7",
            lg: "lg:text-[20px] lg:leading-8",
        },
        amount: {
            base: "text-xl leading-7",
            sm: "sm:text-2xl sm:leading-8",
            md: "md:text-3xl md:leading-9",
            lg: "lg:text-[32px] lg:leading-[40px]",
        },
        currency: {
            base: "text-[14px] leading-5",   // increased from 11px → 14px
            sm: "sm:text-[15px] sm:leading-5",
            md: "md:text-[16px] md:leading-6",
            lg: "lg:text-[17px] lg:leading-6", // a touch larger at lg
        },
    };

    return (
        <div
            className={`${inline ? "inline-flex" : "flex"} flex-col items-start min-w-0 gap-1 ${className}`}
            style={style}
        >
            {/* Merchant name */}
            <span
                title={name}
                className={[
                    "font-nunito font-medium text-slate-900/95",
                    "max-w-full truncate tracking-[-0.01em]",
                    sizes.name.base,
                    sizes.name.sm,
                    sizes.name.md,
                    sizes.name.lg,
                ].join(" ")}
            >
        {name || "—"}
      </span>

            {(formattedAmount !== null || currency) && (
                <div
                    className="flex items-center gap-2"
                    aria-label={
                        formattedAmount ? `Amount ${formattedAmount} ${currency ?? ""}`.trim() : undefined
                    }
                >
                    {/* Amount */}
                    {formattedAmount !== null && (
                        <span
                            className={[
                                "font-nunito font-bold text-slate-900",
                                "tracking-[-0.017em] [font-variant-numeric:tabular-nums]",
                                sizes.amount.base,
                                sizes.amount.sm,
                                sizes.amount.md,
                                sizes.amount.lg,
                            ].join(" ")}
                        >
              {formattedAmount}
            </span>
                    )}

                    {/* Currency (slightly larger, uppercase, centered) */}
                    {currency && (
                        <span
                            className={[
                                "font-nunito text-slate-900/90 uppercase",
                                "tracking-[0.08em]",
                                sizes.currency.base,
                                sizes.currency.sm,
                                sizes.currency.md,
                                sizes.currency.lg,
                            ].join(" ")}
                        >
              {currency}
            </span>
                    )}
                </div>
            )}
        </div>
    );
}

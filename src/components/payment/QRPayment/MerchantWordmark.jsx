// src/components/payments/QRPayment/MerchantWordmark.jsx
import React, { useMemo } from "react";
import { formatAmount } from "../../../utils/money";

export default function MerchantWordmark({
                                             name,
                                             amount,
                                             currency,
                                             inline = false,
                                             className = "",
                                             style = {},
                                         }) {
    const formattedAmount = useMemo(() => formatAmount(amount), [amount]);

    return (
        <div
            className={`${inline ? "inline-flex" : "flex"} flex-col items-start gap-1 ${className}`}
            style={style}
        >
      <span
          title={name}
          className="font-nunito max-w-full text-slate-900 text-[20px] leading-10 tracking-[-0.017em] whitespace-nowrap overflow-hidden text-ellipsis"
      >
        {name || "—"}
      </span>

            {(formattedAmount !== null || currency) && (
                <div
                    className="flex items-baseline gap-1"
                    aria-label={
                        formattedAmount ? `Amount ${formattedAmount} ${currency ?? ""}`.trim() : undefined
                    }
                >
                    {formattedAmount !== null && (
                        <span className="font-nunito text-slate-900 font-bold text-[30px] leading-[45px] tracking-[-0.017em]">
              {formattedAmount}
            </span>
                    )}
                    {currency && (
                        <span className="font-nunito text-slate-900 text-[15px] leading-4 tracking-[-0.017em]">
              {currency}
            </span>
                    )}
                </div>
            )}
        </div>
    );
}

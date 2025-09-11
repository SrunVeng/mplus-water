// src/components/payments/QRPayment/CurrencyLogo.jsx
import React from "react";
import { currencyGlyph } from "../../../utils/money";

export default function CurrencyLogo({
                                         size = 44,
                                         currency = "USD",
                                         textColor = "white",
                                         className = "",
                                         style,
                                         withBorder = true,
                                         "aria-label": ariaLabel,
                                         ...rest
                                     }) {
    const glyph = currencyGlyph(currency);
    const fontSize = Math.round(size * 0.52);
    const borderWidth = Math.max(2, Math.round(size * 0.09));
    const decorativeOnly = !ariaLabel;

    return (
        <div
            className={`grid place-items-center rounded-full ${className}`}
            style={{
                width: size,
                height: size,
                background: "#00526A",
                border: withBorder ? `${borderWidth}px solid #FFFFFF` : "none",
                ...style,
            }}
            {...(decorativeOnly ? { "aria-hidden": true } : { role: "img", "aria-label": ariaLabel })}
            {...rest}
        >
      <span
          style={{
              color: textColor,
              fontFamily:
                  "'Nunito Sans', system-ui, -apple-system, Segoe UI, Roboto, Arial",
              fontWeight: 800,
              lineHeight: 1,
              fontSize,
          }}
      >
        {glyph}
      </span>
        </div>
    );
}

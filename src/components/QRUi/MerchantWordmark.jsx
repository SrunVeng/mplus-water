// File: ./QRUi/MerchantWordmark.jsx
import React from "react";

export default function MerchantWordmark({
                                             name,
                                             amount,
                                             currency,
                                             inline = false,
                                             className = "",
                                             style = {},
                                         }) {
    const baseStyle = {
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-start",
        padding: 0,
        gap: 4,
        position: inline ? "static" : "absolute",
        width: 117,
        height: 42.7,
        left: 226,
        top: 726,
    };

    return (
        <div className={className} style={{ ...baseStyle, ...style }}>
            {/* Merchant name */}
            <span
                style={{
                    width: "118px",
                    height: "11.7px",
                    fontFamily: "'Nunito Sans', sans-serif",
                    fontStyle: "normal",
                    fontWeight: 400,
                    fontSize: "12px",
                    lineHeight: "20px", // 167%
                    display: "flex",
                    alignItems: "center",
                    letterSpacing: "-0.017em",
                    color: "#000000",
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                }}
                title={name}
            >
        {name || "—"}
      </span>

            {/* Amount + Currency */}
            {(amount || currency) && (
                <div
                    style={{
                        display: "flex",
                        alignItems: "baseline",
                        gap: "2px"// keep currency aligned with bottom of amount
                    }}
                >
                    {/* Amount */}
                    <span
                        style={{
                            fontFamily: "'Nunito Sans', sans-serif",
                            fontStyle: "normal",
                            fontWeight: 700,
                            fontSize: "20px",
                            lineHeight: "27px",
                            display: "flex",
                            alignItems: "center",
                            letterSpacing: "-0.017em",
                            color: "#000000",
                        }}
                    >
            {amount}
          </span>

                    {/* Currency */}
                    <span
                        style={{
                            marginLeft: "2px", // tight spacing
                            fontFamily: "'Nunito Sans', sans-serif",
                            fontStyle: "normal",
                            fontWeight: 400,
                            fontSize: "12px",
                            lineHeight: "16px",
                            display: "flex",
                            alignItems: "center",
                            letterSpacing: "-0.017em",
                            color: "#000000",
                        }}
                    >
            {currency}
          </span>
                </div>
            )}
        </div>
    );
}

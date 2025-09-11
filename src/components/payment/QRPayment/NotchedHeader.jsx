// src/components/payments/QRPayment/NotchedHeaderTW.jsx
import React from "react";
import KHQRLogo from "../../../assets/KHQR.svg";

export default function NotchedHeaderTW({
                                            className = "",
                                            ariaLabel = "KHQR header",
                                        }) {
    return (
        <div
            className={[
                "relative z-10",       // keep above following content
                "w-full",
                "h-12 sm:h-14",        // fixed header height so logo fits
                "bg-[#E21A1A]",
                "rounded-t-2xl",       // rounded top only
                "shadow-sm",
                // NOTE: no overflow-hidden, no notch
                className,
            ].join(" ")}
            role="img"
            aria-label={ariaLabel}
        >
            <div className="absolute inset-0 flex items-center justify-center">
                <img
                    src={KHQRLogo}
                    alt="KHQR logo"
                    className="object-contain translate-y-[-3%]"
                />
            </div>
        </div>
    );
}

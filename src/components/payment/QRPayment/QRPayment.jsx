import React, { useMemo } from "react";
import { QRCodeSVG } from "qrcode.react";
import { motion, AnimatePresence } from "framer-motion";

// time + dom utils
import { useCountdown, timeParts } from "../../../utils/time";
import { useMeasure, computeQrPixelsFromWidth } from "../../../utils/dom.js";

// shared UI
import NotchedHeader from "./NotchedHeader";
import MerchantWordmark from "./MerchantWordmark";
import CurrencyLogo from "./CurrencyLogo";
import CardShell from "./CardShell";
import ABAPayLogo from "../../../assets/ABAPay.svg";

export default function QRPayment({
                                      payload,
                                      merchantName,
                                      title = "ABA PAY",
                                      minutesToExpire = 5,
                                      onExpired,
                                      note = "Scan with ABA Mobile or any KHQR-supported banking app",
                                  }) {
    const qrString = payload?.qrString || "";
    const amount = payload?.amount;
    const currency = payload?.currency || "USD";
    const safeMerchant = merchantName || payload?.merchantName || "";

    // Container-measured sizing (works reliably on all mobile widths)
    const [qrWrapRef, wrapWidth] = useMeasure();
    const qrPixels = useMemo(() => computeQrPixelsFromWidth(wrapWidth), [wrapWidth]);

    // amount display
    const displayAmount = useMemo(() => {
        if (typeof amount === "number") return amount;
        return amount ?? "—";
    }, [amount]);

    // countdown
    const totalMs = minutesToExpire * 60 * 1000;
    const remainingMs = useCountdown(totalMs, onExpired);
    const { mm, ss } = timeParts(remainingMs);
    const isExpired = remainingMs <= 0;

    // badge scales with QR pixels, clamped
    const centerBadgeSize = useMemo(() => {
        const s = Math.floor((qrPixels || 160) * 0.18);
        return Math.min(Math.max(s, 40), 72);
    }, [qrPixels]);

    const hasQr = typeof qrString === "string" && qrString.length > 0;

    return (
        <div className="w-full min-h-[60vh] flex items-start justify-center px-3 sm:px-0">
            <div className="relative w-full max-w-sm rounded-3xl shadow-2xl overflow-hidden bg-gradient-to-b from-[#e8f2ff] to-[#f6f9ff]">
                {/* Brand */}
                <div className="px-6 pt-6">
                    <div className="flex items-center justify-center">
                        <img src={ABAPayLogo} alt={title} className="h-8 w-auto" />
                    </div>
                    <div className="h-10" />
                </div>

                {/* Card */}
                <motion.div
                    className="mx-6 mb-6"
                    initial={{ y: 24, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ type: "spring", stiffness: 110, damping: 16 }}
                >
                    <CardShell>
                        <div className="flex flex-col h-full w-full">
                            {/* Keep notch visible on small screens */}
                            <div className="rounded-t-[20px]">
                                <NotchedHeader />
                            </div>

                            {/* Merchant + amount */}
                            <div className="px-6 pt-3">
                                <MerchantWordmark
                                    name={safeMerchant}
                                    amount={displayAmount}
                                    currency={currency}
                                    inline
                                />
                                <div className="mt-2 border-t border-dashed border-slate-300/70" />
                            </div>

                            {/* QR */}
                            <div className="px-6 pt-2 pb-6 -mt-1 flex items-center justify-center">
                                <div
                                    ref={qrWrapRef}
                                    className={[
                                        "relative leading-none",
                                        isExpired ? "grayscale-[.9] brightness-95" : "",
                                        // fluid square wrapper; width driven by layout, not viewport
                                        "w-full max-w-xs sm:max-w-sm md:max-w-md",
                                        "aspect-square",
                                    ].join(" ")}
                                    style={{
                                        contain: "layout paint",
                                        isolation: "isolate",
                                        backfaceVisibility: "hidden",
                                        WebkitBackfaceVisibility: "hidden",
                                        WebkitFontSmoothing: "antialiased",
                                    }}
                                >
                                    {hasQr ? (
                                        <QRCodeSVG
                                            aria-label={`Payment QR code for ${safeMerchant || "merchant"}, ${
                                                typeof displayAmount === "number" ? displayAmount : ""
                                            } ${currency}`}
                                            value={qrString}
                                            size={qrPixels || 144}
                                            level="H"
                                            includeMargin
                                            fgColor="#000000"
                                            bgColor="#FFFFFF"
                                            style={{
                                                width: `${qrPixels || 144}px`,
                                                height: `${qrPixels || 144}px`,
                                                position: "absolute",
                                                inset: 0,
                                                margin: "auto",
                                                display: "block",
                                                verticalAlign: "top",
                                                shapeRendering: "crispEdges",
                                            }}
                                        />
                                    ) : (
                                        <div className="absolute inset-0 grid place-items-center rounded bg-slate-100 text-slate-500 text-xs">
                                            QR unavailable
                                        </div>
                                    )}

                                    {/* Center badge */}
                                    <div
                                        className="pointer-events-none absolute inset-0 flex items-center justify-center"
                                        aria-hidden="true"
                                    >
                                        <div
                                            className="rounded-full shadow ring-1 ring-slate-200 bg-white grid place-items-center"
                                            style={{ width: centerBadgeSize, height: centerBadgeSize }}
                                        >
                                            <CurrencyLogo
                                                size={centerBadgeSize}
                                                currency={currency}
                                                withBorder
                                                aria-label={`${currency} currency badge`}
                                            />
                                        </div>
                                    </div>

                                    {/* Expired overlay */}
                                    <AnimatePresence>
                                        {isExpired && (
                                            <motion.div
                                                className="absolute inset-0 grid place-items-center pointer-events-none"
                                                initial={{ opacity: 0 }}
                                                animate={{ opacity: 1 }}
                                                exit={{ opacity: 0 }}
                                            >

                        <span className="px-2.5 py-1 rounded-md bg-slate-900 text-white text-xs font-bold shadow">
                          Expired
                        </span>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>
                            </div>

                            {/* Instruction */}
                            <div className="px-5 pb-3">
                                <div className="rounded-xl bg-slate-50 text-slate-500 text-xs text-center px-3 py-2">
                                    {note}
                                </div>
                            </div>
                        </div>
                    </CardShell>
                </motion.div>

                {/* Timer + live region */}
                <div className="px-6 pb-6 text-center text-slate-600">
          <span className="text-sm font-medium tracking-wide">
            {mm}:{ss}
          </span>
                    <div aria-live="polite" className="sr-only">
                        {isExpired
                            ? "QR code expired."
                            : `QR code expires in ${mm} minutes ${ss} seconds.`}
                    </div>
                </div>
            </div>
        </div>
    );
}

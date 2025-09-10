// src/components/QRPayment.jsx
import React, { useMemo } from "react";
import { QRCodeCanvas } from "qrcode.react";
import { motion, AnimatePresence } from "framer-motion";
import { useCountdown, timeParts } from "../utils/uiUtils.js";
import LogoABA from "../assets/ABAPay.svg";
import NotchedHeader from "./QRUi/NotchedHeader.jsx";
import SvgPaymentCard from "./QRUi/SvgPaymentCard.jsx";
import CurrencyLogo from "./QRUi/CurrencyLogo.jsx";
import MerchantWordmark from "./QRUi/MerchantWordmark.jsx";

export default function QRPayment({
                                      payload,
                                      merchantName,
                                      title,
                                      minutesToExpire = 5,
                                      onExpired,
                                      note = "Scan with ABA Mobile or any KHQR-supported banking app",
                                  }) {
    const qrString = payload?.qrString || "";
    const amount = payload?.amount;
    const currency = payload?.currency || "USD";
    const safeMerchant = merchantName || payload?.merchantName;

    const displayAmount = useMemo(() => {
        if (typeof amount === "number") {
            return amount.toLocaleString(undefined, { maximumFractionDigits: 2 });
        }
        return amount ?? "—";
    }, [amount]);

    const totalMs = minutesToExpire * 60 * 1000;
    const remainingMs = useCountdown(totalMs, onExpired);
    const { mm, ss } = timeParts(remainingMs);
    const isExpired = remainingMs <= 0;

    // Fixed QR size
    const QR_PIXELS = 144;

    // Overlay badge sizing (relative to QR)
    const centerBadgeSize = Math.max(44, Math.floor(QR_PIXELS * 0.22));

    return (
        <div className="w-full min-h-[60vh] flex items-start justify-center">
            {/* Kiosk container */}
            <div className="relative w-full max-w-sm rounded-3xl shadow-2xl overflow-hidden bg-gradient-to-b from-[#e8f2ff] to-[#f6f9ff]">
                {/* Brand row */}
                <div className="px-6 pt-6">
                    <div className="flex items-center justify-center">
                        <img src={LogoABA} alt="ABA PAY" className="h-8 w-auto" />
                    </div>
                    <div className="h-10" />
                </div>

                {/* Payment card (SVG shell) */}
                <motion.div
                    className="mx-6 mb-6"
                    initial={{ y: 24, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ type: "spring", stiffness: 110, damping: 16 }}
                >
                    <SvgPaymentCard>
                        <div className="flex flex-col h-full">
                            {/* Red header with notch */}
                            <NotchedHeader title={title} />

                            {/* Merchant + amount */}
                            <div className="px-6 pt-3">
                                <MerchantWordmark
                                    name={safeMerchant}
                                    amount={displayAmount}
                                    currency={currency}
                                    inline
                                />
                                <div className="mt-2 border-t border-dashed border-slate-200" />
                            </div>

                            {/* QR area */}
                            <div className="px-6 py-4 flex items-center justify-center">
                                <div
                                    className={`relative leading-none ${
                                        isExpired ? "grayscale-[.9] brightness-95" : ""
                                    }`}
                                    style={{ width: QR_PIXELS, height: QR_PIXELS }}
                                >
                                    <QRCodeCanvas
                                        aria-label="Payment QR Code"
                                        value={qrString}
                                        size={QR_PIXELS}
                                        level="H"
                                        includeMargin={true}
                                        style={{
                                            width: `${QR_PIXELS}px`,
                                            height: `${QR_PIXELS}px`,
                                            display: "block",
                                            verticalAlign: "top",
                                        }}
                                    />

                                    {/* Center overlay: currency badge */}
                                    <div
                                        className="pointer-events-none absolute inset-0 flex items-center justify-center"
                                        aria-hidden="true"
                                    >
                                        <div
                                            className="rounded-full shadow ring-1 ring-slate-200 bg-white grid place-items-center"
                                            style={{
                                                width: centerBadgeSize,
                                                height: centerBadgeSize,
                                            }}
                                        >
                                            <CurrencyLogo
                                                size={centerBadgeSize}
                                                currency={currency}
                                                withBorder={true}
                                            />
                                        </div>
                                    </div>

                                    {/* Expired label overlay */}
                                    <AnimatePresence>
                                        {isExpired && (
                                            <motion.div
                                                className="absolute inset-0 grid place-items-center"
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

                            {/* Instruction band */}
                            <div className="px-5 pb-3">
                                <div className="rounded-xl bg-slate-50 text-slate-500 text-xs text-center px-3 py-2">
                                    {note}
                                </div>
                            </div>
                        </div>
                    </SvgPaymentCard>
                </motion.div>

                {/* Footer: show only timer */}
                <div className="px-6 pb-6 text-center">
          <span className="text-sm font-medium text-slate-600 tracking-wide">
            {mm}:{ss}
          </span>
                </div>
            </div>
        </div>
    );
}

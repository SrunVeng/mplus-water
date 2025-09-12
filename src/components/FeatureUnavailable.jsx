import React from "react";
import { Trans, useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

export default function FeatureUnavailable({ telegramUrl, backTo = "/order/payment" }) {
    const { t } = useTranslation();

    return (
        <section
            className="rounded-3xl ring-1 ring-slate-200 bg-white shadow-sm p-6"
            role="status"
            aria-live="polite"
        >
            <h2 className="text-base font-semibold text-slate-900">
                {t("feature_unavailable.title", { defaultValue: "This feature isn’t available" })}
            </h2>

            <p className="mt-3 text-sm text-slate-700">
                <Trans
                    i18nKey="feature_unavailable.body"
                    defaults="If you’d like this implemented, click <contact>contact</contact> to reach me on Telegram."
                    components={{
                        contact: (
                            <a
                                className="underline hover:no-underline"
                                href={telegramUrl}
                                target="_blank"
                                rel="noreferrer"
                            />
                        ),
                    }}
                />
            </p>

            <div className="mt-4 flex gap-3">
                <Link
                    to={backTo}
                    className="px-4 py-2 rounded-xl border border-slate-300 hover:border-slate-900 min-h-[44px]"
                >
                    {t("feature_unavailable.back", { defaultValue: "Go back" })}
                </Link>
                <a
                    href={telegramUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="px-4 py-2 rounded-xl bg-slate-900 text-white hover:bg-slate-800 min-h-[44px]"
                >
                    {t("feature_unavailable.cta", { defaultValue: "Contact on Telegram" })}
                </a>
            </div>
        </section>
    );
}

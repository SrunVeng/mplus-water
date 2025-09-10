import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import en from "../locales/en.json";
import km from "../locales/km.json";

const saved = localStorage.getItem("lang") || "km";

i18n
    .use(initReactI18next)
    .init({
        resources: {
            en: { translation: en },
            km: { translation: km }
        },
        lng: saved,
        fallbackLng: "en",
        interpolation: { escapeValue: false }
    });

// keep <html lang="..."> in sync
document.documentElement.lang = i18n.language;

i18n.on("languageChanged", (lng) => {
    document.documentElement.lang = lng;
    localStorage.setItem("lang", lng);
});

export default i18n;

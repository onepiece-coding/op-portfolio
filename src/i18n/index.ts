/**
 * @file src/i18n/index.ts
 */

import { initReactI18next } from "react-i18next";

import LanguageDetector from "i18next-browser-languagedetector";
import HttpBackend from "i18next-http-backend";
import i18n from "i18next";

const applyDirection = (lng: string) => {
  const lang = lng.slice(0, 2);
  document.documentElement.setAttribute("dir", lang === "ar" ? "rtl" : "ltr");
  document.documentElement.setAttribute("lang", lang);
};

i18n
  .use(HttpBackend) // ← replaces static imports
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    fallbackLng: "en",
    supportedLngs: ["en", "fr", "ar"],
    interpolation: { escapeValue: false },
    detection: {
      order: ["localStorage", "navigator"],
      caches: ["localStorage"],
    },
    backend: {
      loadPath: "/op-portfolio/locales/{{lng}}/translation.json",
    },
  });

// ✅ Fires on every page load — restores dir/lang from stored language
i18n.on("initialized", () => applyDirection(i18n.language));

// ✅ Fires on mid-session language switch
i18n.on("languageChanged", (lng) => applyDirection(lng));

export default i18n;

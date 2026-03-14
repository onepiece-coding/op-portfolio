/**
 * @file src/components/common/lang-switcher/index.tsx
 */

import { useTranslation } from "react-i18next";

import styles from "./styles.module.css";

const LANGUAGES = [
  { code: "en", label: "EN" },
  { code: "fr", label: "FR" },
  { code: "ar", label: "AR" },
] as const;

type LangCode = (typeof LANGUAGES)[number]["code"];

const LangSwitcher = () => {
  const { i18n, t } = useTranslation();

  const current = i18n.language.slice(0, 2) as LangCode;

  const handleChange = (code: LangCode) => {
    i18n.changeLanguage(code);
    // RTL support — flip document direction for Arabic
    // document.documentElement.setAttribute("dir", code === "ar" ? "rtl" : "ltr");
    // document.documentElement.setAttribute("lang", code);
  };

  return (
    <div
      aria-label={t("langSwitcher.groupAriaLabel")}
      className={styles.switcher}
      role="group"
    >
      {LANGUAGES.map(({ code, label }) => (
        <button
          className={`${styles.btn} ${current === code ? styles.active : ""}`}
          aria-label={t(`langSwitcher.${code}`)}
          onClick={() => handleChange(code)}
          aria-pressed={current === code}
          key={code}
        >
          {label}
        </button>
      ))}
    </div>
  );
};

export default LangSwitcher;

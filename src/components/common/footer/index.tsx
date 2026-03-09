/**
 * @file src/components/common/footer/index.tsx
 */

import { useTranslation } from "react-i18next";
import { BUILD_YEAR } from "@/lib/build-info";

import LangSwitcher from "../lang-switcher";
import styles from "./styles.module.css";

const Footer = () => {
  const { t } = useTranslation();

  return (
    <footer
      className={styles.footerContainer}
      aria-label={t("footer.ariaLabel")}
    >
      <div className={`container ${styles.footerRow}`}>
        <p>{t("footer.copyright", { year: BUILD_YEAR })}</p>
        <LangSwitcher />
      </div>
    </footer>
  );
};

export default Footer;

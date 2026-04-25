/**
 * @file src/components/common/navbar/brand/index.tsx
 */

// import { useTranslation } from "react-i18next";

import styles from "./styles.module.css";

const NavBrand = () => {
  // const { t } = useTranslation();

  return (
    <div className={styles.brand}>
      {/* <div className={styles.logo} aria-hidden="true">
        OP
      </div> */}
      <img
        alt="OnePiece Coding"
        src="/op-portfolio/dark-logo.png"
        style={{
          width: "200px",
          marginTop: "7px",
          marginLeft: "-24px",
        }}
      />
      {/* <div
        style={{
          // marginLeft: "-16px",
          marginTop: "-4px",
        }}
      >
        <div className={styles.brandName}>{t("brand.name")}</div>
        <div className={styles.brandTagline}>{t("brand.tagline")}</div>
      </div> */}
    </div>
  );
};

export default NavBrand;

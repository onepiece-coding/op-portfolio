/**
 * @file src/components/common/navbar/mobile-menu/index.tsx
 */

import { useTranslation } from "react-i18next";
import { NavLink } from "react-router-dom";
import { NAV_ITEMS } from "../navbar.data";
import { createPortal } from "react-dom";

import styles from "./styles.module.css";
import NavBrand from "../brand";

interface MobileMenuProps {
  firstLinkRef: React.RefObject<HTMLAnchorElement | null>;
  onClose: () => void;
  menuId: string;
  open: boolean;
}

const MobileMenu = ({
  firstLinkRef,
  onClose,
  menuId,
  open,
}: MobileMenuProps) => {
  const { t } = useTranslation();

  const menu = (
    <>
      {/* Backdrop overlay — closes menu on outside click */}
      {open && (
        <div className={styles.backdrop} onClick={onClose} aria-hidden="true" />
      )}

      <div
        className={`${styles.mobileMenu} ${open ? styles.open : ""}`}
        aria-label={t("mobileMenu.ariaLabel")}
        aria-modal="true"
        role="dialog"
        id={menuId}
      >
        <div className={styles.mobileHeader}>
          <NavBrand />
          <button
            aria-label={t("mobileMenu.closeAriaLabel")}
            className={styles.mobileClose}
            onClick={onClose}
          >
            ✕
          </button>
        </div>

        <nav
          className={styles.mobileNavLinks}
          aria-label={t("mobileMenu.navAriaLabel")}
        >
          {NAV_ITEMS.map((item, idx) => (
            <NavLink
              className={({ isActive }) =>
                `${styles.mobileLink} ${isActive ? styles.linkActive : ""}`
              }
              ref={idx === 0 ? firstLinkRef : undefined}
              onClick={onClose}
              key={item.to}
              to={item.to}
            >
              {t(item.labelKey)}
            </NavLink>
          ))}
        </nav>

        <div className={styles.mobileFooter}>
          <p>
            {t("mobileMenu.footerText")}{" "}
            <a href="/contact">{t("mobileMenu.footerLink")}</a>
          </p>
        </div>
      </div>
    </>
  );

  return createPortal(menu, document.body);
};

export default MobileMenu;

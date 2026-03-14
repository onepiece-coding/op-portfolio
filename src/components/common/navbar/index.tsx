/**
 * @file src/components/common/navbar/index.tsx
 */

import { useFocusOnOpen, useKeyboardDismiss, useScrollLock } from "@/hooks";
import { useTranslation } from "react-i18next";
import { NavLink } from "react-router-dom";
import { NAV_ITEMS } from "./navbar.data";
import { useRef, useState } from "react";

import styles from "./styles.module.css";
import MobileMenu from "./mobile-menu";
import NavBrand from "./brand";

export const Navbar = () => {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);

  const firstLinkRef = useRef<HTMLAnchorElement | null>(null);
  const mobileMenuId = "primary-mobile-menu";

  useKeyboardDismiss(open, () => setOpen(false));
  useFocusOnOpen(open, firstLinkRef);
  useScrollLock(open);

  return (
    <nav className={styles.navbar} aria-label="Primary Navigation">
      <div className={`container ${styles.navbarContainer}`}>
        <NavBrand />

        {/* desktop nav links */}
        <div
          aria-label={t("navbar.linksAriaLabel")}
          className={styles.navLinks}
          role="navigation"
        >
          {NAV_ITEMS.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `${styles.link} ${isActive ? styles.linkActive : ""}`
              }
            >
              {t(item.labelKey)}
            </NavLink>
          ))}
        </div>

        {/* hamburger for mobile */}
        <button
          aria-label={
            open ? t("navbar.hamburgerClose") : t("navbar.hamburgerOpen")
          }
          onClick={() => setOpen((v) => !v)}
          className={styles.hamburger}
          aria-controls={mobileMenuId}
          aria-expanded={open}
        >
          <span className={styles.hamburgerIcon} aria-hidden="true" />
        </button>
      </div>

      {/* slide-in mobile menu */}
      <MobileMenu
        onClose={() => setOpen(false)}
        firstLinkRef={firstLinkRef}
        menuId={mobileMenuId}
        open={open}
      />
    </nav>
  );
};

export default Navbar;

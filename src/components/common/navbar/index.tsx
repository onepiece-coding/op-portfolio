/**
 * @file src/components/common/navbar/index.tsx
 */

import { useFocusOnOpen, useKeyboardDismiss, useScrollLock } from "@/hooks";
import { NavLink } from "react-router-dom";
import { NAV_ITEMS } from "./navbar.data";
import { useRef, useState } from "react";

import styles from "./navbar.module.css";
import MobileMenu from "./mobile-menu";
import NavBrand from "./brand";

export const Navbar = () => {
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
          aria-label="Site Navigation"
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
              {item.label}
            </NavLink>
          ))}
        </div>

        {/* hamburger for mobile */}
        <button
          aria-label={open ? "Close menu" : "Open menu"}
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

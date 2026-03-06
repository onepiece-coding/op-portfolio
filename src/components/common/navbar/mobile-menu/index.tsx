/**
 * @file src/components/common/navbar/mobile-menu/index.tsx
 */

import { NavLink } from "react-router-dom";
import { NAV_ITEMS } from "../navbar.data";

import styles from "./mobile-menu.module.css";
import NavBrand from "../brand";
import { createPortal } from "react-dom";

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
  const menu = (
    <>
      {/* Backdrop overlay — closes menu on outside click */}
      {open && (
        <div className={styles.backdrop} onClick={onClose} aria-hidden="true" />
      )}
      <div
        className={`${styles.mobileMenu} ${open ? styles.open : ""}`}
        aria-label="Mobile Navigation"
        aria-modal="true"
        role="dialog"
        id={menuId}
      >
        <div className={styles.mobileHeader}>
          <NavBrand />
          <button
            className={styles.mobileClose}
            aria-label="Close menu"
            onClick={onClose}
          >
            ✕
          </button>
        </div>

        <nav className={styles.mobileNavLinks} aria-label="Mobile Navigation">
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
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className={styles.mobileFooter}>
          <p>
            Need a custom plan? <a href="/contact">Start a brief</a>
          </p>
        </div>
      </div>
    </>
  );

  return createPortal(menu, document.body);
};

export default MobileMenu;

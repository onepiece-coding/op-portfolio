/**
 * @file src/components/common/navbar/brand/index.tsx
 */

import styles from "./brand.module.css";

interface BrandProps {
  subtitle?: string;
}

const NavBrand = ({
  subtitle = "Frontend + Backend Strike Team",
}: BrandProps) => (
  <div className={styles.brand}>
    <div className={styles.logo} aria-hidden="true">
      OP
    </div>
    <div>
      <div className={styles.brandName}>OnePiece Coding</div>
      <div className={styles.brandTagline}>{subtitle}</div>
    </div>
  </div>
);

export default NavBrand;

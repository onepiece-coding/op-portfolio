/**
 * @file src/components/common/footer/index.tsx
 */

import { BUILD_YEAR } from "@/lib/build-info";

import styles from "./styles.module.css";

const { footerContainer } = styles;

interface FooterProps {
  companyName?: string;
}

const Footer = ({ companyName = "OnePiece Coding" }: FooterProps) => {
  return (
    <footer className={footerContainer}>
      <div className="container">
        <p>
          © {BUILD_YEAR} {companyName}. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;

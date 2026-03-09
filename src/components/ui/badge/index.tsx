/**
 * @file src/components/ui/badge/index.tsx
 */

import styles from "./badge.module.css";

type BadgeElement = "span" | "li";

interface BadgeProps {
  as?: BadgeElement;
  label: string;
}

const Badge = ({ label, as: Element = "span" }: BadgeProps) => {
  return <Element className={styles.badge}>{label}</Element>;
};

export default Badge;

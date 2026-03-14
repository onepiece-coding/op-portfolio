/**
 * @file src/components/ui/spinner/index.tsx
 */

import styles from "./styles.module.css";

interface SpinnerProps {
  size?: "sm" | "md" | "lg";
  className?: string;
}

const Spinner = ({ size = "md", className = "" }: SpinnerProps) => {
  return (
    <div
      className={`${styles.spinner} ${styles[size]} ${className}`}
      aria-label="Loading"
      role="status"
    >
      <span className="visually-hidden">Loading...</span>
    </div>
  );
};

export default Spinner;

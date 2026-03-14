/**
 * @file src/components/ui/button/index.tsx
 */

import { Link } from "react-router-dom";

import styles from "./styles.module.css";

type ButtonVariant = "primary" | "ghost";

interface ButtonProps {
  children: React.ReactNode;
  variant?: ButtonVariant;
  external?: boolean;
  to: string;
}

const Button = ({
  variant = "primary",
  external = false,
  children,
  to,
}: ButtonProps) => {
  const className = variant === "primary" ? styles.primary : styles.ghost;

  if (external) {
    return (
      <a
        rel="noopener noreferrer"
        className={className}
        target="_blank"
        href={to}
      >
        {children}
      </a>
    );
  }

  return (
    <Link to={to} className={className}>
      {children}
    </Link>
  );
};

export default Button;

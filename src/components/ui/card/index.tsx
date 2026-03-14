/**
 * @file src/components/ui/card/index.tsx
 */

import styles from "./styles.module.css";
import clsx from "clsx";

type CardElement = "article" | "li";

interface CardProps {
  children: React.ReactNode;
  ariaLabelledby?: string;
  hoverable?: boolean;
  className?: string;
  as?: CardElement;
}

const Card = ({
  as: Element = "article",
  hoverable = false,
  ariaLabelledby,
  className,
  children,
}: CardProps) => {
  return (
    <Element
      {...(ariaLabelledby ? { "aria-labelledby": ariaLabelledby } : {})}
      // className={[
      //   styles.card,
      //   hoverable ? styles.cardHoverable : undefined,
      //   className,
      // ]
      //   .filter(Boolean)
      //   .join(" ")} // "card hoverable className"
      className={clsx(
        styles.card,
        hoverable && styles.cardHoverable,
        className,
      )}
    >
      {children}
    </Element>
  );
};

export default Card;

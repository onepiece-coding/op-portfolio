/**
 * @file src/pages/testimonials/star-row/index.tsx
 */

import styles from "./star-row.module.css";

function StarRow({ value = 5 }: { value?: number }) {
  const stars = Array.from({ length: 5 }, (_, i) => i + 1);
  return (
    <div className={styles.stars} aria-hidden="true">
      {stars.map((star) => (
        <svg
          key={star}
          viewBox="0 0 24 24"
          width="14"
          height="14"
          fill={star <= value ? "currentColor" : "none"}
          stroke="currentColor"
          strokeWidth="1.2"
          aria-hidden="true"
        >
          <path d="M12 .9l2.9 6 6.6.6-5 3.7 1.5 6.3L12 15.9 5 17.4l1.5-6.3-5-3.7 6.6-.6z" />
        </svg>
      ))}
    </div>
  );
}

export default StarRow;

/**
 * @file src/routes/with-suspense/index.tsx
 */

import { Spinner } from "@/components/ui";
import { Suspense } from "react";

import styles from "./with-suspense.module.css";

interface WithSuspenseProps {
  children: React.ReactNode;
}

export const WithSuspense = ({ children }: WithSuspenseProps) => (
  <Suspense
    fallback={
      <div className={styles.suspenseFallback}>
        <Spinner size="md" />
      </div>
    }
  >
    {children}
  </Suspense>
);

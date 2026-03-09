/**
 * @file src/pages/contact/hire-card/index.tsx
 */

import { useTranslation } from "react-i18next";
import type { HireId } from "../contact.data";

import styles from "./hire-card.module.css";

const HireCard = ({ id }: { id: HireId }) => {
  const { t } = useTranslation();

  return (
    <div className={styles.hireCard}>
      <h3 className={styles.hireCardName}>{t(`contact.hire.${id}.name`)}</h3>
      <p className={styles.hireCardDesc}>
        {t(`contact.hire.${id}.role`)} — {t(`contact.hire.${id}.description`)}
      </p>
      <div className={styles.hireMeta}>
        {t(`contact.hire.${id}.availability`)}
      </div>
    </div>
  );
};

export default HireCard;

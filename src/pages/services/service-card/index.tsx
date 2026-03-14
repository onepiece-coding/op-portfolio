/**
 * @file src/pages/services/service-card/index.tsx
 */

import type { Service } from "../services.data";
import { Button, Card } from "@/components/ui";
import { useTranslation } from "react-i18next";

import styles from "./styles.module.css";

const ServiceCard = ({ service }: { service: Service }) => {
  const { t } = useTranslation();

  const title = t(`services.items.${service.id}.title`);
  const subtitle = t(`services.items.${service.id}.subtitle`);
  const bullets = t(`services.items.${service.id}.bullets`, {
    returnObjects: true,
  }) as string[];
  const ctaLabel = t(`services.items.${service.id}.cta`);

  return (
    <Card ariaLabelledby={`${service.id}-title`} hoverable as="li">
      <div className={styles.cardHeader}>
        <div className={styles.iconWrap} aria-hidden="true">
          <service.Icon />
        </div>
        <div className={styles.cardHeaderContent}>
          <h2 id={`${service.id}-title`} className={styles.cardTitle}>
            {title}
          </h2>
          <div className={styles.cardSubtitle}>{subtitle}</div>
        </div>
      </div>

      <ul
        className={styles.cardList}
        aria-label={t("services.bulletsAriaLabel")}
      >
        {bullets.map((bullet) => (
          <li key={bullet}>{bullet}</li>
        ))}
      </ul>

      <div className={styles.cardFooter}>
        <Button to={service.href}>{ctaLabel}</Button>
      </div>
    </Card>
  );
};

export default ServiceCard;

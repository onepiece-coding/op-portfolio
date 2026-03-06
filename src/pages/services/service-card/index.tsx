/**
 * @file src/pages/services/service-card/index.tsx
 */

import { Button, Card } from "@/components/ui";
import type { Service } from "../services.data";

import styles from "./service-card.module.css";

interface ServiceCardProps {
  service: Service;
}

const ServiceCard = ({ service }: ServiceCardProps) => {
  return (
    <Card ariaLabelledby={`${service.id}-title`} hoverable as="li">
      <div className={styles.cardHeader}>
        <div className={styles.iconWrap} aria-hidden="true">
          <service.Icon />
        </div>
        <div className={styles.cardHeaderContent}>
          <h2 id={`${service.id}-title`} className={styles.cardTitle}>
            {service.title}
          </h2>
          <div className={styles.cardSubtitle}>{service.subtitle}</div>
        </div>
      </div>

      <ul className={styles.cardList}>
        {service.bullets.map((bullet) => (
          <li key={bullet}>{bullet}</li>
        ))}
      </ul>

      <div className={styles.cardFooter}>
        <Button to={service.cta.href}>{service.cta.label}</Button>
      </div>
    </Card>
  );
};

export default ServiceCard;

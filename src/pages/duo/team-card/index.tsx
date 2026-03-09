/**
 * @file src/pages/duo/team-card/index.tsx
 */

import { useTranslation } from "react-i18next";
import { getInitials } from "@/lib/dom-utils";
import { Badge, Card } from "@/components/ui";

import styles from "./team-card.module.css";

type TeamCardProps = {
  translationKey: "lahcen" | "mohamed";
  initials?: string;
  tech: string[];
};

const TeamCard = ({ translationKey, initials, tech }: TeamCardProps) => {
  const { t } = useTranslation();

  const title = t(`duo.members.${translationKey}.title`);
  const name = t(`duo.members.${translationKey}.name`);
  const bio = t(`duo.members.${translationKey}.bio`);

  const headingId = `${name.replace(/\s+/g, "-").toLowerCase()}`;
  const displayInitials = initials ?? getInitials(name);

  const resps = [
    t(`duo.members.${translationKey}.resp1`),
    t(`duo.members.${translationKey}.resp2`),
    t(`duo.members.${translationKey}.resp3`),
  ];

  return (
    <Card hoverable ariaLabelledby={headingId}>
      <div className={styles.cardHead}>
        <div className={styles.avatar} aria-hidden="true">
          <span>{displayInitials}</span>
        </div>
        <div>
          <h2 id={headingId} className={styles.cardName}>
            {name}
          </h2>
          <div className={styles.cardTitle}>{title}</div>
        </div>
      </div>

      <p className={styles.cardBio}>{bio}</p>

      <ul className={styles.techWrap} aria-label="Technologies">
        {tech.map((t) => (
          <Badge key={t} label={t} as="li" />
        ))}
      </ul>

      <ul className={styles.respList}>
        {resps.map((r) => (
          <li key={r}>{r}</li>
        ))}
      </ul>
    </Card>
  );
};

export default TeamCard;

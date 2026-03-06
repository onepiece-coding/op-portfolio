/**
 * @file src/pages/duo/team-card/index.tsx
 */

import { getInitials } from "@/lib/dom-utils";
import { Badge, Card } from "@/components/ui";

import styles from "./team-card.module.css";

type TeamCardProps = {
  responsibilities: string[];
  initials?: string;
  tech: string[];
  title: string;
  name: string;
  bio: string;
};

const TeamCard = ({
  responsibilities,
  initials,
  title,
  name,
  tech,
  bio,
}: TeamCardProps) => {
  const headingId = `${name.replace(/\s+/g, "-").toLowerCase()}-name`;
  const displayInitials = initials ?? getInitials(name);

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
        {responsibilities.map((r) => (
          <li key={r}>{r}</li>
        ))}
      </ul>
    </Card>
  );
};

export default TeamCard;

import type { TeamMemberContact } from "../contact.data";

import styles from "./hire-card.module.css";

const HireCard = ({
  availability,
  description,
  name,
  role,
}: TeamMemberContact) => (
  <div className={styles.hireCard}>
    <h3 className={styles.hireCardName}>{name}</h3>
    <p className={styles.hireCardDesc}>
      {role} ({description}).
    </p>
    <div className={styles.hireMeta}>{availability}</div>
  </div>
);

export default HireCard;

/**
 * @file src/pages/duo/index.tsx
 */

import { TEAM_MEMBERS } from "./duo.data";
import { Button } from "@/components/ui";

import styles from "./duo.module.css";
import TeamCard from "./team-card";

const DuoPage = () => {
  return (
    <>
      <title>OnePiece Duo — Lahcen (Frontend) & Mohammed (Backend)</title>
      <meta
        name="description"
        content="Meet the OnePiece strike team: Lahcen (React & TypeScript) and Mohammed (Node.js & MongoDB). We design coordinated frontend+backend systems for fast, scalable products."
      />

      <section
        className={`${styles.duoSection} page-in`}
        aria-labelledby="duo-heading"
        id="duo"
      >
        <div className={styles.containerInner}>
          <header className={styles.header}>
            <h1 id="duo-heading" className={styles.heading}>
              The OnePiece Strike Team — two specialists, one rhythm.
            </h1>
            <p className={styles.subhead}>
              We pair deliberate frontend architecture with pragmatic backend
              engineering. Every UI decision takes API cost into account; every
              API is crafted for minimal over-fetch and clear contracts.
            </p>
          </header>

          <div className={styles.teamRow}>
            {TEAM_MEMBERS.map((member) => (
              <TeamCard key={member.id} {...member} />
            ))}
          </div>

          <div className={styles.ctaRow}>
            <Button to="/contact">Start a technical brief</Button>
            <Button to="/projects" variant="ghost">
              See collaborative projects
            </Button>
          </div>

          <footer className={styles.footer}>
            <p className={styles.footerNote}>
              We plan features together: frontend needs inform API shape; APIs
              are designed with client cost in mind.
            </p>
          </footer>
        </div>
      </section>
    </>
  );
};

export default DuoPage;

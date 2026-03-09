/**
 * @file src/pages/duo/index.tsx
 */

import { useTranslation } from "react-i18next";
import { TEAM_MEMBERS } from "./duo.data";
import { Button } from "@/components/ui";

import styles from "./duo.module.css";
import TeamCard from "./team-card";

const DuoPage = () => {
  const { t } = useTranslation();

  return (
    <>
      <title>{t("duo.pageTitle")}</title>
      <meta name="description" content={t("duo.metaDescription")} />

      <section
        className={`${styles.duoSection} page-in`}
        aria-labelledby="duo-heading"
        id="duo"
      >
        <div className={styles.containerInner}>
          <header className={styles.header}>
            <h1 id="duo-heading" className={styles.heading}>
              {t("duo.h1")}
            </h1>
            <p className={styles.subhead}>{t("duo.subhead")}</p>
          </header>

          <div className={styles.teamRow}>
            {TEAM_MEMBERS.map((member) => (
              <TeamCard key={member.id} {...member} />
            ))}
          </div>

          <div className={styles.ctaRow}>
            <Button to="/contact">{t("duo.ctaPrimary")}</Button>
            <Button to="/projects" variant="ghost">
              {t("duo.ctaGhost")}
            </Button>
          </div>

          <footer className={styles.footer}>
            <p className={styles.footerNote}>{t("duo.footerNote")}</p>
          </footer>
        </div>
      </section>
    </>
  );
};

export default DuoPage;

/**
 * @file src/pages/projects/index.tsx
 */

import { useTranslation } from "react-i18next";
import { PROJECTS } from "./projects.data";
import { Button } from "@/components/ui";

import styles from "./styles.module.css";
import ProjectCard from "./project-card";

const ProjectsPage = () => {
  const { t } = useTranslation();

  return (
    <>
      <title>{t("projects.pageTitle")}</title>
      <meta name="description" content={t("projects.metaDescription")} />

      <section
        className={`${styles.projectsSection} page-in`}
        aria-labelledby="projects-heading"
        id="projects"
      >
        <div className={styles.containerInner}>
          <header className={styles.header}>
            <h1 id="projects-heading" className={styles.heading}>
              {t("projects.h1")}
            </h1>

            <p className={styles.lead}>{t("projects.lead")}</p>
          </header>

          <ul aria-label={t("projects.techAriaLabel")} className={styles.grid}>
            {PROJECTS.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </ul>

          <div className={styles.ctaRow}>
            <Button to="/contact">{t("projects.ctaPrimary")}</Button>
            <Button to="/contact" variant="ghost">
              {t("projects.ctaGhost")}
            </Button>
          </div>

          <footer className={styles.footer}>
            <p className={styles.footerNote}>{t("projects.footerNote")}</p>
          </footer>
        </div>
      </section>
    </>
  );
};

export default ProjectsPage;

/**
 * @file src/pages/projects/index.tsx
 */

import { PROJECTS } from "./projects.data";
import { Button } from "@/components/ui";

import styles from "./projects.module.css";
import ProjectCard from "./project-card";

const ProjectsPage = () => {
  return (
    <>
      <title>Projects — OnePiece Coding Case Studies & Work</title>
      <meta
        name="description"
        content="Explore OnePiece Coding projects showing frontend/backend split: OnePiece Blog (zero-bloat CMS), realtime admin, checkout flows and ETL pipelines. See results & tech."
      />

      <section
        className={`${styles.projectsSection} page-in`}
        aria-labelledby="projects-heading"
        id="projects"
      >
        <div className={styles.containerInner}>
          <header className={styles.header}>
            <h1 id="projects-heading" className={styles.heading}>
              Collaborative Projects — Frontend & Backend, side-by-side
            </h1>

            <p className={styles.lead}>
              We plan, design and ship features as a tightly-coupled
              frontend+backend team. Below are representative projects that show
              how we split responsibilities, reduce client payloads, and keep
              infrastructure predictable. Each card highlights UI
              responsibilities, API responsibilities, the tech used, and
              measured impact.
            </p>
          </header>

          <ul aria-label="Project listings" className={styles.grid}>
            {PROJECTS.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </ul>

          <div className={styles.ctaRow}>
            <Button to="/contact">Request an audit</Button>
            <Button to="/contact" variant="ghost">
              Read OnePiece Blog case study
            </Button>
          </div>

          <footer className={styles.footer}>
            <p className={styles.footerNote}>
              Want a similar Zero-Bloat approach? We’ll audit your app and give
              a short remediation plan with impact estimates.
            </p>
          </footer>
        </div>
      </section>
    </>
  );
};

export default ProjectsPage;

/**
 * @file src/pages/projects/project-card/index.tsx
 */

import type { Project } from "../projects.data";
import { useTranslation } from "react-i18next";
import { Badge, Card } from "@/components/ui";

import styles from "./styles.module.css";

// Mirror the JSON shape — used only for typing returnObjects results
interface ProjectFeature {
  name: string;
  description: string;
}

interface ProjectFeatureGroup {
  groupTitle: string;
  features: ProjectFeature[];
}

const ProjectCard = ({ project }: { project: Project }) => {
  const { t } = useTranslation();

  const title = t(`projects.items.${project.id}.title`);
  const summary = t(`projects.items.${project.id}.summary`);
  const groups = t(`projects.items.${project.id}.groups`, {
    returnObjects: true, // use returnObjects: true to get the groups array
  }) as ProjectFeatureGroup[];

  return (
    <Card ariaLabelledby={`${project.id}-title`} hoverable as="li">
      <div className={styles.projectHead}>
        <h2 id={`${project.id}-title`} className={styles.projectTitle}>
          {title}
        </h2>
        <ul
          className={styles.projectBadges}
          aria-label={t("projects.techAriaLabel")}
        >
          {project.tech.map((t) => (
            <Badge key={t} label={t} as="li" />
          ))}
        </ul>
      </div>
      <p className={styles.projectSummary}>{summary}</p>
      <h3 className={styles.splitTitle}>{t("projects.keyFeaturesLabel")}</h3>
      <div className={styles.split}>
        {groups.map(({ groupTitle, features }) => (
          <div key={groupTitle} className={styles.splitCol}>
            <strong className={styles.splitHeading}>{groupTitle}</strong>
            <ul>
              {features.map(({ name, description }) => (
                <li key={name}>
                  <strong className={styles.featureKey}>{name}: </strong>
                  {description}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      {/* rel="noopener noreferrer" => Both 'noopener' & 'noreferrer' are required for any target="_blank" link to external domains */}
      <div className={styles.projectFooter}>
        <a
          aria-label={`${title} — GitHub repository`}
          href={project.githubRepoUrl}
          className={styles.caseLink}
          rel="noopener noreferrer"
          target="_blank"
        >
          {t("projects.githubLinkText")}
        </a>
        <a
          aria-label={`${title} — Live demo`}
          className={styles.caseLink}
          href={project.liveDemoUrl}
          rel="noopener noreferrer"
          target="_blank"
        >
          {t("projects.demoLinkText")}
        </a>
      </div>
    </Card>
  );
};

export default ProjectCard;

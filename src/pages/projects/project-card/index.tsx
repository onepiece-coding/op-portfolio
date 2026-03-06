/**
 * @file src/pages/projects/project-card/index.tsx
 */

import type { Project } from "../projects.data";
import { Badge, Card } from "@/components/ui";

import styles from "./project-card.module.css";

interface ProjectCardProps {
  project: Project;
}

const ProjectCard = ({ project }: ProjectCardProps) => {
  return (
    <Card ariaLabelledby={`${project.id}-title`} hoverable as="li">
      <div className={styles.projectHead}>
        <h2 id={`${project.id}-title`} className={styles.projectTitle}>
          {project.title}
        </h2>
        <ul className={styles.projectBadges} aria-label="Technologies used">
          {project.tech.map((t) => (
            <Badge key={t} label={t} as="li" />
          ))}
        </ul>
      </div>
      <p className={styles.projectSummary}>{project.summary}</p>
      <h3 className={styles.splitTitle}>Key Features</h3>
      <div className={styles.split}>
        {project.keyFeatures.map(({ groupTitle, features }) => (
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
          aria-label={`${project.title} — GitHub repository`}
          href={project.githubRepoUrl}
          className={styles.caseLink}
          rel="noopener noreferrer"
          target="_blank"
        >
          View GitHub repository
        </a>
        <a
          aria-label={`${project.title} — Live demo`}
          className={styles.caseLink}
          href={project.liveDemoUrl}
          rel="noopener noreferrer"
          target="_blank"
        >
          View live demo
        </a>
      </div>
    </Card>
  );
};

export default ProjectCard;

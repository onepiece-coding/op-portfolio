/**
 * @file src/pages/duo/duo.data.ts
 */

export interface TeamMember {
  responsibilities: string[];
  initials: string;
  tech: string[];
  title: string;
  name: string;
  bio: string;
  id: string;
}

export const TEAM_MEMBERS: TeamMember[] = [
  {
    id: "lahcen-alhiane",
    name: "Lahcen Alhiane",
    initials: "LA",
    title: "Frontend Lead — React & TypeScript",
    bio: "Lahcen designs and ships pixel-accurate, resilient React frontends. Performance-first component architecture, CSS Modules, and predictable accessibility are his priorities.",
    tech: ["React", "TypeScript", "React Router", "Redux Toolkit"],
    responsibilities: [
      "Component architecture & design system",
      "Client performance and bundle optimization",
      "Accessibility & UX fidelity",
    ],
  },
  {
    id: "mohammed-boudreya",
    name: "Mohammed BouDreya",
    initials: "MB",
    title: "Backend Lead — Node & MongoDB",
    bio: "Mohammed builds scalable Node APIs and efficient MongoDB schemas. He focuses on low-latency endpoints, pragmatic aggregation pipelines, and observability.",
    tech: ["Node.js", "TypeScript", "Express", "MongoDB"],
    responsibilities: [
      "API design and data modeling",
      "Performance, caching, and indexing",
      "Logging, metrics, and operational readiness",
    ],
  },
];

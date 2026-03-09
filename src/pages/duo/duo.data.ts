/**
 * @file src/pages/duo/duo.data.ts
 */

export interface TeamMember {
  translationKey: "lahcen" | "mohamed";
  initials: string;
  tech: string[];
  id: string;
}

export const TEAM_MEMBERS: TeamMember[] = [
  {
    id: "lahcen-alhiane",
    initials: "LA",
    translationKey: "lahcen",
    tech: ["React", "TypeScript", "React Router", "Redux Toolkit", "Vitest"],
  },
  {
    id: "mohamed-bouderya",
    initials: "MB",
    translationKey: "mohamed",
    tech: ["Node.js", "TypeScript", "Express.js", "MongoDB", "MySQL", "Jest"],
  },
];

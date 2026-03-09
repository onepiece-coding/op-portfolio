/**
 * @file src/pages/projects/projects.data.ts
 */

export interface Project {
  readonly tech: readonly string[];
  readonly githubRepoUrl: string;
  readonly liveDemoUrl: string;
  readonly id: string;
}

export const PROJECTS: readonly Project[] = [
  {
    id: "op-blog",
    tech: [
      "React",
      "TypeScript",
      "Node.js",
      "Express.js",
      "MongoDB",
      "Jest/Vitest",
    ],
    githubRepoUrl: "https://github.com/onepiece-coding/OP-Blog",
    liveDemoUrl: "https://op-blog-mo4u.onrender.com/",
  },
] as const satisfies readonly Project[];

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
    id: "op-market",
    tech: [
      "PostgreSQL",
      "Express.js",
      "TypeScript",
      "Vitest",
      "Prisma",
      "Vite",
      "React",
    ],
    githubRepoUrl: "https://github.com/onepiece-coding/OP-Market",
    liveDemoUrl: "https://onepiece-coding.github.io/op-market-shop",
  },
  {
    id: "careerhub",
    tech: [
      "Redux Toolkit",
      "Jest/Vitest",
      "Express.js",
      "TypeScript",
      "Node.js",
      "MongoDB",
      "React",
    ],
    githubRepoUrl: "https://github.com/onepiece-coding/OP-CareerHub",
    liveDemoUrl: "https://op-career-hub-frontend.vercel.app/",
  },
  {
    id: "op-blog",
    tech: [
      "Redux Toolkit",
      "Jest/Vitest",
      "Express.js",
      "TypeScript",
      "Node.js",
      "MongoDB",
      "React",
    ],
    githubRepoUrl: "https://github.com/onepiece-coding/OP-Blog",
    liveDemoUrl: "https://op-blog-frontend.vercel.app/",
  },
] as const satisfies readonly Project[];

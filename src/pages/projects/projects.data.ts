/**
 * @file src/pages/projects/projects.data.ts
 */

export interface ProjectFeature {
  readonly description: string;
  readonly name: string;
}

export interface ProjectFeatureGroup {
  readonly features: readonly ProjectFeature[];
  readonly groupTitle: string;
}

export interface Project {
  readonly keyFeatures: readonly ProjectFeatureGroup[];
  readonly tech: readonly string[];
  readonly githubRepoUrl: string;
  readonly liveDemoUrl: string;
  readonly summary: string;
  readonly title: string;
  readonly id: string;
}

export const PROJECTS = [
  {
    id: "op-blog",
    title: "OnePiece Blog — Full-Stack Content Ecosystem",
    summary:
      "A robust, production-ready Blog Platform designed for high-performance content delivery and seamless administration. This project isn't just a dashboard; it’s a complete ecosystem including a public-facing blog, user profile management, and a powerful administrative suite.",
    keyFeatures: [
      {
        groupTitle: "User & Profile Management",
        features: [
          {
            name: "Dynamic Profiles",
            description:
              "Users can update bios and upload profile photos via Cloudinary integration.",
          },
          {
            name: "Custom Toast System",
            description:
              "A proprietary notification engine using Pure CSS Keyframes and native Web APIs (crypto.randomUUID()) for ultra-lightweight feedback.",
          },
          {
            name: "Async State",
            description:
              "Redux Toolkit handles complex asynchronous flows for seamless data fetching and caching.",
          },
        ],
      },
      {
        groupTitle: "Admin Power-Suite",
        features: [
          {
            name: "User Moderation",
            description: "Complete CRUD operations for managing the user base.",
          },
          {
            name: "Content Governance",
            description:
              "Categorization and post-management systems designed for scale.",
          },
          {
            name: "Live Stats",
            description:
              "Real-time dashboard updates reflecting platform growth..",
          },
        ],
      },
      {
        groupTitle: "Performance Optimizations",
        features: [
          {
            name: "Zero-Motion Philosophy",
            description:
              "Replaced Framer Motion with optimized CSS animations to keep the bundle size minimal.",
          },
          {
            name: "Lean Dependencies",
            description: "Removed nanoid in favor of native crypto methods.",
          },
        ],
      },
      {
        groupTitle: "What makes OP-Blog different",
        features: [
          {
            name: "Native Power",
            description:
              "We stopped reaching for npm install for every small feature. We replaced libraries like Framer Motion and Nanoid with custom CSS Keyframes and native Web APIs (crypto). The result? A lightning-fast experience that doesn't bloat the browser.",
          },
          {
            name: "Complex State, Simple UX",
            description:
              "Using Redux Toolkit and Async Thunks, we managed intricate data flows—from real-time profile updates to multi-layered content moderation—all while maintaining a clean, 60fps UI.",
          },
          {
            name: "The Synergy",
            description:
              "Mohamed (Backend) built a rock-solid, secure Node.js architecture. Lahcen (Frontend) brought it to life with a responsive, TypeScript-powered React interface.",
          },
        ],
      },
    ],
    tech: ["React", "TypeScript", "Node.js", "Express", "MongoDB"],
    githubRepoUrl: "https://github.com/onepiece-coding/OP-Blog",
    liveDemoUrl: "https://op-blog-mo4u.onrender.com/",
  },
] as const satisfies readonly Project[];

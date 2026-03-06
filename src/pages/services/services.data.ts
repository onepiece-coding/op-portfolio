/**
 * @file src/pages/services/services.data.ts
 */

import { PerformanceIcon, StarIcon, StatsIcon } from "@/components/icons";

export interface Cta {
  readonly label: string;
  readonly href: string;
}

export interface Service {
  readonly bullets: readonly string[];
  readonly Icon: React.ComponentType;
  readonly subtitle: string;
  readonly title: string;
  readonly id: string;
  readonly cta: Cta;
}

export const SERVICES = [
  {
    id: "mvp",
    title: "MVP Delivery",
    subtitle:
      "Ship a production-ready MVP with a tight scope and measurable metrics.",
    bullets: [
      "Opinionated stack: React + TypeScript client, Node.js backend, MongoDB.",
      "Well-shaped API contracts to avoid over-fetch and accelerate frontend work.",
      "Fast shipping cadence (weeks, not months) with an iterative roadmap.",
      "Production checklist: logging, monitoring, error boundaries, and deploy pipelines.",
    ],
    cta: { label: "Book a scoping call", href: "/contact" },
    Icon: StarIcon,
  },
  {
    id: "scaling",
    title: "Full-Stack Scaling",
    subtitle: "Make your product resilient under load and reduce latency.",
    bullets: [
      "API profiling, bottleneck analysis, and efficient DB indexing.",
      "Queue-based workers, horizontal Node scaling, and autoscaling hints.",
      "Observability plan: lightweight metrics, structured logs, and alerting.",
      "Infrastructure recommendations tuned for predictable costs.",
    ],
    cta: { label: "Discuss scaling plan", href: "/contact" },
    Icon: StatsIcon,
  },
  {
    id: "audit",
    title: "Performance Audit & Fix Plan",
    subtitle:
      "Prioritized remediation roadmap with measurable impact estimates.",
    bullets: [
      "Bundle analysis, critical path, and code-splitting recommendations.",
      "Server/DB analysis: query plans, index gaps, and cache strategy.",
      "Concrete P0 → P3 remediation list with estimated effort & impact.",
      "Optional implementation sprint to apply the most-critical fixes.",
    ],
    cta: { label: "Request an audit", href: "/contact" },
    Icon: PerformanceIcon,
  },
] as const satisfies readonly Service[];

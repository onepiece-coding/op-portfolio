/**
 * @file src/pages/services/services.data.ts
 */

import { PerformanceIcon, StarIcon, StatsIcon } from "@/components/icons";

export interface Service {
  readonly id: "mvp" | "scaling" | "audit";
  readonly Icon: React.ComponentType;
  readonly href: string;
}

export const SERVICES: readonly Service[] = [
  { id: "mvp", Icon: StarIcon, href: "/contact" },
  { id: "scaling", Icon: StatsIcon, href: "/contact" },
  { id: "audit", Icon: PerformanceIcon, href: "/contact" },
] as const satisfies readonly Service[];

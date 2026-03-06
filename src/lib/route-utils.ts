/**
 * @file src/lib/route-utils.ts
 */

import type { RouteError } from "./types";

export function isRouteError(value: unknown): value is RouteError {
  return typeof value === "object" && value !== null;
}

/**
 * @file src/lib/route-utils.test.ts
 */

import { describe, it, expect } from "vitest";
import { isRouteError } from "./route-utils";

describe("isRouteError", () => {
  /**
   * TEST 1
   * Why: null is typeof "object" but the guard explicitly requires !== null.
   * React Router passes null from useRouteError when no error exists —
   * treating null as a valid route error would crash every prop access.
   */
  it("returns false for null", () => {
    expect(isRouteError(null)).toBe(false);
  });

  /**
   * TEST 2
   * Why: undefined is typeof "undefined", not "object" — the first condition
   * fails. useRouteError may return undefined in some router configurations.
   */
  it("returns false for undefined", () => {
    expect(isRouteError(undefined)).toBe(false);
  });

  /**
   * TEST 3
   * Why: A string like "Not Found" passes typeof "object" as false.
   * Older React Router versions could surface a plain string error.
   */
  it("returns false for a string", () => {
    expect(isRouteError("Not Found")).toBe(false);
  });

  /**
   * TEST 4
   * Why: A number (e.g. 404) is typeof "number" — the check fails.
   * HTTP status codes could theoretically be thrown as raw numbers.
   */
  it("returns false for a number", () => {
    expect(isRouteError(404)).toBe(false);
  });

  /**
   * TEST 5
   * Why: An empty object satisfies both conditions (typeof "object" && !== null).
   * The guard is intentionally permissive — the component accesses optional
   * fields with ?. so an object with no recognized keys is safe.
   */
  it("returns true for an empty object", () => {
    expect(isRouteError({})).toBe(true);
  });

  /**
   * TEST 6
   * Why: The primary real-world case — a React Router error object with
   * statusText, status, message, and stack all present. The guard must
   * accept it so the component can read these fields.
   */
  it("returns true for a route-error-shaped object", () => {
    expect(
      isRouteError({
        statusText: "Not Found",
        status: 404,
        message: "No route matched /xyz",
        stack: "Error: No route matched",
      }),
    ).toBe(true);
  });
});

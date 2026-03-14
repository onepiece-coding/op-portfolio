/**
 * @file src/lib/dom-utils/dom-utils.test.ts
 */

import { describe, it, expect } from "vitest";
import { getInitials } from "./dom-utils";

describe("getInitials", () => {
  // ─── Core behaviour ────────────────────────────────────────────────────────

  /**
   * TEST 1
   * Why: Standard two-word name — the primary use case. Both team members
   * are two-word names, so this is the path executed on every TeamCard render.
   */
  it("returns the first letter of each word uppercased for a two-word name", () => {
    expect(getInitials("Lahcen Alhiane")).toBe("LA");
    expect(getInitials("Mohamed Bouderya")).toBe("MB");
  });

  /**
   * TEST 2
   * Why: The function must slice to 2 characters. A three-word name like
   * "Jean-Paul Sartre III" should still produce "JS", not "JSI" — avatar
   * circles have fixed dimensions that accommodate exactly 2 characters.
   */
  it("returns at most 2 initials for names with more than two words", () => {
    expect(getInitials("Jean Paul Sartre")).toBe("JP");
    expect(getInitials("Anna Maria de Torres")).toBe("AM");
  });

  /**
   * TEST 3
   * Why: A single-word name must not crash and must return that word's
   * initial. Some contributors or clients may have single-name handles.
   */
  it("returns one initial for a single-word name", () => {
    expect(getInitials("Lahcen")).toBe("L");
  });

  /**
   * TEST 4
   * Why: Extra leading, trailing, or internal whitespace must be ignored.
   * The regex split on \s+ handles this, but a regression here would produce
   * an empty initial from the leading space — a blank avatar badge.
   */
  it("handles extra whitespace between words", () => {
    expect(getInitials("  Lahcen   Alhiane  ")).toBe("LA");
  });

  /**
   * TEST 5
   * Why: An empty string must return an empty string, not crash. An upstream
   * i18n fallback could produce an empty name string — the avatar should
   * render blank rather than throw.
   */
  it("returns an empty string for an empty input", () => {
    expect(getInitials("")).toBe("");
  });

  /**
   * TEST 6
   * Why: Initials must always be uppercase regardless of the input casing.
   * A lowercase name ("lahcen alhiane") must still produce "LA" — the avatar
   * is a visual UI element that should always look consistent.
   */
  it("uppercases initials regardless of input casing", () => {
    expect(getInitials("lahcen alhiane")).toBe("LA");
    expect(getInitials("LAHCEN ALHIANE")).toBe("LA");
  });
});

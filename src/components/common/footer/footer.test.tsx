/**
 * @file src/components/common/footer/footer.test.tsx
 */

import { renderWithProviders } from "@/test/i18n-test-utils";
import { describe, it, expect, vi } from "vitest";
import { screen } from "@testing-library/react";

import Footer from "./index";

// ─── Mocks ────────────────────────────────────────────────────────────────────

// Freeze BUILD_YEAR so copyright assertions never drift with the calendar.
// Must be hoisted before the module under test is imported.
vi.mock("@/lib/build-info", () => ({ BUILD_YEAR: 2026 }));

// Isolate Footer from LangSwitcher so Footer tests are purely unit-level.
// LangSwitcher has its own test file that covers all its behaviour.
vi.mock("@/components/common/lang-switcher", () => ({
  default: () => <div data-testid="lang-switcher" />,
}));

// ─── Helpers ─────────────────────────────────────────────────────────────────

const renderFooter = () => renderWithProviders(<Footer />);

// ─── Tests ───────────────────────────────────────────────────────────────────

describe("Footer", () => {
  // ─── 1. Rendering ──────────────────────────────────────────────────────────

  describe("Rendering", () => {
    /**
     * TEST 1
     * Category: 🧱 Rendering
     * Why: The <footer> landmark is required for screen reader navigation.
     * An accessible name on it distinguishes it from other regions — WCAG
     * 4.1.2 requires landmark regions to be identifiable.
     */
    it("renders a <footer> element with the correct aria-label", () => {
      renderFooter();
      expect(
        screen.getByRole("contentinfo", { name: "Site footer" }),
      ).toBeInTheDocument();
    });

    /**
     * TEST 2
     * Category: 🧱 Rendering
     * Why: The copyright line is the primary visible text in the footer.
     * If BUILD_YEAR interpolation breaks, the rendered string would show
     * the raw key or "{{year}}" — immediately visible to all users.
     */
    it("renders the copyright string with the mocked BUILD_YEAR", () => {
      renderFooter();
      expect(
        screen.getByText("© 2026 OnePiece Coding. All rights reserved."),
      ).toBeInTheDocument();
    });

    /**
     * TEST 3
     * Category: 🧱 Rendering
     * Why: LangSwitcher must be present in the footer — it is the only
     * language-selection UI on desktop. Without it users have no way to
     * change the interface language from any page.
     */
    it("renders the LangSwitcher", () => {
      renderFooter();
      expect(screen.getByTestId("lang-switcher")).toBeInTheDocument();
    });

    /**
     * TEST 4
     * Category: 🧱 Rendering / ♿ Accessibility
     * Why: The copyright paragraph must sit alongside the LangSwitcher in
     * the same row. DOM order determines read order for screen readers —
     * copyright before language switcher is the correct sequence.
     */
    it("renders copyright before LangSwitcher in DOM order", () => {
      renderFooter();
      const footer = screen.getByRole("contentinfo");
      const p = footer.querySelector("p")!;
      const switcher = screen.getByTestId("lang-switcher");

      // compareDocumentPosition returns a bitmask — 4 means "following"
      expect(p.compareDocumentPosition(switcher)).toBe(
        Node.DOCUMENT_POSITION_FOLLOWING,
      );
    });
  });

  // ─── 2. i18n ───────────────────────────────────────────────────────────────

  describe("i18n interpolation", () => {
    /**
     * TEST 5
     * Category: 🌍 i18n
     * Why: The copyright uses {{year}} interpolation. If the i18n instance
     * or translation key changes format, the interpolation silently breaks
     * and users see a raw template string. This pins the exact output.
     */
    it("does not render the raw interpolation placeholder '{{year}}'", () => {
      renderFooter();
      expect(screen.queryByText(/\{\{year\}\}/)).not.toBeInTheDocument();
    });

    /**
     * TEST 6
     * Category: 🌍 i18n
     * Why: The footer aria-label comes from i18n, not a hardcoded string.
     * If the key is missing or misspelled, the ARIA label falls back to the
     * key string ("footer.ariaLabel") — a broken accessible name for the
     * landmark region.
     */
    it("does not render the raw i18n key as the aria-label", () => {
      renderFooter();
      const footer = screen.getByRole("contentinfo");
      expect(footer.getAttribute("aria-label")).not.toContain("footer.");
    });
  });
});

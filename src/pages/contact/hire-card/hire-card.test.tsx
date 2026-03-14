/**
 * @file src/pages/contact/hire-card/hire-card.test.tsx
 */

import { renderWithProviders } from "@/test/i18n-test-utils";
import { screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";

import HireCard from "./index";

describe("HireCard", () => {
  // ─── 1. Lahcen card ───────────────────────────────────────────────────────

  describe("Lahcen's hire card", () => {
    /**
     * TEST 1
     * Why: The name heading must render from i18n as an h3. It is the primary
     * identity text on the card — a missing translation silently blanks the
     * name that clients use to identify which team member they are hiring.
     */
    it("renders Lahcen's name as an h3 from i18n", () => {
      renderWithProviders(<HireCard id="lahcen" />);
      const h3 = screen.getByRole("heading", { level: 3 });
      expect(h3).toHaveTextContent("Lahcen Alhiane — Frontend Lead");
    });

    /**
     * TEST 2
     * Why: The role and description are concatenated inline in a single <p>
     * with " — " between them. If either part is missing, the separator "—"
     * is dangling or the sentence is incomplete — both are visible regressions.
     */
    it("renders role and description together in a paragraph", () => {
      renderWithProviders(<HireCard id="lahcen" />);
      // The paragraph contains both role and description concatenated
      expect(screen.getByText(/Frontend Engineer/)).toBeInTheDocument();
      expect(screen.getByText(/component architecture/)).toBeInTheDocument();
    });

    /**
     * TEST 3
     * Why: The availability line is the closing meta-text of the hire card.
     * It communicates whether part-time or remote work is accepted — a
     * missing translation silently removes this key hiring detail.
     */
    it("renders availability from i18n", () => {
      renderWithProviders(<HireCard id="lahcen" />);
      expect(
        screen.getByText(
          "Available for part-time, full-time, and remote frontend roles",
        ),
      ).toBeInTheDocument();
    });

    /**
     * TEST 4
     * Why: No raw i18n key may appear in the card. All four fields come from
     * t() — a missing key for any one of them produces "contact.hire.lahcen.xyz"
     * in the rendered DOM, visible on a client-facing portfolio page.
     */
    it("renders no raw i18n keys in the card", () => {
      const { container } = renderWithProviders(<HireCard id="lahcen" />);
      expect(container.textContent).not.toMatch(/\bcontact\.hire\.\w+/);
    });
  });

  // ─── 2. Mohamed card ──────────────────────────────────────────────────────

  describe("Mohamed's hire card", () => {
    /**
     * TEST 5
     * Why: Mohamed's card must use the "mohamed" translation key — not
     * fall back to Lahcen's content. A copy-paste bug that always reads
     * "lahcen" keys would show the wrong person's details on Mohamed's card.
     */
    it("renders Mohamed's name and role correctly", () => {
      renderWithProviders(<HireCard id="mohamed" />);
      const h3 = screen.getByRole("heading", { level: 3 });
      expect(h3).toHaveTextContent("Mohamed Bouderya — Backend Lead");
      expect(screen.getByText(/Backend Engineer/)).toBeInTheDocument();
    });

    /**
     * TEST 6
     * Why: Mohamed's availability differs from Lahcen's ("backend roles" vs
     * "frontend roles"). This guards against a single shared availability
     * string appearing on both cards — misrepresenting Mohamed's specialisation.
     */
    it("renders Mohamed's availability with 'backend' in the text", () => {
      renderWithProviders(<HireCard id="mohamed" />);
      expect(screen.getByText(/remote backend roles/)).toBeInTheDocument();
    });

    /**
     * TEST 7
     * Why: Mohamed's tech description includes "API design" and "Node.js" —
     * entirely different from Lahcen's React/TypeScript description. If both
     * cards show the same description, potential backend employers cannot
     * evaluate Mohamed's actual skills from the portfolio.
     */
    it("renders Mohamed's tech description from i18n", () => {
      renderWithProviders(<HireCard id="mohamed" />);
      expect(screen.getByText(/API design/)).toBeInTheDocument();
    });
  });

  // ─── 3. Semantic structure ────────────────────────────────────────────────

  /**
   * TEST 8
   * Why: The name must be an h3 (not h2 or h4). The ContactPage uses h2 for
   * section headings ("Open for roles") and h3 for card headings — the
   * correct heading level maintains a coherent document outline for AT users
   * navigating by heading landmarks.
   */
  it("renders the name at heading level 3, not 2 or 4", () => {
    renderWithProviders(<HireCard id="lahcen" />);
    expect(screen.queryByRole("heading", { level: 2 })).toBeNull();
    expect(screen.queryByRole("heading", { level: 4 })).toBeNull();
    expect(screen.getByRole("heading", { level: 3 })).toBeInTheDocument();
  });
});

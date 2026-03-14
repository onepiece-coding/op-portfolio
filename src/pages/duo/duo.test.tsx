/**
 * @file src/pages/duo/duo.test.tsx
 */

import { renderWithProviders } from "@/test/i18n-test-utils";
import { describe, it, expect, vi } from "vitest";
import { screen } from "@testing-library/react";

import DuoPage from "./index";

// ─── Mocks ────────────────────────────────────────────────────────────────────

// TeamCard has its own test file — replace with a deterministic stub.
// The stub renders a unique data-testid per translationKey so DuoPage
// tests can assert "both cards rendered" without TeamCard's full logic.
vi.mock("./team-card", () => ({
  default: ({ translationKey }: { translationKey: string }) => (
    <div data-testid={`team-card-${translationKey}`} />
  ),
}));

// Button is kept real — it is a thin <Link> wrapper with no side effects,
// and MemoryRouter is provided by renderWithProviders.
// Card is not used directly by DuoPage — no mock needed.

// ─── Helpers ─────────────────────────────────────────────────────────────────

const renderDuo = () => renderWithProviders(<DuoPage />);

// ─── Tests ───────────────────────────────────────────────────────────────────

describe("DuoPage", () => {
  // ─── 1. Document metadata ─────────────────────────────────────────────────

  describe("Document metadata", () => {
    /**
     * TEST 1
     * Why: The <title> tag is the browser tab label and the primary SEO
     * signal for the Duo page. A missing or raw-key title harms both
     * discoverability and the user's orientation within the portfolio.
     */
    it("sets document.title from the duo.pageTitle i18n key", () => {
      renderDuo();
      expect(document.title).toBe(
        "Meet the Team — OnePiece Coding | React & Node.js",
      );
    });

    /**
     * TEST 2
     * Why: The meta description must be populated and must not contain a
     * raw key. Search engines use this for result snippets — a broken key
     * ("duo.metaDescription") in the snippet destroys the studio's credibility.
     */
    it("renders a non-empty meta description without raw i18n keys", () => {
      renderDuo();
      const meta = document.querySelector("meta[name='description']");
      expect(meta).not.toBeNull();
      expect(meta?.getAttribute("content")).not.toMatch(/^duo\./);
      expect(meta?.getAttribute("content")?.length).toBeGreaterThan(10);
    });
  });

  // ─── 2. Section structure ─────────────────────────────────────────────────

  describe("Section structure", () => {
    /**
     * TEST 3
     * Why: The section must have id="duo" and aria-labelledby="duo-heading"
     * so screen reader users can jump to it via landmark navigation. Without
     * the id, anchor links to #duo silently fail.
     */
    it("renders the section with id='duo' and aria-labelledby='duo-heading'", () => {
      renderDuo();
      const section = document.getElementById("duo");
      expect(section).not.toBeNull();
      expect(section).toHaveAttribute("aria-labelledby", "duo-heading");
    });

    /**
     * TEST 4
     * Why: The h1 is the page's primary heading and anchors the
     * aria-labelledby relationship. It must have id="duo-heading" and render
     * the correct translated text — both attributes are required together.
     */
    it("renders h1 with id='duo-heading' and the correct text", () => {
      renderDuo();
      const h1 = screen.getByRole("heading", { level: 1 });
      expect(h1).toHaveAttribute("id", "duo-heading");
      expect(h1).toHaveTextContent(
        "Two specialists. One coordinated delivery.",
      );
    });

    /**
     * TEST 5
     * Why: The subheading paragraph must render from i18n. It is the
     * positioning statement below the h1 — a silent regression here
     * removes the "no handoff waste" argument from the most-read header area.
     */
    it("renders the subhead paragraph from i18n", () => {
      renderDuo();
      expect(
        screen.getByText(/Frontend decisions are shaped by API cost/),
      ).toBeInTheDocument();
    });

    /**
     * TEST 6
     * Why: The footer note is the conversion micro-copy at the bottom of
     * the section. It must render from i18n — not be hardcoded — so language
     * switches update it correctly.
     */
    it("renders the footer note from i18n", () => {
      renderDuo();
      expect(screen.getByText(/No handoff waste/)).toBeInTheDocument();
    });
  });

  // ─── 3. Team cards ────────────────────────────────────────────────────────

  describe("Team cards", () => {
    /**
     * TEST 7
     * Why: Exactly two TeamCard instances must render — one for Lahcen and
     * one for Mohamed. One missing card means half the team is invisible
     * on the Duo page.
     */
    it("renders exactly two TeamCard stubs", () => {
      renderDuo();
      expect(screen.getByTestId("team-card-lahcen")).toBeInTheDocument();
      expect(screen.getByTestId("team-card-mohamed")).toBeInTheDocument();
    });

    /**
     * TEST 8
     * Why: The cards must be rendered in data order — Lahcen first, Mohamed
     * second, matching TEAM_MEMBERS array order. Reversed order changes the
     * visual narrative (Frontend lead is listed first by design).
     */
    it("renders Lahcen's card before Mohamed's in DOM order", () => {
      renderDuo();
      const lahcen = screen.getByTestId("team-card-lahcen");
      const mohamed = screen.getByTestId("team-card-mohamed");
      expect(lahcen.compareDocumentPosition(mohamed)).toBe(
        Node.DOCUMENT_POSITION_FOLLOWING,
      );
    });
  });

  // ─── 4. CTA buttons ───────────────────────────────────────────────────────

  describe("CTA buttons", () => {
    /**
     * TEST 9
     * Why: The primary CTA must be a link to /contact and read "Start a
     * technical brief". This is the main conversion action on the Duo page —
     * a wrong href or missing text silently kills the contact funnel.
     */
    it("renders the primary CTA linking to /contact", () => {
      renderDuo();
      const primaryCta = screen.getByRole("link", {
        name: "Start a technical brief",
      });
      expect(primaryCta).toHaveAttribute("href", "/contact");
    });

    /**
     * TEST 10
     * Why: The ghost CTA must link to /projects and read "See our projects".
     * It is the secondary escape route from the Duo page — visitors who are
     * not ready to contact may want to see work samples first.
     */
    it("renders the ghost CTA linking to /projects", () => {
      renderDuo();
      const ghostCta = screen.getByRole("link", { name: "See our projects" });
      expect(ghostCta).toHaveAttribute("href", "/projects");
    });

    /**
     * TEST 11
     * Why: Neither CTA should show a raw i18n key. If duo.ctaPrimary or
     * duo.ctaGhost are missing from the translation file, the buttons render
     * as machine-readable key names — an embarrassing production regression.
     */
    it("neither CTA displays a raw i18n key as its label", () => {
      renderDuo();
      screen.getAllByRole("link").forEach((link) => {
        expect(link.textContent).not.toMatch(/^duo\./);
      });
    });
  });
});

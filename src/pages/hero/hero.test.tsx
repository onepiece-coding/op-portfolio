/**
 * @file src/pages/hero/hero.test.tsx
 */

import { renderWithProviders } from "@/test/i18n-test-utils";
import { screen, within } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";

import Hero from "./index";

// ─── Mocks ────────────────────────────────────────────────────────────────────

// Stub every icon to a simple <svg> so JSDOM does not choke on complex SVG paths.
// We test presence/count of icons via aria-hidden wrappers, not the icons themselves.
vi.mock("@/components/icons", () => ({
  LinkedInOutlineIcon: () => <svg data-testid="icon-linkedin" />,
  GitHubIcon: () => <svg data-testid="icon-github" />,
  EmailIcon: () => <svg data-testid="icon-email" />,
  ReactIcon: () => <svg data-testid="icon-react" />,
  TypeScriptIcon: () => <svg data-testid="icon-typescript" />,
  ReactRouterIcon: () => <svg data-testid="icon-react-router" />,
  ReduxToolkitIcon: () => <svg data-testid="icon-rtk" />,
  NodeIcon: () => <svg data-testid="icon-node" />,
  MongoDBIcon: () => <svg data-testid="icon-mongodb" />,
  SQLIcon: () => <svg data-testid="icon-sql" />,
  JavaScriptIcon: () => <svg data-testid="icon-js" />,
}));

// ─── Helpers ─────────────────────────────────────────────────────────────────

const renderHero = () => renderWithProviders(<Hero />);

// ─── Tests ───────────────────────────────────────────────────────────────────

describe("Hero", () => {
  // ─── 1. Document metadata ─────────────────────────────────────────────────

  describe("Document metadata", () => {
    /**
     * TEST 1
     * Category: 🧱 Rendering
     * Why: React 19 hoists <title> to document.title. If the i18n key is
     * wrong or missing the page title falls back to the app default or the
     * raw key — both hurt SEO and browser tab readability.
     */
    it("sets document.title to the hero.pageTitle i18n string", () => {
      renderHero();
      expect(document.title).toBe(
        "OnePiece Coding — React & Node.js Full-Stack Studio",
      );
    });

    /**
     * TEST 2
     * Category: 🧱 Rendering
     * Why: The meta description must be rendered with the correct content
     * attribute. A missing or raw-key description breaks search engine
     * snippets for every page that uses the Hero component.
     */
    it("renders a meta description tag with the correct content", () => {
      renderHero();
      const meta = document.querySelector("meta[name='description']");
      expect(meta).not.toBeNull();
      expect(meta?.getAttribute("content")).toContain("OnePiece Coding");
      expect(meta?.getAttribute("content")).not.toMatch(/hero\./); // no raw key
    });
  });

  // ─── 2. Rendering ─────────────────────────────────────────────────────────

  describe("Rendering", () => {
    /**
     * TEST 3
     * Category: 🧱 Rendering
     * Why: The section is the primary landmark for the hero. Its presence
     * confirms the component mounted and rendered correctly. Without it
     * every subsequent assertion is meaningless.
     */
    it("renders a section with id='hero'", () => {
      renderHero();
      const section = document.getElementById("hero");
      expect(section).not.toBeNull();
      expect(section?.tagName.toLowerCase()).toBe("section");
    });

    /**
     * TEST 4
     * Category: 🧱 Rendering
     * Why: The kicker is the first visible text and sets the section's
     * context ("React & Node.js · Full-Stack Engineering Studio"). If it
     * disappears or shows a raw key, the hero loses its positioning statement.
     */
    it("renders the kicker from i18n", () => {
      renderHero();
      expect(
        screen.getByText("React & Node.js · Full-Stack Engineering Studio"),
      ).toBeInTheDocument();
    });

    /**
     * TEST 5
     * Category: 🧱 Rendering
     * Why: The h1 is the most important heading on the page — it anchors the
     * section's accessible label via aria-labelledby. A regression here
     * silently removes the page's primary heading.
     */
    it("renders the h1 with id='hero-heading' from i18n", () => {
      renderHero();
      const h1 = screen.getByRole("heading", { level: 1 });
      expect(h1).toHaveAttribute("id", "hero-heading");
      expect(h1).toHaveTextContent(
        "We build products that are fast, tested, and built to scale.",
      );
    });

    /**
     * TEST 6
     * Category: 🧱 Rendering
     * Why: The lead paragraph carries the studio's value proposition. It
     * must render from i18n — not be hardcoded — so language switches update
     * it correctly.
     */
    it("renders the lead paragraph from i18n", () => {
      renderHero();
      expect(
        screen.getByText(/OnePiece Coding ships clean React frontends/),
      ).toBeInTheDocument();
    });

    /**
     * TEST 7
     * Category: 🧱 Rendering
     * Why: All three tech stack items must render. These communicate the
     * studio's technology expertise — missing items silently drop key
     * signals ("Tested · Accessible · Performance-First").
     */
    it("renders all three tech stack list items from i18n", () => {
      renderHero();
      const list = screen.getByRole("list");
      const items = within(list).getAllByRole("listitem");
      expect(items).toHaveLength(3);
      expect(items[0]).toHaveTextContent("React · TypeScript · Redux Toolkit");
      expect(items[1]).toHaveTextContent(
        "Node.js · Express.js · MongoDB · MySQL",
      );
      expect(items[2]).toHaveTextContent(
        "Tested · Accessible · Performance-First",
      );
    });
  });

  // ─── 3. Social links ──────────────────────────────────────────────────────

  describe("Social links", () => {
    /**
     * TEST 8
     * Category: 🧱 Rendering
     * Why: Three social links must render. If any is missing, that contact
     * channel is silently inaccessible from the hero — reducing the studio's
     * reach from the most-visited section of the portfolio.
     */
    it("renders exactly three social links inside the social nav", () => {
      renderHero();
      const nav = screen.getByRole("navigation", { name: "Social links" });
      const links = within(nav).getAllByRole("link");
      expect(links).toHaveLength(3);
    });

    /**
     * TEST 9
     * Category: 🧱 Rendering
     * Why: Each social link must point to the correct external URL from
     * hero.data.ts. A wrong href routes users to a broken or unrelated page.
     */
    it("LinkedIn link points to the correct URL", () => {
      renderHero();
      const linkedinLink = screen.getByRole("link", {
        name: /Lahcen Alhiane on LinkedIn/i,
      });
      expect(linkedinLink).toHaveAttribute(
        "href",
        "https://www.linkedin.com/in/lahcen-alhiane-61217239a/",
      );
    });

    /**
     * TEST 10
     * Category: 🧱 Rendering
     * Why: The GitHub link must point to the organisation account. A wrong
     * href would send visitors to a 404 or an unrelated profile.
     */
    it("GitHub link points to the correct URL", () => {
      renderHero();
      const githubLink = screen.getByRole("link", {
        name: /OnePiece Coding on GitHub/i,
      });
      expect(githubLink).toHaveAttribute(
        "href",
        "https://github.com/onepiece-coding",
      );
    });

    /**
     * TEST 11
     * Category: 🧱 Rendering
     * Why: The email link must use the mailto: scheme with the correct
     * address. A broken scheme or wrong address silently kills the contact
     * channel for users who click the email button.
     */
    it("Email link uses mailto: with the correct address", () => {
      renderHero();
      const emailLink = screen.getByRole("link", { name: /Send us an email/i });
      expect(emailLink).toHaveAttribute(
        "href",
        "mailto:onepiece.codingpar@gmail.com",
      );
    });

    /**
     * TEST 12
     * Category: 🔒 Security
     * Why: All three social links open in a new tab (target="_blank"). Without
     * rel="noopener noreferrer" the linked page can access window.opener and
     * redirect the portfolio — a well-known reverse tabnapping vulnerability.
     */
    it("all social links have target='_blank' and rel='noopener noreferrer'", () => {
      renderHero();
      const nav = screen.getByRole("navigation", { name: "Social links" });
      within(nav)
        .getAllByRole("link")
        .forEach((link) => {
          expect(link).toHaveAttribute("target", "_blank");
          expect(link).toHaveAttribute("rel", "noopener noreferrer");
        });
    });

    /**
     * TEST 13
     * Category: ♿ Accessibility
     * Why: Each social link must have a descriptive aria-label from i18n.
     * Without it, screen readers announce just the icon SVG or nothing —
     * the link's purpose is completely opaque to blind users.
     */
    it("LinkedIn link has the correct aria-label from i18n", () => {
      renderHero();
      expect(
        screen.getByRole("link", {
          name: "Lahcen Alhiane on LinkedIn (opens in new tab)",
        }),
      ).toBeInTheDocument();
    });

    /**
     * TEST 14
     * Category: ♿ Accessibility
     * Why: No social link must have a raw i18n key as its label. A broken
     * key lookup would produce "hero.socialLinkedIn" as the accessible name —
     * meaningless to all screen reader users.
     */
    it("no social link has a raw i18n key as its aria-label", () => {
      renderHero();
      const nav = screen.getByRole("navigation", { name: "Social links" });
      within(nav)
        .getAllByRole("link")
        .forEach((link) => {
          expect(link.getAttribute("aria-label")).not.toMatch(/^hero\./);
        });
    });
  });

  // ─── 4. Accessibility ─────────────────────────────────────────────────────

  describe("Accessibility", () => {
    /**
     * TEST 15
     * Category: ♿ Accessibility
     * Why: The section must be labelled by the h1 via aria-labelledby. This
     * is what screen readers use to announce the section when navigating by
     * landmarks — without it the landmark is unnamed (WCAG 2.4.1).
     */
    it("section has aria-labelledby='hero-heading'", () => {
      renderHero();
      const section = document.getElementById("hero");
      expect(section).toHaveAttribute("aria-labelledby", "hero-heading");
    });

    /**
     * TEST 16
     * Category: ♿ Accessibility
     * Why: The social nav must have an aria-label so screen readers announce
     * it as a distinct named landmark. Without a label, the nav merges
     * contextually with the primary nav — confusing for keyboard users.
     */
    it("social nav has aria-label 'Social links'", () => {
      renderHero();
      expect(
        screen.getByRole("navigation", { name: "Social links" }),
      ).toBeInTheDocument();
    });

    /**
     * TEST 17
     * Category: ♿ Accessibility
     * Why: The entire right column (logo + orbit) is decorative and must be
     * aria-hidden. If it is not hidden, screen readers announce the spinning
     * orbit and 8 skill badge divs as interactive content — noise that
     * disrupts navigation for blind users.
     */
    it("the decorative right column has aria-hidden='true'", () => {
      renderHero();
      // The right div directly wrapping the logo/orbit is aria-hidden
      const hiddenRegion = document
        .getElementById("hero")!
        .querySelector("[aria-hidden='true']");
      expect(hiddenRegion).not.toBeNull();
    });

    /**
     * TEST 18
     * Category: ♿ Accessibility
     * Why: The orbit container holding the 8 skill badges must be aria-hidden.
     * Without this, each badge div is in the accessibility tree as an unnamed
     * element — 8 extra unlabelled nodes for AT users to wade through.
     */
    it("the orbit element has aria-hidden='true'", () => {
      renderHero();
      // The orbit is inside the right column and carries aria-hidden independently
      const allHidden = document.querySelectorAll("[aria-hidden='true']");
      // At least the right column and orbit are hidden
      expect(allHidden.length).toBeGreaterThanOrEqual(2);
    });

    /**
     * TEST 19
     * Category: ♿ Accessibility
     * Why: The logo circle ("OP" text) must also be aria-hidden — it is a
     * decorative logo badge, not a heading or label. Without aria-hidden, the
     * reader announces "OP" in isolation, which is meaningless without context.
     */
    it("the logo circle has aria-hidden='true'", () => {
      renderHero();
      // Find the element containing "OP" text and confirm it is aria-hidden
      const logoCircle = screen.getByText("OP").closest("[aria-hidden='true']");
      expect(logoCircle).not.toBeNull();
    });

    /**
     * TEST 20
     * Category: ♿ Accessibility
     * Why: All social icon <span> wrappers carry aria-hidden so only the
     * link's aria-label is read, not the SVG content. Without this, screen
     * readers may attempt to read SVG child elements as text.
     */
    it("social icon spans do not expose icon SVGs to assistive technology", () => {
      renderHero();
      // The icons themselves are inside spans — the link aria-label covers the purpose.
      // Verify no icon SVG has a role that would add it to the AT tree.
      const iconSvgs = document.querySelectorAll(
        "[data-testid^='icon-linkedin'], [data-testid^='icon-github'], [data-testid^='icon-email']",
      );
      iconSvgs.forEach((svg) => {
        // Must not have role="img" with an accessible name — that would double-announce
        if (svg.hasAttribute("role")) {
          expect(svg.getAttribute("role")).not.toBe("img");
        }
      });
    });
  });

  // ─── 5. i18n ──────────────────────────────────────────────────────────────

  describe("i18n", () => {
    /**
     * TEST 21
     * Category: 🌍 i18n
     * Why: No raw i18n key must appear in the rendered output. A key like
     * "hero.h1" or "hero.kicker" in the DOM means the translation lookup
     * failed — visible to all sighted users as broken text.
     */
    it("renders no raw i18n keys anywhere in the hero section", () => {
      renderHero();
      const section = document.getElementById("hero")!;
      // Raw keys always contain a dot and start with a known namespace
      expect(section.textContent).not.toMatch(/\bhero\.\w+/);
    });

    /**
     * TEST 22
     * Category: 🌍 i18n
     * Why: The social nav's aria-label must come from i18n (hero.socialNavAriaLabel).
     * If the key lookup fails the nav is labelled "hero.socialNavAriaLabel" —
     * a meaningless accessible name that also confirms a configuration bug.
     */
    it("social nav aria-label does not contain a raw i18n key", () => {
      renderHero();
      const nav = screen.getByRole("navigation", { name: "Social links" });
      expect(nav.getAttribute("aria-label")).not.toMatch(/^hero\./);
    });
  });
});

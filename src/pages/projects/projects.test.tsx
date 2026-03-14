/**
 * @file src/pages/projects/projects.test.tsx
 */

import { renderWithProviders } from "@/test/i18n-test-utils";
import { describe, it, expect, vi } from "vitest";
import { screen } from "@testing-library/react";

import ProjectsPage from "./index";

// ─── Mocks ────────────────────────────────────────────────────────────────────

// ProjectCard has its own 20-test file — stub it out to keep this unit-level.
vi.mock("./project-card", () => ({
  default: ({ project }: { project: { id: string } }) => (
    <li data-testid={`project-card-${project.id}`} />
  ),
}));

// ─── Helpers ─────────────────────────────────────────────────────────────────

const renderProjects = () => renderWithProviders(<ProjectsPage />);

// ─── Tests ───────────────────────────────────────────────────────────────────

describe("ProjectsPage", () => {
  // ─── 1. Document metadata ─────────────────────────────────────────────────

  describe("Document metadata", () => {
    /**
     * TEST 1
     * Why: The page title appears in browser tabs and search engine results.
     * A missing translation key ("projects.pageTitle") would render the raw
     * key as the tab title — immediately visible to every visitor.
     */
    it("sets document.title from projects.pageTitle", () => {
      renderProjects();
      expect(document.title).toBe(
        "Projects — OnePiece Coding | React & Node.js Case Studies",
      );
    });

    /**
     * TEST 2
     * Why: The meta description is the search snippet for the Projects page.
     * A raw key or empty content destroys SEO and looks broken in search
     * results.
     */
    it("renders a non-empty meta description without raw i18n keys", () => {
      renderProjects();
      const meta = document.querySelector("meta[name='description']");
      expect(meta).not.toBeNull();
      expect(meta?.getAttribute("content")).not.toMatch(/^projects\./);
      expect(meta?.getAttribute("content")?.length).toBeGreaterThan(10);
    });
  });

  // ─── 2. Section structure ─────────────────────────────────────────────────

  describe("Section structure", () => {
    /**
     * TEST 3
     * Why: The section must have id="projects" for anchor navigation and
     * aria-labelledby="projects-heading" so AT users reach a named landmark.
     * Without both attributes, the page fails landmark navigation requirements.
     */
    it("renders section with id='projects' and aria-labelledby='projects-heading'", () => {
      renderProjects();
      const section = document.getElementById("projects");
      expect(section).not.toBeNull();
      expect(section).toHaveAttribute("aria-labelledby", "projects-heading");
    });

    /**
     * TEST 4
     * Why: The h1 must have id="projects-heading" (referenced by
     * aria-labelledby) and the correct translated text. A mismatch between
     * the id and aria-labelledby value silently breaks the named landmark.
     */
    it("renders h1 with id='projects-heading' and correct text", () => {
      renderProjects();
      const h1 = screen.getByRole("heading", { level: 1 });
      expect(h1).toHaveAttribute("id", "projects-heading");
      expect(h1).toHaveTextContent(
        "Projects built end-to-end — frontend and backend, together.",
      );
    });

    /**
     * TEST 5
     * Why: The lead paragraph delivers the page's framing copy. It must
     * render from i18n — a raw key or missing string silently removes the
     * "no handoff waste" positioning statement below the heading.
     */
    it("renders the lead paragraph from i18n", () => {
      renderProjects();
      expect(
        screen.getByText(/Each project below is planned, built, and shipped/),
      ).toBeInTheDocument();
    });

    /**
     * TEST 6
     * Why: The footer note must render. It is the conversion micro-copy that
     * pitches the performance audit service — a missing key leaves a blank
     * paragraph below the CTA buttons.
     */
    it("renders the footer note from i18n", () => {
      renderProjects();
      expect(
        screen.getByText(/Carrying libraries for features a native API/),
      ).toBeInTheDocument();
    });

    /**
     * TEST 7
     * Why: No raw i18n key must appear anywhere in the section. A broken
     * key lookup for any of the page-level strings (h1, lead, footerNote)
     * produces "projects.xyz" in the DOM — visible to all sighted users.
     */
    it("renders no raw i18n keys in the section text content", () => {
      renderProjects();
      const section = document.getElementById("projects")!;
      expect(section.textContent).not.toMatch(/\bprojects\.\w+/);
    });
  });

  // ─── 3. Project list ──────────────────────────────────────────────────────

  describe("Project list", () => {
    /**
     * TEST 8
     * Why: The <ul> that wraps project cards must have an aria-label. Without
     * it the list landmark is unnamed — screen readers present it as an
     * anonymous list alongside the tech badge lists inside cards.
     */
    it("renders a <ul> with aria-label 'Technologies used' for the project grid", () => {
      renderProjects();
      // The page-level grid list has this label (same key as badge lists)
      const lists = screen.getAllByRole("list", { name: "Technologies used" });
      // At least one list with this label must exist at the page level
      expect(lists.length).toBeGreaterThanOrEqual(1);
    });

    /**
     * TEST 9
     * Why: There is exactly one project in PROJECTS (op-blog). The stub must
     * render once — confirming the PROJECTS array is iterated and the correct
     * project id is passed as a prop.
     */
    it("renders one ProjectCard stub for the op-blog project", () => {
      renderProjects();
      expect(screen.getByTestId("project-card-op-blog")).toBeInTheDocument();
    });

    /**
     * TEST 10
     * Why: The stub renders inside the <ul> (as an <li>). If ProjectCard is
     * rendered outside the list, the HTML is invalid and list semantics
     * for AT users are broken.
     */
    it("the project card stub is inside the projects grid list", () => {
      renderProjects();
      const lists = screen.getAllByRole("list", { name: "Technologies used" });
      // Find the grid list (the one that contains the project card stub)
      const gridList = lists.find((l) =>
        l.contains(screen.getByTestId("project-card-op-blog")),
      );
      expect(gridList).not.toBeUndefined();
    });
  });

  // ─── 4. CTA buttons ───────────────────────────────────────────────────────

  describe("CTA buttons", () => {
    /**
     * TEST 11
     * Why: The primary CTA must link to /contact and show "Request a
     * performance audit". Both text and destination are correct — a wrong
     * href routes visitors to the wrong page after clicking the primary CTA.
     */
    it("renders the primary CTA linking to /contact", () => {
      renderProjects();
      const primaryCta = screen.getByRole("link", {
        name: "Request a performance audit",
      });
      expect(primaryCta).toHaveAttribute("href", "/contact");
    });

    /**
     * TEST 12
     * Why: The ghost CTA also links to /contact (per the JSX) and shows
     * "Start a project brief". Both CTAs on this page point to /contact —
     * different text but same destination, which is intentional.
     */
    it("renders the ghost CTA linking to /contact", () => {
      renderProjects();
      const ghostCta = screen.getByRole("link", {
        name: "Start a project brief",
      });
      expect(ghostCta).toHaveAttribute("href", "/contact");
    });

    /**
     * TEST 13
     * Why: Neither CTA label may be a raw i18n key. If projects.ctaPrimary
     * or projects.ctaGhost is missing, users see "projects.ctaPrimary" as
     * the button text — an immediately visible regression.
     */
    it("neither CTA displays a raw i18n key as its label", () => {
      renderProjects();
      screen.getAllByRole("link").forEach((link) => {
        expect(link.textContent).not.toMatch(/^projects\./);
      });
    });
  });
});

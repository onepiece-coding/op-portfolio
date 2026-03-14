/**
 * @file src/pages/services/services.test.tsx
 */

import { renderWithProviders } from "@/test/i18n-test-utils";
import { screen, within } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";

import ServicesPage from "./index";

// ─── Mocks ────────────────────────────────────────────────────────────────────

// ServiceCard has its own 15-test file — stub with a deterministic id.
vi.mock("./service-card", () => ({
  default: ({ service }: { service: { id: string } }) => (
    <li data-testid={`service-card-${service.id}`} />
  ),
}));

// Icons used in services.data.ts — must be mocked so the import does not
// crash before ServiceCard is mocked out.
vi.mock("@/components/icons", () => ({
  StarIcon: () => <svg />,
  StatsIcon: () => <svg />,
  PerformanceIcon: () => <svg />,
}));

// ─── Helpers ─────────────────────────────────────────────────────────────────

const renderServices = () => renderWithProviders(<ServicesPage />);

// ─── Tests ───────────────────────────────────────────────────────────────────

describe("ServicesPage", () => {
  // ─── 1. Document metadata ─────────────────────────────────────────────────

  describe("Document metadata", () => {
    /**
     * TEST 1
     * Why: The page title is the browser tab label and primary SEO signal.
     * A raw key ("services.pageTitle") in the tab title is immediately
     * visible to every visitor who has the portfolio open in a browser.
     */
    it("sets document.title from services.pageTitle", () => {
      renderServices();
      expect(document.title).toBe(
        "Services — OnePiece Coding | MVP, Scaling & Audits",
      );
    });

    /**
     * TEST 2
     * Why: The meta description populates search engine snippets. A raw key
     * or empty string in this field destroys the page's SEO value and
     * looks broken in search results.
     */
    it("renders a non-empty meta description without raw i18n keys", () => {
      renderServices();
      const meta = document.querySelector("meta[name='description']");
      expect(meta).not.toBeNull();
      expect(meta?.getAttribute("content")).not.toMatch(/^services\./);
      expect(meta?.getAttribute("content")?.length).toBeGreaterThan(10);
    });
  });

  // ─── 2. Section structure ─────────────────────────────────────────────────

  describe("Section structure", () => {
    /**
     * TEST 3
     * Why: The section must have id="services" for anchor navigation and
     * aria-labelledby="services-heading" for a named landmark. Without both,
     * AT users cannot jump to the services section via landmarks panel.
     */
    it("renders section with id='services' and aria-labelledby='services-heading'", () => {
      renderServices();
      const section = document.getElementById("services");
      expect(section).not.toBeNull();
      expect(section).toHaveAttribute("aria-labelledby", "services-heading");
    });

    /**
     * TEST 4
     * Why: The h1 must have id="services-heading" so aria-labelledby
     * resolves. Its translated text is the page's primary heading — a
     * missing or wrong id silently breaks the landmark's accessible name.
     */
    it("renders h1 with id='services-heading' and correct text", () => {
      renderServices();
      const h1 = screen.getByRole("heading", { level: 1 });
      expect(h1).toHaveAttribute("id", "services-heading");
      expect(h1).toHaveTextContent(
        "What we build, scale, and fix — and how we do it.",
      );
    });

    /**
     * TEST 5
     * Why: The lead paragraph is the section's positioning copy. It must
     * render from i18n so language switches update it — a hardcoded string
     * would break Arabic and French visitors.
     */
    it("renders the lead paragraph from i18n", () => {
      renderServices();
      expect(
        screen.getByText(
          /Three focused services built around real engineering/,
        ),
      ).toBeInTheDocument();
    });

    /**
     * TEST 6
     * Why: The footer note is the pricing transparency micro-copy. A blank
     * or raw-key footer note silently removes the "fixed-scope estimate"
     * promise that reduces client hesitation.
     */
    it("renders the footer note from i18n", () => {
      renderServices();
      expect(
        screen.getByText(/Pricing and timeline are scoped per engagement/),
      ).toBeInTheDocument();
    });
  });

  // ─── 3. Service cards list ────────────────────────────────────────────────

  describe("Service cards list", () => {
    /**
     * TEST 7
     * Why: The <ul> wrapping service cards must have aria-label "Service
     * offerings". Without it the list is anonymous — AT users navigating
     * by list landmarks cannot identify what this list represents.
     */
    it("renders the service list with aria-label 'Service offerings'", () => {
      renderServices();
      expect(
        screen.getByRole("list", { name: "Service offerings" }),
      ).toBeInTheDocument();
    });

    /**
     * TEST 8
     * Why: SERVICES has three entries (mvp, scaling, audit). All three stubs
     * must render — a missing card means an entire service is invisible to
     * visitors.
     */
    it("renders all three ServiceCard stubs", () => {
      renderServices();
      expect(screen.getByTestId("service-card-mvp")).toBeInTheDocument();
      expect(screen.getByTestId("service-card-scaling")).toBeInTheDocument();
      expect(screen.getByTestId("service-card-audit")).toBeInTheDocument();
    });

    /**
     * TEST 9
     * Why: Cards must render in SERVICES array order (mvp → scaling → audit).
     * The third card (audit) gets special CSS treatment (grid-column: span 2)
     * — reordering would break the visual layout intent.
     */
    it("renders service cards in mvp → scaling → audit order", () => {
      renderServices();
      const mvp = screen.getByTestId("service-card-mvp");
      const scaling = screen.getByTestId("service-card-scaling");
      const audit = screen.getByTestId("service-card-audit");

      expect(mvp.compareDocumentPosition(scaling)).toBe(
        Node.DOCUMENT_POSITION_FOLLOWING,
      );
      expect(scaling.compareDocumentPosition(audit)).toBe(
        Node.DOCUMENT_POSITION_FOLLOWING,
      );
    });

    /**
     * TEST 10
     * Why: All three stubs must be inside the service list. A card rendered
     * outside the <ul> produces invalid HTML (<li> outside <ul>) and breaks
     * the list landmark semantics for AT users.
     */
    it("all service card stubs are inside the service list", () => {
      renderServices();
      const list = screen.getByRole("list", { name: "Service offerings" });
      ["mvp", "scaling", "audit"].forEach((id) => {
        expect(list).toContainElement(screen.getByTestId(`service-card-${id}`));
      });
    });
  });

  // ─── 4. How it works section ──────────────────────────────────────────────

  describe("How it works section", () => {
    /**
     * TEST 11
     * Why: The "How an engagement works" subsection must be a <section> with
     * its own aria-labelledby. It is a distinct content region — without a
     * named landmark, AT users have no way to navigate to it directly.
     */
    it("renders the how-it-works subsection as a named landmark", () => {
      renderServices();
      expect(
        screen.getByRole("region", { name: "How an engagement works" }),
      ).toBeInTheDocument();
    });

    /**
     * TEST 12
     * Why: The h2 must have id="engagement-heading" and the correct
     * translated text. A wrong id means aria-labelledby on the section
     * points to a non-existent element — the landmark is unnamed.
     */
    it("h2 has id='engagement-heading' and correct text from i18n", () => {
      renderServices();
      const h2 = screen.getByRole("heading", { level: 2 });
      expect(h2).toHaveAttribute("id", "engagement-heading");
      expect(h2).toHaveTextContent("How an engagement works");
    });

    /**
     * TEST 13
     * Why: The ordered list must have exactly 3 steps. An <ol> communicates
     * sequential process — a missing step silently drops part of the
     * engagement process from the client's view.
     */
    it("renders an ordered list with exactly 3 steps", () => {
      renderServices();
      const ol = document.querySelector("ol");

      expect(ol).not.toBeNull();
      const items = within(ol!).getAllByRole("listitem");
      expect(items).toHaveLength(3);
    });

    /**
     * TEST 14
     * Why: Each step has a <strong> label and a text continuation — both
     * must render. The strong text ("Scope (1–2 hours)") is the step heading;
     * the continuation text provides the detail. A missing strong means the
     * step appears without its bold label.
     */
    it("renders the bold label for each step", () => {
      renderServices();
      expect(screen.getByText("Scope (1–2 hours)")).toBeInTheDocument();
      expect(screen.getByText("Audit & plan")).toBeInTheDocument();
      expect(screen.getByText("Execute")).toBeInTheDocument();
    });

    /**
     * TEST 15
     * Why: Step continuation text must also render. A regression where only
     * the <strong> text renders (and the sibling text node is dropped) would
     * silently remove the explanatory detail from each step.
     */
    it("renders the continuation text for each step", () => {
      renderServices();
      expect(
        screen.getByText(/— a technical brief to define goals/),
      ).toBeInTheDocument();
      expect(
        screen.getByText(/— prioritised P0 → P3 fix list/),
      ).toBeInTheDocument();
      expect(screen.getByText(/— implementation sprint/)).toBeInTheDocument();
    });

    /**
     * TEST 16
     * Why: The "How it works" section has its own CTA ("Start a technical
     * brief") linking to /contact. This is a separate conversion point
     * from the service card CTAs — it must render and link correctly.
     */
    it("renders the how-it-works CTA linking to /contact", () => {
      renderServices();
      // Button is real here — MemoryRouter provided by renderWithProviders
      const cta = screen.getByRole("link", { name: "Start a technical brief" });
      expect(cta).toHaveAttribute("href", "/contact");
    });
  });

  // ─── 5. i18n guard ────────────────────────────────────────────────────────

  describe("i18n", () => {
    /**
     * TEST 17
     * Why: No raw i18n key may appear anywhere in the section's text content.
     * Every text node in ServicesPage comes from t() — a single broken key
     * ("services.xyz") would be visible to all sighted visitors.
     */
    it("renders no raw i18n keys in the section text content", () => {
      renderServices();
      const section = document.getElementById("services")!;
      expect(section.textContent).not.toMatch(/\bservices\.\w+/);
    });
  });
});

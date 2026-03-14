/**
 * @file src/pages/contact/contact.test.tsx
 */

import { renderWithProviders } from "@/test/i18n-test-utils";
import { describe, it, expect, vi } from "vitest";
import { screen } from "@testing-library/react";

import ContactPage from "./index";

// ─── Mocks ────────────────────────────────────────────────────────────────────

// ContactMethod and HireCard both have their own test files.
// Stub them with deterministic ids so ContactPage tests stay unit-level.
vi.mock("./contact-method", () => ({
  default: ({ id }: { id: string }) => (
    <div data-testid={`contact-method-${id}`} />
  ),
}));

vi.mock("./hire-card", () => ({
  default: ({ id }: { id: string }) => <div data-testid={`hire-card-${id}`} />,
}));

// Icons are imported by contact.data.ts at module level — stub them
// so the import does not crash before the component mocks take effect.
vi.mock("@/components/icons", () => ({
  WhatsappIcon: () => <svg />,
  LinkedInFillIcon: () => <svg />,
  EmailIcon: () => <svg />,
  ExclamationCircleIcon: () => <svg />,
}));

// ─── Helpers ─────────────────────────────────────────────────────────────────

const renderContact = () => renderWithProviders(<ContactPage />);

const CONTACT_METHOD_IDS = [
  "whatsapp-lahcen",
  "whatsapp-mohamed",
  "linkedin-lahcen",
  "linkedin-mohamed",
  "email",
  "availability",
];

// ─── Tests ───────────────────────────────────────────────────────────────────

describe("ContactPage", () => {
  // ─── 1. Document metadata ─────────────────────────────────────────────────

  describe("Document metadata", () => {
    /**
     * TEST 1
     * Why: The page title determines the browser tab label and is the primary
     * SEO signal for the Contact page. A raw key ("contact.pageTitle") in
     * the tab title is immediately visible and unprofessional on a portfolio.
     */
    it("sets document.title from contact.pageTitle", () => {
      renderContact();
      expect(document.title).toBe(
        "Contact — Hire OnePiece Coding | Frontend & Backend",
      );
    });

    /**
     * TEST 2
     * Why: The meta description feeds the search engine snippet for the
     * Contact page. An empty or raw-key content removes the page from useful
     * search results — precisely where potential clients would look.
     */
    it("renders a non-empty meta description without raw i18n keys", () => {
      renderContact();
      const meta = document.querySelector("meta[name='description']");
      expect(meta).not.toBeNull();
      expect(meta?.getAttribute("content")).not.toMatch(/^contact\./);
      expect(meta?.getAttribute("content")?.length).toBeGreaterThan(10);
    });
  });

  // ─── 2. Page section structure ────────────────────────────────────────────

  describe("Page section structure", () => {
    /**
     * TEST 3
     * Why: The outer section needs id="contact" for anchor navigation and
     * aria-labelledby="contact-heading" for a named landmark. Without both,
     * AT users cannot jump directly to the contact section.
     */
    it("renders outer section with id='contact' and aria-labelledby='contact-heading'", () => {
      renderContact();
      const section = document.getElementById("contact");
      expect(section).not.toBeNull();
      expect(section).toHaveAttribute("aria-labelledby", "contact-heading");
    });

    /**
     * TEST 4
     * Why: The h1 must have id="contact-heading" so aria-labelledby resolves,
     * and must show the translated "Let's work together." headline — a missing
     * id silently breaks the named landmark even if the heading text renders.
     */
    it("renders h1 with id='contact-heading' and correct text", () => {
      renderContact();
      const h1 = screen.getByRole("heading", { level: 1 });
      expect(h1).toHaveAttribute("id", "contact-heading");
      expect(h1).toHaveTextContent("Let's work together.");
    });

    /**
     * TEST 5
     * Why: The lead paragraph sets expectations before the contact methods
     * grid. A missing translation silently removes the "remote-friendly and
     * responsive within 48 hours" promise — reducing client confidence.
     */
    it("renders the lead paragraph from i18n", () => {
      renderContact();
      expect(
        screen.getByText(/We are available for freelance projects/),
      ).toBeInTheDocument();
    });

    /**
     * TEST 6
     * Why: The footer note is the closing call-to-action micro-copy.
     * A missing translation leaves a blank paragraph below the CTA buttons —
     * an obvious visual regression on the last section of the portfolio.
     */
    it("renders the footer note from i18n", () => {
      renderContact();
      expect(
        screen.getByText(/Send a short message with your project/),
      ).toBeInTheDocument();
    });
  });

  // ─── 3. Contact methods subsection ───────────────────────────────────────

  describe("Contact methods subsection", () => {
    /**
     * TEST 7
     * Why: The "How to reach us" subsection must be a named landmark with
     * aria-labelledby="methods-heading". Without this, AT users navigating
     * by region landmarks see an anonymous subsection with no declared purpose.
     */
    it("renders the methods subsection as a named landmark", () => {
      renderContact();
      expect(
        screen.getByRole("region", { name: "How to reach us" }),
      ).toBeInTheDocument();
    });

    /**
     * TEST 8
     * Why: The h2 must have id="methods-heading" and the translated text.
     * A wrong id breaks the aria-labelledby relationship; wrong text is a
     * visible regression on the heading above the contact methods grid.
     */
    it("renders methods h2 with id='methods-heading' and correct text", () => {
      renderContact();
      const headings = screen.getAllByRole("heading", { level: 2 });
      const methodsH2 = headings.find((h) =>
        h.textContent?.includes("How to reach us"),
      );
      expect(methodsH2).not.toBeUndefined();
      expect(methodsH2).toHaveAttribute("id", "methods-heading");
    });

    /**
     * TEST 9
     * Why: All 6 contact methods must render — one for each entry in
     * CONTACT_METHODS. A missing card silently removes a contact channel
     * from the portfolio (e.g. both WhatsApp numbers must be present).
     */
    it("renders all 6 ContactMethod stubs", () => {
      renderContact();
      CONTACT_METHOD_IDS.forEach((id) => {
        expect(screen.getByTestId(`contact-method-${id}`)).toBeInTheDocument();
      });
    });

    /**
     * TEST 10
     * Why: Contact methods must render in CONTACT_METHODS array order
     * (Lahcen's WhatsApp first). Reversed order would show Mohamed's details
     * before Lahcen's — contradicting the data design intent.
     */
    it("renders whatsapp-lahcen before whatsapp-mohamed in DOM order", () => {
      renderContact();
      const lahcen = screen.getByTestId("contact-method-whatsapp-lahcen");
      const mohamed = screen.getByTestId("contact-method-whatsapp-mohamed");
      expect(lahcen.compareDocumentPosition(mohamed)).toBe(
        Node.DOCUMENT_POSITION_FOLLOWING,
      );
    });
  });

  // ─── 4. Hiring subsection ─────────────────────────────────────────────────

  describe("Hiring subsection", () => {
    /**
     * TEST 11
     * Why: The "Open for roles" subsection must be a named region landmark.
     * Without it, AT users cannot navigate directly to the hiring section —
     * it blends into the page as anonymous content.
     */
    it("renders the hiring subsection as a named landmark", () => {
      renderContact();
      expect(
        screen.getByRole("region", { name: "Open for roles" }),
      ).toBeInTheDocument();
    });

    /**
     * TEST 12
     * Why: The h2 must have id="hiring-heading" for aria-labelledby to
     * resolve. A missing or wrong id produces an anonymous region even though
     * the heading text renders correctly.
     */
    it("renders hiring h2 with id='hiring-heading' and correct text", () => {
      renderContact();
      const headings = screen.getAllByRole("heading", { level: 2 });
      const hiringH2 = headings.find((h) =>
        h.textContent?.includes("Open for roles"),
      );
      expect(hiringH2).not.toBeUndefined();
      expect(hiringH2).toHaveAttribute("id", "hiring-heading");
    });

    /**
     * TEST 13
     * Why: Both HireCard stubs must render. A missing card means one team
     * member is invisible in the "available for hire" section — directly
     * reducing the studio's hiring prospects.
     */
    it("renders HireCard stubs for both lahcen and mohamed", () => {
      renderContact();
      expect(screen.getByTestId("hire-card-lahcen")).toBeInTheDocument();
      expect(screen.getByTestId("hire-card-mohamed")).toBeInTheDocument();
    });

    /**
     * TEST 14
     * Why: The hiring cards must render inside the hiring subsection — not
     * in the methods grid or outside a section entirely. Misplaced cards
     * would break the semantic structure and confuse AT users navigating
     * by region.
     */
    it("hire cards are inside the hiring subsection", () => {
      renderContact();
      const hiringRegion = screen.getByRole("region", {
        name: "Open for roles",
      });
      expect(hiringRegion).toContainElement(
        screen.getByTestId("hire-card-lahcen"),
      );
      expect(hiringRegion).toContainElement(
        screen.getByTestId("hire-card-mohamed"),
      );
    });
  });

  // ─── 5. CTA buttons ───────────────────────────────────────────────────────

  describe("CTA buttons", () => {
    /**
     * TEST 15
     * Why: The primary CTA on the Contact page links to /duo — different
     * from every other page (which link to /contact). A regression that
     * changes this to /contact creates a self-referential loop where users
     * clicking "Meet the team" stay on the Contact page.
     */
    it("renders the primary CTA linking to /duo", () => {
      renderContact();
      const cta = screen.getByRole("link", { name: "Meet the team" });
      expect(cta).toHaveAttribute("href", "/duo");
    });

    /**
     * TEST 16
     * Why: The ghost CTA links to /projects. After reading the contact page,
     * visitors who want to review work samples before committing need this
     * escape route — a wrong href routes them to the wrong page.
     */
    it("renders the ghost CTA linking to /projects", () => {
      renderContact();
      const cta = screen.getByRole("link", { name: "See our projects" });
      expect(cta).toHaveAttribute("href", "/projects");
    });

    /**
     * TEST 17
     * Why: Neither CTA may show a raw i18n key. "contact.ctaPrimary" rendered
     * as the button text is an immediate regression visible to every visitor
     * who reaches the Contact page.
     */
    it("neither CTA displays a raw i18n key as its label", () => {
      renderContact();
      screen.getAllByRole("link").forEach((link) => {
        expect(link.textContent).not.toMatch(/^contact\./);
      });
    });
  });

  // ─── 6. i18n guard ────────────────────────────────────────────────────────

  /**
   * TEST 18
   * Why: No raw i18n key may appear in the section's text content. Every
   * rendered string in ContactPage comes from t() — a single broken key
   * ("contact.xyz") would be visible on a page that prospective clients
   * and employers visit to make contact.
   */
  it("renders no raw i18n keys in the section text content", () => {
    renderContact();
    const section = document.getElementById("contact")!;
    expect(section.textContent).not.toMatch(/\bcontact\.\w+/);
  });
});

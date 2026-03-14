/**
 * @file src/pages/services/service-card/service-card.test.tsx
 */

import { renderWithProviders } from "@/test/i18n-test-utils";
import { screen, within } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import type { Service } from "../services.data";

import ServiceCard from "./index";

// ─── Mocks ────────────────────────────────────────────────────────────────────

// Card forwards ariaLabelledby and as so the aria relationship still works
// in tests without resolving CSS Module class names.
vi.mock("@/components/ui", () => ({
  Card: ({
    children,
    ariaLabelledby,
    as: Element = "article",
  }: {
    children: React.ReactNode;
    ariaLabelledby?: string;
    as?: "article" | "li";
  }) => (
    <Element
      data-testid="card"
      {...(ariaLabelledby ? { "aria-labelledby": ariaLabelledby } : {})}
    >
      {children}
    </Element>
  ),
  // Button renders a real anchor via MemoryRouter — stub to a plain link
  // so tests remain fast and do not depend on router internals.
  Button: ({ children, to }: { children: React.ReactNode; to: string }) => (
    <a href={to} data-testid="cta-button">
      {children}
    </a>
  ),
}));

// ─── Fixtures ─────────────────────────────────────────────────────────────────

const MockIcon = () => <svg data-testid="service-icon" />;

const mvpService = {
  id: "mvp" as const,
  Icon: MockIcon,
  href: "/contact",
};

const scalingService = {
  id: "scaling" as const,
  Icon: MockIcon,
  href: "/contact",
};

const auditService = {
  id: "audit" as const,
  Icon: MockIcon,
  href: "/contact",
};

const renderCard = (service: Service = mvpService) =>
  renderWithProviders(<ServiceCard service={service} />);

// ─── Tests ───────────────────────────────────────────────────────────────────

describe("ServiceCard", () => {
  // ─── 1. Rendering ──────────────────────────────────────────────────────────

  describe("Rendering", () => {
    /**
     * TEST 1
     * Why: The service title is the card's primary heading and anchors the
     * aria-labelledby relationship. It comes from i18n — a broken key would
     * silently blank the heading on every service card.
     */
    it("renders the service title as an h2 from i18n", () => {
      renderCard();
      const h2 = screen.getByRole("heading", { level: 2 });
      expect(h2).toHaveTextContent("MVP Delivery");
    });

    /**
     * TEST 2
     * Why: The h2 must have id="${service.id}-title" for the Card's
     * aria-labelledby to reference it. Without a matching id the aria
     * relationship between the card article and its name heading is broken.
     */
    it("h2 has id matching the service.id-title pattern", () => {
      renderCard();
      const h2 = screen.getByRole("heading", { level: 2 });
      expect(h2).toHaveAttribute("id", "mvp-title");
    });

    /**
     * TEST 3
     * Why: The subtitle communicates the service's core promise. It renders
     * below the title and is the second-most read element in the card —
     * a missing translation silently removes the positioning line.
     */
    it("renders the service subtitle from i18n", () => {
      renderCard();
      expect(
        screen.getByText("Ship a production-ready product with tight scope."),
      ).toBeInTheDocument();
    });

    /**
     * TEST 4
     * Why: Each service has 4 bullet points that enumerate its deliverables.
     * returnObjects: true must work — if it fails, bullets is a string and
     * .map() throws, crashing the entire ServiceCard render.
     */
    it("renders all 4 bullet items from returnObjects i18n", () => {
      renderCard();
      const bulletList = screen.getByRole("list", { name: "What is included" });
      const items = within(bulletList).getAllByRole("listitem");
      expect(items).toHaveLength(4);
    });

    /**
     * TEST 5
     * Why: Bullet text must match the i18n values exactly. A silent key
     * mismatch would render wrong copy — e.g. audit bullets appearing on the
     * MVP card, which would actively mislead potential clients.
     */
    it("renders the correct bullet text for the mvp service", () => {
      renderCard();
      expect(
        screen.getByText(/Opinionated stack: React \+ TypeScript frontend/),
      ).toBeInTheDocument();
      expect(
        screen.getByText(/Well-shaped API contracts before implementation/),
      ).toBeInTheDocument();
    });

    /**
     * TEST 6
     * Why: The CTA button must render with the service-specific label from
     * i18n. "Book a scoping call" for MVP, "Discuss a scaling plan" for
     * scaling — a shared key would make all three cards show the same label.
     */
    it("renders the CTA button with the correct i18n label", () => {
      renderCard();
      expect(screen.getByTestId("cta-button")).toHaveTextContent(
        "Book a scoping call",
      );
    });

    /**
     * TEST 7
     * Why: The CTA must link to service.href ("/contact" for all three
     * services). A wrong href silently routes users to the wrong page
     * when they click any service CTA.
     */
    it("CTA button links to service.href", () => {
      renderCard();
      expect(screen.getByTestId("cta-button")).toHaveAttribute(
        "href",
        "/contact",
      );
    });
  });

  // ─── 2. Icon ───────────────────────────────────────────────────────────────

  describe("Icon", () => {
    /**
     * TEST 8
     * Why: The icon must render. It is the visual differentiator between
     * the three service cards — a missing icon leaves all three cards looking
     * identical with only text.
     */
    it("renders the service Icon component", () => {
      renderCard();
      expect(screen.getByTestId("service-icon")).toBeInTheDocument();
    });

    /**
     * TEST 9
     * Why: The icon wrapper must be aria-hidden. The icon is purely
     * decorative — its presence in the accessibility tree would add an
     * unlabelled SVG node before every card heading for screen reader users.
     */
    it("icon wrapper has aria-hidden='true'", () => {
      renderCard();
      const icon = screen.getByTestId("service-icon");
      const wrapper = icon.closest("[aria-hidden='true']");
      expect(wrapper).not.toBeNull();
    });
  });

  // ─── 3. Accessibility ─────────────────────────────────────────────────────

  describe("Accessibility", () => {
    /**
     * TEST 10
     * Why: The card's aria-labelledby must reference the h2 id so the <li>
     * card has an accessible name. Without it, AT users navigating by list
     * items reach an anonymous card with no declared purpose.
     */
    it("card has aria-labelledby='mvp-title'", () => {
      renderCard();
      expect(screen.getByTestId("card")).toHaveAttribute(
        "aria-labelledby",
        "mvp-title",
      );
    });

    /**
     * TEST 11
     * Why: The bullet list must have aria-label "What is included". Without
     * this label the <ul> is anonymous and screen reader users cannot tell
     * whether it contains deliverables, tech badges, or something else.
     */
    it("bullet list has aria-label 'What is included'", () => {
      renderCard();
      expect(
        screen.getByRole("list", { name: "What is included" }),
      ).toBeInTheDocument();
    });

    /**
     * TEST 12
     * Why: No raw i18n key may appear in the card's rendered text. A broken
     * t() call for any of title/subtitle/bullets/cta produces "services.xyz"
     * in the DOM — an embarrassing regression on a client-facing portfolio.
     */
    it("renders no raw i18n keys in the card text content", () => {
      renderCard();
      expect(screen.getByTestId("card").textContent).not.toMatch(
        /\bservices\.\w+/,
      );
    });
  });

  // ─── 4. Scaling and Audit cards ───────────────────────────────────────────

  describe("Scaling and Audit service variants", () => {
    /**
     * TEST 13
     * Why: The scaling card must use the "scaling" translation key, not
     * fall back to "mvp". A copy-paste bug in the t() calls could render
     * MVP content on the scaling card — wrong promises to potential clients.
     */
    it("renders scaling card title and h2 id correctly", () => {
      renderCard(scalingService);
      const h2 = screen.getByRole("heading", { level: 2 });
      expect(h2).toHaveTextContent("Full-Stack Scaling");
      expect(h2).toHaveAttribute("id", "scaling-title");
    });

    /**
     * TEST 14
     * Why: The audit card must use the "audit" key, rendering different
     * title, bullets, and CTA. This guards against a single set of
     * translations accidentally appearing on all three cards.
     */
    it("renders audit card title, cta, and h2 id correctly", () => {
      renderCard(auditService);
      const h2 = screen.getByRole("heading", { level: 2 });
      expect(h2).toHaveTextContent("Performance Audit & Fix Plan");
      expect(h2).toHaveAttribute("id", "audit-title");
      expect(screen.getByTestId("cta-button")).toHaveTextContent(
        "Request an audit",
      );
    });

    /**
     * TEST 15
     * Why: Each card's aria-labelledby must use its own service id. If
     * all three cards produce aria-labelledby="mvp-title", the scaling and
     * audit cards are named by the MVP heading — wrong accessible identity.
     */
    it("audit card aria-labelledby uses 'audit-title'", () => {
      renderCard(auditService);
      expect(screen.getByTestId("card")).toHaveAttribute(
        "aria-labelledby",
        "audit-title",
      );
    });
  });
});

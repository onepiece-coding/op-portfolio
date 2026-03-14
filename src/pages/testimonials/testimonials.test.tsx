/* eslint-disable @typescript-eslint/no-explicit-any */

/**
 * @file src/pages/testimonials/testimonials.test.tsx
 */

import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderWithProviders } from "@/test/i18n-test-utils";
import { screen, within } from "@testing-library/react";
import { useCarousel } from "@/hooks";

import userEvent from "@testing-library/user-event";
import TestimonialsPage from "./index";

// ─── Mocks ────────────────────────────────────────────────────────────────────

// useCarousel controls the active slide — mock it so tests can drive the
// carousel state without relying on DOM focus or real keyboard events.
vi.mock("@/hooks");

// StarRow is decorative and has its own test file.
vi.mock("./star-row", () => ({
  default: () => <div data-testid="star-row" aria-hidden="true" />,
}));

// ─── Helpers ─────────────────────────────────────────────────────────────────

let mockGoNext: any;
let mockGoPrev: any;
let mockGoTo: any;

const renderPage = (index = 0) => {
  mockGoNext = vi.fn();
  mockGoPrev = vi.fn();
  mockGoTo = vi.fn();

  vi.mocked(useCarousel).mockReturnValue({
    index,
    goNext: mockGoNext,
    goPrev: mockGoPrev,
    goTo: mockGoTo,
  });

  return renderWithProviders(<TestimonialsPage />);
};

// ─── Tests ───────────────────────────────────────────────────────────────────

describe("TestimonialsPage", () => {
  let user: ReturnType<typeof userEvent.setup>;

  beforeEach(() => {
    user = userEvent.setup();
    vi.clearAllMocks();
  });

  // ─── 1. Document metadata ─────────────────────────────────────────────────

  describe("Document metadata", () => {
    /**
     * TEST 1
     * Why: The page title is the browser tab label and primary SEO signal.
     * A raw key ("testimonials.pageTitle") visible in the tab would destroy
     * credibility for a client-facing portfolio page.
     */
    it("sets document.title from testimonials.pageTitle", () => {
      renderPage();
      expect(document.title).toBe(
        "Testimonials — Real Clients & Results | OnePiece Coding",
      );
    });

    /**
     * TEST 2
     * Why: The meta description feeds search engine snippets. An empty string
     * or raw key removes the page from meaningful search results.
     */
    it("renders a non-empty meta description without raw i18n keys", () => {
      renderPage();
      const meta = document.querySelector("meta[name='description']");
      expect(meta).not.toBeNull();
      expect(meta?.getAttribute("content")).not.toMatch(/^testimonials\./);
      expect(meta?.getAttribute("content")?.length).toBeGreaterThan(10);
    });
  });

  // ─── 2. Section structure ─────────────────────────────────────────────────

  describe("Section structure", () => {
    /**
     * TEST 3
     * Why: The section needs id="testimonials" for anchor links and
     * aria-labelledby="testimonials-heading" for a named landmark. Without
     * both, AT users cannot navigate directly to this section.
     */
    it("renders section with id='testimonials' and aria-labelledby='testimonials-heading'", () => {
      renderPage();
      const section = document.getElementById("testimonials");
      expect(section).not.toBeNull();
      expect(section).toHaveAttribute(
        "aria-labelledby",
        "testimonials-heading",
      );
    });

    /**
     * TEST 4
     * Why: The h1 must have id="testimonials-heading" so aria-labelledby
     * resolves, and the correct translated text so the page's heading is
     * meaningful to sighted and AT users alike.
     */
    it("renders h1 with id='testimonials-heading' and correct text", () => {
      renderPage();
      const h1 = screen.getByRole("heading", { level: 1 });
      expect(h1).toHaveAttribute("id", "testimonials-heading");
      expect(h1).toHaveTextContent(
        "What our clients say — real projects, real feedback.",
      );
    });

    /**
     * TEST 5
     * Why: The lead paragraph frames the testimonials section for visitors.
     * A missing translation silently removes context about the diversity of
     * client types featured.
     */
    it("renders the lead paragraph from i18n", () => {
      renderPage();
      expect(
        screen.getByText(/From booking systems to inventory management/),
      ).toBeInTheDocument();
    });

    /**
     * TEST 6
     * Why: The footer note is the social proof meta-copy ("genuine quotes
     * from real clients"). A missing key leaves a blank paragraph that
     * undermines the credibility the section is designed to build.
     */
    it("renders the footer note from i18n", () => {
      renderPage();
      expect(
        screen.getByText(/These are genuine quotes from real clients/),
      ).toBeInTheDocument();
    });
  });

  // ─── 3. Carousel region ───────────────────────────────────────────────────

  describe("Carousel region", () => {
    /**
     * TEST 7
     * Why: The carousel wrapper must have aria-roledescription="carousel"
     * so assistive technologies announce it as a carousel, not a generic
     * container. Without this, AT users have no context for the tabpanel
     * pattern inside it.
     */
    it("carousel wrapper has aria-roledescription='carousel'", () => {
      renderPage();
      const wrapper = document.querySelector(
        '[aria-roledescription="carousel"]',
      );
      expect(wrapper).not.toBeNull();
    });

    /**
     * TEST 8
     * Why: The carousel wrapper's aria-label must come from i18n. Without
     * an accessible name the carousel is an anonymous region — screen reader
     * users cannot tell what the carousel contains before entering it.
     */
    it("carousel wrapper has aria-label 'Client testimonials' from i18n", () => {
      renderPage();
      const wrapper = document.querySelector(
        '[aria-roledescription="carousel"]',
      );
      expect(wrapper?.getAttribute("aria-label")).toBe("Client testimonials");
    });

    /**
     * TEST 9
     * Why: The carousel must render exactly 3 tabpanels — one per testimonial.
     * queryAllByRole is needed because inactive panels have aria-hidden="true"
     * which excludes them from getByRole, so we use DOM directly.
     */
    it("renders 3 tabpanel articles in the DOM", () => {
      renderPage();
      const panels = document.querySelectorAll('[role="tabpanel"]');
      expect(panels).toHaveLength(3);
    });
  });

  // ─── 4. Active card (index = 0) ───────────────────────────────────────────

  describe("Active card — Ahmed (index=0)", () => {
    /**
     * TEST 10
     * Why: The active card must have aria-hidden="false" so its content is
     * in the accessibility tree. If the active card has aria-hidden="true",
     * screen reader users cannot access any testimonial content at all.
     */
    it("active card (index=0) has aria-hidden='false' and tabIndex=0", () => {
      renderPage(0);
      const ahmedCard = document.getElementById("testimonial-t1");
      expect(ahmedCard).toHaveAttribute("aria-hidden", "false");
      expect(ahmedCard).toHaveAttribute("tabindex", "0");
    });

    /**
     * TEST 11
     * Why: The active card must be findable by role="tabpanel" — it is the
     * only accessible tabpanel since the others have aria-hidden="true".
     * This confirms the ARIA tab pattern renders correctly for AT.
     */
    it("only the active card is reachable via getByRole('tabpanel')", () => {
      renderPage(0);
      // getByRole respects aria-hidden — returns only the one active panel
      expect(screen.getByRole("tabpanel")).toHaveAttribute(
        "id",
        "testimonial-t1",
      );
    });

    /**
     * TEST 12
     * Why: Ahmed's quote must render inside the active card. The quote comes
     * from i18n via his translationKey — a wrong key would show a different
     * client's quote on the wrong card.
     */
    it("renders Ahmed's quote inside the active tabpanel", () => {
      renderPage(0);
      const panel = screen.getByRole("tabpanel");
      expect(
        within(panel).getByText(/The booking system they built/),
      ).toBeInTheDocument();
    });

    /**
     * TEST 13
     * Why: The client name "Ahmed Iben Daoud" is rendered directly from
     * TESTIMONIALS data — not through i18n. This verifies the data prop
     * flows correctly to the DOM, not through the translation pipeline.
     */
    it("renders Ahmed's name from data (not i18n) inside the active card", () => {
      renderPage(0);
      const panel = screen.getByRole("tabpanel");
      expect(within(panel).getByText("Ahmed Iben Daoud")).toBeInTheDocument();
    });

    /**
     * TEST 14
     * Why: The avatar shows getInitials("Ahmed Iben Daoud") = "AI" and must
     * be aria-hidden. Without aria-hidden the initials are announced before
     * the client's full name, producing "AI Ahmed Iben Daoud" for AT users.
     */
    it("avatar shows correct initials and is aria-hidden", () => {
      renderPage(0);
      const avatar = screen.getByText("AI").closest("[aria-hidden='true']");
      expect(avatar).not.toBeNull();
    });
  });

  // ─── 5. Inactive cards ────────────────────────────────────────────────────

  describe("Inactive cards", () => {
    /**
     * TEST 15
     * Why: Inactive cards must have aria-hidden="true" and tabIndex=-1.
     * Without aria-hidden, AT users would navigate through all three cards
     * simultaneously rather than seeing only the active one.
     */
    it("inactive cards have aria-hidden='true' and tabIndex=-1", () => {
      renderPage(0);
      const mustapha = document.getElementById("testimonial-t2");
      const asma = document.getElementById("testimonial-t3");
      expect(mustapha).toHaveAttribute("aria-hidden", "true");
      expect(mustapha).toHaveAttribute("tabindex", "-1");
      expect(asma).toHaveAttribute("aria-hidden", "true");
      expect(asma).toHaveAttribute("tabindex", "-1");
    });

    /**
     * TEST 16
     * Why: When index changes to 1, the second card becomes active and the
     * first becomes inactive. This confirms the active/inactive logic is
     * driven by the index value — not hardcoded to the first card.
     */
    it("renders Mustapha's card as active when index=1", () => {
      renderPage(1);
      const panel = screen.getByRole("tabpanel");
      expect(panel).toHaveAttribute("id", "testimonial-t2");
      expect(within(panel).getByText(/tracking stock/)).toBeInTheDocument();
    });
  });

  // ─── 6. Navigation controls ───────────────────────────────────────────────

  describe("Navigation controls", () => {
    /**
     * TEST 17
     * Why: The previous and next buttons must have descriptive aria-labels
     * from i18n. Icon-only buttons without accessible names are invisible
     * to screen reader users — WCAG 2.4.6 requires descriptive labels.
     */
    it("renders previous and next buttons with correct aria-labels", () => {
      renderPage();
      expect(
        screen.getByRole("button", { name: "Previous testimonial" }),
      ).toBeInTheDocument();
      expect(
        screen.getByRole("button", { name: "Next testimonial" }),
      ).toBeInTheDocument();
    });

    /**
     * TEST 18
     * Why: The tablist must have aria-label "Testimonial navigation". Without
     * a label, the tablist is an anonymous role landmark — AT users cannot
     * identify it as the testimonial navigation control.
     */
    it("tablist has aria-label 'Testimonial navigation'", () => {
      renderPage();
      expect(
        screen.getByRole("tablist", { name: "Testimonial navigation" }),
      ).toBeInTheDocument();
    });

    /**
     * TEST 19
     * Why: There must be exactly 3 tab dots — one per testimonial. A missing
     * dot means a testimonial is unreachable via the dot navigation. An extra
     * dot means a non-existent slide is reachable.
     */
    it("renders exactly 3 tab buttons inside the tablist", () => {
      renderPage();
      const tablist = screen.getByRole("tablist");
      expect(within(tablist).getAllByRole("tab")).toHaveLength(3);
    });

    /**
     * TEST 20
     * Why: The first tab must be aria-selected=true and the others false
     * when index=0. Multiple selected tabs simultaneously would mean users
     * cannot tell which testimonial is currently shown.
     */
    it("first tab is aria-selected='true', others are 'false' at index=0", () => {
      renderPage(0);
      const tablist = screen.getByRole("tablist");
      const tabs = within(tablist).getAllByRole("tab");
      expect(tabs[0]).toHaveAttribute("aria-selected", "true");
      expect(tabs[1]).toHaveAttribute("aria-selected", "false");
      expect(tabs[2]).toHaveAttribute("aria-selected", "false");
    });

    /**
     * TEST 21
     * Why: Each tab must have aria-controls referencing its tabpanel's id.
     * This is the ARIA relationship that links the dot to its slide — without
     * it, the tab widget is semantically incomplete.
     */
    it("first tab has aria-controls='testimonial-t1'", () => {
      renderPage();
      const tablist = screen.getByRole("tablist");
      const firstTab = within(tablist).getAllByRole("tab")[0];
      expect(firstTab).toHaveAttribute("aria-controls", "testimonial-t1");
    });

    /**
     * TEST 22
     * Why: Each tab dot must have a descriptive aria-label from i18n. Without
     * it, the dots are anonymous buttons — screen reader users cannot tell
     * which testimonial each dot navigates to.
     */
    it("tab dots have descriptive aria-labels from i18n", () => {
      renderPage();
      expect(
        screen.getByRole("tab", {
          name: "Go to testimonial by Ahmed Iben Daoud",
        }),
      ).toBeInTheDocument();
      expect(
        screen.getByRole("tab", {
          name: "Go to testimonial by Mustapha Bougermez",
        }),
      ).toBeInTheDocument();
      expect(
        screen.getByRole("tab", {
          name: "Go to testimonial by Asma Ben Baali",
        }),
      ).toBeInTheDocument();
    });
  });

  // ─── 7. Interaction ───────────────────────────────────────────────────────

  describe("Interaction", () => {
    /**
     * TEST 23
     * Why: Clicking the next button must call goNext. Without this, the next
     * button renders but does nothing — the carousel is visually present but
     * non-functional.
     */
    it("clicking the next button calls goNext", async () => {
      renderPage();
      await user.click(
        screen.getByRole("button", { name: "Next testimonial" }),
      );
      expect(mockGoNext).toHaveBeenCalledTimes(1);
    });

    /**
     * TEST 24
     * Why: Clicking the previous button must call goPrev. Without this, the
     * previous button is a dead end — users can advance but not go back.
     */
    it("clicking the previous button calls goPrev", async () => {
      renderPage();
      await user.click(
        screen.getByRole("button", { name: "Previous testimonial" }),
      );
      expect(mockGoPrev).toHaveBeenCalledTimes(1);
    });

    /**
     * TEST 25
     * Why: Clicking the second dot must call goTo(1). If goTo is called with
     * the wrong index, the user clicks Mustapha's dot but sees a different
     * testimonial — a silent and confusing navigation bug.
     */
    it("clicking the second dot calls goTo(1)", async () => {
      renderPage();
      await user.click(
        screen.getByRole("tab", {
          name: "Go to testimonial by Mustapha Bougermez",
        }),
      );
      expect(mockGoTo).toHaveBeenCalledWith(1);
    });

    /**
     * TEST 26
     * Why: Clicking the third dot must call goTo(2). Each dot must map to its
     * own index — a bug where all dots call goTo(0) would make the second and
     * third dots silently non-functional.
     */
    it("clicking the third dot calls goTo(2)", async () => {
      renderPage();
      await user.click(
        screen.getByRole("tab", {
          name: "Go to testimonial by Asma Ben Baali",
        }),
      );
      expect(mockGoTo).toHaveBeenCalledWith(2);
    });
  });

  // ─── 8. CTAs ──────────────────────────────────────────────────────────────

  describe("CTA buttons", () => {
    /**
     * TEST 27
     * Why: The primary CTA links to /contact and must show the translated
     * text. This is the main conversion point from social proof to the
     * contact funnel — a wrong href silently kills the conversion path.
     */
    it("renders the primary CTA linking to /contact", () => {
      renderPage();
      const cta = screen.getByRole("link", { name: "Start a technical brief" });
      expect(cta).toHaveAttribute("href", "/contact");
    });

    /**
     * TEST 28
     * Why: The ghost CTA must link to /projects. Visitors who want to see
     * work samples after reading testimonials need this secondary escape
     * route — a wrong href routes them to the wrong page.
     */
    it("renders the ghost CTA linking to /projects", () => {
      renderPage();
      const cta = screen.getByRole("link", { name: "See our projects" });
      expect(cta).toHaveAttribute("href", "/projects");
    });
  });

  // ─── 9. i18n guard ────────────────────────────────────────────────────────

  /**
   * TEST 29
   * Why: No raw i18n key may appear anywhere in the section. Every text node
   * in TestimonialsPage comes from t() — a single broken key ("testimonials.xyz")
   * would be visible to all sighted visitors on this high-credibility page.
   */
  it("renders no raw i18n keys in the section text content", () => {
    renderPage();
    const section = document.getElementById("testimonials")!;
    expect(section.textContent).not.toMatch(/\btestimonials\.\w+/);
  });
});

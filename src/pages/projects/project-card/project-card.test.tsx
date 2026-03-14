/**
 * @file src/pages/projects/project-card/project-card.test.tsx
 */

import { renderWithProviders } from "@/test/i18n-test-utils";
import { describe, it, expect, vi } from "vitest";
import { screen } from "@testing-library/react";

import ProjectCard from "./index";

// ─── Mocks ────────────────────────────────────────────────────────────────────

// Card forwards ariaLabelledby and as so aria + list-item semantics still work.
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
  Badge: ({ label }: { label: string }) => <li data-testid="badge">{label}</li>,
}));

// ─── Fixtures ─────────────────────────────────────────────────────────────────

const opBlogProject = {
  id: "op-blog",
  tech: [
    "React",
    "TypeScript",
    "Node.js",
    "Express.js",
    "MongoDB",
    "Jest/Vitest",
  ],
  githubRepoUrl: "https://github.com/onepiece-coding/OP-Blog",
  liveDemoUrl: "https://op-blog-mo4u.onrender.com/",
} as const;

const renderCard = () =>
  renderWithProviders(<ProjectCard project={opBlogProject} />);

// ─── Tests ───────────────────────────────────────────────────────────────────

describe("ProjectCard", () => {
  // ─── 1. Rendering ──────────────────────────────────────────────────────────

  describe("Rendering", () => {
    /**
     * TEST 1
     * Why: The project title is the h2 that anchors the card's aria-labelledby
     * relationship and is the primary visible heading. It must come from i18n
     * so language switches update it — not be hardcoded from project.id.
     */
    it("renders the project title as an h2 from i18n", () => {
      renderCard();
      const h2 = screen.getByRole("heading", { level: 2 });
      expect(h2).toHaveTextContent("OP Blog — Production-Ready Full-Stack CMS");
    });

    /**
     * TEST 2
     * Why: The h2 must have id="${project.id}-title" so the Card's
     * aria-labelledby can reference it. A wrong or missing id breaks the
     * aria relationship — the card article has no accessible name.
     */
    it("h2 has id matching the project.id-title pattern", () => {
      renderCard();
      const h2 = screen.getByRole("heading", { level: 2 });
      expect(h2).toHaveAttribute("id", "op-blog-title");
    });

    /**
     * TEST 3
     * Why: The summary paragraph is the project's elevator pitch. It comes
     * from i18n — a missing translation key silently removes the most
     * informative prose on the project card.
     */
    it("renders the project summary from i18n", () => {
      renderCard();
      expect(
        screen.getByText(
          /A full-stack blog platform built for real content operations/,
        ),
      ).toBeInTheDocument();
    });

    /**
     * TEST 4
     * Why: The "Key Features" h3 must render from i18n. Without it the
     * feature groups section has no heading — the semantic hierarchy is
     * broken and the groups appear as unlabelled content blocks.
     */
    it("renders the 'Key Features' h3 from i18n", () => {
      renderCard();
      const h3 = screen.getByRole("heading", { level: 3 });
      expect(h3).toHaveTextContent("Key Features");
    });
  });

  // ─── 2. Tech badges ────────────────────────────────────────────────────────

  describe("Tech badges", () => {
    /**
     * TEST 5
     * Why: Every tech string in project.tech must render a Badge. The
     * op-blog project has 6 tech items — a count mismatch means the tech
     * stack shown on the card is incomplete or duplicated.
     */
    it("renders one Badge per tech item", () => {
      renderCard();
      const badges = screen.getAllByTestId("badge");
      expect(badges).toHaveLength(opBlogProject.tech.length);
    });

    /**
     * TEST 6
     * Why: Badge labels must match the tech array values exactly. "Jest/Vitest"
     * is an unusual slash-separated value — a transformation that strips the
     * second part would silently misrepresent the project's testing stack.
     */
    it("renders the correct label for each tech Badge", () => {
      renderCard();
      opBlogProject.tech.forEach((techName) => {
        expect(screen.getByText(techName)).toBeInTheDocument();
      });
    });

    /**
     * TEST 7
     * Why: The tech badge list must have aria-label "Technologies used".
     * Without it, the <ul> is an unlabelled list alongside the feature
     * group lists — screen reader users cannot distinguish them.
     */
    it("tech badge list has aria-label 'Technologies used'", () => {
      renderCard();
      const techList = screen.getByRole("list", { name: "Technologies used" });
      expect(techList).toBeInTheDocument();
    });
  });

  // ─── 3. Feature groups (returnObjects) ────────────────────────────────────

  describe("Feature groups", () => {
    /**
     * TEST 8
     * Why: groups is fetched with returnObjects: true — if this flag is
     * missing or the i18n key is wrong, t() returns a string and .map()
     * throws. This test confirms groups rendered correctly as an array.
     */
    it("renders all feature group headings from the groups array", () => {
      renderCard();
      expect(screen.getByText("User & Profile Management")).toBeInTheDocument();
      expect(screen.getByText("Admin Suite")).toBeInTheDocument();
    });

    /**
     * TEST 9
     * Why: Each feature within a group must render its name and description.
     * The name is bolded inline — both parts must appear. A regression that
     * only renders names (not descriptions) silently removes the explanatory
     * text from every feature bullet.
     */
    it("renders feature names and descriptions within each group", () => {
      renderCard();
      // Feature name
      expect(screen.getByText(/Dynamic Profiles/)).toBeInTheDocument();
      // Feature description
      expect(
        screen.getByText(/Users update bios and upload profile photos/),
      ).toBeInTheDocument();
    });

    /**
     * TEST 10
     * Why: "Zero-Dependency Toasts" is a feature in the first group.
     * Its presence confirms the full feature array within a group is
     * iterated — not just the first feature.
     */
    it("renders all features within the first group, not just the first", () => {
      renderCard();
      expect(screen.getByText(/Zero-Dependency Toasts/)).toBeInTheDocument();
      expect(
        screen.getByText(/Custom notification system/),
      ).toBeInTheDocument();
    });

    /**
     * TEST 11
     * Why: Feature names must be rendered as <strong> elements so they are
     * visually distinct from descriptions. Without the <strong> tag the
     * name and description blur into one unpunctuated run of text.
     */
    it("renders feature names inside <strong> elements", () => {
      renderCard();
      const strongs = document.querySelectorAll("strong");
      const featureStrongs = Array.from(strongs).filter(
        (s) => s.textContent === "Dynamic Profiles: ",
      );
      expect(featureStrongs.length).toBeGreaterThanOrEqual(1);
    });
  });

  // ─── 4. External links ────────────────────────────────────────────────────

  describe("External links", () => {
    /**
     * TEST 12
     * Why: The GitHub link must point to the exact URL from project.githubRepoUrl.
     * A wrong href silently routes visitors to a 404 or unrelated repository —
     * damaging credibility precisely where the studio wants to show its code.
     */
    it("GitHub link has the correct href from project.githubRepoUrl", () => {
      renderCard();
      const githubLink = screen.getByRole("link", {
        name: /GitHub repository/i,
      });
      expect(githubLink).toHaveAttribute(
        "href",
        "https://github.com/onepiece-coding/OP-Blog",
      );
    });

    /**
     * TEST 13
     * Why: The live demo link must point to the exact liveDemoUrl. A broken
     * demo URL — possibly from a stale data entry — silently routes to a
     * non-existent deploy, undermining the project's showcase value.
     */
    it("live demo link has the correct href from project.liveDemoUrl", () => {
      renderCard();
      const demoLink = screen.getByRole("link", { name: /Live demo/i });
      expect(demoLink).toHaveAttribute(
        "href",
        "https://op-blog-mo4u.onrender.com/",
      );
    });

    /**
     * TEST 14
     * Why: Both links use target="_blank". Without this, clicking either
     * link navigates the portfolio tab away — visitors lose their place and
     * must use the back button to return to the portfolio.
     */
    it("both external links have target='_blank'", () => {
      renderCard();
      const githubLink = screen.getByRole("link", {
        name: /GitHub repository/i,
      });
      const demoLink = screen.getByRole("link", { name: /Live demo/i });
      expect(githubLink).toHaveAttribute("target", "_blank");
      expect(demoLink).toHaveAttribute("target", "_blank");
    });

    /**
     * TEST 15
     * Why: Both links need rel="noopener noreferrer". target="_blank" without
     * this allows the linked page to access window.opener — a reverse
     * tabnapping vulnerability that lets external sites redirect the portfolio.
     */
    it("both external links have rel='noopener noreferrer'", () => {
      renderCard();
      [
        screen.getByRole("link", { name: /GitHub repository/i }),
        screen.getByRole("link", { name: /Live demo/i }),
      ].forEach((link) => {
        expect(link).toHaveAttribute("rel", "noopener noreferrer");
      });
    });

    /**
     * TEST 16
     * Why: The aria-label on each link is composed from the translated title
     * string — NOT from a raw i18n key. The pattern is `${title} — GitHub
     * repository` and `${title} — Live demo`. Without the title prefix, both
     * links on a page with multiple cards would have identical labels.
     */
    it("GitHub link aria-label includes the project title", () => {
      renderCard();
      const githubLink = screen.getByRole("link", {
        name: /GitHub repository/,
      });
      expect(githubLink.getAttribute("aria-label")).toContain(
        "OP Blog — Production-Ready Full-Stack CMS",
      );
    });

    /**
     * TEST 17
     * Why: Same as test 16 for the demo link. The label must include the
     * project title so screen reader users can distinguish "OP Blog — Live
     * demo" from any other project's live demo link on the same page.
     */
    it("demo link aria-label includes the project title", () => {
      renderCard();
      const demoLink = screen.getByRole("link", { name: /Live demo/ });
      expect(demoLink.getAttribute("aria-label")).toContain(
        "OP Blog — Production-Ready Full-Stack CMS",
      );
    });

    /**
     * TEST 18
     * Why: The link text must come from i18n ("View on GitHub" / "View live
     * demo") — not be hardcoded. If the keys are missing the links render
     * with raw key text, which is meaningless to sighted users.
     */
    it("renders the correct i18n link text for GitHub and demo", () => {
      renderCard();
      expect(screen.getByText("View on GitHub")).toBeInTheDocument();
      expect(screen.getByText("View live demo")).toBeInTheDocument();
    });
  });

  // ─── 5. Accessibility ─────────────────────────────────────────────────────

  describe("Accessibility", () => {
    /**
     * TEST 19
     * Why: The card's aria-labelledby must reference the h2's id. This gives
     * the <li> card its accessible name when AT users navigate by list items
     * or article landmarks — without it the card is anonymous.
     */
    it("card has aria-labelledby='op-blog-title'", () => {
      renderCard();
      const card = screen.getByTestId("card");
      expect(card).toHaveAttribute("aria-labelledby", "op-blog-title");
    });

    /**
     * TEST 20
     * Why: No link may have a raw i18n key as its aria-label. Both link
     * labels are composed from a translated string + a suffix — a broken
     * t() call would produce "projects.items.op-blog.title — GitHub repository"
     * which is an embarrassing machine-readable string in production.
     */
    it("no link has a raw i18n key in its aria-label", () => {
      renderCard();
      screen.getAllByRole("link").forEach((link) => {
        expect(link.getAttribute("aria-label")).not.toMatch(/projects\.\w/);
      });
    });
  });
});

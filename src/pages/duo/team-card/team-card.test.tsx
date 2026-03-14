/**
 * @file src/pages/duo/team-card/team-card.test.tsx
 */

import { renderWithProviders } from "@/test/i18n-test-utils";
import { describe, it, expect, vi } from "vitest";
import { screen } from "@testing-library/react";

import TeamCard from "./index";

// ─── Mocks ────────────────────────────────────────────────────────────────────

// Isolate TeamCard from Card and Badge — both have their own test files.
// Card is replaced with a plain <article> that forwards ariaLabelledby so
// aria relationship tests still work without CSS Module class resolution.
vi.mock("@/components/ui", () => ({
  Card: ({
    children,
    ariaLabelledby,
  }: {
    children: React.ReactNode;
    ariaLabelledby?: string;
  }) => (
    <article
      data-testid="card"
      {...(ariaLabelledby ? { "aria-labelledby": ariaLabelledby } : {})}
    >
      {children}
    </article>
  ),
  Badge: ({ label }: { label: string }) => <li data-testid="badge">{label}</li>,
}));

// getInitials is tested separately — here we just verify TeamCard calls it
// correctly via the rendered output, no need to mock it.

// ─── Helpers ──────────────────────────────────────────────────────────────────

const lahcenProps = {
  translationKey: "lahcen" as const,
  initials: "LA",
  tech: ["React", "TypeScript", "Redux Toolkit"],
};

const mohamedProps = {
  translationKey: "mohamed" as const,
  initials: "MB",
  tech: ["Node.js", "Express.js", "MongoDB"],
};

// ─── Tests ────────────────────────────────────────────────────────────────────

describe("TeamCard", () => {
  // ─── 1. Rendering ──────────────────────────────────────────────────────────

  describe("Rendering", () => {
    /**
     * TEST 1
     * Why: The member's name is the primary identity text on the card and
     * doubles as the h2 for screen reader navigation. It comes from i18n —
     * not from a prop — so a key regression would silently blank the name.
     */
    it("renders the member name from i18n as an h2", () => {
      renderWithProviders(<TeamCard {...lahcenProps} />);
      const heading = screen.getByRole("heading", { level: 2 });
      expect(heading).toHaveTextContent("Lahcen Alhiane");
    });

    /**
     * TEST 2
     * Why: The role/title line is the second most important piece of identity
     * text. It communicates the member's specialisation — if it disappears,
     * both cards read only as names with no context.
     */
    it("renders the member title from i18n", () => {
      renderWithProviders(<TeamCard {...lahcenProps} />);
      expect(
        screen.getByText("Frontend Lead — React & TypeScript"),
      ).toBeInTheDocument();
    });

    /**
     * TEST 3
     * Why: The bio paragraph is the detailed description of each member's
     * approach. A missing bio silently removes the most persuasive copy on
     * the Duo page — it is the primary sales text for each specialist.
     */
    it("renders the member bio from i18n", () => {
      renderWithProviders(<TeamCard {...lahcenProps} />);
      expect(
        screen.getByText(/Lahcen builds pixel-accurate/),
      ).toBeInTheDocument();
    });

    /**
     * TEST 4
     * Why: All three responsibility items must render. These are the
     * bulleted outcomes each member delivers — a regression that drops resp3
     * would silently hide "Accessibility compliance and UX fidelity".
     */
    it("renders all three responsibility items from i18n", () => {
      renderWithProviders(<TeamCard {...lahcenProps} />);
      expect(
        screen.getByText("Component architecture & design system"),
      ).toBeInTheDocument();
      expect(
        screen.getByText("Bundle optimisation and Core Web Vitals"),
      ).toBeInTheDocument();
      expect(
        screen.getByText("Accessibility compliance and UX fidelity"),
      ).toBeInTheDocument();
    });

    /**
     * TEST 5
     * Why: Each tech item in the array must produce a Badge. If any badge
     * is missing, the tech stack section shows an incomplete list — a subtle
     * but immediately visible layout gap.
     */
    it("renders one Badge per tech item", () => {
      renderWithProviders(<TeamCard {...lahcenProps} />);
      const badges = screen.getAllByTestId("badge");
      expect(badges).toHaveLength(lahcenProps.tech.length);
    });

    /**
     * TEST 6
     * Why: Badge text must match the tech array values exactly. Wrong labels
     * would misrepresent the studio's technical capabilities on the portfolio.
     */
    it("renders the correct label for each Badge", () => {
      renderWithProviders(<TeamCard {...lahcenProps} />);
      lahcenProps.tech.forEach((techName) => {
        expect(screen.getByText(techName)).toBeInTheDocument();
      });
    });
  });

  // ─── 2. Avatar initials ────────────────────────────────────────────────────

  describe("Avatar initials", () => {
    /**
     * TEST 7
     * Why: When the `initials` prop is provided it must be used as-is.
     * The TEAM_MEMBERS data provides pre-computed "LA" and "MB" — if these
     * are ignored the avatar would recompute from the i18n name, which is
     * fine but the prop contract would be silently broken.
     */
    it("displays the initials prop when provided", () => {
      renderWithProviders(<TeamCard {...lahcenProps} />);
      // The avatar is aria-hidden — query by text, not role
      expect(screen.getByText("LA")).toBeInTheDocument();
    });

    /**
     * TEST 8
     * Why: When no initials prop is given, getInitials(name) must be called
     * with the translated name. This is the fallback path — it must produce
     * a sensible two-letter initial rather than crash or show blank.
     */
    it("falls back to getInitials(name) when initials prop is omitted", () => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { initials, ...propsWithoutInitials } = lahcenProps;
      renderWithProviders(<TeamCard {...propsWithoutInitials} />);
      // getInitials("Lahcen Alhiane") → "LA"
      expect(screen.getByText("LA")).toBeInTheDocument();
    });
  });

  // ─── 3. Accessibility ─────────────────────────────────────────────────────

  describe("Accessibility", () => {
    /**
     * TEST 9
     * Why: The card's aria-labelledby must reference the h2 id. This is what
     * gives the <article> landmark its accessible name — screen readers
     * announce the member's name when landing on the card.
     */
    it("card has aria-labelledby matching the h2 id", () => {
      renderWithProviders(<TeamCard {...lahcenProps} />);
      const card = screen.getByTestId("card");
      const h2 = screen.getByRole("heading", { level: 2 });
      expect(card).toHaveAttribute("aria-labelledby", h2.id);
    });

    /**
     * TEST 10
     * Why: The headingId is derived from the translated name, not the data
     * id. For "Lahcen Alhiane" the expected id is "lahcen-alhiane". If the
     * derivation changes, aria-labelledby and the h2 id fall out of sync —
     * the aria relationship is silently broken.
     */
    it("h2 id is derived from the translated name with hyphens", () => {
      renderWithProviders(<TeamCard {...lahcenProps} />);
      const h2 = screen.getByRole("heading", { level: 2 });
      expect(h2).toHaveAttribute("id", "lahcen-alhiane");
    });

    /**
     * TEST 11
     * Why: The tech list must have an accessible label. Without aria-label
     * the <ul> is an unlabelled list — screen reader users cannot tell whether
     * it contains tech, responsibilities, or something else.
     */
    it("tech badge list has aria-label 'Technologies'", () => {
      renderWithProviders(<TeamCard {...lahcenProps} />);
      expect(
        screen.getByRole("list", { name: "Technologies" }),
      ).toBeInTheDocument();
    });

    /**
     * TEST 12
     * Why: The avatar container must be aria-hidden. It shows initials that
     * duplicate the h2 name — without aria-hidden the screen reader would
     * announce "LA" immediately before "Lahcen Alhiane", confusing users.
     */
    it("avatar container is aria-hidden", () => {
      renderWithProviders(<TeamCard {...lahcenProps} />);
      const avatar = screen.getByText("LA").closest("[aria-hidden='true']");
      expect(avatar).not.toBeNull();
    });
  });

  // ─── 4. Mohamed card ──────────────────────────────────────────────────────

  describe("Mohamed card", () => {
    /**
     * TEST 13
     * Why: The second team member must render correctly with different i18n
     * keys and tech data. This guards against a copy-paste error in
     * translationKey wiring that always renders Lahcen's content twice.
     */
    it("renders Mohamed's name, title, and tech badges correctly", () => {
      renderWithProviders(<TeamCard {...mohamedProps} />);
      expect(screen.getByRole("heading", { level: 2 })).toHaveTextContent(
        "Mohamed Bouderya",
      );
      expect(
        screen.getByText("Backend Lead — Node.js & MongoDB"),
      ).toBeInTheDocument();
      mohamedProps.tech.forEach((techName) => {
        expect(screen.getByText(techName)).toBeInTheDocument();
      });
    });

    /**
     * TEST 14
     * Why: Mohamed's h2 id must be "mohamed-bouderya" — different from
     * Lahcen's. If both cards produce the same id, aria-labelledby on both
     * articles would point to the first h2, giving the second card the wrong
     * accessible name.
     */
    it("derives h2 id as 'mohamed-bouderya' for Mohamed's card", () => {
      renderWithProviders(<TeamCard {...mohamedProps} />);
      expect(screen.getByRole("heading", { level: 2 })).toHaveAttribute(
        "id",
        "mohamed-bouderya",
      );
    });
  });
});

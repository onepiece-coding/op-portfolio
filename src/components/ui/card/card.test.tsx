/**
 * @file src/components/ui/card/card.test.tsx
 */

import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";

import styles from "./styles.module.css";
import Card from "./index";

describe("Card", () => {
  // ─── Rendering ─────────────────────────────────────────────────────────────

  /**
   * TEST 1
   * Why: The default element is <article>, which is a semantic HTML5
   * landmark. Using <article> gives the card independent content context
   * in the accessibility tree — the correct default for team cards.
   */
  it("renders as <article> by default", () => {
    const { container } = render(<Card>content</Card>);
    expect(container.firstChild?.nodeName.toLowerCase()).toBe("article");
  });

  /**
   * TEST 2
   * Why: When cards are rendered inside a <ul> (e.g. project list), they
   * must be <li> elements for valid HTML. Rendering <article> inside <ul>
   * is a DOM validation error and breaks list semantics.
   */
  it("renders as <li> when as='li' is passed", () => {
    const { container } = render(<Card as="li">content</Card>);
    expect(container.firstChild?.nodeName.toLowerCase()).toBe("li");
  });

  /**
   * TEST 3
   * Why: Children must render. Without this guarantee, every page that uses
   * Card for layout (TeamCard, ProjectCard) would silently have blank cards.
   */
  it("renders children inside the element", () => {
    render(
      <Card>
        <span data-testid="child">hello</span>
      </Card>,
    );
    expect(screen.getByTestId("child")).toBeInTheDocument();
  });

  // ─── Accessibility ─────────────────────────────────────────────────────────

  /**
   * TEST 4
   * Why: TeamCard passes ariaLabelledby so the card's accessible name is
   * the team member's name heading. Without this attribute, the <article>
   * is an unnamed landmark — WCAG 4.1.2 violation.
   */
  it("applies aria-labelledby when provided", () => {
    const { container } = render(
      <Card ariaLabelledby="test-heading">content</Card>,
    );
    expect(container.firstChild).toHaveAttribute(
      "aria-labelledby",
      "test-heading",
    );
  });

  /**
   * TEST 5
   * Why: When ariaLabelledby is omitted the attribute must not exist at all
   * — not be set to empty string or undefined. A blank aria-labelledby is
   * worse than no attribute: it points to a non-existent element.
   */
  it("does NOT apply aria-labelledby when not provided", () => {
    const { container } = render(<Card>content</Card>);
    expect(container.firstChild).not.toHaveAttribute("aria-labelledby");
  });

  // ─── CSS variants ──────────────────────────────────────────────────────────

  /**
   * TEST 6
   * Why: The hoverable prop adds a CSS class that enables the lift animation.
   * Without this class TeamCards have no hover feedback — the design system's
   * interactive affordance is silently missing.
   */
  it("applies the hoverable CSS class when hoverable is true", () => {
    const { container } = render(<Card hoverable>content</Card>);
    // The class name is a CSS Module hash — check for substring
    expect(container.firstChild).toHaveClass(styles.cardHoverable);
  });

  /**
   * TEST 7
   * Why: When hoverable is false (default), the animation class must not be
   * present. Adding animation to static cards (footer note, metadata cards)
   * would be an unintended visual regression.
   */
  it("does NOT apply the hoverable class when hoverable is false", () => {
    const { container } = render(<Card>content</Card>);
    expect((container.firstChild as HTMLElement).className).not.toMatch(
      /cardHoverable/,
    );
  });
});

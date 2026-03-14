/**
 * @file src/components/ui/badge/badge.test.tsx
 */

import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";

import Badge from "./index";

describe("Badge", () => {
  // ─── Rendering ─────────────────────────────────────────────────────────────

  /**
   * TEST 1
   * Why: Badge renders as <span> by default. TeamCard renders tech badges as
   * <li> but other consumers may use the default. The default element must be
   * correct so consumers do not need to pass `as` just for the standard case.
   */
  it("renders as <span> by default", () => {
    const { container } = render(<Badge label="React" />);
    expect(container.firstChild?.nodeName.toLowerCase()).toBe("span");
  });

  /**
   * TEST 2
   * Why: TeamCard passes `as="li"` so badges render as list items inside a
   * <ul>. If the polymorphic prop is ignored, the HTML is invalid
   * (<span> inside <ul>) and accessibility tree semantics break.
   */
  it("renders as <li> when as='li' is passed", () => {
    const { container } = render(<Badge label="TypeScript" as="li" />);
    expect(container.firstChild?.nodeName.toLowerCase()).toBe("li");
  });

  /**
   * TEST 3
   * Why: The label is the only visible content of the badge. If it does not
   * render, tech stack and skill tags are blank — an immediately visible
   * regression on every page that uses badges.
   */
  it("renders the label text", () => {
    render(<Badge label="Redux Toolkit" />);
    expect(screen.getByText("Redux Toolkit")).toBeInTheDocument();
  });

  /**
   * TEST 4
   * Why: Both span and li variants must render the same label. This ensures
   * the polymorphic `as` prop does not interfere with text content rendering.
   */
  it("renders the label text when rendered as <li>", () => {
    render(<Badge label="Node.js" as="li" />);
    expect(screen.getByText("Node.js")).toBeInTheDocument();
  });
});

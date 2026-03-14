/**
 * @file src/pages/testimonials/star-row/star-row.test.tsx
 */

import { render } from "@testing-library/react";
import { describe, it, expect } from "vitest";

import StarRow from "./index";

describe("StarRow", () => {
  // ─── 1. Star count ─────────────────────────────────────────────────────────

  /**
   * TEST 1
   * Why: StarRow must always render exactly 5 SVGs regardless of the value
   * prop. Rendering 4 or 6 stars would make the rating system visually
   * inconsistent across testimonial cards.
   */
  it("renders exactly 5 SVG stars", () => {
    const { container } = render(<StarRow />);
    expect(container.querySelectorAll("svg")).toHaveLength(5);
  });

  // ─── 2. Fill logic ─────────────────────────────────────────────────────────

  /**
   * TEST 2
   * Why: With the default value of 5 all stars must be filled. All three
   * real testimonials have rating=5 — this is the path exercised every time
   * TestimonialsPage renders a star row.
   */
  it("fills all 5 stars when value is 5 (default)", () => {
    const { container } = render(<StarRow />);
    const svgs = Array.from(container.querySelectorAll("svg"));
    svgs.forEach((svg) => expect(svg).toHaveAttribute("fill", "currentColor"));
  });

  /**
   * TEST 3
   * Why: For value=3 the first three stars must be filled and the last two
   * must be empty. An off-by-one error here would silently misrepresent a
   * partial rating — showing 4 stars for a 3-star review, or vice versa.
   */
  it("fills the first 3 and leaves the last 2 empty for value=3", () => {
    const { container } = render(<StarRow value={3} />);
    const svgs = Array.from(container.querySelectorAll("svg"));
    [0, 1, 2].forEach((i) =>
      expect(svgs[i]).toHaveAttribute("fill", "currentColor"),
    );
    [3, 4].forEach((i) => expect(svgs[i]).toHaveAttribute("fill", "none"));
  });

  /**
   * TEST 4
   * Why: For value=0 no star must be filled. This is an edge case but a
   * regression that fills star 0 (index 0 of the loop is star=1, which fails
   * 1 <= 0) would show one filled star for a zero-star rating.
   */
  it("leaves all stars empty for value=0", () => {
    const { container } = render(<StarRow value={0} />);
    const svgs = Array.from(container.querySelectorAll("svg"));
    svgs.forEach((svg) => expect(svg).toHaveAttribute("fill", "none"));
  });

  /**
   * TEST 5
   * Why: value=1 must fill exactly the first star. This tests the boundary
   * of the `star <= value` condition — only star 1 satisfies 1 <= 1, the
   * rest (2-5) fail 2 <= 1 through 5 <= 1.
   */
  it("fills exactly 1 star for value=1", () => {
    const { container } = render(<StarRow value={1} />);
    const svgs = Array.from(container.querySelectorAll("svg"));
    expect(svgs[0]).toHaveAttribute("fill", "currentColor");
    [1, 2, 3, 4].forEach((i) =>
      expect(svgs[i]).toHaveAttribute("fill", "none"),
    );
  });

  // ─── 3. Accessibility ─────────────────────────────────────────────────────

  /**
   * TEST 6
   * Why: The outer wrapper div must have aria-hidden="true". StarRow is
   * purely decorative — without hiding the container, screen readers would
   * encounter an unlabelled group of 5 SVG nodes before every testimonial
   * author block.
   */
  it("outer wrapper div has aria-hidden='true'", () => {
    const { container } = render(<StarRow />);
    expect(container.firstElementChild).toHaveAttribute("aria-hidden", "true");
  });

  /**
   * TEST 7
   * Why: Each individual SVG must also have aria-hidden="true". Some AT
   * implementations traverse SVG children independently — a missing
   * aria-hidden on the SVGs would still announce each star element to
   * blind users even when the container is hidden.
   */
  it("every SVG star has aria-hidden='true'", () => {
    const { container } = render(<StarRow />);
    container
      .querySelectorAll("svg")
      .forEach((svg) => expect(svg).toHaveAttribute("aria-hidden", "true"));
  });
});

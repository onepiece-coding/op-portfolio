/**
 * @file src/components/ui/spinner/spinner.test.tsx
 */

import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";

import styles from "./styles.module.css";
import Spinner from "./index";

describe("Spinner", () => {
  // ─── 1. Rendering ──────────────────────────────────────────────────────────

  /**
   * TEST 1
   * Why: The spinner must render with role="status" so assistive technologies
   * know this region will update dynamically. Without the role, a screen
   * reader has no way to announce that a loading operation is in progress.
   */
  it("renders a div with role='status'", () => {
    render(<Spinner />);
    expect(screen.getByRole("status")).toBeInTheDocument();
  });

  /**
   * TEST 2
   * Why: aria-label="Loading" gives the status region an accessible name.
   * Without it, AT announces the role but not what is loading — the element
   * is identifiable by role alone but lacks descriptive context.
   */
  it("has aria-label='Loading'", () => {
    render(<Spinner />);
    expect(screen.getByRole("status")).toHaveAttribute("aria-label", "Loading");
  });

  /**
   * TEST 3
   * Why: The visually-hidden span must contain "Loading..." so screen readers
   * that ignore aria-label still have fallback text to announce. Without it,
   * blind users on some AT implementations receive no loading feedback at all.
   */
  it("renders a visually-hidden 'Loading...' span for AT fallback", () => {
    render(<Spinner />);
    const span = screen.getByText("Loading...");
    expect(span).toBeInTheDocument();
    expect(span).toHaveClass("visually-hidden");
  });

  // ─── 2. Size variants ─────────────────────────────────────────────────────

  /**
   * TEST 4
   * Why: The default size must be "md". This is the size rendered by
   * WithSuspense (tested previously with size="md") — if the default
   * changes, the page loading state silently changes size for all lazy routes.
   */
  it("applies the 'md' CSS class by default", () => {
    render(<Spinner />);
    expect(screen.getByRole("status")).toHaveClass(styles.md);
  });

  /**
   * TEST 5
   * Why: Passing size="sm" must apply the "sm" CSS class. The WithSuspense
   * tests assert size="md" is passed — this confirms the prop is actually
   * wired through, not ignored.
   */
  it("applies the 'sm' CSS class for size='sm'", () => {
    render(<Spinner size="sm" />);
    expect(screen.getByRole("status")).toHaveClass(styles.sm);
  });

  /**
   * TEST 6
   * Why: size="lg" must apply the "lg" class. All three size variants must
   * work — an off-by-one in the CSS Module lookup (e.g. styles["lg"]
   * resolving to undefined) would silently produce no size class.
   */
  it("applies the 'lg' CSS class for size='lg'", () => {
    render(<Spinner size="lg" />);
    expect(screen.getByRole("status")).toHaveClass(styles.lg);
  });

  /**
   * TEST 7
   * Why: Exactly one size class must be present at a time. If the className
   * template accidentally concatenates both the default and the prop value,
   * the element would have two conflicting size classes — a visual regression
   * that is hard to spot without this assertion.
   */
  it("has exactly one size class applied at a time", () => {
    const { rerender } = render(<Spinner size="sm" />);
    const el = screen.getByRole("status");

    const countSizeClasses = (className: string) =>
      ["sm", "md", "lg"].filter((s) => className.includes(s)).length;

    expect(countSizeClasses(el.className)).toBe(1);

    rerender(<Spinner size="lg" />);
    expect(countSizeClasses(el.className)).toBe(1);
  });

  // ─── 3. className prop ────────────────────────────────────────────────────

  /**
   * TEST 8
   * Why: The className prop must be appended to the element's class list.
   * WithSuspense or any consumer may need to add positioning utilities
   * (e.g. "mx-auto") — without forwarding className those styles never apply.
   */
  it("appends a custom className when provided", () => {
    render(<Spinner className="mx-auto" />);
    expect(screen.getByRole("status").className).toContain("mx-auto");
  });

  /**
   * TEST 9
   * Why: When no className is passed, the default is an empty string which
   * must not introduce a stray space or undefined into the class attribute.
   * A className of "spinner md undefined" would fail style lookups in
   * browsers that do exact class matching.
   */
  it("does not include 'undefined' in className when prop is omitted", () => {
    render(<Spinner />);
    expect(screen.getByRole("status").className).not.toContain("undefined");
  });
});

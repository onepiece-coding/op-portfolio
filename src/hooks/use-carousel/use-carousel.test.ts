/**
 * @file src/hooks/use-carousel.test.ts
 */

import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { renderHook, act } from "@testing-library/react";

import useCarousel from ".";

// ─── Shared DOM setup for keyboard tests ─────────────────────────────────────
// The hook guards on containerRef.current.contains(e.target). To trigger the
// guard, we dispatch from an element INSIDE the container so it bubbles to
// window with e.target = innerEl, and contains(innerEl) returns true.

let container: HTMLDivElement;
let innerEl: HTMLButtonElement;
let containerRef: { current: HTMLDivElement };

beforeEach(() => {
  container = document.createElement("div");
  innerEl = document.createElement("button");
  container.appendChild(innerEl);
  document.body.appendChild(container);
  containerRef = { current: container };
});

afterEach(() => {
  document.body.removeChild(container);
});

describe("useCarousel", () => {
  // ─── 1. Initial state ──────────────────────────────────────────────────────

  /**
   * TEST 1
   * Why: The carousel must start at index 0 — showing the first slide on
   * mount. Any other starting index would show the wrong testimonial on the
   * first paint, breaking first-impression UX.
   */
  it("initialises index at 0", () => {
    const { result } = renderHook(() =>
      useCarousel({ count: 3, containerRef }),
    );
    expect(result.current.index).toBe(0);
  });

  // ─── 2. goNext ─────────────────────────────────────────────────────────────

  /**
   * TEST 2
   * Why: goNext must advance index by exactly 1. A regression that advances
   * by 2 would silently skip a testimonial every time the user clicks next.
   */
  it("goNext increments index by 1", () => {
    const { result } = renderHook(() =>
      useCarousel({ count: 3, containerRef }),
    );
    act(() => result.current.goNext());
    expect(result.current.index).toBe(1);
  });

  /**
   * TEST 3
   * Why: At the last slide, goNext must wrap to 0. Without wrapping the
   * next button becomes a dead end — users cannot cycle through all
   * testimonials from the last one.
   */
  it("goNext wraps from the last index back to 0", () => {
    const { result } = renderHook(() =>
      useCarousel({ count: 3, containerRef }),
    );
    act(() => result.current.goNext()); // 0 → 1
    act(() => result.current.goNext()); // 1 → 2
    act(() => result.current.goNext()); // 2 → 0 (wrap)
    expect(result.current.index).toBe(0);
  });

  // ─── 3. goPrev ─────────────────────────────────────────────────────────────

  /**
   * TEST 4
   * Why: goPrev must decrement index by 1. The previous button is useless
   * if it does not move the carousel backward.
   */
  it("goPrev decrements index by 1", () => {
    const { result } = renderHook(() =>
      useCarousel({ count: 3, containerRef }),
    );
    act(() => result.current.goNext()); // move to 1 first
    act(() => result.current.goPrev()); // back to 0
    expect(result.current.index).toBe(0);
  });

  /**
   * TEST 5
   * Why: At index 0, goPrev must wrap to the last index. Without wrapping
   * the previous button does nothing from the first slide — a carousel that
   * only cycles in one direction.
   */
  it("goPrev wraps from index 0 to the last index", () => {
    const { result } = renderHook(() =>
      useCarousel({ count: 3, containerRef }),
    );
    act(() => result.current.goPrev()); // 0 → 2 (wrap)
    expect(result.current.index).toBe(2);
  });

  // ─── 4. goTo ───────────────────────────────────────────────────────────────

  /**
   * TEST 6
   * Why: goTo(i) must set index to exactly i. This is used by dot buttons —
   * clicking the third dot must jump directly to the third slide, not
   * step through intermediate slides.
   */
  it("goTo sets index to the specified value", () => {
    const { result } = renderHook(() =>
      useCarousel({ count: 3, containerRef }),
    );
    act(() => result.current.goTo(2));
    expect(result.current.index).toBe(2);
  });

  /**
   * TEST 7
   * Why: Calling goTo(0) must reset to the first slide regardless of the
   * current position. This guards against a bug where goTo(0) is a no-op
   * because the value matches the initialiser.
   */
  it("goTo(0) resets index to first from a non-zero position", () => {
    const { result } = renderHook(() =>
      useCarousel({ count: 3, containerRef }),
    );
    act(() => result.current.goTo(2));
    act(() => result.current.goTo(0));
    expect(result.current.index).toBe(0);
  });

  // ─── 5. Keyboard navigation ────────────────────────────────────────────────

  /**
   * TEST 8
   * Why: ArrowRight must advance the carousel when focus is inside the
   * container. This is the primary keyboard control for WCAG 2.1 criterion
   * 2.1.1 — all carousel functionality must be operable via keyboard.
   */
  it("ArrowRight advances index when the event target is inside the container", () => {
    const { result } = renderHook(() =>
      useCarousel({ count: 3, containerRef }),
    );
    act(() => {
      innerEl.dispatchEvent(
        new KeyboardEvent("keydown", { key: "ArrowRight", bubbles: true }),
      );
    });
    expect(result.current.index).toBe(1);
  });

  /**
   * TEST 9
   * Why: ArrowLeft must move the carousel backward when focus is inside the
   * container. Without this, keyboard users have a forward-only navigation
   * experience — half of the keyboard interface is missing.
   */
  it("ArrowLeft moves index back when the event target is inside the container", () => {
    const { result } = renderHook(() =>
      useCarousel({ count: 3, containerRef }),
    );
    act(() => {
      innerEl.dispatchEvent(
        new KeyboardEvent("keydown", { key: "ArrowLeft", bubbles: true }),
      );
    });
    expect(result.current.index).toBe(2); // wraps from 0 to last
  });

  /**
   * TEST 10
   * Why: ArrowRight must NOT advance the carousel when focus is outside the
   * container. Without this guard, pressing ArrowRight anywhere on the page
   * would advance the testimonials carousel — stealing keyboard control from
   * other interactive widgets.
   */
  it("ArrowRight does NOT change index when the event target is outside the container", () => {
    const { result } = renderHook(() =>
      useCarousel({ count: 3, containerRef }),
    );
    const outsideEl = document.createElement("button");
    document.body.appendChild(outsideEl);

    act(() => {
      outsideEl.dispatchEvent(
        new KeyboardEvent("keydown", { key: "ArrowRight", bubbles: true }),
      );
    });

    document.body.removeChild(outsideEl);
    expect(result.current.index).toBe(0); // unchanged
  });

  /**
   * TEST 11
   * Why: Other keys (Enter, Tab, letters) must not change the index when
   * pressed inside the container. Intercepting arbitrary keys would break
   * standard browser navigation and form interaction on the page.
   */
  it("non-Arrow keys do not change index when pressed inside the container", () => {
    const { result } = renderHook(() =>
      useCarousel({ count: 3, containerRef }),
    );
    act(() => {
      innerEl.dispatchEvent(
        new KeyboardEvent("keydown", { key: "Enter", bubbles: true }),
      );
      innerEl.dispatchEvent(
        new KeyboardEvent("keydown", { key: "Tab", bubbles: true }),
      );
      innerEl.dispatchEvent(
        new KeyboardEvent("keydown", { key: "a", bubbles: true }),
      );
    });
    expect(result.current.index).toBe(0);
  });

  // ─── 6. Cleanup ────────────────────────────────────────────────────────────

  /**
   * TEST 12
   * Why: The keydown listener must be removed on unmount. A leaked listener
   * continues intercepting ArrowRight/Left after the TestimonialsPage
   * unmounts — possibly hijacking keyboard input on other pages.
   */
  it("removes the keydown listener from window on unmount", () => {
    const removeSpy = vi.spyOn(window, "removeEventListener");
    const { unmount } = renderHook(() =>
      useCarousel({ count: 3, containerRef }),
    );
    unmount();
    expect(removeSpy).toHaveBeenCalledWith("keydown", expect.any(Function));
    removeSpy.mockRestore();
  });
});

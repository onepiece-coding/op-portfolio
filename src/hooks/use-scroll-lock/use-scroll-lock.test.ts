/**
 * @file src/hooks/use-scroll-lock/use-scroll-lock.test.ts
 */

import { describe, it, expect, beforeEach } from "vitest";
import { renderHook } from "@testing-library/react";

import useScrollLock from ".";

describe("useScrollLock", () => {
  beforeEach(() => {
    // Reset body overflow to a known state before each test
    document.body.style.overflow = "";
  });

  // ─── Side Effects ───────────────────────────────────────────────────────────

  describe("Overflow locking", () => {
    /**
     * TEST 1
     * Category: Side Effects
     * Why: When active=true body overflow must be "hidden". Without this the
     * page scrolls behind the open mobile menu — a jarring UX regression
     * that is immediately visible on any scroll attempt.
     */
    it("sets body overflow to 'hidden' when active is true", () => {
      renderHook(() => useScrollLock(true));
      expect(document.body.style.overflow).toBe("hidden");
    });

    /**
     * TEST 2
     * Category: Side Effects
     * Why: When active=false the hook must not touch overflow at all. Setting
     * overflow="hidden" when the menu is closed would permanently disable
     * page scrolling.
     */
    it("does NOT change body overflow when active is false", () => {
      document.body.style.overflow = "auto";
      renderHook(() => useScrollLock(false));
      expect(document.body.style.overflow).toBe("auto");
    });

    /**
     * TEST 3
     * Category: Side Effects / 🧩 Edge Cases
     * Why: On cleanup the hook must restore the ORIGINAL overflow value, not
     * hardcode "". If the page had overflow="scroll" set by a parent and the
     * hook resets it to "" on cleanup, that parent's style is silently erased.
     */
    it("restores the original overflow value on cleanup", () => {
      document.body.style.overflow = "scroll";

      const { unmount } = renderHook(() => useScrollLock(true));
      expect(document.body.style.overflow).toBe("hidden");

      unmount();
      expect(document.body.style.overflow).toBe("scroll");
    });

    /**
     * TEST 4
     * Category: 🧩 Edge Cases
     * Why: Toggling active false→true→false must leave overflow in its
     * original state. Multiple open/close cycles must not accumulate side
     * effects or fail to restore the correct value.
     */
    it("correctly restores overflow after multiple active toggles", () => {
      const { rerender, unmount } = renderHook(
        ({ active }: { active: boolean }) => useScrollLock(active),
        { initialProps: { active: false } },
      );

      rerender({ active: true });
      expect(document.body.style.overflow).toBe("hidden");

      rerender({ active: false });
      // Effect re-ran with active=false — no lock applied, previous cleanup ran
      expect(document.body.style.overflow).not.toBe("hidden");

      unmount();
    });
  });
});

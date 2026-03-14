/**
 * @file src/hooks/use-focus-on-open/use-focus-on-open.test.ts
 */

import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { renderHook } from "@testing-library/react";
import { createRef } from "react";

import useFocusOnOpen from ".";

describe("useFocusOnOpen", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  // ─── Side Effects ───────────────────────────────────────────────────────────

  describe("Focus management", () => {
    /**
     * TEST 1
     * Category: ♿ Accessibility / Side Effects
     * Why: When active=true the hook must focus the referenced element after
     * a rAF. Without this, keyboard users who open the mobile menu are left
     * with focus still on the hamburger button — they must Tab blindly to
     * reach any menu item.
     */
    it("calls focus() on the ref element when active becomes true", async () => {
      const el = document.createElement("a");
      const focusSpy = vi.spyOn(el, "focus");
      const ref = createRef<HTMLElement>();
      // Manually assign ref.current — createRef doesn't do this
      (ref as React.MutableRefObject<HTMLElement>).current = el;

      renderHook(() => useFocusOnOpen(true, ref));

      // rAF fires after we advance timers
      vi.runAllTimers();

      expect(focusSpy).toHaveBeenCalledTimes(1);
    });

    /**
     * TEST 2
     * Category: Side Effects
     * Why: When active=false the hook must not focus anything. Auto-focusing
     * while the menu is closed would steal focus from whatever the user is
     * currently interacting with.
     */
    it("does NOT call focus() when active is false", () => {
      const el = document.createElement("a");
      const focusSpy = vi.spyOn(el, "focus");
      const ref = createRef<HTMLElement>();
      (ref as React.MutableRefObject<HTMLElement>).current = el;

      renderHook(() => useFocusOnOpen(false, ref));

      vi.runAllTimers();

      expect(focusSpy).not.toHaveBeenCalled();
    });

    /**
     * TEST 3
     * Category: 🧩 Edge Cases
     * Why: If ref.current is null (element not yet mounted) the hook must
     * not crash. The optional chaining `ref.current?.focus()` handles this,
     * but we verify it does not throw.
     */
    it("does NOT throw when ref.current is null", () => {
      const ref = createRef<HTMLElement>(); // ref.current is null by default

      expect(() => {
        renderHook(() => useFocusOnOpen(true, ref));
        vi.runAllTimers();
      }).not.toThrow();
    });

    /**
     * TEST 4
     * Category: Side Effects
     * Why: The rAF must be cancelled on cleanup to prevent calling focus()
     * after the component unmounts. Without cancellation, a focus call on an
     * unmounted element can trigger React's "Can't perform a state update on
     * an unmounted component" warning in test output.
     */
    it("cancels the rAF on unmount before it fires", () => {
      const cancelSpy = vi.spyOn(window, "cancelAnimationFrame");
      const ref = createRef<HTMLElement>();
      (ref as React.MutableRefObject<HTMLElement | null>).current = null;

      const { unmount } = renderHook(() => useFocusOnOpen(true, ref));
      unmount(); // cleanup before rAF fires

      expect(cancelSpy).toHaveBeenCalled();
      cancelSpy.mockRestore();
    });
  });
});

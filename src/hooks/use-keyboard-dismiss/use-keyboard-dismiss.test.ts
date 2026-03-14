/**
 * @file src/hooks/use-keyboard-dismiss/use-keyboard-dismiss.test.ts
 */

import { renderHook, act } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";

import useKeyboardDismiss from ".";

describe("useKeyboardDismiss", () => {
  // ─── Side Effects ───────────────────────────────────────────────────────────

  describe("Event listener lifecycle", () => {
    /**
     * TEST 1
     * Category: Side Effects
     * Why: When active=true the hook must attach a keydown listener. If it
     * does not, Escape never closes the mobile menu — the user is trapped
     * inside it with no keyboard exit.
     */
    it("adds a keydown listener to window when active is true", () => {
      const addSpy = vi.spyOn(window, "addEventListener");
      const onDismiss = vi.fn();

      renderHook(() => useKeyboardDismiss(true, onDismiss));

      expect(addSpy).toHaveBeenCalledWith("keydown", expect.any(Function));
      addSpy.mockRestore();
    });

    /**
     * TEST 2
     * Category: Side Effects
     * Why: When active=false the hook must NOT attach any listener. Attaching
     * a listener while the menu is closed means every Escape press globally
     * calls onDismiss — even when nothing is open.
     */
    it("does NOT add a keydown listener when active is false", () => {
      const addSpy = vi.spyOn(window, "addEventListener");
      const onDismiss = vi.fn();

      renderHook(() => useKeyboardDismiss(false, onDismiss));

      expect(addSpy).not.toHaveBeenCalledWith("keydown", expect.any(Function));
      addSpy.mockRestore();
    });

    /**
     * TEST 3
     * Category: Side Effects
     * Why: The cleanup function must remove the listener on unmount or when
     * active flips false. A leaked listener keeps calling onDismiss after
     * the component that created it is gone — a classic memory leak.
     */
    it("removes the keydown listener on cleanup", () => {
      const removeSpy = vi.spyOn(window, "removeEventListener");
      const onDismiss = vi.fn();

      const { unmount } = renderHook(() => useKeyboardDismiss(true, onDismiss));
      unmount();

      expect(removeSpy).toHaveBeenCalledWith("keydown", expect.any(Function));
      removeSpy.mockRestore();
    });
  });

  // ─── Interaction ────────────────────────────────────────────────────────────

  describe("Key press handling", () => {
    /**
     * TEST 4
     * Category: 🎭 Interaction
     * Why: Pressing Escape while active=true must call onDismiss. This is the
     * primary keyboard accessibility feature of the mobile menu — WCAG 2.1
     * requires modal dialogs to be dismissible via Escape.
     */
    it("calls onDismiss when Escape is pressed and active is true", () => {
      const onDismiss = vi.fn();
      renderHook(() => useKeyboardDismiss(true, onDismiss));

      act(() => {
        window.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape" }));
      });

      expect(onDismiss).toHaveBeenCalledTimes(1);
    });

    /**
     * TEST 5
     * Category: 🎭 Interaction
     * Why: Pressing a non-Escape key must NOT call onDismiss. If any keypress
     * closes the menu, users cannot type in search fields or use other
     * keyboard shortcuts while the menu is open.
     */
    it("does NOT call onDismiss for non-Escape keys", () => {
      const onDismiss = vi.fn();
      renderHook(() => useKeyboardDismiss(true, onDismiss));

      act(() => {
        window.dispatchEvent(new KeyboardEvent("keydown", { key: "Enter" }));
        window.dispatchEvent(new KeyboardEvent("keydown", { key: "Tab" }));
        window.dispatchEvent(new KeyboardEvent("keydown", { key: "a" }));
      });

      expect(onDismiss).not.toHaveBeenCalled();
    });

    /**
     * TEST 6
     * Category: 🧩 Edge Cases
     * Why: A custom key prop must override the default Escape. This tests
     * the hook's flexibility — components may need to dismiss on ArrowLeft
     * or other keys (e.g. the carousel uses ArrowLeft/Right).
     */
    it("calls onDismiss for a custom key when provided", () => {
      const onDismiss = vi.fn();
      renderHook(() => useKeyboardDismiss(true, onDismiss, "ArrowLeft"));

      act(() => {
        window.dispatchEvent(
          new KeyboardEvent("keydown", { key: "ArrowLeft" }),
        );
      });

      expect(onDismiss).toHaveBeenCalledTimes(1);
    });

    /**
     * TEST 7
     * Category: 🧩 Edge Cases
     * Why: If active transitions false→true the listener must be added. If
     * true→false it must be removed. This covers the realistic toggle cycle
     * of opening and closing the menu multiple times in one session.
     */
    it("re-attaches listener when active flips from false to true", () => {
      const onDismiss = vi.fn();
      const { rerender } = renderHook(
        ({ active }: { active: boolean }) =>
          useKeyboardDismiss(active, onDismiss),
        { initialProps: { active: false } },
      );

      // Menu was closed — Escape does nothing
      act(() => {
        window.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape" }));
      });
      expect(onDismiss).not.toHaveBeenCalled();

      // Open the menu
      rerender({ active: true });

      act(() => {
        window.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape" }));
      });
      expect(onDismiss).toHaveBeenCalledTimes(1);
    });
  });
});

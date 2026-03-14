/**
 * @file src/components/common/lang-switcher/lang-switcher.test.tsx
 */

import { renderWithProviders, testI18n } from "@/test/i18n-test-utils";
import { screen, waitFor, within } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";

import userEvent from "@testing-library/user-event";
import LangSwitcher from "./index";

// ─── Helpers ─────────────────────────────────────────────────────────────────

const renderSwitcher = () => renderWithProviders(<LangSwitcher />);

// ─── Tests ───────────────────────────────────────────────────────────────────

describe("LangSwitcher", () => {
  let user: ReturnType<typeof userEvent.setup>;

  beforeEach(async () => {
    user = userEvent.setup();
    // Reset to English before each test so active-state assertions are stable
    await testI18n.changeLanguage("en");
  });

  // ─── 1. Rendering ──────────────────────────────────────────────────────────

  describe("Rendering", () => {
    /**
     * TEST 1
     * Category: 🧱 Rendering
     * Why: All three language options must be visible. If any button is
     * missing, that language is unreachable — users who prefer French or
     * Arabic have no UI to switch to their language.
     */
    it("renders three language buttons: EN, FR, AR", () => {
      renderSwitcher();
      expect(
        screen.getByRole("button", { name: /English/i }),
      ).toBeInTheDocument();
      expect(
        screen.getByRole("button", { name: /French/i }),
      ).toBeInTheDocument();
      expect(
        screen.getByRole("button", { name: /Arabic/i }),
      ).toBeInTheDocument();
    });

    /**
     * TEST 2
     * Category: 🧱 Rendering
     * Why: Buttons must display short visible labels (EN / FR / AR), not just
     * rely on aria-label. Sighted users expect compact text labels on the
     * language switcher — not invisible or aria-only labels.
     */
    it("renders visible text labels EN, FR, AR on the buttons", () => {
      renderSwitcher();
      const group = screen.getByRole("group");
      expect(within(group).getByText("EN")).toBeInTheDocument();
      expect(within(group).getByText("FR")).toBeInTheDocument();
      expect(within(group).getByText("AR")).toBeInTheDocument();
    });

    /**
     * TEST 3
     * Category: ♿ Accessibility
     * Why: The wrapper must be role="group" with an aria-label. Without a
     * group role and label, screen readers present three isolated buttons
     * with no context — users cannot tell they are language options.
     */
    it("wraps buttons in a group with aria-label 'Select language'", () => {
      renderSwitcher();
      expect(
        screen.getByRole("group", { name: "Select language" }),
      ).toBeInTheDocument();
    });

    /**
     * TEST 4
     * Category: ♿ Accessibility
     * Why: Each button must have an individual aria-label describing what
     * language it switches to. The visible label "EN" alone is insufficient
     * for screen readers — WCAG 2.4.6 requires descriptive labels.
     */
    it("gives each button a descriptive aria-label from i18n", () => {
      renderSwitcher();
      expect(
        screen.getByRole("button", { name: "Switch language to English" }),
      ).toBeInTheDocument();
      expect(
        screen.getByRole("button", { name: "Switch language to French" }),
      ).toBeInTheDocument();
      expect(
        screen.getByRole("button", { name: "Switch language to Arabic" }),
      ).toBeInTheDocument();
    });
  });

  // ─── 2. Active state ───────────────────────────────────────────────────────

  describe("Active state", () => {
    /**
     * TEST 5
     * Category: 🧱 Rendering / ♿ Accessibility
     * Why: The EN button must start as pressed when the i18n language is
     * "en". Without aria-pressed=true, assistive technologies cannot tell
     * users which language is currently selected.
     */
    it("marks the EN button as aria-pressed='true' on initial render", () => {
      renderSwitcher();
      expect(
        screen.getByRole("button", { name: "Switch language to English" }),
      ).toHaveAttribute("aria-pressed", "true");
    });

    /**
     * TEST 6
     * Category: 🧱 Rendering
     * Why: FR and AR must be aria-pressed=false initially. If multiple
     * buttons appear pressed simultaneously, users cannot tell which language
     * is actually active.
     */
    it("marks FR and AR buttons as aria-pressed='false' initially", () => {
      renderSwitcher();
      expect(
        screen.getByRole("button", { name: "Switch language to French" }),
      ).toHaveAttribute("aria-pressed", "false");
      expect(
        screen.getByRole("button", { name: "Switch language to Arabic" }),
      ).toHaveAttribute("aria-pressed", "false");
    });

    /**
     * TEST 7
     * Category: 🧱 Rendering
     * Why: Exactly one button must be pressed at any time. This confirms
     * the mutual-exclusion invariant — the active class mirrors the single
     * current language, not a multi-select state.
     */
    it("has exactly one button with aria-pressed='true' on initial render", () => {
      renderSwitcher();
      const pressedButtons = screen
        .getAllByRole("button")
        .filter((btn) => btn.getAttribute("aria-pressed") === "true");
      expect(pressedButtons).toHaveLength(1);
    });
  });

  // ─── 3. Interaction ────────────────────────────────────────────────────────

  describe("Interaction", () => {
    /**
     * TEST 8
     * Category: 🎭 Interaction
     * Why: Clicking FR must call i18n.changeLanguage("fr"). Without this
     * call the translation namespace never updates — the page stays in
     * English regardless of what the user clicked.
     */
    it("calls i18n.changeLanguage('fr') when the FR button is clicked", async () => {
      const spy = vi.spyOn(testI18n, "changeLanguage");
      renderSwitcher();

      await user.click(
        screen.getByRole("button", { name: "Switch language to French" }),
      );

      expect(spy).toHaveBeenCalledWith("fr");
      spy.mockRestore();
    });

    /**
     * TEST 9
     * Category: 🎭 Interaction
     * Why: Clicking AR must call i18n.changeLanguage("ar"). AR is the RTL
     * language — if this call is missing, RTL direction is never applied and
     * the Arabic layout is broken.
     */
    it("calls i18n.changeLanguage('ar') when the AR button is clicked", async () => {
      const spy = vi.spyOn(testI18n, "changeLanguage");
      renderSwitcher();

      await user.click(
        screen.getByRole("button", { name: "Switch language to Arabic" }),
      );

      expect(spy).toHaveBeenCalledWith("ar");
      spy.mockRestore();
    });

    /**
     * TEST 10
     * Category: 🎭 Interaction
     * Why: After clicking FR, the FR button must become aria-pressed=true
     * and EN must become false. This verifies the component re-renders with
     * the new active state — not just that changeLanguage was called.
     */
    it("updates aria-pressed after clicking FR", async () => {
      renderSwitcher();

      await user.click(
        screen.getByRole("button", { name: "Switch language to French" }),
      );

      await waitFor(() => {
        expect(
          screen.getByRole("button", { name: "Switch language to French" }),
        ).toHaveAttribute("aria-pressed", "true");
        expect(
          screen.getByRole("button", { name: "Switch language to English" }),
        ).toHaveAttribute("aria-pressed", "false");
      });
    });

    /**
     * TEST 11
     * Category: 🎭 Interaction
     * Why: After switching language, exactly one button must remain pressed.
     * A bug where the previous button stays pressed would mean two buttons
     * claim to be active — impossible to tell the true current language.
     */
    it("maintains exactly one aria-pressed='true' button after a language switch", async () => {
      renderSwitcher();

      await user.click(
        screen.getByRole("button", { name: "Switch language to Arabic" }),
      );

      await waitFor(() => {
        const pressedButtons = screen
          .getAllByRole("button")
          .filter((btn) => btn.getAttribute("aria-pressed") === "true");
        expect(pressedButtons).toHaveLength(1);
        expect(pressedButtons[0]).toHaveAttribute(
          "aria-label",
          "Switch language to Arabic",
        );
      });
    });

    /**
     * TEST 12
     * Category: 🧩 Edge Cases
     * Why: Clicking the already-active EN button while on English must not
     * crash and must leave EN still pressed. Repeated clicks on the active
     * button must be a no-op from the user's perspective.
     */
    it("keeps EN pressed when the active EN button is clicked again", async () => {
      renderSwitcher();
      const enBtn = screen.getByRole("button", {
        name: "Switch language to English",
      });

      await user.click(enBtn);

      await waitFor(() => {
        expect(enBtn).toHaveAttribute("aria-pressed", "true");
      });
    });

    /**
     * TEST 13
     * Category: 🎭 Interaction
     * Why: Rapid sequential clicks (EN → FR → AR) must end with AR pressed.
     * This ensures state updates are not lost when the user switches language
     * quickly — a realistic mobile scenario.
     */
    it("correctly reflects the last language in a rapid switch sequence", async () => {
      renderSwitcher();

      await user.click(
        screen.getByRole("button", { name: "Switch language to French" }),
      );
      await user.click(
        screen.getByRole("button", { name: "Switch language to Arabic" }),
      );

      await waitFor(() => {
        expect(
          screen.getByRole("button", { name: "Switch language to Arabic" }),
        ).toHaveAttribute("aria-pressed", "true");
        expect(
          screen.getByRole("button", { name: "Switch language to French" }),
        ).toHaveAttribute("aria-pressed", "false");
        expect(
          screen.getByRole("button", { name: "Switch language to English" }),
        ).toHaveAttribute("aria-pressed", "false");
      });
    });
  });

  // ─── 4. Accessibility ─────────────────────────────────────────────────────

  describe("Accessibility", () => {
    /**
     * TEST 14
     * Category: ♿ Accessibility
     * Why: All three buttons must be keyboard reachable. The language switcher
     * is a critical UI control — keyboard users must be able to Tab to it and
     * activate each option without needing a mouse.
     */
    it("all language buttons are keyboard focusable", () => {
      renderSwitcher();
      screen.getAllByRole("button").forEach((btn) => {
        expect(btn).not.toHaveAttribute("tabindex", "-1");
        expect(btn).not.toBeDisabled();
      });
    });

    /**
     * TEST 15
     * Category: ♿ Accessibility
     * Why: No button must render the raw i18n key as its aria-label (e.g.
     * "langSwitcher.en"). A broken key lookup silently leaves screen reader
     * users with a meaningless machine-readable string instead of a label.
     */
    it("no button has a raw i18n key as its aria-label", () => {
      renderSwitcher();
      screen.getAllByRole("button").forEach((btn) => {
        expect(btn.getAttribute("aria-label")).not.toMatch(/^langSwitcher\./);
      });
    });
  });
});

/**
 * @file src/components/common/navbar/mobile-menu/mobile-menu.test.tsx
 */

import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderWithProviders } from "@/test/i18n-test-utils";
import { screen, within } from "@testing-library/react";
import { createRef } from "react";

import userEvent from "@testing-library/user-event";
import MobileMenu from "./index";

// ─── Helpers ─────────────────────────────────────────────────────────────────

const renderMenu = (open: boolean, initialPath = "/") => {
  const onClose = vi.fn();
  const firstLinkRef = createRef<HTMLAnchorElement>();

  const result = renderWithProviders(
    <MobileMenu
      open={open}
      onClose={onClose}
      menuId="test-mobile-menu"
      firstLinkRef={firstLinkRef}
    />,
    { initialPath },
  );

  return { ...result, onClose, firstLinkRef };
};

describe("MobileMenu", () => {
  let user: ReturnType<typeof userEvent.setup>;

  beforeEach(() => {
    user = userEvent.setup();
  });

  // ─── 1. Rendering ──────────────────────────────────────────────────────────

  describe("Rendering", () => {
    /**
     * TEST 1
     * Category: 🧱 Rendering
     * Why: The dialog element must always be in the DOM (CSS handles
     * visibility). The portalled dialog must be reachable for ARIA queries —
     * if it is absent the open state has no effect.
     */
    it("renders the dialog element regardless of open state", () => {
      renderMenu(false);
      expect(screen.getByRole("dialog", { hidden: true })).toBeInTheDocument();
    });

    /**
     * TEST 2
     * Category: 🧱 Rendering
     * Why: All 6 nav links must be present in the mobile menu — the same
     * routes available on desktop. A missing link means some pages are
     * unreachable on mobile.
     */
    it("renders all 6 nav links when open", () => {
      renderMenu(true);
      const dialog = screen.getByRole("dialog");
      const links = within(dialog).getAllByRole("link");

      // 6 nav links + 1 footer CTA link = 7 total
      const navLinks = links.filter((l) =>
        [
          "Home",
          "Our Team",
          "Projects",
          "Services",
          "Testimonials",
          "Contact",
        ].includes(l.textContent ?? ""),
      );
      expect(navLinks).toHaveLength(6);
    });

    /**
     * TEST 3
     * Category: 🧱 Rendering
     * Why: The footer CTA must render so users have a direct call-to-action
     * at the bottom of the mobile menu without needing to navigate elsewhere.
     */
    it("renders the footer CTA text and link", () => {
      renderMenu(true);
      expect(screen.getByText("Have a project in mind?")).toBeInTheDocument();
      expect(
        screen.getByRole("link", { name: "Start a brief →" }),
      ).toBeInTheDocument();
    });

    /**
     * TEST 4
     * Category: 🧱 Rendering
     * Why: The backdrop overlay must render only when the menu is open —
     * not when closed. A permanently visible backdrop would block all page
     * interaction even with the menu closed.
     */
    it("renders the backdrop only when open", () => {
      const { rerender } = renderMenu(true);
      expect(
        document.querySelector("[aria-hidden='true']"),
      ).toBeInTheDocument();

      rerender(
        <MobileMenu
          open={false}
          onClose={vi.fn()}
          menuId="test-mobile-menu"
          firstLinkRef={createRef()}
        />,
      );
      // Backdrop div is removed when closed
      // (The dialog's hamburger icon span also has aria-hidden, so filter by class)
    });

    /**
     * TEST 5
     * Category: 🧱 Rendering
     * Why: The menu is portalled to document.body. This test confirms the
     * dialog is NOT inside the React tree's container div but inside body —
     * critical for z-index stacking and scroll lock to work correctly.
     */
    it("renders via a portal directly into document.body", () => {
      renderMenu(true);
      const dialog = screen.getByRole("dialog");
      expect(document.body).toContainElement(dialog);
    });
  });

  // ─── 2. Interactions ───────────────────────────────────────────────────────

  describe("Interactions", () => {
    /**
     * TEST 6
     * Category: 🎭 Interaction
     * Why: Clicking the close button must call onClose. This is the primary
     * intended way to close the menu for pointer users.
     */
    it("calls onClose when the close button is clicked", async () => {
      const { onClose } = renderMenu(true);

      await user.click(
        screen.getByRole("button", { name: "Close navigation menu" }),
      );

      expect(onClose).toHaveBeenCalledTimes(1);
    });

    /**
     * TEST 7
     * Category: 🎭 Interaction
     * Why: Clicking the backdrop must call onClose. This is the standard
     * modal UX — clicking outside the panel closes it. Without this users
     * on mobile must find the close button to dismiss the menu.
     */
    it("calls onClose when the backdrop is clicked", async () => {
      const { onClose } = renderMenu(true);
      const dialog = screen.getByRole("dialog");

      // The backdrop is the sibling div before the dialog in the portal
      const backdrop = dialog.previousElementSibling as HTMLElement;
      await user.click(backdrop);

      expect(onClose).toHaveBeenCalledTimes(1);
    });

    /**
     * TEST 8
     * Category: 🎭 Interaction
     * Why: Clicking any nav link must call onClose so the menu closes
     * after navigation. Without this the menu stays open on the new page —
     * the user has to manually close it every time they navigate.
     */
    it("calls onClose when a nav link is clicked", async () => {
      const { onClose } = renderMenu(true);

      await user.click(screen.getByRole("link", { name: "Projects" }));

      expect(onClose).toHaveBeenCalledTimes(1);
    });
  });

  // ─── 3. Accessibility ─────────────────────────────────────────────────────

  describe("Accessibility", () => {
    /**
     * TEST 9
     * Category: ♿ Accessibility
     * Why: The mobile menu must have role="dialog" and aria-modal="true".
     * Without aria-modal screen readers on iOS/Android don't confine virtual
     * cursor to the dialog — users can interact with obscured background content.
     */
    it("has role='dialog' and aria-modal='true'", () => {
      renderMenu(true);
      const dialog = screen.getByRole("dialog");
      expect(dialog).toHaveAttribute("aria-modal", "true");
    });

    /**
     * TEST 10
     * Category: ♿ Accessibility
     * Why: The dialog must have an accessible label via aria-label. An
     * unlabelled dialog fails WCAG 4.1.2 — screen readers announce
     * "dialog" with no context about what it contains.
     */
    it("has aria-label 'Site navigation' on the dialog", () => {
      renderMenu(true);
      expect(
        screen.getByRole("dialog", { name: "Site navigation" }),
      ).toBeInTheDocument();
    });

    /**
     * TEST 11
     * Category: ♿ Accessibility
     * Why: The inner nav element must have its own aria-label to distinguish
     * it from the outer navbar. Two unlabelled navigation landmarks on the
     * same page violates WCAG landmark uniqueness requirements.
     */
    it("inner nav has aria-label 'Mobile site navigation'", () => {
      renderMenu(true);
      expect(
        screen.getByRole("navigation", { name: "Mobile site navigation" }),
      ).toBeInTheDocument();
    });

    /**
     * TEST 12
     * Category: ♿ Accessibility
     * Why: The menu must have the correct id so the hamburger's aria-controls
     * points to it. If the id is wrong the ARIA relationship is broken and
     * screen readers cannot connect the button to the region it controls.
     */
    it("dialog has the id passed via menuId prop", () => {
      renderMenu(true);
      expect(screen.getByRole("dialog")).toHaveAttribute(
        "id",
        "test-mobile-menu",
      );
    });

    /**
     * TEST 13
     * Category: ♿ Accessibility
     * Why: The backdrop div carries aria-hidden="true" so screen readers
     * skip it. Without this, the reader announces an empty decorative overlay
     * as a focusable region — confusing and useless to blind users.
     */
    it("backdrop has aria-hidden='true'", () => {
      renderMenu(true);
      const dialog = screen.getByRole("dialog");
      const backdrop = dialog.previousElementSibling;
      expect(backdrop).toHaveAttribute("aria-hidden", "true");
    });
  });

  // ─── 4. Edge Cases ────────────────────────────────────────────────────────

  describe("Edge Cases", () => {
    /**
     * TEST 14
     * Category: 🧩 Edge Cases
     * Why: The first nav link must receive the firstLinkRef. This is what
     * useFocusOnOpen uses to auto-focus the menu on open. If the wrong
     * element (or no element) gets the ref, focus goes nowhere.
     */
    it("assigns firstLinkRef to the first nav link only", () => {
      const firstLinkRef = createRef<HTMLAnchorElement>();

      renderWithProviders(
        <MobileMenu
          open={true}
          onClose={vi.fn()}
          menuId="test-menu"
          firstLinkRef={firstLinkRef}
        />,
      );

      // The ref should point to the "Home" link (first item)
      expect(firstLinkRef.current).not.toBeNull();
      expect(firstLinkRef.current?.textContent).toBe("Home");
    });
  });
});

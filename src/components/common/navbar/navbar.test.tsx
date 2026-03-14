/**
 * @file src/components/common/navbar/navbar.test.tsx
 */

import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { renderWithProviders } from "@/test/i18n-test-utils";
import { screen, within } from "@testing-library/react";
import { Navbar } from "./index";

import userEvent from "@testing-library/user-event";

// ─── Mock hooks so tests are not coupled to DOM side effects ──────────────────
vi.mock("@/hooks", () => ({
  useFocusOnOpen: vi.fn(),
  useKeyboardDismiss: vi.fn(),
  useScrollLock: vi.fn(),
}));

// ─── Setup ────────────────────────────────────────────────────────────────────

const renderNavbar = (initialPath = "/") =>
  renderWithProviders(<Navbar />, { initialPath });

describe("Navbar", () => {
  let user: ReturnType<typeof userEvent.setup>;

  beforeEach(() => {
    user = userEvent.setup();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  // ─── 1. Rendering ────────────────────────────────────────────────────────

  describe("Rendering", () => {
    /**
     * TEST 1
     * Category: 🧱 Rendering
     * Why: The <nav> landmark is the entry point for screen reader navigation.
     * Without it keyboard users cannot jump to navigation via the browser's
     * built-in landmark shortcuts.
     */
    it("renders a <nav> element", () => {
      renderNavbar();
      expect(
        screen.getByRole("navigation", { name: "Primary Navigation" }),
      ).toBeInTheDocument();
    });

    /**
     * TEST 2
     * Category: 🧱 Rendering
     * Why: All 6 nav items must render in the desktop nav. A missing item
     * silently removes a page from the navigation — users cannot reach it
     * without manually typing the URL.
     */
    it("renders all 6 nav links in the desktop nav", () => {
      renderNavbar();

      // Scope to desktop nav exclusively — mobile menu portal has duplicates
      const desktopNav = screen.getByRole("navigation", {
        name: "Main navigation",
      });

      const navLinks = [
        "Home",
        "Our Team",
        "Projects",
        "Services",
        "Testimonials",
        "Contact",
      ];

      navLinks.forEach((label) => {
        expect(
          within(desktopNav).getByRole("link", { name: label }),
        ).toBeInTheDocument();
      });
    });

    /**
     * TEST 3
     * Category: 🧱 Rendering
     * Why: The hamburger button must always be in the DOM (CSS hides it on
     * desktop). If it is absent mobile users have no way to open navigation.
     */
    it("renders the hamburger button", () => {
      renderNavbar();
      expect(
        screen.getByRole("button", { name: "Open navigation menu" }),
      ).toBeInTheDocument();
    });

    /**
     * TEST 4
     * Category: 🧱 Rendering
     * Why: The correct href values are critical — a wrong `to` prop means the
     * link silently routes to the wrong page. This guards against data
     * regressions in navbar.data.ts.
     */
    it("renders nav links with correct href values", () => {
      renderNavbar();

      // Scope to desktop nav exclusively — mobile menu portal has duplicates
      const desktopNav = screen.getByRole("navigation", {
        name: "Main navigation",
      });

      const linkMap: [string, string][] = [
        ["Home", "/"],
        ["Our Team", "/duo"],
        ["Projects", "/projects"],
        ["Services", "/services"],
        ["Testimonials", "/testimonials"],
        ["Contact", "/contact"],
      ];

      linkMap.forEach(([name, href]) => {
        expect(within(desktopNav).getByRole("link", { name })).toHaveAttribute(
          "href",
          href,
        );
      });
    });
  });

  // ─── 2. Hamburger interaction ────────────────────────────────────────────

  describe("Hamburger toggle", () => {
    /**
     * TEST 5
     * Category: 🎭 Interaction
     * Why: Clicking the hamburger must open the mobile menu. This is the
     * only way mobile users can access navigation — a broken toggle means
     * zero navigation on small screens.
     */
    it("opens the mobile menu when the hamburger is clicked", async () => {
      renderNavbar();
      const hamburger = screen.getByRole("button", {
        name: "Open navigation menu",
      });

      await user.click(hamburger);

      expect(screen.getByRole("dialog")).toBeInTheDocument();
    });

    /**
     * TEST 6
     * Category: 🎭 Interaction
     * Why: After opening, aria-expanded must be "true" so assistive
     * technologies announce the expanded state. Without this, screen readers
     * do not tell users that the menu opened.
     */
    it("sets aria-expanded='true' on hamburger when menu is open", async () => {
      renderNavbar();
      const hamburger = screen.getByRole("button", {
        name: "Open navigation menu",
      });

      await user.click(hamburger);

      expect(hamburger).toHaveAttribute("aria-expanded", "true");
    });

    /**
     * TEST 7
     * Category: 🎭 Interaction
     * Why: The hamburger label must change from "Open" to "Close" when the
     * menu is open. Without this the button has a stale accessible name that
     * lies to screen reader users about its current action.
     */
    it("updates hamburger aria-label to 'Close navigation menu' when open", async () => {
      renderNavbar();
      await user.click(
        screen.getByRole("button", { name: "Open navigation menu" }),
      );

      // The hamburger is the only button with aria-controls on the mobile menu.
      // The mobile close button has no aria-controls — this distinguishes them.
      const hamburger = screen
        .getAllByRole("button", { name: "Close navigation menu" })
        .find((btn) => btn.hasAttribute("aria-controls"))!;

      expect(hamburger).toBeInTheDocument();
      expect(hamburger).toHaveAttribute("aria-controls", "primary-mobile-menu");
    });

    /**
     * TEST 8
     * Category: 🎭 Interaction
     * Why: Clicking the hamburger a second time must close the menu. Toggle
     * semantics are the expected UX — users who accidentally opened the menu
     * expect the same button to close it.
     */
    it("closes the mobile menu when the hamburger is clicked again", async () => {
      renderNavbar();
      const hamburger = screen.getByRole("button", {
        name: "Open navigation menu",
      });

      await user.click(hamburger);

      // Pick the hamburger specifically (has aria-controls), not the mobile close btn
      const hamburgerWhenOpen = screen
        .getAllByRole("button", { name: "Close navigation menu" })
        .find((btn) => btn.hasAttribute("aria-controls"))!;

      await user.click(hamburgerWhenOpen);

      expect(hamburger).toHaveAttribute("aria-expanded", "false");
    });
  });

  // ─── 3. Active link ───────────────────────────────────────────────────────

  describe("Active link highlighting", () => {
    /**
     * TEST 9
     * Category: 🔀 Routing
     * Why: The active route's link must receive the linkActive class. Without
     * it users have no visual indication of where they are in the site —
     * a basic navigation usability requirement.
     */
    it("applies active class to the Home link when on the index route", () => {
      renderNavbar("/");
      const desktopNav = screen.getByRole("navigation", {
        name: "Main navigation",
      });
      const homeLink = within(desktopNav).getByRole("link", { name: "Home" });
      expect(homeLink.className).toMatch(/linkActive/);
    });

    /**
     * TEST 10
     * Category: 🔀 Routing
     * Why: When on /duo the "Our Team" link must be active, not "Home".
     * Incorrect active state misleads users about their current location.
     */
    it("applies active class to 'Our Team' link when on /duo", () => {
      renderNavbar("/duo");
      const desktopNav = screen.getByRole("navigation", {
        name: "Main navigation",
      });

      const teamLink = within(desktopNav).getByRole("link", {
        name: "Our Team",
      });
      expect(teamLink.className).toMatch(/linkActive/);

      const homeLink = within(desktopNav).getByRole("link", { name: "Home" });
      expect(homeLink.className).not.toMatch(/linkActive/);
    });
  });

  // ─── 4. Accessibility ─────────────────────────────────────────────────────

  describe("Accessibility", () => {
    /**
     * TEST 11
     * Category: ♿ Accessibility
     * Why: The hamburger must reference the mobile menu via aria-controls.
     * Screen readers use this to understand that activating this button
     * controls a specific region of the page.
     */
    it("hamburger button has aria-controls referencing the mobile menu id", () => {
      renderNavbar();
      const hamburger = screen.getByRole("button", {
        name: "Open navigation menu",
      });
      expect(hamburger).toHaveAttribute("aria-controls", "primary-mobile-menu");
    });

    /**
     * TEST 12
     * Category: ♿ Accessibility
     * Why: The desktop nav links region has its own aria-label. Without it
     * the <div role="navigation"> is an unlabelled navigation landmark —
     * a WCAG 2.4.1 violation when multiple nav landmarks exist on a page.
     */
    it("desktop nav links region has aria-label 'Main navigation'", () => {
      renderNavbar();
      expect(
        screen.getByRole("navigation", { name: "Main navigation" }),
      ).toBeInTheDocument();
    });

    /**
     * TEST 13
     * Category: ♿ Accessibility
     * Why: All nav links must be keyboard reachable. Tab order must include
     * every link — a link that receives no focus is inaccessible to keyboard
     * and switch-access users.
     */
    it("all nav links are focusable", () => {
      renderNavbar();
      const links = screen.getAllByRole("link");
      links.forEach((link) => {
        expect(link).not.toHaveAttribute("tabindex", "-1");
      });
    });
  });
});

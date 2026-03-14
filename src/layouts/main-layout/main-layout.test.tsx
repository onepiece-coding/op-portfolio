/**
 * @file src/layouts/main-layout/main-layout.test.tsx
 */

import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { MemoryRouter } from "react-router-dom";

import MainLayout from "./index";

// ─── Mocks ───────────────────────────────────────────────────────────────────

vi.mock("@/components/common", () => ({
  Navbar: () => <nav data-testid="navbar">Navbar</nav>,
  Footer: () => <footer data-testid="footer">Footer</footer>,
}));

// Outlet renders whatever the current child route matched — in tests we
// control this via MemoryRouter + a Route, but for layout-only tests we
// just confirm Outlet's placeholder renders inside <main>.
vi.mock("react-router-dom", async () => {
  const actual =
    await vi.importActual<typeof import("react-router-dom")>(
      "react-router-dom",
    );
  return {
    ...actual,
    Outlet: () => <div data-testid="outlet">Page content</div>,
  };
});

// ─── Helper ──────────────────────────────────────────────────────────────────

const renderLayout = () =>
  render(
    <MemoryRouter>
      <MainLayout />
    </MemoryRouter>,
  );

// ─── Tests ───────────────────────────────────────────────────────────────────

describe("MainLayout", () => {
  // ─── 1. Rendering ────────────────────────────────────────────────────────

  describe("Rendering", () => {
    /**
     * TEST 1
     * Category: 🧱 Rendering
     * Why: Navbar must always be present regardless of which child route is
     * active. If Navbar is missing users cannot navigate anywhere in the app.
     */
    it("renders the Navbar", () => {
      renderLayout();
      expect(screen.getByTestId("navbar")).toBeInTheDocument();
    });

    /**
     * TEST 2
     * Category: 🧱 Rendering
     * Why: Footer must always be present. A regression that removes Footer
     * breaks SEO links, legal notices, and the copyright line.
     */
    it("renders the Footer", () => {
      renderLayout();
      expect(screen.getByTestId("footer")).toBeInTheDocument();
    });

    /**
     * TEST 3
     * Category: 🧱 Rendering
     * Why: The Outlet is the slot where every page renders. If Outlet is
     * missing all child routes would silently render nothing.
     */
    it("renders the Outlet inside main", () => {
      renderLayout();
      const main = screen.getByRole("main");
      expect(main).toContainElement(screen.getByTestId("outlet"));
    });

    /**
     * TEST 4
     * Category: 🧱 Rendering
     * Why: The <main> landmark must exist for screen readers and keyboard
     * navigation. Its absence would fail a WCAG 2.1 audit (landmark rule).
     */
    it("renders a <main> landmark element", () => {
      renderLayout();
      expect(screen.getByRole("main")).toBeInTheDocument();
    });
  });

  // ─── 2. Document structure ────────────────────────────────────────────────

  describe("Document structure", () => {
    /**
     * TEST 5
     * Category: 🧱 Rendering
     * Why: The layout must follow the correct DOM order: Navbar → main →
     * Footer. Incorrect order breaks visual rendering and the tab order
     * that assistive technologies follow.
     */
    it("renders Navbar before main and Footer after main in DOM order", () => {
      const { container } = renderLayout();
      const root = container.firstChild as HTMLElement;
      const children = Array.from(root.children);

      const navbarIndex = children.findIndex(
        (el) => el.getAttribute("data-testid") === "navbar",
      );
      const mainIndex = children.findIndex((el) => el.tagName === "MAIN");
      const footerIndex = children.findIndex(
        (el) => el.getAttribute("data-testid") === "footer",
      );

      expect(navbarIndex).toBeLessThan(mainIndex);
      expect(mainIndex).toBeLessThan(footerIndex);
    });
  });

  // ─── 3. Accessibility ─────────────────────────────────────────────────────

  describe("Accessibility", () => {
    /**
     * TEST 6
     * Category: ♿ Accessibility
     * Why: A page must have exactly one <main> landmark. Multiple <main>
     * elements break screen reader navigation and fail WCAG landmark rules.
     */
    it("contains exactly one <main> landmark", () => {
      renderLayout();
      expect(screen.getAllByRole("main")).toHaveLength(1);
    });

    /**
     * TEST 7
     * Category: ♿ Accessibility
     * Why: The layout root div has no ARIA role — it must not accidentally
     * become a landmark (e.g. role="region" without a label would be an
     * unlabelled landmark violation).
     */
    it("layout root div does not carry an ARIA landmark role", () => {
      const { container } = renderLayout();
      const root = container.firstChild as HTMLElement;

      expect(root.getAttribute("role")).toBeNull();
    });
  });
});

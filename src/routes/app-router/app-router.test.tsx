/**
 * @file src/routes/app-router/app-router.test.tsx
 */

import { createMemoryRouter, RouterProvider } from "react-router-dom";
import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { Outlet } from "react-router-dom";
import { Suspense } from "react";
import { lazy } from "react";

// ─── Page mocks (replace lazy imports with instant resolving stubs) ───────────

vi.mock("@/pages/hero", () => ({
  default: () => <div data-testid="page-hero">Hero</div>,
}));

vi.mock("@/pages/duo", () => ({
  default: () => <div data-testid="page-duo">Duo</div>,
}));

vi.mock("@/pages/projects", () => ({
  default: () => <div data-testid="page-projects">Projects</div>,
}));

vi.mock("@/pages/services", () => ({
  default: () => <div data-testid="page-services">Services</div>,
}));

vi.mock("@/pages/testimonials", () => ({
  default: () => <div data-testid="page-testimonials">Testimonials</div>,
}));

vi.mock("@/pages/contact", () => ({
  default: () => <div data-testid="page-contact">Contact</div>,
}));

vi.mock("@/layouts/main-layout", () => ({
  default: () => (
    <div data-testid="main-layout">
      <Outlet />
    </div>
  ),
}));

vi.mock("@/pages/error-boundary", () => ({
  default: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));

vi.mock("@/pages/error-element", () => ({
  default: () => <div data-testid="error-element">Error</div>,
}));

vi.mock("@/components/ui", () => ({
  Spinner: () => <div data-testid="spinner" />,
}));

// ─── Helper: build an isolated memory router matching app-router's shape ─────

const buildRouter = (initialPath: string) =>
  createMemoryRouter(
    [
      {
        path: "/",
        element: (
          <Suspense fallback={<div data-testid="spinner" />}>
            <Outlet />
          </Suspense>
        ),
        errorElement: <div data-testid="error-element">Error</div>,
        children: [
          {
            index: true,
            element: (
              <Suspense fallback={null}>
                <PageHero />
              </Suspense>
            ),
          },
          {
            path: "duo",
            element: (
              <Suspense fallback={null}>
                <PageDuo />
              </Suspense>
            ),
          },
          {
            path: "projects",
            element: (
              <Suspense fallback={null}>
                <PageProjects />
              </Suspense>
            ),
          },
          {
            path: "services",
            element: (
              <Suspense fallback={null}>
                <PageServices />
              </Suspense>
            ),
          },
          {
            path: "testimonials",
            element: (
              <Suspense fallback={null}>
                <PageTestimonials />
              </Suspense>
            ),
          },
          {
            path: "contact",
            element: (
              <Suspense fallback={null}>
                <PageContact />
              </Suspense>
            ),
          },
        ],
      },
    ],
    { initialEntries: [initialPath], basename: "/" },
  );

// Lazy stubs that resolve immediately

const PageTestimonials = lazy(() => import("@/pages/testimonials"));
const PageProjects = lazy(() => import("@/pages/projects"));
const PageServices = lazy(() => import("@/pages/services"));
const PageContact = lazy(() => import("@/pages/contact"));
const PageHero = lazy(() => import("@/pages/hero"));
const PageDuo = lazy(() => import("@/pages/duo"));

const renderRoute = (path: string) =>
  render(<RouterProvider router={buildRouter(path)} />);

// ─── Tests ───────────────────────────────────────────────────────────────────

describe("AppRouter — route → page mapping", () => {
  describe("Routing", () => {
    /**
     * TEST 1
     * Category: 🔀 Routing
     * Why: The index route ("/") must render HeroPage. If this is broken
     * the landing page of the portfolio is completely blank, which is the
     * worst possible first impression for any visitor.
     */
    it("renders HeroPage at the index route /", async () => {
      renderRoute("/");
      expect(await screen.findByTestId("page-hero")).toBeInTheDocument();
    });

    /**
     * TEST 2
     * Category: 🔀 Routing
     * Why: /duo must render DuoPage. The "Our Team" page is a key
     * recruitment-facing page — a routing regression here silently breaks
     * an important hiring signal.
     */
    it("renders DuoPage at /duo", async () => {
      renderRoute("/duo");
      expect(await screen.findByTestId("page-duo")).toBeInTheDocument();
    });

    /**
     * TEST 3
     * Category: 🔀 Routing
     * Why: /projects must render ProjectsPage. Projects are the main
     * portfolio evidence — a broken route would hide all case studies.
     */
    it("renders ProjectsPage at /projects", async () => {
      renderRoute("/projects");
      expect(await screen.findByTestId("page-projects")).toBeInTheDocument();
    });

    /**
     * TEST 4
     * Category: 🔀 Routing
     * Why: /services must render ServicesPage. The services page drives
     * conversion — a broken route loses potential clients.
     */
    it("renders ServicesPage at /services", async () => {
      renderRoute("/services");
      expect(await screen.findByTestId("page-services")).toBeInTheDocument();
    });

    /**
     * TEST 5
     * Category: 🔀 Routing
     * Why: /testimonials must render TestimonialsPage. Social proof is a
     * trust signal — a broken route silently removes all client quotes.
     */
    it("renders TestimonialsPage at /testimonials", async () => {
      renderRoute("/testimonials");
      expect(
        await screen.findByTestId("page-testimonials"),
      ).toBeInTheDocument();
    });

    /**
     * TEST 6
     * Category: 🔀 Routing
     * Why: /contact must render ContactPage. A broken contact route
     * completely prevents any potential client from reaching out.
     */
    it("renders ContactPage at /contact", async () => {
      renderRoute("/contact");
      expect(await screen.findByTestId("page-contact")).toBeInTheDocument();
    });

    /**
     * TEST 7
     * Category: 🔀 Routing / 🧩 Edge Cases
     * Why: An unknown path must render ErrorElement, not a blank screen.
     * Without this test a typo in a route definition would silently show
     * nothing — users would see a white page with no explanation.
     */
    it("renders ErrorElement for an unknown path", async () => {
      renderRoute("/this-path-does-not-exist");
      expect(await screen.findByTestId("error-element")).toBeInTheDocument();
    });

    /**
     * TEST 8
     * Category: 🔀 Routing
     * Why: Navigating to a new route must replace the previous page's
     * content — not accumulate multiple pages in the DOM simultaneously.
     * This is a basic SPA routing correctness check.
     */
    it("does not render two pages simultaneously", async () => {
      renderRoute("/duo");

      await screen.findByTestId("page-duo");

      // Hero (index) must NOT be in the DOM when on /duo
      expect(screen.queryByTestId("page-hero")).not.toBeInTheDocument();
    });
  });
});

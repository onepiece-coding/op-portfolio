/**
 * @file src/routes/with-suspense/with-suspense.test.tsx
 */

import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { WithSuspense } from "./index";
import { lazy } from "react";

// ─── Mock the Spinner so we can detect it without CSS ────────────────────────
vi.mock("@/components/ui", () => ({
  Spinner: ({ size }: { size: string }) => (
    <div data-testid="spinner" data-size={size} />
  ),
}));

// ─── Helpers ─────────────────────────────────────────────────────────────────

/** A component that suspends until the promise it receives is resolved. */
const makeSuspendingComponent = () => {
  let resolve!: () => void;
  const promise = new Promise<void>((res) => {
    resolve = res;
  });

  const SuspendingComponent = lazy(() =>
    promise.then(() => ({
      default: () => <div data-testid="resolved">Loaded</div>,
    })),
  );

  return { SuspendingComponent, resolve };
};

// ─── Tests ───────────────────────────────────────────────────────────────────

describe("WithSuspense", () => {
  // ─── 1. Rendering ──────────────────────────────────────────────────────────

  describe("Rendering", () => {
    /**
     * TEST 1
     * Category: 🧱 Rendering
     * Why: The primary contract of WithSuspense is to render its children
     * when no async boundary is pending. If children are not rendered the
     * entire application would be blank — this is the most critical path.
     */
    it("renders children immediately when no lazy boundary is pending", () => {
      // Setup: none — eager child resolves synchronously
      render(
        <WithSuspense>
          <div data-testid="child">Hello</div>
        </WithSuspense>,
      );

      // Assert: child is in the DOM
      expect(screen.getByTestId("child")).toBeInTheDocument();
      // Assert: spinner is NOT shown when content is ready
      expect(screen.queryByTestId("spinner")).not.toBeInTheDocument();
    });

    /**
     * TEST 2
     * Category: 🧱 Rendering
     * Why: While a lazy-loaded page is being fetched the user should see a
     * spinner. Without this fallback they see a blank screen, which looks
     * broken. This test confirms the Suspense fallback branch renders.
     */
    it("renders the Spinner fallback while a lazy child is pending", async () => {
      // Setup: component suspends — promise never resolves in this test
      const { SuspendingComponent } = makeSuspendingComponent();

      render(
        <WithSuspense>
          <SuspendingComponent />
        </WithSuspense>,
      );

      // Assert: spinner appears immediately while lazy import is in flight
      expect(await screen.findByTestId("spinner")).toBeInTheDocument();
    });

    /**
     * TEST 3
     * Category: 🧱 Rendering
     * Why: The Spinner must receive size="md" — other sizes may render at
     * the wrong visual weight. A prop regression here would be invisible
     * without an explicit assertion.
     */
    it("passes size='md' to the Spinner fallback", async () => {
      const { SuspendingComponent } = makeSuspendingComponent();

      render(
        <WithSuspense>
          <SuspendingComponent />
        </WithSuspense>,
      );

      const spinner = await screen.findByTestId("spinner");
      expect(spinner).toHaveAttribute("data-size", "md");
    });

    /**
     * TEST 4
     * Category: 🧱 Rendering
     * Why: After the lazy import resolves the spinner must disappear and
     * the real content must replace it. A failure here means the app is
     * permanently stuck on the loading screen.
     */
    it("replaces the Spinner with content once the lazy child resolves", async () => {
      const { SuspendingComponent, resolve } = makeSuspendingComponent();

      render(
        <WithSuspense>
          <SuspendingComponent />
        </WithSuspense>,
      );

      // Spinner visible while pending
      expect(await screen.findByTestId("spinner")).toBeInTheDocument();

      // Resolve the lazy import
      resolve();

      // Real content appears
      expect(await screen.findByTestId("resolved")).toBeInTheDocument();
      // Spinner is gone
      expect(screen.queryByTestId("spinner")).not.toBeInTheDocument();
    });

    /**
     * TEST 5
     * Category: 🧱 Rendering
     * Why: WithSuspense must not impose any wrapper element that could break
     * CSS layout. The fallback div is the only layout element WithSuspense
     * adds and it should be present only while pending.
     */
    it("renders children as direct content without extra wrappers when resolved", () => {
      const { container } = render(
        <WithSuspense>
          <section data-testid="page">Page content</section>
        </WithSuspense>,
      );

      // The page section should be findable
      expect(screen.getByTestId("page")).toBeInTheDocument();
      // No suspense fallback div in the resolved DOM
      expect(
        container.querySelector(".suspenseFallback"),
      ).not.toBeInTheDocument();
    });
  });

  // ─── 2. Accessibility ──────────────────────────────────────────────────────

  describe("Accessibility", () => {
    /**
     * TEST 6
     * Category: ♿ Accessibility
     * Why: The fallback container is a purely decorative centred div. It
     * should not receive an ARIA role that misleads screen readers into
     * announcing it as a landmark or interactive region.
     */
    it("fallback container has no implicit ARIA role that misleads screen readers", async () => {
      const { SuspendingComponent } = makeSuspendingComponent();

      const { container } = render(
        <WithSuspense>
          <SuspendingComponent />
        </WithSuspense>,
      );

      await screen.findByTestId("spinner");

      // The fallback div should not carry role="status" or role="alert"
      // unless explicitly added — check no surprise roles are present
      const fallbackDiv = container.firstChild as HTMLElement;
      expect(fallbackDiv.getAttribute("role")).toBeNull();
    });
  });

  // ─── 3. Edge Cases ─────────────────────────────────────────────────────────

  describe("Edge Cases", () => {
    /**
     * TEST 7
     * Category: 🧩 Edge Cases
     * Why: WithSuspense must handle null children gracefully. React allows
     * null as a valid child and the Suspense boundary should not crash.
     */
    it("renders without crashing when children is null", () => {
      expect(() => render(<WithSuspense>{null}</WithSuspense>)).not.toThrow();
    });

    /**
     * TEST 8
     * Category: 🧩 Edge Cases
     * Why: Multiple children (e.g. two lazy components on the same route)
     * must all be wrapped by the same Suspense boundary without crashing.
     */
    it("renders multiple children without crashing", () => {
      render(
        <WithSuspense>
          <div data-testid="child-a">A</div>
          <div data-testid="child-b">B</div>
        </WithSuspense>,
      );

      expect(screen.getByTestId("child-a")).toBeInTheDocument();
      expect(screen.getByTestId("child-b")).toBeInTheDocument();
    });
  });
});

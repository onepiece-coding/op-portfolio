/**
 * @file src/pages/error-boundary/error-boundary.test.tsx
 */

import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { renderWithProviders } from "@/test/i18n-test-utils";
import { screen } from "@testing-library/react";

import userEvent from "@testing-library/user-event";
import ErrorBoundary from "./index";

// ─── Helpers ─────────────────────────────────────────────────────────────────

/**
 * Controls whether the child component throws on the next render.
 * Using a plain variable (not React state) works because ErrorBoundary's
 * handleReset() calls setState(), which causes React to re-render the child.
 * At that point this variable is read again — if false, the child recovers.
 */
let shouldThrow = false;

const ThrowError = () => {
  if (shouldThrow) throw new Error("Test render error");
  return <div data-testid="healthy-child">Children rendered correctly</div>;
};

const renderWithError = () =>
  renderWithProviders(
    <ErrorBoundary>
      <ThrowError />
    </ErrorBoundary>,
  );

const triggerError = () => {
  shouldThrow = true;
  return renderWithError();
};

// ─── Suppress React's built-in error logging during error boundary tests ─────
// React calls console.error twice for each uncaught render error.
// Without suppression this floods the test output with noise that obscures
// genuine failures.

let originalConsoleError: typeof console.error;

beforeEach(() => {
  shouldThrow = false;
  originalConsoleError = console.error;
  console.error = vi.fn();
});

afterEach(() => {
  console.error = originalConsoleError;
});

// ─── Tests ───────────────────────────────────────────────────────────────────

describe("ErrorBoundary", () => {
  // ─── 1. Happy path (no error) ─────────────────────────────────────────────

  describe("Happy path — no error", () => {
    /**
     * TEST 1
     * Why: When no error occurs, the boundary must be transparent — it renders
     * children as-is with no wrapper elements. A boundary that always renders
     * the error UI would block every page from loading.
     */
    it("renders children when no error has been thrown", () => {
      renderWithError();
      expect(screen.getByTestId("healthy-child")).toBeInTheDocument();
    });

    /**
     * TEST 2
     * Why: The error UI must NOT appear when children render successfully.
     * role="alert" appearing on every page would immediately trigger AT
     * announcements on every route — a severe false-positive for blind users.
     */
    it("does not render the error UI when no error has been thrown", () => {
      renderWithError();
      expect(screen.queryByRole("alert")).not.toBeInTheDocument();
    });
  });

  // ─── 2. Error UI rendering ────────────────────────────────────────────────

  describe("Error UI — after a child throws", () => {
    /**
     * TEST 3
     * Why: The error container must have role="alert" so screen readers
     * immediately announce the error state when it appears. Without this,
     * blind users receive no indication that the page failed — they may wait
     * indefinitely for content that will never load.
     */
    it("renders a div with role='alert' when a child throws", () => {
      triggerError();
      expect(screen.getByRole("alert")).toBeInTheDocument();
    });

    /**
     * TEST 4
     * Why: The h1 must display the error message from i18n. It is the first
     * heading a sighted user sees after a crash — a missing or raw-key heading
     * ("error-boundary.h1") leaves users without any contextual explanation.
     */
    it("renders the h1 error message from i18n", () => {
      triggerError();
      expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(
        "Something went wrong.",
      );
    });

    /**
     * TEST 5
     * Why: The lead paragraph gives human context to the error. Without it
     * the error screen is just an h1 and a button — no empathy, no explanation.
     * It also confirms the i18n pipeline works for the error-boundary namespace.
     */
    it("renders the lead paragraph from i18n", () => {
      triggerError();
      expect(
        screen.getByText("Our frontend crew hit turbulence."),
      ).toBeInTheDocument();
    });

    /**
     * TEST 6
     * Why: The "Try Again" button must render and be keyboard-accessible. It
     * is the only recovery action available to users — without it the error
     * state is a dead end that requires a full page reload to escape.
     */
    it("renders the 'Try Again' button with the correct label from i18n", () => {
      triggerError();
      expect(
        screen.getByRole("button", { name: "Try Again" }),
      ).toBeInTheDocument();
    });

    /**
     * TEST 7
     * Why: Children must NOT render when the error UI is showing. Rendering
     * both the error alert and the broken children simultaneously would produce
     * a confusing double-render and potentially re-throw the same error.
     */
    it("does not render children when the error UI is shown", () => {
      triggerError();
      expect(screen.queryByTestId("healthy-child")).not.toBeInTheDocument();
    });
  });

  // ─── 3. Document metadata on error ───────────────────────────────────────

  describe("Document metadata on error", () => {
    /**
     * TEST 8
     * Why: The page title must switch to the error title when the boundary
     * catches. Without this the browser tab still shows the previous route's
     * title — users get no indication from the tab that something went wrong.
     */
    it("sets document.title to the error page title from i18n", () => {
      triggerError();
      expect(document.title).toBe("Page Error — OnePiece Coding");
    });

    /**
     * TEST 9
     * Why: The error meta description must be set. Search engines or social
     * scrapers that hit a cached error page need a meaningful description —
     * a raw key ("error-boundary.metaDescription") in the meta tag would
     * be indexed as the page description.
     */
    it("renders a meta description without a raw i18n key", () => {
      triggerError();
      const meta = document.querySelector("meta[name='description']");
      expect(meta).not.toBeNull();
      expect(meta?.getAttribute("content")).not.toMatch(/^error-boundary\./);
      expect(meta?.getAttribute("content")?.length).toBeGreaterThan(20);
    });
  });

  // ─── 4. Fallback strings ──────────────────────────────────────────────────

  describe("i18n fallback strings", () => {
    /**
     * TEST 10
     * Why: Every t() call in ErrorBoundary passes a hardcoded fallback string
     * as the second argument. This ensures the UI is always readable even if
     * the i18n HTTP backend fails to load (e.g. offline or CDN outage) —
     * exactly the scenario where an error boundary is most likely to activate.
     * Verify no raw key leaks into the rendered text.
     */
    it("renders no raw i18n keys in the error UI text content", () => {
      triggerError();
      const alert = screen.getByRole("alert");
      // Raw keys always contain "error-boundary." namespace prefix
      expect(alert.textContent).not.toMatch(/error-boundary\.\w+/);
    });
  });

  // ─── 5. Recovery — handleReset ────────────────────────────────────────────

  describe("Recovery via 'Try Again'", () => {
    /**
     * TEST 11
     * Why: Clicking "Try Again" must call setState({ hasError: false }) which
     * causes React to re-render children. If the child no longer throws, the
     * healthy content must replace the error UI. Without this, the error
     * screen is a one-way door — users can never recover without a full reload.
     */
    it("restores children after clicking 'Try Again' when the child recovers", async () => {
      const user = userEvent.setup();
      triggerError();

      // Confirm error UI is showing
      expect(screen.getByRole("alert")).toBeInTheDocument();

      // Fix the child so it no longer throws on next render
      shouldThrow = false;

      await user.click(screen.getByRole("button", { name: "Try Again" }));

      expect(screen.queryByRole("alert")).not.toBeInTheDocument();
      expect(screen.getByTestId("healthy-child")).toBeInTheDocument();
    });

    /**
     * TEST 12
     * Why: If the child still throws after reset (the underlying problem is
     * not fixed), the boundary must catch again and keep showing the error UI.
     * A reset that permanently disables the boundary would leave broken content
     * rendering without any error protection.
     */
    it("shows the error UI again if the child throws again after reset", async () => {
      const user = userEvent.setup();
      triggerError();

      // Child still throws — shouldThrow remains true
      await user.click(screen.getByRole("button", { name: "Try Again" }));

      // Error boundary must catch the re-throw and show error UI again
      expect(screen.getByRole("alert")).toBeInTheDocument();
    });

    /**
     * TEST 13
     * Why: After a successful recovery, the "Try Again" button must no longer
     * be in the DOM. A lingering alert button on a recovered page would confuse
     * users into thinking an error is still active.
     */
    it("removes the 'Try Again' button after successful recovery", async () => {
      const user = userEvent.setup();
      triggerError();

      shouldThrow = false;
      await user.click(screen.getByRole("button", { name: "Try Again" }));

      expect(
        screen.queryByRole("button", { name: "Try Again" }),
      ).not.toBeInTheDocument();
    });
  });

  // ─── 6. componentDidCatch — dev-mode logging ─────────────────────────────

  describe("componentDidCatch — dev-mode logging guard", () => {
    /**
     * TEST 14
     * Why: In test mode (import.meta.env.MODE === "test"), the conditional
     * `if (import.meta.env.MODE === "development")` must be false — so
     * ErrorBoundary must NOT call console.error itself. Only React's own
     * internal error logging should call console.error during tests.
     * This confirms the dev-only guard works: production and test builds
     * do not leak error stack traces to the console.
     *
     * Note: React itself calls console.error once for uncaught boundary
     * errors — we cannot assert zero calls. Instead we assert that none
     * of the calls include our specific "Runtime Error:" prefix, which
     * is the signature of ErrorBoundary's own logging.
     */
    it("does NOT log 'Runtime Error:' prefix in test mode", () => {
      triggerError();
      const calls = vi.mocked(console.error).mock.calls;
      const runtimeErrorCalls = calls.filter((args) =>
        String(args[0]).includes("Runtime Error:"),
      );
      expect(runtimeErrorCalls).toHaveLength(0);
    });
  });
});

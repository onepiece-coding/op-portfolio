/**
 * @file src/pages/error-element/error-element.test.tsx
 */

import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { useNavigate, useRouteError } from "react-router-dom";
import { renderWithProviders } from "@/test/i18n-test-utils";
import { screen, within } from "@testing-library/react";

import userEvent from "@testing-library/user-event";
import ErrorElement from "./index";

// ─── Mock react-router-dom ────────────────────────────────────────────────────
// Spread the real module so Link and MemoryRouter (used by renderWithProviders)
// continue to work. Only useRouteError and useNavigate are overridden.

const mockNavigate = vi.fn();

vi.mock("react-router-dom", async (importOriginal) => {
  const actual = await importOriginal<typeof import("react-router-dom")>();
  return {
    ...actual,
    useNavigate: vi.fn(),
    useRouteError: vi.fn(),
  };
});

// ─── Fixtures ─────────────────────────────────────────────────────────────────

const statusTextError = {
  statusText: "Not Found",
  status: 404,
  message: "No route matched /xyz",
};

const messageOnlyError = {
  message: "Loader threw an exception",
};

const stackError = {
  message: "Unexpected token",
  stack: "SyntaxError: Unexpected token\n  at parse (bundle.js:42)",
  status: 500,
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

const renderElement = () => renderWithProviders(<ErrorElement />);

const setError = (error: unknown) =>
  vi.mocked(useRouteError).mockReturnValue(error);

// ─── Setup ────────────────────────────────────────────────────────────────────

beforeEach(() => {
  vi.mocked(useNavigate).mockReturnValue(mockNavigate);
  vi.mocked(useRouteError).mockReturnValue(null); // default: no error
  mockNavigate.mockReset();
});

afterEach(() => {
  vi.clearAllMocks();
});

// ─── Tests ───────────────────────────────────────────────────────────────────

describe("ErrorElement", () => {
  // ─── 1. Document metadata ─────────────────────────────────────────────────

  describe("Document metadata", () => {
    /**
     * TEST 1
     * Why: The error page title must update in the browser tab so users can
     * identify the problem from the tab alone. A raw key ("error-element.pageTitle")
     * in the tab is an embarrassing and confusing regression.
     */
    it("sets document.title from i18n", () => {
      renderElement();
      expect(document.title).toBe("Page Error — OnePiece Coding");
    });

    /**
     * TEST 2
     * Why: The meta description must be populated and contain no raw key. A
     * search engine or social scraper that hits the error page needs a real
     * description — "error-element.metaDescription" indexed as content is
     * damaging to the studio's SEO.
     */
    it("renders a non-empty meta description without raw i18n keys", () => {
      renderElement();
      const meta = document.querySelector("meta[name='description']");
      expect(meta).not.toBeNull();
      expect(meta?.getAttribute("content")).not.toMatch(/^error-element\./);
      expect(meta?.getAttribute("content")?.length).toBeGreaterThan(20);
    });
  });

  // ─── 2. Section structure ─────────────────────────────────────────────────

  describe("Section structure", () => {
    /**
     * TEST 3
     * Why: The section must have aria-labelledby="error-heading" so AT users
     * can reach a named region landmark. Without it the error page is
     * an anonymous region — no context about what the section represents.
     */
    it("section has aria-labelledby='error-heading'", () => {
      renderElement();
      expect(
        screen.getByRole("region", { name: "Something went wrong." }),
      ).toBeInTheDocument();
    });

    /**
     * TEST 4
     * Why: The h1 must have id="error-heading" (for aria-labelledby to
     * resolve) and the correct translated text. A wrong id silently breaks
     * the named landmark even if the heading text renders correctly.
     */
    it("h1 has id='error-heading' and correct text from i18n", () => {
      renderElement();
      const h1 = screen.getByRole("heading", { level: 1 });
      expect(h1).toHaveAttribute("id", "error-heading");
      expect(h1).toHaveTextContent("Something went wrong.");
    });

    /**
     * TEST 5
     * Why: The lead paragraph gives context to the error state. A missing
     * translation leaves users with only the heading and a button — no
     * explanation of what happened or what they can do.
     */
    it("renders the lead paragraph from i18n", () => {
      renderElement();
      expect(
        screen.getByText(/We couldn't load that page/),
      ).toBeInTheDocument();
    });
  });

  // ─── 3. Message priority chain ────────────────────────────────────────────

  describe("Message resolution", () => {
    /**
     * TEST 6
     * Why: statusText takes highest priority — it is the HTTP-level reason
     * phrase and the most user-relevant description. If it is bypassed in
     * favour of message, a "404 Not Found" error shows a technical exception
     * message instead of the human-readable status text.
     */
    it("uses statusText when the error has one", () => {
      setError(statusTextError);
      renderElement();
      const pre = document.querySelector("pre")!;
      expect(pre.textContent).toContain("Not Found");
    });

    /**
     * TEST 7
     * Why: When statusText is absent, message must be used. This covers
     * JavaScript errors thrown inside loaders — they have a message property
     * but no statusText.
     */
    it("falls back to message when statusText is absent", () => {
      setError(messageOnlyError);
      renderElement();
      const pre = document.querySelector("pre")!;
      expect(pre.textContent).toContain("Loader threw an exception");
    });

    /**
     * TEST 8
     * Why: When useRouteError returns null (isRouteError fails), error is null
     * and the message must fall back to the i18n errorMsg key. Without this
     * fallback the pre renders blank — users see an empty technical details
     * panel with no information.
     */
    it("falls back to the i18n errorMsg when there is no route error", () => {
      renderElement();
      const pre = document.querySelector("pre")!;
      expect(pre.textContent).toContain("An unexpected error occurred.");
    });
  });

  // ─── 4. Actions ───────────────────────────────────────────────────────────

  describe("Actions", () => {
    /**
     * TEST 9
     * Why: Clicking "Go back" must call navigate(-1). Without this the button
     * renders but does nothing — users have no way to return to the page they
     * came from after hitting the error page.
     */
    it("'Go back' button calls navigate(-1)", async () => {
      const user = userEvent.setup();
      renderElement();
      await user.click(screen.getByRole("button", { name: "Go back" }));
      expect(mockNavigate).toHaveBeenCalledWith(-1);
    });

    /**
     * TEST 10
     * Why: The "Go home" link must navigate to "/" — the root route. A wrong
     * href routes users to a broken URL. It also uses replace so the error
     * page is not pushed to history — confirmed via href value.
     */
    it("'Go home' link has href='/'", () => {
      renderElement();
      expect(screen.getByRole("link", { name: "Go home" })).toHaveAttribute(
        "href",
        "/",
      );
    });

    /**
     * TEST 11
     * Why: The "Report issue" link must be a mailto link targeting the studio
     * email. Without the correct address, error reports go nowhere — support
     * is inaccessible from the error page.
     */
    it("'Report issue' is a mailto link to the studio email", () => {
      renderElement();
      const reportLink = screen.getByRole("link", { name: "Report issue" });
      expect(reportLink.getAttribute("href")).toMatch(
        /^mailto:onepiece\.codingpar@gmail\.com/,
      );
    });

    /**
     * TEST 12
     * Why: The mailto body must include the error message so engineers
     * receive actionable reports. Without the encoded message, every report
     * arrives with no error details — impossible to diagnose from the email.
     */
    it("'Report issue' href includes the error message in the body", () => {
      setError(messageOnlyError);
      renderElement();
      const reportLink = screen.getByRole("link", { name: "Report issue" });
      const href = reportLink.getAttribute("href") ?? "";
      // The message must appear URL-encoded in the body param
      expect(href).toContain(encodeURIComponent("Loader threw an exception"));
    });

    /**
     * TEST 13
     * Why: The mailto must include a subject line ("Site error report")
     * so reports are filterable in the studio's inbox. Without the subject,
     * every error report arrives with no subject — hard to prioritise.
     */
    it("'Report issue' href includes the subject parameter", () => {
      renderElement();
      const href =
        screen
          .getByRole("link", { name: "Report issue" })
          .getAttribute("href") ?? "";
      expect(href).toContain("subject=Site%20error%20report");
    });
  });

  // ─── 5. Technical details (details/summary/pre) ───────────────────────────

  describe("Technical details", () => {
    /**
     * TEST 14
     * Why: The <summary> must render the "Technical details" label from i18n.
     * Without it the disclosure widget has no visible label — sighted users
     * see a blank triangle with no explanation of what it reveals.
     */
    it("renders 'Technical details' as the summary label from i18n", () => {
      renderElement();
      expect(screen.getByText("Technical details")).toBeInTheDocument();
    });

    /**
     * TEST 15
     * Why: The <pre> must contain the resolved message. This is the primary
     * diagnostic content — engineers and power-users rely on it to identify
     * the error before copying it into a bug report.
     */
    it("pre contains the error message", () => {
      setError(statusTextError);
      renderElement();
      expect(document.querySelector("pre")!.textContent).toContain("Not Found");
    });

    /**
     * TEST 16
     * Why: When the error has a status code, the pre must include
     * "Status: 404". Without the status line, engineers lose the HTTP
     * classification — important context for routing vs. server errors.
     */
    it("pre includes 'Status: N' when error.status is present", () => {
      setError(statusTextError);
      renderElement();
      expect(document.querySelector("pre")!.textContent).toContain(
        "Status: 404",
      );
    });

    /**
     * TEST 17
     * Why: When status is absent, "Status:" must not appear. Including a
     * blank "Status:" line would look like a rendering bug and confuse users
     * reading the technical details.
     */
    it("pre does NOT include 'Status:' when error.status is absent", () => {
      setError(messageOnlyError);
      renderElement();
      expect(document.querySelector("pre")!.textContent).not.toContain(
        "Status:",
      );
    });

    /**
     * TEST 18
     * Why: When the error has a stack trace, it must appear in the pre.
     * Stack traces are the most actionable debugging information available —
     * silently omitting them makes remote bug reports almost impossible to fix.
     */
    it("pre includes the stack trace when error.stack is present", () => {
      setError(stackError);
      renderElement();
      expect(document.querySelector("pre")!.textContent).toContain(
        "SyntaxError: Unexpected token",
      );
    });

    /**
     * TEST 19
     * Why: When stack is absent, no "undefined" or blank line must appear
     * in the pre. The conditional `error?.stack ? ... : ""` guard must work —
     * a failed conditional that renders the literal string "undefined" is
     * an immediate visual regression.
     */
    it("pre does not contain 'undefined' when error.stack is absent", () => {
      setError(messageOnlyError);
      renderElement();
      expect(document.querySelector("pre")!.textContent).not.toContain(
        "undefined",
      );
    });
  });

  // ─── 6. Aside / help panel ────────────────────────────────────────────────

  describe("Help aside", () => {
    /**
     * TEST 20
     * Why: The aside must be a named landmark (aria-labelledby="help-heading").
     * Without a name, AT users cannot distinguish the help panel from the
     * main error card when navigating by landmarks.
     */
    it("aside is a named complementary landmark", () => {
      renderElement();
      expect(
        screen.getByRole("complementary", { name: "Need immediate help?" }),
      ).toBeInTheDocument();
    });

    /**
     * TEST 21
     * Why: The h2 must have id="help-heading" for aria-labelledby to resolve.
     * A wrong id silently breaks the landmark name even if the heading text
     * renders correctly.
     */
    it("h2 has id='help-heading' and correct text from i18n", () => {
      renderElement();
      const h2 = screen.getByRole("heading", { level: 2 });
      expect(h2).toHaveAttribute("id", "help-heading");
      expect(h2).toHaveTextContent("Need immediate help?");
    });

    /**
     * TEST 22
     * Why: The WhatsApp link in the aside is external — it must have
     * target="_blank" and rel="noopener noreferrer". Without the rel
     * attribute the linked WhatsApp page can access window.opener
     * (reverse tabnapping).
     */
    it("WhatsApp link is external with correct rel", () => {
      renderElement();
      const aside = screen.getByRole("complementary");
      const wpLink = within(aside).getByRole("link", { name: "WhatsApp" });
      expect(wpLink).toHaveAttribute("target", "_blank");
      expect(wpLink).toHaveAttribute("rel", "noopener noreferrer");
      expect(wpLink.getAttribute("href")).toContain("wa.me/212696514234");
    });

    /**
     * TEST 23
     * Why: The "See projects" link must have href="/projects". This is a
     * React Router Link rendered inside the aside — a wrong path routes
     * users to a 404 instead of the projects portfolio page.
     */
    it("'See projects' link has href='/projects'", () => {
      renderElement();
      const aside = screen.getByRole("complementary");
      expect(
        within(aside).getByRole("link", { name: "See projects" }),
      ).toHaveAttribute("href", "/projects");
    });
  });

  // ─── 7. console.error logging ─────────────────────────────────────────────

  describe("useEffect console.error logging", () => {
    /**
     * TEST 24
     * Why: When a route error is present, componentDidCatch/useEffect logs
     * console.error("Route error:", error). This is the only mechanism
     * that surfaces route errors in production monitoring. Without the log,
     * routing failures are silent — invisible to error tracking services.
     */
    it("logs 'Route error:' to console.error when an error is present", () => {
      const spy = vi.spyOn(console, "error").mockImplementation(() => {});
      setError(statusTextError);
      renderElement();
      const routeErrorCalls = spy.mock.calls.filter((args) =>
        String(args[0]).includes("Route error:"),
      );
      expect(routeErrorCalls).toHaveLength(1);
      spy.mockRestore();
    });

    /**
     * TEST 25
     * Why: When useRouteError returns null (isRouteError fails → error = null),
     * the useEffect condition `if (error)` is false — console.error must NOT
     * be called with "Route error:". Logging a null error would clutter
     * monitoring dashboards with false-positive entries on every 404 page load.
     */
    it("does NOT log 'Route error:' when there is no route error", () => {
      const spy = vi.spyOn(console, "error").mockImplementation(() => {});
      renderElement(); // useRouteError returns null by default
      const routeErrorCalls = spy.mock.calls.filter((args) =>
        String(args[0]).includes("Route error:"),
      );
      expect(routeErrorCalls).toHaveLength(0);
      spy.mockRestore();
    });
  });

  // ─── 8. i18n guard ────────────────────────────────────────────────────────

  /**
   * TEST 26
   * Why: No raw i18n key may appear anywhere in the error page. Every user-
   * facing string comes from t() with a hardcoded fallback — a broken
   * namespace load must show the fallback, not "error-element.h1". On an
   * error page — where the user is already confused — machine-readable keys
   * would make the experience dramatically worse.
   */
  it("renders no raw i18n keys in the page text content", () => {
    renderElement();
    const section = screen.getByRole("region");
    expect(section.textContent).not.toMatch(/\berror-element\.\w+/);
  });
});

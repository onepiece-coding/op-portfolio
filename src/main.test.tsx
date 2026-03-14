/**
 * @file src/main.test.tsx
 */

import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";

// ─── Mocks ────────────────────────────────────────────────────────────────────

const mockCreateRoot = vi.fn(() => ({ render: mockRender }));
const mockRender = vi.fn();

vi.mock("react-dom/client", () => ({
  createRoot: mockCreateRoot,
}));

vi.mock("./routes/app-router", () => ({
  default: () => null,
}));

vi.mock("./styles/variables.css", () => ({}));
vi.mock("./styles/globals.css", () => ({}));

// ─── i18n mock factory ────────────────────────────────────────────────────────

const makeI18nMock = (isInitialized: boolean) => {
  const listeners: Record<string, (() => void)[]> = {};
  return {
    isInitialized,
    on: vi.fn((event: string, cb: () => void) => {
      listeners[event] = listeners[event] ?? [];
      listeners[event].push(cb);
    }),
    // Helper: simulate the event firing
    _emit: (event: string) => listeners[event]?.forEach((cb) => cb()),
  };
};

// ─── Tests ────────────────────────────────────────────────────────────────────

describe("main.tsx — mounting logic", () => {
  beforeEach(() => {
    // Ensure #root exists in jsdom
    document.body.innerHTML = '<div id="root"></div>';
    mockRender.mockClear();
    mockCreateRoot.mockClear();
  });

  afterEach(() => {
    vi.resetModules();
  });

  /**
   * TEST 1
   * Category: 🧩 Edge Cases / Side Effects
   * Why: When i18n is already initialised (warm cache in dev, browser-cached
   * JSON on repeat visits) the app must mount immediately without waiting for
   * any event. If this path is broken the app is permanently blank on every
   * page reload after the first.
   */
  it("mounts immediately when i18n.isInitialized is true", async () => {
    const i18nMock = makeI18nMock(true);

    vi.doMock("@/i18n", () => ({ default: i18nMock }));

    // Import AFTER mocks are registered
    await import("./main");

    expect(mockCreateRoot).toHaveBeenCalledWith(
      document.getElementById("root"),
    );
    expect(mockRender).toHaveBeenCalledTimes(1);
  });

  /**
   * TEST 2
   * Category: 🧩 Edge Cases / Side Effects
   * Why: When i18n has NOT yet initialised (first load, cold cache) the app
   * must NOT render before the translations are ready — that would flash
   * raw translation keys like "hero.h1" to the user.
   */
  it("does NOT mount before the initialized event when isInitialized is false", async () => {
    const i18nMock = makeI18nMock(false);

    vi.doMock("@/i18n", () => ({ default: i18nMock }));

    await import("./main");

    // Event has not fired yet — render must not have been called
    expect(mockRender).not.toHaveBeenCalled();
  });

  /**
   * TEST 3
   * Category: 🧩 Edge Cases / Side Effects
   * Why: Once the initialized event fires the app must mount exactly once.
   * If mount() is called multiple times React throws "createRoot was called
   * on a container that has already been passed to createRoot".
   */
  it("mounts exactly once when initialized event fires", async () => {
    const i18nMock = makeI18nMock(false);

    vi.doMock("@/i18n", () => ({ default: i18nMock }));

    await import("./main");

    // Simulate i18next finishing initialisation
    i18nMock._emit("initialized");

    expect(mockCreateRoot).toHaveBeenCalledTimes(1);
    expect(mockRender).toHaveBeenCalledTimes(1);
  });

  /**
   * TEST 4
   * Category: 🧩 Edge Cases
   * Why: The app must mount to the #root element specifically — not to body
   * or any other container. If getElementById("root") returns null React
   * throws, which would require the non-null assertion to protect correctly.
   */
  it("mounts into the #root DOM element", async () => {
    const i18nMock = makeI18nMock(true);

    vi.doMock("@/i18n", () => ({ default: i18nMock }));

    await import("./main");

    const rootEl = document.getElementById("root");
    expect(mockCreateRoot).toHaveBeenCalledWith(rootEl);
  });
});

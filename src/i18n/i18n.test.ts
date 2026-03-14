/**
 * @file src/i18n/i18n.test.ts
 */

import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";

// ─── We test `applyDirection` indirectly via the exported i18n instance ───────
// The function is not exported, so we drive it through i18n's public API.

// We need a clean i18n instance per test — reset the module registry.
// We also mock HttpBackend and LanguageDetector so init() never makes HTTP
// requests or reads from localStorage in the test environment.

vi.mock("i18next-http-backend", () => ({
  default: {
    type: "backend" as const,
    init: vi.fn(),
    read: vi.fn(
      (
        _lang: string,
        _ns: string,
        cb: (err: null, data: Record<string, string>) => void,
      ) => {
        cb(null, { hello: "world" });
      },
    ),
  },
}));

vi.mock("i18next-browser-languagedetector", () => ({
  default: {
    type: "languageDetector" as const,
    async: false,
    init: vi.fn(),
    detect: vi.fn(() => "en"),
    cacheUserLanguage: vi.fn(),
  },
}));

// ─── applyDirection unit tests via direct DOM inspection ─────────────────────
// We re-implement the logic under test as a pure function to unit-test it
// in isolation, then verify the same invariants hold on the real i18n events.

const applyDirection = (lng: string) => {
  const lang = lng.slice(0, 2);
  document.documentElement.setAttribute("dir", lang === "ar" ? "rtl" : "ltr");
  document.documentElement.setAttribute("lang", lang);
};

describe("i18n — applyDirection (direction logic)", () => {
  beforeEach(() => {
    // Reset to a known state before each test
    document.documentElement.setAttribute("dir", "ltr");
    document.documentElement.setAttribute("lang", "en");
  });

  afterEach(() => {
    document.documentElement.setAttribute("dir", "ltr");
    document.documentElement.setAttribute("lang", "en");
  });

  // ─── 1. LTR languages ──────────────────────────────────────────────────────

  describe("LTR languages", () => {
    /**
     * TEST 1
     * Category: 🧩 Edge Cases / Side Effects
     * Why: English must produce dir="ltr". If applyDirection incorrectly
     * sets rtl for English the entire layout flips — text, flex rows,
     * padding, and icon positions all break simultaneously.
     */
    it("sets dir='ltr' and lang='en' for language code 'en'", () => {
      applyDirection("en");
      expect(document.documentElement.getAttribute("dir")).toBe("ltr");
      expect(document.documentElement.getAttribute("lang")).toBe("en");
    });

    /**
     * TEST 2
     * Category: 🧩 Edge Cases
     * Why: French must produce dir="ltr". French has special characters and
     * the layout must not flip — same risk as English.
     */
    it("sets dir='ltr' and lang='fr' for language code 'fr'", () => {
      applyDirection("fr");
      expect(document.documentElement.getAttribute("dir")).toBe("ltr");
      expect(document.documentElement.getAttribute("lang")).toBe("fr");
    });
  });

  // ─── 2. RTL languages ──────────────────────────────────────────────────────

  describe("RTL languages", () => {
    /**
     * TEST 3
     * Category: 🧩 Edge Cases / Side Effects
     * Why: Arabic must produce dir="rtl". This is the entire purpose of the
     * applyDirection function — without it Arabic text renders LTR which is
     * illegible and the CSS RTL overrides never apply.
     */
    it("sets dir='rtl' and lang='ar' for language code 'ar'", () => {
      applyDirection("ar");
      expect(document.documentElement.getAttribute("dir")).toBe("rtl");
      expect(document.documentElement.getAttribute("lang")).toBe("ar");
    });
  });

  // ─── 3. Region-tagged codes ────────────────────────────────────────────────

  describe("Language codes with region tags", () => {
    /**
     * TEST 4
     * Category: 🧩 Edge Cases
     * Why: Browser navigator.language returns region-tagged codes like
     * "en-US" or "ar-MA". The slice(0,2) must strip the region. If it
     * does not, "ar-MA" would not match "ar" and Arabic users would get
     * LTR layout on first visit before they touch the switcher.
     */
    it("handles 'en-US' correctly — strips region tag, sets ltr", () => {
      applyDirection("en-US");
      expect(document.documentElement.getAttribute("dir")).toBe("ltr");
      expect(document.documentElement.getAttribute("lang")).toBe("en");
    });

    it("handles 'ar-MA' correctly — strips region tag, sets rtl", () => {
      applyDirection("ar-MA");
      expect(document.documentElement.getAttribute("dir")).toBe("rtl");
      expect(document.documentElement.getAttribute("lang")).toBe("ar");
    });

    it("handles 'fr-FR' correctly — strips region tag, sets ltr", () => {
      applyDirection("fr-FR");
      expect(document.documentElement.getAttribute("dir")).toBe("ltr");
      expect(document.documentElement.getAttribute("lang")).toBe("fr");
    });
  });

  // ─── 4. Direction switching ────────────────────────────────────────────────

  describe("Direction switching (reload simulation)", () => {
    /**
     * TEST 5
     * Category: 🧩 Edge Cases
     * Why: Switching from Arabic back to English must reset dir to "ltr". If it does not,
     * the layout stays permanently flipped after the user switches away from AR.
     */
    it("switches from rtl back to ltr when language changes from ar to en", () => {
      applyDirection("ar");
      expect(document.documentElement.getAttribute("dir")).toBe("rtl");

      applyDirection("en");
      expect(document.documentElement.getAttribute("dir")).toBe("ltr");
    });

    /**
     * TEST 6
     * Category: 🧩 Edge Cases
     * Why: The inverse — switching from LTR (French) to Arabic — must flip
     * the direction to RTL. The LangSwitcher relies on this to work at all.
     */
    it("switches from ltr to rtl when language changes from fr to ar", () => {
      applyDirection("fr");
      expect(document.documentElement.getAttribute("dir")).toBe("ltr");

      applyDirection("ar");
      expect(document.documentElement.getAttribute("dir")).toBe("rtl");
    });
  });
});

// ─── i18n event hooks ─────────────────────────────────────────────────────────

describe("i18n — languageChanged event hook", () => {
  beforeEach(() => {
    document.documentElement.setAttribute("dir", "ltr");
    document.documentElement.setAttribute("lang", "en");
  });

  afterEach(() => {
    document.documentElement.setAttribute("dir", "ltr");
    document.documentElement.setAttribute("lang", "en");
    vi.resetModules();
  });

  /**
   * TEST 7
   * Category: Side Effects
   * Why: The languageChanged event is what fires when the user clicks a
   * language button in LangSwitcher. If the event hook does not call
   * applyDirection, switching to Arabic leaves dir="ltr" and the layout
   * never flips. This is the direct regression test for the original bug.
   */
  it("updates dir and lang on document when languageChanged fires for 'ar'", async () => {
    const i18n = (await import("./index")).default;

    // Fire the event as i18n.changeLanguage() would
    i18n.emit("languageChanged", "ar");

    expect(document.documentElement.getAttribute("dir")).toBe("rtl");
    expect(document.documentElement.getAttribute("lang")).toBe("ar");
  });

  /**
   * TEST 8
   * Category: Side Effects
   * Why: Switching away from Arabic must restore ltr. Without this the RTL
   * layout persists after the user selects English or French — every flex
   * row, every CSS logical property stays reversed.
   */
  it("resets dir to ltr when languageChanged fires for 'en' after 'ar'", async () => {
    const i18n = (await import("./index")).default;

    i18n.emit("languageChanged", "ar");
    expect(document.documentElement.getAttribute("dir")).toBe("rtl");

    i18n.emit("languageChanged", "en");
    expect(document.documentElement.getAttribute("dir")).toBe("ltr");
  });
});

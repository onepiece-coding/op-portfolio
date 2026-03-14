/**
 * @file src/components/common/navbar/brand/brand.test.tsx
 */

import { renderWithProviders } from "@/test/i18n-test-utils";
import { screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";

import NavBrand from "./index";

describe("NavBrand", () => {
  // ─── Rendering ─────────────────────────────────────────────────────────────

  describe("Rendering", () => {
    /**
     * TEST 1
     * Category: 🧱 Rendering
     * Why: Brand name must always be visible — it is the primary identity
     * marker. If it disappears the user cannot tell what site they are on.
     */
    it("renders the brand name from i18n", () => {
      renderWithProviders(<NavBrand />);
      expect(screen.getByText("OnePiece Coding")).toBeInTheDocument();
    });

    /**
     * TEST 2
     * Category: 🧱 Rendering
     * Why: Tagline communicates the studio's positioning. A regression here
     * would silently remove the "Full-Stack React & Node.js Studio" descriptor
     * from both the desktop and mobile nav.
     */
    it("renders the brand tagline from i18n", () => {
      renderWithProviders(<NavBrand />);
      expect(
        screen.getByText("Full-Stack React & Node.js Studio"),
      ).toBeInTheDocument();
    });

    /**
     * TEST 3
     * Category: 🧱 Rendering
     * Why: The logo placeholder "OP" must render with aria-hidden so screen
     * readers skip it. Without aria-hidden the reader announces "OP" before
     * "OnePiece Coding" — redundant and confusing.
     */
    it("renders the logo badge with aria-hidden='true'", () => {
      renderWithProviders(<NavBrand />);
      const logo = screen.getByText("OP");
      expect(logo).toHaveAttribute("aria-hidden", "true");
    });
  });
});

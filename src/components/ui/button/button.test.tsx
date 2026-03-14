/**
 * @file src/components/ui/button/button.test.tsx
 */

import { renderWithProviders } from "@/test/i18n-test-utils";
import { screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";

import Button from "./index";

// renderWithProviders wraps in MemoryRouter — required for <Link> rendering.

describe("Button", () => {
  // ─── Internal (Link) mode ──────────────────────────────────────────────────

  /**
   * TEST 1
   * Why: The default mode renders a React Router <Link>. It must produce
   * an <a> tag so keyboard and AT users can navigate. Without the anchor
   * element the button is unreachable via Tab.
   */
  it("renders an <a> tag for internal navigation", () => {
    renderWithProviders(<Button to="/contact">Contact</Button>);
    expect(screen.getByRole("link", { name: "Contact" })).toBeInTheDocument();
  });

  /**
   * TEST 2
   * Why: The href must resolve to the correct in-app path. React Router
   * prepends the base (handled by the router config) — here we verify the
   * raw `to` prop is reflected in the rendered href so routing is correct.
   */
  it("internal button href matches the to prop", () => {
    renderWithProviders(<Button to="/projects">Projects</Button>);
    expect(screen.getByRole("link")).toHaveAttribute("href", "/projects");
  });

  /**
   * TEST 3
   * Why: Internal links must NOT have target="_blank" — opening in-app pages
   * in a new tab is disruptive UX and not what the `to` prop intends.
   */
  it("internal button does NOT have target='_blank'", () => {
    renderWithProviders(<Button to="/duo">Team</Button>);
    expect(screen.getByRole("link")).not.toHaveAttribute("target");
  });

  // ─── External (anchor) mode ───────────────────────────────────────────────

  /**
   * TEST 4
   * Why: External buttons must render a plain <a> tag (not Link) with
   * target="_blank". If Link is used for external URLs the browser treats
   * them as SPA routes, producing a blank page.
   */
  it("external button has target='_blank'", () => {
    renderWithProviders(
      <Button to="https://github.com" external>
        GitHub
      </Button>,
    );
    expect(screen.getByRole("link")).toHaveAttribute("target", "_blank");
  });

  /**
   * TEST 5
   * Why: External links with target="_blank" must have rel="noopener noreferrer"
   * to prevent reverse tabnapping — the linked page could otherwise access
   * window.opener and redirect the portfolio tab.
   */
  it("external button has rel='noopener noreferrer'", () => {
    renderWithProviders(
      <Button to="https://example.com" external>
        External
      </Button>,
    );
    expect(screen.getByRole("link")).toHaveAttribute(
      "rel",
      "noopener noreferrer",
    );
  });

  /**
   * TEST 6
   * Why: The href on an external button must be the full URL passed via `to`,
   * not a router-resolved path. A wrong href silently sends users to the
   * SPA root or a 404 instead of the external resource.
   */
  it("external button href matches the full URL in the to prop", () => {
    renderWithProviders(
      <Button to="https://github.com/onepiece-coding" external>
        GitHub
      </Button>,
    );
    expect(screen.getByRole("link")).toHaveAttribute(
      "href",
      "https://github.com/onepiece-coding",
    );
  });

  // ─── Variants ─────────────────────────────────────────────────────────────

  /**
   * TEST 7
   * Why: The primary variant must apply its CSS class. Without it the button
   * renders with no background — an invisible CTA on any white section.
   */
  it("applies the primary CSS class for the default variant", () => {
    renderWithProviders(<Button to="/contact">CTA</Button>);
    expect(screen.getByRole("link").className).toMatch(/primary/);
  });

  /**
   * TEST 8
   * Why: The ghost variant must apply its ghost CSS class and NOT the primary
   * class. Mixing classes would produce a visually broken button that applies
   * both a gradient background and a transparent border simultaneously.
   */
  it("applies the ghost CSS class and not primary for variant='ghost'", () => {
    renderWithProviders(
      <Button to="/projects" variant="ghost">
        Ghost
      </Button>,
    );
    const link = screen.getByRole("link");
    expect(link.className).toMatch(/ghost/);
    expect(link.className).not.toMatch(/primary/);
  });

  // ─── Content ──────────────────────────────────────────────────────────────

  /**
   * TEST 9
   * Why: Children must render inside the link. This verifies the Button
   * component does not swallow its content — applicable for both text CTAs
   * and any composed child content.
   */
  it("renders children as the link text", () => {
    renderWithProviders(<Button to="/">Start a brief</Button>);
    expect(screen.getByRole("link")).toHaveTextContent("Start a brief");
  });
});

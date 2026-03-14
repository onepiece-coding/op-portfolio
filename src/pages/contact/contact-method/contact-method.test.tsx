/**
 * @file src/pages/contact/contact-method/contact-method.test.tsx
 */

import { renderWithProviders } from "@/test/i18n-test-utils";
import { screen } from "@testing-library/react";
import { CONTACT_META } from "../contact.data";
import { describe, it, expect } from "vitest";

import ContactMethod from "./index";

// ─── Mocks ────────────────────────────────────────────────────────────────────

const MockIcon = () => <svg data-testid="method-icon" />;

// ─── Fixtures ─────────────────────────────────────────────────────────────────

const whatsappLahcen = {
  id: "whatsapp-lahcen" as const,
  href: "https://wa.me/212696514234?text=Hello%20OnePiece%20Coding",
  Icon: MockIcon,
  external: true,
};

const emailMethod = {
  id: "email" as const,
  href: "mailto:onepiece.codingpar@gmail.com",
  Icon: MockIcon,
  external: false,
};

const availabilityMethod = {
  id: "availability" as const,
  Icon: MockIcon,
  // no href — renders as <div role="note">
};

// ─── Tests ───────────────────────────────────────────────────────────────────

describe("ContactMethod", () => {
  // ─── 1. External link mode ────────────────────────────────────────────────

  describe("External link (href + external=true)", () => {
    /**
     * TEST 1
     * Why: An external WhatsApp or LinkedIn link must render as an <a> so
     * keyboard and AT users can activate it. A non-anchor element cannot
     * receive focus via Tab and cannot be opened by Enter — making the
     * contact channel unreachable without a mouse.
     */
    it("renders as an <a> element when href is provided", () => {
      renderWithProviders(<ContactMethod {...whatsappLahcen} />);
      expect(screen.getByRole("link")).toBeInTheDocument();
    });

    /**
     * TEST 2
     * Why: The href must be the exact URL from the data. A wrong href routes
     * visitors to a different WhatsApp number or a broken link — directly
     * harming the studio's ability to receive client inquiries.
     */
    it("link href matches the provided URL", () => {
      renderWithProviders(<ContactMethod {...whatsappLahcen} />);
      expect(screen.getByRole("link")).toHaveAttribute(
        "href",
        "https://wa.me/212696514234?text=Hello%20OnePiece%20Coding",
      );
    });

    /**
     * TEST 3
     * Why: External links must open in a new tab (target="_blank"). Without
     * this, clicking a WhatsApp or LinkedIn link navigates away from the
     * portfolio — visitors must use the back button to return.
     */
    it("has target='_blank' for external links", () => {
      renderWithProviders(<ContactMethod {...whatsappLahcen} />);
      expect(screen.getByRole("link")).toHaveAttribute("target", "_blank");
    });

    /**
     * TEST 4
     * Why: target="_blank" without rel="noopener noreferrer" is a reverse
     * tabnapping vulnerability. The linked page can access window.opener and
     * redirect the portfolio tab to a phishing page.
     */
    it("has rel='noopener noreferrer' for external links", () => {
      renderWithProviders(<ContactMethod {...whatsappLahcen} />);
      expect(screen.getByRole("link")).toHaveAttribute(
        "rel",
        "noopener noreferrer",
      );
    });

    /**
     * TEST 5
     * Why: The aria-label must come from i18n and must not be a raw key.
     * The icon-only icon with no visible text relies entirely on aria-label
     * for its accessible name — a broken key produces a machine-readable
     * string as the only label for a critical contact action.
     */
    it("link has aria-label from i18n (not a raw key)", () => {
      renderWithProviders(<ContactMethod {...whatsappLahcen} />);
      const link = screen.getByRole("link");
      expect(link.getAttribute("aria-label")).not.toMatch(/^contact\./);
      expect(link.getAttribute("aria-label")).toContain("WhatsApp");
    });
  });

  // ─── 2. Internal link mode ────────────────────────────────────────────────

  describe("Internal link (href + external=false)", () => {
    /**
     * TEST 6
     * Why: An email mailto: link must render as an <a> so the browser can
     * open the mail client when activated. It is internal (no new tab) —
     * a mailto: in a new tab would likely confuse the browser.
     */
    it("renders as an <a> element for the email method", () => {
      renderWithProviders(<ContactMethod {...emailMethod} />);
      expect(screen.getByRole("link")).toBeInTheDocument();
    });

    /**
     * TEST 7
     * Why: An internal link must NOT have target="_blank". Opening a mail
     * client in a new tab is semantically wrong and some browsers block it —
     * the mailto: link must use the current tab for the OS to handle it.
     */
    it("does NOT have target='_blank' for an internal link", () => {
      renderWithProviders(<ContactMethod {...emailMethod} />);
      expect(screen.getByRole("link")).not.toHaveAttribute("target");
    });

    /**
     * TEST 8
     * Why: Without target="_blank", rel="noopener noreferrer" is also absent.
     * Applying it to an internal link would not cause a bug but would be
     * misleading markup — this confirms the conditional spread works correctly.
     */
    it("does NOT have rel='noopener noreferrer' for an internal link", () => {
      renderWithProviders(<ContactMethod {...emailMethod} />);
      expect(screen.getByRole("link")).not.toHaveAttribute("rel");
    });
  });

  // ─── 3. No-href mode (availability) ──────────────────────────────────────

  describe("No-href mode (availability card)", () => {
    /**
     * TEST 9
     * Why: The availability card has no href — it is informational, not
     * actionable. It must NOT render as an <a> because there is no
     * destination to navigate to, and a link with no href is an error.
     */
    it("renders as a div (not a link) when no href is provided", () => {
      renderWithProviders(<ContactMethod {...availabilityMethod} />);
      expect(screen.queryByRole("link")).not.toBeInTheDocument();
    });

    /**
     * TEST 10
     * Why: The wrapping div must have role="note" to communicate its
     * semantics to AT. A plain <div> with no role is anonymous — screen
     * reader users cannot tell whether the availability info is a status
     * message, a label, or part of a form.
     */
    it("renders with role='note' when no href is provided", () => {
      renderWithProviders(<ContactMethod {...availabilityMethod} />);
      expect(screen.getByRole("note")).toBeInTheDocument();
    });

    /**
     * TEST 11
     * Why: The availability meta must come from i18n (via the `??` fallback)
     * since CONTACT_META["availability"] is undefined. If the fallback is
     * missing, the meta line renders blank — the availability information
     * silently disappears from the contact card.
     */
    it("renders the meta from i18n when CONTACT_META[id] is undefined", () => {
      expect(CONTACT_META["availability"]).toBeUndefined();
      renderWithProviders(<ContactMethod {...availabilityMethod} />);
      expect(
        screen.getByText(/Open for freelance and contract work/),
      ).toBeInTheDocument();
    });
  });

  // ─── 4. Meta from CONTACT_META ────────────────────────────────────────────

  describe("Meta from CONTACT_META (non-translatable values)", () => {
    /**
     * TEST 12
     * Why: WhatsApp shows a phone number that must come from CONTACT_META,
     * not from i18n. Phone numbers never change per language — if they were
     * translated, a typo in one locale would silently break the contact
     * number for all speakers of that language.
     */
    it("renders the phone number from CONTACT_META for whatsapp-lahcen", () => {
      renderWithProviders(<ContactMethod {...whatsappLahcen} />);
      expect(screen.getByText("+212 6 96 51 42 34")).toBeInTheDocument();
    });

    /**
     * TEST 13
     * Why: The email method must display the email address from CONTACT_META.
     * Showing the raw address helps users verify they are clicking the right
     * link before activating it — this must come from the data constant, not
     * from a translation that could diverge per locale.
     */
    it("renders the email address from CONTACT_META for email", () => {
      renderWithProviders(<ContactMethod {...emailMethod} />);
      expect(
        screen.getByText("onepiece.codingpar@gmail.com"),
      ).toBeInTheDocument();
    });
  });

  // ─── 5. Title ─────────────────────────────────────────────────────────────

  /**
   * TEST 14
   * Why: The title ("WhatsApp / Lahcen") is the primary visible label for
   * each contact method card. It comes from i18n so language switches update
   * it — a raw key here would appear as "contact.methods.whatsapp-lahcen.title"
   * on the card for all sighted users.
   */
  it("renders the method title from i18n", () => {
    renderWithProviders(<ContactMethod {...whatsappLahcen} />);
    expect(screen.getByText("WhatsApp / Lahcen")).toBeInTheDocument();
  });

  // ─── 6. Icon ──────────────────────────────────────────────────────────────

  /**
   * TEST 15
   * Why: The icon wrapper span must be aria-hidden so the icon SVG is not
   * announced by screen readers. The link's aria-label already describes
   * the action — announcing the icon SVG in addition would produce double
   * narration or meaningless noise.
   */
  it("icon wrapper span is aria-hidden='true'", () => {
    renderWithProviders(<ContactMethod {...whatsappLahcen} />);
    const icon = screen.getByTestId("method-icon");
    expect(icon.closest("[aria-hidden='true']")).not.toBeNull();
  });
});

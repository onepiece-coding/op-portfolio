/**
 * @file src/components/common/navbar/navbar.data.ts
 */

interface NavITEM {
  readonly labelKey: string;
  readonly to: string;
}

export const NAV_ITEMS = [
  { to: "/", labelKey: "nav.home" },
  { to: "/duo", labelKey: "nav.team" },
  { to: "/projects", labelKey: "nav.projects" },
  { to: "/services", labelKey: "nav.services" },
  { to: "/testimonials", labelKey: "nav.testimonials" },
  { to: "/contact", labelKey: "nav.contact" },
] as const satisfies readonly NavITEM[];

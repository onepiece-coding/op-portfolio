/**
 * @file src/components/common/navbar/navbar.data.ts
 */

interface NavITEM {
  readonly label: string;
  readonly to: string;
}

export const NAV_ITEMS = [
  { to: "/", label: "Hero" },
  { to: "/duo", label: "Duo" },
  { to: "/projects", label: "Projects" },
  { to: "/services", label: "Services" },
  { to: "/testimonials", label: "Testimonials" },
  { to: "/contact", label: "Contact" },
] as const satisfies readonly NavITEM[];

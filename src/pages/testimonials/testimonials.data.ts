/**
 * @file src/pages/testimonials/testimonials.data.ts
 */

export interface Testimonial {
  readonly company: string;
  readonly rating: number;
  readonly quote: string;
  readonly name: string;
  readonly role: string;
  readonly id: string;
}

export const TESTIMONIALS = [
  {
    id: "t1",
    quote:
      "OnePiece Coding helped us ship a production MVP in weeks. The frontend felt lightweight and the API surface was perfectly shaped for our UI — we saw real performance wins immediately.",
    name: "Amina El Idrissi",
    role: "Product Lead",
    company: "Editorial Co",
    rating: 5,
  },
  {
    id: "t2",
    quote:
      "They reduced our client bundle by half and implemented a sensible caching strategy. Our pages now load faster and our hosting bill is more predictable.",
    name: "Jon Pérez",
    role: "CTO",
    company: "NewsFlow",
    rating: 5,
  },
  {
    id: "t3",
    quote:
      "A pragmatic, no-nonsense team. Their audit gave us a prioritized roadmap (P0→P3) that immediately focused our engineers on the highest-impact items.",
    name: "Sara Khan",
    role: "VP Engineering",
    company: "Commerce Lite",
    rating: 4,
  },
] as const satisfies readonly Testimonial[];

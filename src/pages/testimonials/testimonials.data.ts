/**
 * @file src/pages/testimonials/testimonials.data.ts
 */

export interface Testimonial {
  readonly translationKey: "ahmed" | "mustapha" | "asma";
  readonly rating: number;
  readonly name: string;
  readonly id: string;
}

export const TESTIMONIALS = [
  { id: "t1", name: "Ahmed Iben", translationKey: "ahmed", rating: 5 },
  {
    id: "t2",
    name: "Mustapha Bou",
    translationKey: "mustapha",
    rating: 5,
  },
  { id: "t3", name: "Asma Ben", translationKey: "asma", rating: 5 },
] as const satisfies readonly Testimonial[];

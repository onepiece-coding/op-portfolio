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
  { id: "t1", name: "Ahmed Iben Daoud", translationKey: "ahmed", rating: 5 },
  {
    id: "t2",
    name: "Mustapha Bougermez",
    translationKey: "mustapha",
    rating: 5,
  },
  { id: "t3", name: "Asma Ben Baali", translationKey: "asma", rating: 5 },
] as const satisfies readonly Testimonial[];

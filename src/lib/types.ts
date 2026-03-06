/**
 * @file src/lib/types.ts
 */

export type Testimonial = {
  rating?: number; // 1..5
  avatarUrl?: string;
  company?: string;
  quote: string;
  role?: string;
  name: string;
  id: string;
};

export interface RouteError {
  statusText?: string;
  message?: string;
  status?: number;
  stack?: string;
}

/**
 * @file src/pages/contact/contact.data.ts
 */

import {
  ExclamationCircleIcon,
  LinkedInFillIcon,
  WhatsappIcon,
  EmailIcon,
} from "@/components/icons";

export type ContactMethodId =
  | "whatsapp-lahcen"
  | "whatsapp-mohamed"
  | "linkedin-lahcen"
  | "linkedin-mohamed"
  | "email"
  | "availability";

export type HireId = "lahcen" | "mohamed";

export interface IContactMethod {
  readonly Icon: React.ComponentType;
  readonly id: ContactMethodId;
  readonly external?: boolean;
  readonly href?: string;
  // meta stays in data only for non-translatable values (phone, email address, URL slug)
  readonly meta?: string;
}

export interface TeamMemberContact {
  readonly id: HireId;
}

export const CONTACT_METHODS: readonly IContactMethod[] = [
  {
    href: "https://wa.me/212696514234?text=Hello%20OnePiece%20Coding",
    Icon: WhatsappIcon,
    id: "whatsapp-lahcen",
    external: true,
  },
  {
    href: "https://wa.me/212618620089?text=Hello%20OnePiece%20Coding",
    Icon: WhatsappIcon,
    id: "whatsapp-mohamed",
    external: true,
  },
  {
    href: "https://www.linkedin.com/in/lahcen-alhiane-61217239a/",
    Icon: LinkedInFillIcon,
    id: "linkedin-lahcen",
    external: true,
  },
  {
    href: "https://www.linkedin.com/in/mohamed-bouderya-0270142a2/",
    Icon: LinkedInFillIcon,
    id: "linkedin-mohamed",
    external: true,
  },
  {
    href: "mailto:onepiece.codingpar@gmail.com",
    Icon: EmailIcon,
    external: false,
    id: "email",
  },
  { id: "availability", Icon: ExclamationCircleIcon },
] as const satisfies readonly IContactMethod[];

// Non-translatable meta values (phone number, email address — never change per language)
export const CONTACT_META: Record<ContactMethodId, string | undefined> = {
  "linkedin-lahcen": "/in/lahcen-alhiane-61217239a/",
  "linkedin-mohamed": "/in/mohamed-bouderya-0270142a2/",
  email: "onepiece.codingpar@gmail.com",
  "whatsapp-lahcen": "+212 6 96 51 42 34",
  "whatsapp-mohamed": "+212 6 18 62 00 89",
  availability: undefined, // translated in JSON
};

export const HIRE_CARDS: readonly TeamMemberContact[] = [
  { id: "lahcen" },
  { id: "mohamed" },
] as const satisfies readonly TeamMemberContact[];

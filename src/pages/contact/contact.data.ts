/**
 * @file src/pages/contact/contact.data.ts
 */

import {
  EmailIcon,
  ExclamationCircleIcon,
  LinkedInFillIcon,
  WhatsappIcon,
} from "@/components/icons";

export interface IContactMethod {
  readonly Icon: React.ComponentType;
  readonly external?: boolean;
  readonly ariaLabel?: string;
  readonly href?: string;
  readonly title: string;
  readonly meta: string;
  readonly id: string;
}

export interface TeamMemberContact {
  readonly availability: string;
  readonly description: string;
  readonly name: string;
  readonly role: string;
  readonly id: string;
}

export const CONTACT_METHODS: readonly IContactMethod[] = [
  {
    href: "https://wa.me/212696514234?text=Hello%20OnePiece%20Coding",
    ariaLabel: "WhatsApp / Phone (opens in new tab)",
    meta: "+212 6 96 51 42 34",
    title: "Phone / WhatsApp",
    Icon: WhatsappIcon,
    id: "whatsapp",
    external: true,
  },
  {
    href: "https://www.linkedin.com/in/lahcen-alhiane-61217239a/",
    ariaLabel: "LinkedIn profile (opens in new tab)",
    meta: "/in/lahcen-alhiane-61217239a/",
    Icon: LinkedInFillIcon,
    title: "LinkedIn",
    id: "linkedin",
    external: true,
  },
  {
    ariaLabel: "Send email to onepiece.codingpar@gmail.com",
    href: "mailto:onepiece.codingpar@gmail.com",
    meta: "onepiece.codingpar@gmail.com",
    external: false,
    Icon: EmailIcon,
    title: "Email",
    id: "email",
  },
  {
    meta: "Open for freelance & contract roles — respond within 48 hours",
    Icon: ExclamationCircleIcon,
    title: "Availability",
    id: "availability",
  },
];

export const HIRE_CARDS: readonly TeamMemberContact[] = [
  {
    description:
      "React Engineer | performance-first UI, component architecture, accessibility",
    availability: "Available for: Part / Full / Remote frontend roles",
    name: "Lahcen Alhiane — Frontend Lead",
    role: "Frontend Roles",
    id: "lahcen",
  },
  {
    description:
      "Node.js Developer | API design, aggregation pipelines, observability, scaling",
    availability: "Available for: Part / Full / Remote backend roles",
    name: "Mohamed Bouderya — Backend Lead",
    role: "Backend Roles",
    id: "mohamed",
  },
];

/* eslint-disable react-refresh/only-export-components */

/**
 * @file src/test/i18n-test-utils.tsx
 *
 * Shared test utilities: i18n-aware render wrapper and translation fixture.
 * Import this instead of @testing-library/react in every test that needs t().
 */

import { render, type RenderOptions } from "@testing-library/react";
import { initReactI18next, I18nextProvider } from "react-i18next";
import { MemoryRouter } from "react-router-dom";
import type { ReactNode } from "react";

import i18n from "i18next";

// ─── Minimal in-memory i18n instance (no HTTP, no detector) ──────────────────
// Uses English strings verbatim so assertions can target real text.

const enTranslation = {
  nav: {
    home: "Home",
    team: "Our Team",
    projects: "Projects",
    services: "Services",
    testimonials: "Testimonials",
    contact: "Contact",
  },
  navbar: {
    ariaLabel: "Primary",
    linksAriaLabel: "Main navigation",
    hamburgerOpen: "Open navigation menu",
    hamburgerClose: "Close navigation menu",
  },
  brand: {
    name: "OnePiece Coding",
    tagline: "Full-Stack React & Node.js Studio",
  },
  mobileMenu: {
    ariaLabel: "Site navigation",
    navAriaLabel: "Mobile site navigation",
    closeAriaLabel: "Close navigation menu",
    footerText: "Have a project in mind?",
    footerLink: "Start a brief →",
  },
  langSwitcher: {
    groupAriaLabel: "Select language",
    en: "Switch language to English",
    fr: "Switch language to French",
    ar: "Switch language to Arabic",
  },
  footer: {
    ariaLabel: "Site footer",
    copyright: "© {{year}} OnePiece Coding. All rights reserved.",
  },
  hero: {
    pageTitle: "OnePiece Coding — React & Node.js Full-Stack Studio",
    metaDescription:
      "React & TypeScript frontends paired with Node.js backends. OnePiece Coding builds tested, accessible, high-performance MVPs and products. Book a technical brief.",
    kicker: "React & Node.js · Full-Stack Engineering Studio",
    h1: "We build products that are fast, tested, and built to scale.",
    lead: "OnePiece Coding ships clean React frontends and efficient Node.js backends — with TypeScript end-to-end, accessibility baked in, and performance measured, not assumed.",
    socialLinkedIn: "Lahcen Alhiane on LinkedIn (opens in new tab)",
    socialGitHub: "OnePiece Coding on GitHub (opens in new tab)",
    socialEmail: "Send us an email",
    socialNavAriaLabel: "Social links",
    tech1: "React · TypeScript · Redux Toolkit",
    tech2: "Node.js · Express.js · MongoDB · MySQL",
    tech3: "Tested · Accessible · Performance-First",
  },
  duo: {
    pageTitle: "Meet the Team — OnePiece Coding | React & Node.js",
    metaDescription:
      "Lahcen (React & TypeScript) and Mohamed (Node.js & MongoDB).",
    h1: "Two specialists. One coordinated delivery.",
    subhead: "Frontend decisions are shaped by API cost.",
    ctaPrimary: "Start a technical brief",
    ctaGhost: "See our projects",
    footerNote:
      "No handoff waste: UI components are built against real API contracts.",
    members: {
      lahcen: {
        name: "Lahcen Alhiane",
        title: "Frontend Lead — React & TypeScript",
        bio: "Lahcen builds pixel-accurate, resilient React interfaces.",
        resp1: "Component architecture & design system",
        resp2: "Bundle optimisation and Core Web Vitals",
        resp3: "Accessibility compliance and UX fidelity",
      },
      mohamed: {
        name: "Mohamed Bouderya",
        title: "Backend Lead — Node.js & MongoDB",
        bio: "Mohamed designs scalable Node.js APIs and efficient data schemas.",
        resp1: "API design and data modelling",
        resp2: "Query performance, caching, and indexing",
        resp3: "Logging, metrics, and operational readiness",
      },
    },
  },
  projects: {
    pageTitle: "Projects — OnePiece Coding | React & Node.js Case Studies",
    metaDescription: "Full-stack projects by OnePiece Coding.",
    h1: "Projects built end-to-end — frontend and backend, together.",
    lead: "Each project below is planned, built, and shipped by both of us.",
    keyFeaturesLabel: "Key Features",
    githubLinkText: "View on GitHub",
    demoLinkText: "View live demo",
    techAriaLabel: "Technologies used",
    ctaPrimary: "Request a performance audit",
    ctaGhost: "Start a project brief",
    footerNote:
      "Carrying libraries for features a native API handles just as well?",
    items: {
      "op-blog": {
        title: "OP Blog — Production-Ready Full-Stack CMS",
        summary:
          "A full-stack blog platform built for real content operations.",
        groups: [
          {
            groupTitle: "User & Profile Management",
            features: [
              {
                name: "Dynamic Profiles",
                description: "Users update bios and upload profile photos.",
              },
              {
                name: "Zero-Dependency Toasts",
                description: "Custom notification system.",
              },
            ],
          },
          {
            groupTitle: "Admin Suite",
            features: [
              { name: "User Moderation", description: "Full CRUD operations." },
            ],
          },
        ],
      },
    },
  },
  services: {
    pageTitle: "Services — OnePiece Coding | MVP, Scaling & Audits",
    metaDescription: "MVP delivery in weeks, full-stack scaling under load.",
    h1: "What we build, scale, and fix — and how we do it.",
    lead: "Three focused services built around real engineering outcomes.",
    serviceListAriaLabel: "Service offerings",
    bulletsAriaLabel: "What is included",
    footerNote: "Pricing and timeline are scoped per engagement.",
    howItWorks: {
      h2: "How an engagement works",
      step1Strong: "Scope (1–2 hours)",
      step1Text: "— a technical brief to define goals.",
      step2Strong: "Audit & plan",
      step2Text: "— prioritised P0 → P3 fix list.",
      step3Strong: "Execute",
      step3Text: "— implementation sprint.",
      cta: "Start a technical brief",
    },
    items: {
      mvp: {
        title: "MVP Delivery",
        subtitle: "Ship a production-ready product with tight scope.",
        bullets: [
          "Opinionated stack: React + TypeScript frontend.",
          "Well-shaped API contracts before implementation.",
          "Weeks to first deploy, not months.",
          "Production checklist included.",
        ],
        cta: "Book a scoping call",
      },
      scaling: {
        title: "Full-Stack Scaling",
        subtitle: "Make your product handle real traffic.",
        bullets: [
          "API profiling and bottleneck analysis.",
          "Queue-based workers, horizontal Node.js scaling.",
          "Observability plan: structured logs.",
          "Infrastructure recommendations.",
        ],
        cta: "Discuss a scaling plan",
      },
      audit: {
        title: "Performance Audit & Fix Plan",
        subtitle: "A prioritised remediation roadmap.",
        bullets: [
          "Frontend: bundle analysis.",
          "Backend: query plans.",
          "Concrete P0 → P3 fix list.",
          "Optional implementation sprint.",
        ],
        cta: "Request an audit",
      },
    },
  },
  testimonials: {
    pageTitle: "Testimonials — Real Clients & Results | OnePiece Coding",
    metaDescription:
      "Real feedback from clients who worked with OnePiece Coding.",
    h1: "What our clients say — real projects, real feedback.",
    lead: "From booking systems to inventory management and graduation projects.",
    ctaPrimary: "Start a technical brief",
    ctaGhost: "See our projects",
    footerNote: "These are genuine quotes from real clients.",
    carouselAriaLabel: "Client testimonials",
    tablistAriaLabel: "Testimonial navigation",
    prevAriaLabel: "Previous testimonial",
    nextAriaLabel: "Next testimonial",
    clients: {
      ahmed: {
        quote:
          "The booking system they built completely replaced our paper diary.",
        role: "Driving Instructor",
        company: "Alhayat-DR Driving School",
        dotAriaLabel: "Go to testimonial by Ahmed Iben Daoud",
      },
      mustapha: {
        quote:
          "Before this application, tracking stock was a constant headache.",
        role: "CEO",
        company: "Kewoped Distribution",
        dotAriaLabel: "Go to testimonial by Mustapha Bougermez",
      },
      asma: {
        quote:
          "My graduation project needed to handle job applications end-to-end.",
        role: "Computer Science Student — OFPPT",
        company: "PFE Graduation Project",
        dotAriaLabel: "Go to testimonial by Asma Ben Baali",
      },
    },
  },
  contact: {
    pageTitle: "Contact — Hire OnePiece Coding | Frontend & Backend",
    metaDescription:
      "Available for freelance projects, contract roles, and short-term audits.",
    h1: "Let's work together.",
    lead: "We are available for freelance projects, contract roles, and performance audits.",
    contactMethodsH2: "How to reach us",
    hiringH2: "Open for roles",
    ctaPrimary: "Meet the team",
    ctaGhost: "See our projects",
    footerNote: "Send a short message with your project or role description.",
    methods: {
      "whatsapp-lahcen": {
        title: "WhatsApp / Lahcen",
        ariaLabel:
          "Contact me (Lahcen Alhiane | Frontend Lead) on WhatsApp (opens in new tab)",
      },
      "whatsapp-mohamed": {
        title: "WhatsApp / Mohamed",
        ariaLabel:
          "Contact me (Mohamed Bouderya | Backend Lead) on WhatsApp (opens in new tab)",
      },
      "linkedin-lahcen": {
        title: "LinkedIn / Lahcen",
        ariaLabel: "Lahcen Alhiane on LinkedIn (opens in new tab)",
      },
      "linkedin-mohamed": {
        title: "LinkedIn / Mohamed",
        ariaLabel: "Mohamed Bouderya on LinkedIn (opens in new tab)",
      },
      email: {
        title: "Email",
        ariaLabel: "Send an email to onepiece.codingpar@gmail.com",
      },
      availability: {
        title: "Availability",
        meta: "Open for freelance and contract work — replies within 48 hours",
      },
    },
    hire: {
      lahcen: {
        name: "Lahcen Alhiane — Frontend Lead",
        role: "Frontend Engineer",
        description:
          "React & TypeScript — component architecture, performance optimisation, accessibility, CSS Modules, Vite.",
        availability:
          "Available for part-time, full-time, and remote frontend roles",
      },
      mohamed: {
        name: "Mohamed Bouderya — Backend Lead",
        role: "Backend Engineer",
        description:
          "Node.js & TypeScript — API design, data modelling, aggregation pipelines, testing, observability, and scaling.",
        availability:
          "Available for part-time, full-time, and remote backend roles",
      },
    },
  },
  "error-boundary": {
    pageTitle: "Page Error — OnePiece Coding",
    metaDescription:
      "We had trouble loading that page. Try refreshing or return home.",
    h1: "Something went wrong.",
    lead: "Our frontend crew hit turbulence.",
    button: "Try Again",
  },
  "error-element": {
    errorMsg: "An unexpected error occurred.",
    pageTitle: "Page Error — OnePiece Coding",
    metaDescription:
      "We had trouble loading that page. Try refreshing or return home. If the issue persists, report the error to onepiece.codingpar@gmail.com with the page URL.",
    h1: "Something went wrong.",
    lead: "We couldn't load that page. This might be a broken link, a server issue, or a temporary glitch. Try refreshing, or use the links below to continue browsing.",
    primaryBtn: "Go back",
    ghostBtn: "Go home",
    linkText: "Report issue",
    summary: "Technical details",
    sideTitle: "Need immediate help?",
    sideText:
      "Contact us and we’ll assist quickly — share the error details above when you reach out.",
    sideLink: "See projects",
  },
};

const testI18n = i18n.createInstance();
testI18n.use(initReactI18next).init({
  lng: "en",
  fallbackLng: "en",
  resources: { en: { translation: enTranslation } },
  interpolation: { escapeValue: false },
});

// ─── Wrapper ──────────────────────────────────────────────────────────────────

interface WrapperProps {
  children: ReactNode;
  initialPath?: string;
}

const AllProviders = ({ children, initialPath = "/" }: WrapperProps) => (
  <I18nextProvider i18n={testI18n}>
    <MemoryRouter initialEntries={[initialPath]}>{children}</MemoryRouter>
  </I18nextProvider>
);

// ─── Custom render ────────────────────────────────────────────────────────────

const renderWithProviders = (
  ui: ReactNode,
  {
    initialPath = "/",
    ...options
  }: RenderOptions & { initialPath?: string } = {},
) =>
  render(ui, {
    wrapper: ({ children }) => (
      <AllProviders initialPath={initialPath}>{children}</AllProviders>
    ),
    ...options,
  });

export { renderWithProviders, testI18n, enTranslation };

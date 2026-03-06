# OnePiece Coding — Portfolio

> **Frontend + Backend Strike Team** — React & TypeScript frontends paired with Node.js & MongoDB backends.

🔗 **Live:** [onepiece-coding.github.io/op-portfolio](https://onepiece-coding.github.io/op-portfolio/)

---

## Overview

This is the official portfolio for **OnePiece Coding**, a two-person full-stack studio specialising in:

- **Zero-bloat MVPs** — production-ready in weeks, not months
  
- **Full-stack scaling** — API profiling, DB indexing, queue-based workers
  
- **Performance audits** — prioritised P0→P3 remediation roadmaps with impact estimates

Built as a showcase of our own engineering standards: performance-first architecture, predictable state, and a zero-dependency philosophy where native APIs replace third-party libraries.

---

## Team

| | Name | Role |
|---|---|---|
| **LA** | Lahcen Alhiane | Frontend Lead — React & TypeScript |
| **MB** | Mohammed BouDreya | Backend Lead — Node.js & MongoDB |

---

## Tech Stack

### Frontend
| Technology | Purpose |
|---|---|
| React 18+ | UI rendering with concurrent features |
| TypeScript | End-to-end type safety |
| React Router v6 | Client-side routing with lazy-loaded routes |
| Redux Toolkit | Predictable async state management |
| CSS Modules | Scoped, zero-runtime styling |
| Vite | Build tooling & local dev server |

### Backend (featured projects)
| Technology | Purpose |
|---|---|
| Node.js | Server runtime |
| Express | REST API framework |
| MongoDB | Document database |
| TypeScript | Shared type contracts |

---

## Key Engineering Decisions

### Zero-Bloat Philosophy

We replaced common dependencies with native alternatives:

- **Framer Motion** → optimised CSS keyframe animations

- **nanoid** → `crypto.randomUUID()` (native Web API)

- **react-helmet** → React 19 native `<title>` / `<meta>` hoisting

### Performance

- All routes are **code-split** via `React.lazy` + `Suspense`
  
- Static data defined at **module scope** — never inside component render
  
- `will-change: transform` applied only to actively animated elements
  
- `prefers-reduced-motion` respected globally via CSS media query

### Accessibility

- Full keyboard navigation on carousel (scoped arrow key listeners)

- `aria-labelledby` landmark regions on every page section

- `:focus-visible` on all interactive elements — no `:focus` overrides

- `visually-hidden` utility class for screen-reader-only content

- `role="dialog"` + `aria-modal` on mobile menu with focus trap

### Routing on GitHub Pages

SPAs on GitHub Pages 404 on direct URL access. We use the standard `public/404.html` redirect pattern:

1. GitHub serves `404.html` for unknown paths
   
2. `404.html` encodes the path and redirects to `index.html`
  
3. An inline script in `index.html` decodes the path and calls `history.replaceState` before React mounts

---

## Getting Started

### Prerequisites

- Node.js 18+

- npm 9+

### Install & Run

```bash

# Clone the repository

git clone https://github.com/onepiece-coding/op-portfolio.git

cd op-portfolio

# Install dependencies

npm install

# Start development server

npm run dev

# → http://localhost:3000/op-portfolio/

```

### Build & Preview

```bash

# Production build

npm run build

# Preview production build locally

npm run preview

# → http://localhost:4173/op-portfolio/

```

---

## Deployment

The portfolio is deployed to **GitHub Pages** via the `gh-pages` branch.

```bash

# Build and deploy

npm run build

npm run deploy

```

The `base` in `vite.config.ts` is set to `/op-portfolio/` to match the GitHub Pages subdirectory.

---

## Pages

| Route | Page | Description |
|---|---|---|
| `/` | Hero | Landing — stack overview and social links |
| `/duo` | Duo | Team profiles — Lahcen (Frontend) & Mohammed (Backend) |
| `/projects` | Projects | Case studies with key features and tech used |
| `/services` | Services | MVP delivery, scaling, and performance audit offerings |
| `/testimonials` | Testimonials | Client quotes carousel with keyboard navigation |
| `/contact` | Contact | Contact methods and hiring availability |

---

## Contact

| Method | Detail |
|---|---|
| WhatsApp / Phone | +212 6 96 51 42 34 |
| LinkedIn | [/in/lahcen-alhiane-61217239a](https://www.linkedin.com/in/lahcen-alhiane-61217239a/) |
| Email | onepiece.codingpar@gmail.com |

---

## License

© 2026 OnePiece Coding. All rights reserved.

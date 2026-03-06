/**
 * @file src/pages/services/index.tsx
 */

import { SERVICES } from "./services.data";
import { Button } from "@/components/ui";

import styles from "./services.module.css";
import ServiceCard from "./service-card";

const ServicesPage = () => {
  return (
    <>
      <title>Services — MVP, Scaling & Performance Audits</title>
      <meta
        name="description"
        content="Services from OnePiece Coding: MVP delivery in weeks, full-stack scaling, and prioritized performance audits. Outcome-focused plans with measurable impact estimates."
      />
      <section
        id="services"
        className={`${styles.page} page-in`}
        aria-labelledby="services-heading"
      >
        <div className={styles.containerInner}>
          <header className={styles.header}>
            <h1 id="services-heading" className={styles.heading}>
              Services — What we do for high-performance products
            </h1>
            <p className={styles.lead}>
              We offer opinionated, outcome-focused services: ship fast with a
              solid MVP, scale safely as traffic grows, and reduce frontend &
              backend bloat with a prioritized remediation roadmap.
            </p>
          </header>

          <ul aria-label="Service offerings" className={styles.grid}>
            {SERVICES.map((service) => (
              <ServiceCard key={service.id} service={service} />
            ))}
          </ul>

          <section
            className={styles.howItWorks}
            aria-labelledby="engagement-heading"
          >
            <h2 className={styles.smallHeading} id="engagement-heading">
              How we engage?
            </h2>
            <ol className={styles.steps}>
              <li>
                <strong>Scope (1–2 hours)</strong> — technical brief to define
                goals, constraints, and success metrics.
              </li>
              <li>
                <strong>Audit & plan</strong> — prioritized P0→P3 fixes with
                impact estimates.
              </li>
              <li>
                <strong>Execute</strong> — implementation sprint(s) or handoff
                with clear tests and benchmarks.
              </li>
            </ol>
            <div className={styles.howCta}>
              <Button to="/contact">Start a technical brief</Button>
            </div>
          </section>

          <footer className={styles.footer}>
            <p className={styles.footerNote}>
              Pricing & timeline are tailored — we prefer transparent,
              milestone-driven engagement. For typical MVP work we provide a
              fixed-scope estimate after the scoping call.
            </p>
          </footer>
        </div>
      </section>
    </>
  );
};

export default ServicesPage;

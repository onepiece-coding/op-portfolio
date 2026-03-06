/**
 * @file src/pages/testimonials/index.tsx
 */

import { TESTIMONIALS } from "./testimonials.data";
import { getInitials } from "@/lib/dom-utils";
import { Button } from "@/components/ui";
import { useCarousel } from "@/hooks";
import { useRef } from "react";

import styles from "./testimonials.module.css";
import StarRow from "./star-row";

const TestimonialsPage = () => {
  const carouselRef = useRef<HTMLDivElement>(null);

  const { index, goNext, goPrev, goTo } = useCarousel({
    count: TESTIMONIALS.length,
    containerRef: carouselRef,
  });

  return (
    <>
      <title>Testimonials — Clients & Results | OnePiece Coding</title>
      <meta
        name="description"
        content="What product teams say about OnePiece Coding: faster TTI, smaller client payloads, and predictable infrastructure costs. Read client testimonials and impact highlights."
      />

      <section
        aria-labelledby="testimonials-heading"
        className={`${styles.page} page-in`}
        id="testimonials"
      >
        <div className={styles.container}>
          <header className={styles.header}>
            <h1 id="testimonials-heading" className={styles.title}>
              Trusted by product teams who need performance and clarity
            </h1>
            <p className={styles.lead}>
              We pair frontend precision with backend pragmatism to reduce
              client bloat, improve time-to-interactive, and deliver predictable
              infrastructure costs. See what product teams say about working
              with us.
            </p>
          </header>

          <div
            className={styles.carouselWrap}
            aria-label="Client testimonials"
            aria-roledescription="carousel"
            ref={carouselRef}
          >
            <div className={styles.carousel}>
              {TESTIMONIALS.map((testimonial, i) => {
                const active = i === index;
                return (
                  <article
                    className={`${styles.card} ${active ? styles.active : ""}`}
                    id={`testimonial-${testimonial.id}`}
                    tabIndex={active ? 0 : -1}
                    aria-hidden={!active}
                    key={testimonial.id}
                    role="tabpanel"
                  >
                    <blockquote className={styles.quote}>
                      {testimonial.quote}
                    </blockquote>

                    <div className={styles.meta}>
                      <div className={styles.person}>
                        <div className={styles.avatar} aria-hidden="true">
                          {getInitials(testimonial.name)}
                        </div>
                        <div>
                          <div className={styles.name}>{testimonial.name}</div>
                          <div className={styles.role}>
                            {testimonial.role} — {testimonial.company}
                          </div>
                        </div>
                      </div>

                      <div className={styles.rating}>
                        <StarRow value={testimonial.rating} />
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>

            <div className={styles.controls}>
              <button
                onClick={goPrev}
                aria-label="Previous testimonial"
                className={styles.controlBtn}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  fill="none"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15.75 19.5 8.25 12l7.5-7.5"
                  />
                </svg>
              </button>

              <div
                aria-label="Testimonial tabs"
                className={styles.dots}
                role="tablist"
              >
                {TESTIMONIALS.map((testimonial, i) => (
                  <button
                    className={`${styles.dot} ${i === index ? styles.dotActive : ""}`}
                    aria-label={`Go to testimonial by ${testimonial.name}`}
                    aria-controls={`testimonial-${testimonial.id}`}
                    aria-selected={i === index}
                    onClick={() => goTo(i)}
                    key={testimonial.id}
                    role="tab"
                  />
                ))}
              </div>

              <button
                onClick={goNext}
                aria-label="Next testimonial"
                className={styles.controlBtn}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  fill="none"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="m8.25 4.5 7.5 7.5-7.5 7.5"
                  />
                </svg>
              </button>
            </div>
          </div>

          <div className={styles.ctaRow}>
            <Button to="/contact">Start a technical brief</Button>
            <Button to="/projects" variant="ghost">
              See collaborative projects
            </Button>
          </div>

          <footer className={styles.footer}>
            <p className={styles.footerNote}>
              Testimonials are representative client quotes. We can provide
              redacted references and audit reports on request.
            </p>
          </footer>
        </div>
      </section>
    </>
  );
};

export default TestimonialsPage;

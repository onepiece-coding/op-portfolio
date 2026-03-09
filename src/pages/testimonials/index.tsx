/**
 * @file src/pages/testimonials/index.tsx
 */

import { TESTIMONIALS } from "./testimonials.data";
import { useTranslation } from "react-i18next";
import { getInitials } from "@/lib/dom-utils";
import { Button } from "@/components/ui";
import { useCarousel } from "@/hooks";
import { useRef } from "react";

import styles from "./testimonials.module.css";
import StarRow from "./star-row";

const TestimonialsPage = () => {
  const { t } = useTranslation();

  const carouselRef = useRef<HTMLDivElement>(null);

  const { index, goNext, goPrev, goTo } = useCarousel({
    count: TESTIMONIALS.length,
    containerRef: carouselRef,
  });

  return (
    <>
      <title>{t("testimonials.pageTitle")}</title>
      <meta name="description" content={t("testimonials.metaDescription")} />

      <section
        aria-labelledby="testimonials-heading"
        className={`${styles.page} page-in`}
        id="testimonials"
      >
        <div className={styles.container}>
          <header className={styles.header}>
            <h1 id="testimonials-heading" className={styles.title}>
              {t("testimonials.h1")}
            </h1>
            <p className={styles.lead}>{t("testimonials.lead")}</p>
          </header>

          <div
            aria-label={t("testimonials.carouselAriaLabel")}
            className={styles.carouselWrap}
            aria-roledescription="carousel"
            ref={carouselRef}
          >
            <div className={styles.carousel}>
              {TESTIMONIALS.map((testimonial, i) => {
                const active = i === index;
                const key = testimonial.translationKey;
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
                      {t(`testimonials.clients.${key}.quote`)}
                    </blockquote>

                    <div className={styles.meta}>
                      <div className={styles.person}>
                        <div className={styles.avatar} aria-hidden="true">
                          {getInitials(testimonial.name)}
                        </div>
                        <div>
                          <div className={styles.name}>{testimonial.name}</div>
                          <div className={styles.role}>
                            {t(`testimonials.clients.${key}.role`)} —{" "}
                            {t(`testimonials.clients.${key}.company`)}
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
                aria-label={t("testimonials.prevAriaLabel")}
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
                aria-label={t("testimonials.tablistAriaLabel")}
                className={styles.dots}
                role="tablist"
              >
                {TESTIMONIALS.map((testimonial, i) => (
                  <button
                    className={`${styles.dot} ${i === index ? styles.dotActive : ""}`}
                    aria-label={t(
                      `testimonials.clients.${testimonial.translationKey}.dotAriaLabel`,
                    )}
                    aria-controls={`testimonial-${testimonial.id}`}
                    aria-selected={i === index}
                    onClick={() => goTo(i)}
                    key={testimonial.id}
                    role="tab"
                  />
                ))}
              </div>

              <button
                aria-label={t("testimonials.nextAriaLabel")}
                className={styles.controlBtn}
                onClick={goNext}
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
            <Button to="/contact">{t("testimonials.ctaPrimary")}</Button>
            <Button to="/projects" variant="ghost">
              {t("testimonials.ctaGhost")}
            </Button>
          </div>

          <footer className={styles.footer}>
            <p className={styles.footerNote}>{t("testimonials.footerNote")}</p>
          </footer>
        </div>
      </section>
    </>
  );
};

export default TestimonialsPage;

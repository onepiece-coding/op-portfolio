/**
 * @file src/pages/services/index.tsx
 */

import { useTranslation } from "react-i18next";
import { SERVICES } from "./services.data";
import { Button } from "@/components/ui";

import styles from "./styles.module.css";
import ServiceCard from "./service-card";

const ServicesPage = () => {
  const { t } = useTranslation();

  return (
    <>
      <title>{t("services.pageTitle")}</title>
      <meta name="description" content={t("services.metaDescription")} />
      <section
        id="services"
        className={`${styles.page} page-in`}
        aria-labelledby="services-heading"
      >
        <div className={styles.containerInner}>
          <header className={styles.header}>
            <h1 id="services-heading" className={styles.heading}>
              {t("services.h1")}
            </h1>
            <p className={styles.lead}>{t("services.lead")}</p>
          </header>

          <ul
            aria-label={t("services.serviceListAriaLabel")}
            className={styles.grid}
          >
            {SERVICES.map((service) => (
              <ServiceCard key={service.id} service={service} />
            ))}
          </ul>

          <section
            className={styles.howItWorks}
            aria-labelledby="engagement-heading"
          >
            <h2 className={styles.smallHeading} id="engagement-heading">
              {t("services.howItWorks.h2")}
            </h2>
            <ol className={styles.steps}>
              <li>
                <strong>{t("services.howItWorks.step1Strong")}</strong>
                {t("services.howItWorks.step1Text")}
              </li>
              <li>
                <strong>{t("services.howItWorks.step2Strong")}</strong>
                {t("services.howItWorks.step2Text")}
              </li>
              <li>
                <strong>{t("services.howItWorks.step3Strong")}</strong>
                {t("services.howItWorks.step3Text")}
              </li>
            </ol>
            <div className={styles.howCta}>
              <Button to="/contact">{t("services.howItWorks.cta")}</Button>
            </div>
          </section>

          <footer className={styles.footer}>
            <p className={styles.footerNote}>{t("services.footerNote")}</p>
          </footer>
        </div>
      </section>
    </>
  );
};

export default ServicesPage;

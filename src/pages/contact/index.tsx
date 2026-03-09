/**
 * @file src/pages/contact/index.tsx
 */

import { CONTACT_METHODS, HIRE_CARDS } from "./contact.data";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui";

import ContactMethod from "./contact-method";
import styles from "./contact.module.css";
import HireCard from "./hire-card";

const ContactPage = () => {
  const { t } = useTranslation();

  return (
    <>
      <title>{t("contact.pageTitle")}</title>
      <meta name="description" content={t("contact.metaDescription")} />

      <section
        className={`${styles.page} page-in`}
        aria-labelledby="contact-heading"
        id="contact"
      >
        <div className={styles.container}>
          <header className={styles.header}>
            <h1 id="contact-heading" className={styles.title}>
              {t("contact.h1")}
            </h1>
            <p className={styles.lead}>{t("contact.lead")}</p>
          </header>

          <section aria-labelledby="methods-heading">
            <h2 id="methods-heading" className={styles.sectionSubtitle}>
              {t("contact.contactMethodsH2")}
            </h2>

            <div className={styles.methodsGrid}>
              {CONTACT_METHODS.map((contactMethod) => (
                <ContactMethod key={contactMethod.id} {...contactMethod} />
              ))}
            </div>
          </section>

          <section className={styles.hiring} aria-labelledby="hiring-heading">
            <h2 id="hiring-heading" className={styles.sectionSubtitle}>
              {t("contact.hiringH2")}
            </h2>

            <div className={styles.hireGrid}>
              {HIRE_CARDS.map((hireCard) => (
                <HireCard key={hireCard.id} id={hireCard.id} />
              ))}
            </div>
          </section>

          <div className={styles.ctaRow}>
            <Button to="/duo">{t("contact.ctaPrimary")}</Button>
            <Button to="/projects" variant="ghost">
              {t("contact.ctaGhost")}
            </Button>
          </div>

          <footer className={styles.footer}>
            <p className={styles.footerNote}>{t("contact.footerNote")}</p>
          </footer>
        </div>
      </section>
    </>
  );
};

export default ContactPage;

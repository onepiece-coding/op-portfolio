/**
 * @file src/pages/contact/index.tsx
 */

import { CONTACT_METHODS, HIRE_CARDS } from "./contact.data";
import { Button } from "@/components/ui";

import styles from "./contact.module.css";
import HireCard from "./hire-card";
import ContactMethod from "./contact-method";

const ContactPage = () => {
  return (
    <>
      <title>Contact — Hire OnePiece Coding (Frontend & Backend)</title>
      <meta
        name="description"
        content="We’re open for freelance projects and roles. Contact OnePiece Coding via WhatsApp, LinkedIn or email for MVPs, audits, and part/full-time frontend or backend work."
      />

      <section
        className={`${styles.page} page-in`}
        aria-labelledby="contact-heading"
        id="contact"
      >
        <div className={styles.container}>
          <header className={styles.header}>
            <h1 id="contact-heading" className={styles.title}>
              We&apos;re Open for Business
            </h1>
            <p className={styles.lead}>
              OnePiece Coding is available for freelance projects, contract
              roles, and short-term audits. We pair performance-minded frontends
              with pragmatic, efficient backends to ship fast and keep costs
              predictable.
            </p>
          </header>

          <section aria-labelledby="methods-heading">
            <h2 id="methods-heading" className={styles.sectionSubtitle}>
              Contact methods
            </h2>

            <div className={styles.methodsGrid}>
              {CONTACT_METHODS.map((contactMethod) => (
                <ContactMethod key={contactMethod.id} {...contactMethod} />
              ))}
            </div>
          </section>

          <section className={styles.hiring} aria-labelledby="hiring-heading">
            <h2 id="hiring-heading" className={styles.sectionSubtitle}>
              Hiring & Roles
            </h2>

            <div className={styles.hireGrid}>
              {HIRE_CARDS.map((hireCard) => (
                <HireCard key={hireCard.id} {...hireCard} />
              ))}
            </div>
          </section>

          <div className={styles.ctaRow}>
            <Button to="/duo">Want to know more about us?</Button>
            <Button to="/projects" variant="ghost">
              See collaborative projects
            </Button>
          </div>

          <footer className={styles.footer}>
            <p className={styles.footerNote}>
              Want a short scoping note? Send a DM or email with a brief
              description and we’ll reply with next steps.
            </p>
          </footer>
        </div>
      </section>
    </>
  );
};

export default ContactPage;

/**
 * @file src/pages/contact/contact-method/index.tsx
 */

import { CONTACT_META, type IContactMethod } from "../contact.data";
import { useTranslation } from "react-i18next";

import styles from "./styles.module.css";

const ContactMethod = ({ href, external, Icon, id }: IContactMethod) => {
  const { t } = useTranslation();

  const title = t(`contact.methods.${id}.title`);
  const ariaLabel = t(`contact.methods.${id}.ariaLabel`);
  // Non-translatable meta (phone, email) from data; translatable meta (availability) from JSON
  const meta = CONTACT_META[id] ?? t(`contact.methods.${id}.meta`);

  const content = (
    <>
      <span className={styles.icon} aria-hidden="true">
        <Icon />
      </span>
      <div className={styles.methodBody}>
        <div className={styles.methodTitle}>{title}</div>
        <div className={styles.methodMeta}>{meta}</div>
      </div>
    </>
  );

  if (href) {
    return (
      <a
        {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
        className={styles.method}
        aria-label={ariaLabel}
        href={href}
      >
        {content}
      </a>
    );
  }
  return (
    <div className={styles.method} role="note">
      {content}
    </div>
  );
};

export default ContactMethod;

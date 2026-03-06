import type { IContactMethod } from "../contact.data";

import styles from "./contact-method.module.css";

const ContactMethod = ({
  href,
  external,
  ariaLabel,
  Icon,
  title,
  meta,
}: IContactMethod) => {
  if (href) {
    return (
      <a
        {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
        className={styles.method}
        aria-label={ariaLabel}
        href={href}
      >
        <span className={styles.icon} aria-hidden="true">
          <Icon />
        </span>

        <div className={styles.methodBody}>
          <div className={styles.methodTitle}>{title}</div>
          <div className={styles.methodMeta}>{meta}</div>
        </div>
      </a>
    );
  } else {
    return (
      <div className={styles.method} role="note">
        <span className={styles.icon} aria-hidden="true">
          <Icon />
        </span>

        <div className={styles.methodBody}>
          <div className={styles.methodTitle}>{title}</div>
          <div className={styles.methodMeta}>{meta}</div>
        </div>
      </div>
    );
  }
};

export default ContactMethod;

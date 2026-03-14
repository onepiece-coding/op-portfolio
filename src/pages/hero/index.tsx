/**
 * @file src/pages/hero/index.tsx
 */

import { useTranslation } from "react-i18next";
import { SKILLS, SOCIAL } from "./hero.data";

import styles from "./styles.module.css";

const SOCIAL_ARIA_KEYS: Record<string, string> = {
  LinkedIn: "hero.socialLinkedIn",
  GitHub: "hero.socialGitHub",
  Email: "hero.socialEmail",
};

const Hero = () => {
  const { t } = useTranslation();

  return (
    <>
      <title>{t("hero.pageTitle")}</title>
      <meta name="description" content={t("hero.metaDescription")} />

      <section
        className={`${styles.hero} page-in`}
        aria-labelledby="hero-heading"
        id="hero"
      >
        <div className={styles.inner}>
          <div className={styles.left}>
            <div className={`${styles.kicker}`}>{t("hero.kicker")}</div>

            <h1 id="hero-heading" className={`${styles.title}`}>
              {t("hero.h1")}
            </h1>

            <p className={`${styles.lead}`}>{t("hero.lead")}</p>

            <nav
              className={`${styles.socialRow}`}
              aria-label={t("hero.socialNavAriaLabel")}
            >
              {SOCIAL.map(({ label, href, Icon }) => (
                <a
                  aria-label={t(SOCIAL_ARIA_KEYS[label] ?? label)}
                  className={styles.socialBtn}
                  rel="noopener noreferrer"
                  target="_blank"
                  key={label}
                  href={href}
                >
                  <span className={styles.socialIcon}>
                    <Icon />
                  </span>
                </a>
              ))}
            </nav>

            <ul className={`${styles.techList}`}>
              <li>{t("hero.tech1")}</li>
              <li>{t("hero.tech2")}</li>
              <li>{t("hero.tech3")}</li>
            </ul>
          </div>

          <div className={styles.right} aria-hidden="true">
            <div className={styles.logoWrap}>
              <div className={styles.logoCircle} aria-hidden="true">
                <span className={styles.logoText}>OP</span>
              </div>
              {/* <img
                src="/op-portfolio/logo-test.png"
                alt="OnePiece Coding"
                style={{
                  width: "200px",
                  marginTop: "10px",
                }}
              /> */}

              <div className={styles.orbit} aria-hidden="true">
                {SKILLS.map(({ key, label, Icon }) => (
                  <div
                    className={styles.skillBadge}
                    aria-hidden="true"
                    title={label}
                    key={key}
                  >
                    <div className={styles.skillInner}>
                      <Icon />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Hero;

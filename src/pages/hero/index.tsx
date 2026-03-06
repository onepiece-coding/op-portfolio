/**
 * @file src/pages/hero/index.tsx
 */

import { SKILLS, SOCIAL } from "./hero.data";

import styles from "./hero.module.css";

const Hero = () => {
  return (
    <>
      <title>OnePiece Coding — Frontend + Backend Strike Team</title>
      <meta
        name="description"
        content="OnePiece Coding: React + TypeScript frontends and Node.js backends. We build high-performance MVPs, CMSs and dashboards with a zero-bloat approach. Book a technical brief."
      />

      <section
        className={`${styles.hero} page-in`}
        aria-labelledby="hero-heading"
        id="hero"
      >
        <div className={styles.inner}>
          <div className={styles.left}>
            <div className={`${styles.kicker}`}>
              Frontend + Backend Strike Team
            </div>

            <h1 id="hero-heading" className={`${styles.title}`}>
              Frontend + Backend Strike Team — build blazing-fast products, ship
              faster.
            </h1>

            <p className={`${styles.lead}`}>
              OnePiece Coding accelerates product-market fit with clean React
              frontends, scalable Node APIs, and a zero-bloat delivery approach.
              From MVP to scale — we own both sides.
            </p>

            <nav className={`${styles.socialRow}`} aria-label="Social links">
              {SOCIAL.map(({ label, href, Icon }) => (
                <a
                  className={styles.socialBtn}
                  rel="noopener noreferrer"
                  aria-label={label}
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
              <li>React · TypeScript</li>
              <li>Node.js · Express · MongoDB</li>
              <li>Zero-Bloat · Performance First</li>
            </ul>
          </div>

          <div className={styles.right} aria-hidden="true">
            <div className={styles.logoWrap}>
              <div className={styles.logoCircle} aria-hidden="true">
                <span className={styles.logoText}>OP</span>
              </div>

              <div className={styles.orbit} aria-hidden="true">
                {SKILLS.map(({ key, label, Icon }) => (
                  <div
                    key={key}
                    className={styles.skillBadge}
                    title={label}
                    aria-hidden="true"
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

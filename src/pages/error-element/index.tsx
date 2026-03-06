/**
 * @file src/components/common/error-element/index.tsx
 * ErrorElement → routing / 404 / loader issues
 */

import { useRouteError, Link, useNavigate } from "react-router-dom";
import { isRouteError } from "@/lib/route-utils";
import { useEffect } from "react";

import styles from "./error-element.module.css";

const ErrorElement = () => {
  const rawError = useRouteError();
  const navigate = useNavigate();

  const error = isRouteError(rawError) ? rawError : null;

  const message =
    error?.statusText || error?.message || "An unexpected error occurred.";

  useEffect(() => {
    if (error) console.error("Route error:", error);
  }, [error]);

  return (
    <>
      <title>Page Error — OnePiece Coding</title>
      <meta
        name="description"
        content="We had trouble loading that page. Try refreshing or return home. If the issue persists, report the error to onepiece.codingpar@gmail.com with the page URL."
      />

      <section aria-labelledby="error-heading" className={styles.page}>
        <div className={styles.containerInner}>
          <div className={styles.card} aria-labelledby="error-heading">
            <h1 id="error-heading" className={styles.title}>
              Something went wrong
            </h1>

            <p className={styles.lead}>
              We couldn't load that page. This might be a broken link, a server
              issue, or a temporary glitch. Try refreshing, or use the links
              below to continue browsing.
            </p>

            <div className={styles.actions}>
              <button
                className={styles.primaryBtn}
                onClick={() => navigate(-1)}
              >
                Go back
              </button>

              <Link to="/" replace={true} className={styles.ghostBtn}>
                Go home
              </Link>

              <a
                className={styles.linkText}
                href={`mailto:onepiece.codingpar@gmail.com?subject=Site%20error%20report&body=${encodeURIComponent(
                  `I encountered an error on the site.

Page: ${window.location.href}

Error: ${message}`,
                )}`}
              >
                Report issue
              </a>
            </div>

            <details className={styles.details}>
              <summary>Technical details</summary>
              <pre className={styles.pre}>
                {message}
                {error?.status
                  ? `
Status: ${error.status}`
                  : ""}
                {error?.stack
                  ? `

${error.stack}`
                  : ""}
              </pre>
            </details>
          </div>

          <aside className={styles.side} aria-labelledby="help-heading">
            <h2 id="help-heading" className={styles.sideTitle}>
              Need immediate help?
            </h2>

            <p className={styles.sideText}>
              Contact us and we’ll assist quickly — share the error details
              above when you reach out.
            </p>

            <div className={styles.sideActions}>
              <a
                href="https://wa.me/212696514234?text=Hello%20OnePiece%20Coding"
                className={styles.sideLink}
                rel="noopener noreferrer"
                target="_blank"
              >
                WhatsApp
              </a>

              <a
                href="mailto:onepiece.codingpar@gmail.com"
                className={styles.sideLink}
              >
                Email
              </a>

              <Link className={styles.sideLink} to="/projects">
                See projects
              </Link>
            </div>
          </aside>
        </div>
      </section>
    </>
  );
};

export default ErrorElement;

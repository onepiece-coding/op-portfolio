/* eslint-disable react-refresh/only-export-components */

/**
 * @file src/pages/error-boundary/index.tsx
 * ErrorBoundary → runtime rendering protection
 */

import { withTranslation, type WithTranslation } from "react-i18next";
import { Component, type ErrorInfo, type ReactNode } from "react";

import styles from "./styles.module.css";

interface Props extends WithTranslation {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

class ErrorBoundary extends Component<Props, State> {
  state: State = {
    hasError: false,
  };

  static getDerivedStateFromError(error: Error): State {
    return {
      hasError: true,
      error,
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    if (import.meta.env.MODE === "development") {
      console.error("Runtime Error:", error, errorInfo);
    }
  }

  handleReset = () => {
    this.setState({ hasError: false, error: undefined });
  };

  render() {
    const { t, children } = this.props;

    if (this.state.hasError) {
      return (
        <>
          <title>
            {t("error-boundary.pageTitle", "Page Error — OnePiece Coding")}
          </title>
          <meta
            name="description"
            content={t(
              "error-boundary.metaDescription",
              "We had trouble loading that page. Try refreshing or return home. If the issue persists, report the error to onepiece.codingpar@gmail.com with the page URL.",
            )}
          />
          <div className={styles.container} role="alert">
            <h1>{t("error-boundary.h1", "Something went wrong.")}</h1>
            <p>
              {t("error-boundary.lead", "Our frontend crew hit turbulence.")}
            </p>

            <button onClick={this.handleReset}>
              {t("error-boundary.button", "Try Again")}
            </button>
          </div>
        </>
      );
    }

    return children;
  }
}

export default withTranslation()(ErrorBoundary);

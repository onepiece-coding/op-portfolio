/**
 * @file src/components/common/error-boundary/index.tsx
 * ErrorBoundary → runtime rendering protection
 */

import { Component, type ErrorInfo, type ReactNode } from "react";

import styles from "./error-boundary.module.css";

interface Props {
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
    if (this.state.hasError) {
      return (
        <>
          <title>Page Error — OnePiece Coding</title>
          <meta
            name="description"
            content="We had trouble loading that page. Try refreshing or return home. If the issue persists, report the error to onepiece.codingpar@gmail.com with the page URL."
          />
          <div className={styles.container} role="alert">
            <h1>Something went wrong.</h1>
            <p>Our frontend crew hit turbulence.</p>

            <button onClick={this.handleReset}>Try Again</button>
          </div>
        </>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;

import { Component } from "react";

/**
 * Isolates a subtree so a crash doesn't take down the page.
 * `fallback` may be a node or a function ({ error, reset }) => node.
 */
export default class ErrorBoundary extends Component {
  state = { error: null };

  static getDerivedStateFromError(error) {
    return { error };
  }

  componentDidCatch(error, info) {
    if (import.meta.env.DEV) console.error(`[ErrorBoundary:${this.props.name ?? "section"}]`, error, info);
  }

  reset = () => this.setState({ error: null });

  render() {
    const { error } = this.state;
    const { fallback, children } = this.props;
    if (!error) return children;

    if (typeof fallback === "function") return fallback({ error, reset: this.reset });
    if (fallback !== undefined) return fallback;

    return (
      <div className="error-fallback" role="alert">
        <p className="error-fallback__title">Something went wrong</p>
        <button type="button" className="btn" onClick={this.reset}>
          Try Again
        </button>
      </div>
    );
  }
}

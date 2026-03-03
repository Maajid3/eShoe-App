import React from "react";

export default class ErrorBoundary extends React.Component {
  state = { hasError: false, isOffline: false };

  static getDerivedStateFromError() {
    return { hasError: true, isOffline: !navigator.onLine };
  }

  componentDidCatch(error) {
    console.error(error);
  }

  handleRetry = () => {
    this.setState({ hasError: false, isOffline: false });
  };

  render() {
    if (this.state.hasError) {
      return (
        <div style={styles.page}>
          <div style={styles.card}>
            <span style={styles.icon}>
              {this.state.isOffline ? "📡" : "⚠️"}
            </span>
            <h2 style={styles.title}>
              {this.state.isOffline ? "You're offline" : "Something went wrong"}
            </h2>
            <p style={styles.subtitle}>
              {this.state.isOffline
                ? "Check your internet connection and try again."
                : "An unexpected error occurred. Please try again."}
            </p>
            <div style={styles.actions}>
              <button style={styles.primaryBtn} onClick={this.handleRetry}>
                Try Again
              </button>
              <button style={styles.secondaryBtn} onClick={() => (window.location.href = "/")}>
                Go Home
              </button>
            </div>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

const styles = {
  page: {
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "#f8f8f5",
    fontFamily: "DM Sans, sans-serif",
    padding: "1rem",
  },
  card: {
    background: "#fff",
    borderRadius: "16px",
    border: "1px solid rgba(0,0,0,0.07)",
    padding: "2.5rem 2rem",
    maxWidth: "400px",
    width: "100%",
    textAlign: "center",
    boxShadow: "0 4px 24px rgba(0,0,0,0.06)",
  },
  icon: {
    fontSize: "2.8rem",
    display: "block",
    marginBottom: "1rem",
  },
  title: {
    fontSize: "1.2rem",
    fontWeight: "700",
    color: "#1a1a1a",
    margin: "0 0 0.5rem",
  },
  subtitle: {
    fontSize: "0.88rem",
    color: "#999",
    margin: "0 0 1.8rem",
    lineHeight: "1.6",
  },
  actions: {
    display: "flex",
    gap: "0.75rem",
    justifyContent: "center",
  },
  primaryBtn: {
    padding: "0.7rem 1.6rem",
    background: "#1a1a1a",
    color: "#fff",
    border: "none",
    borderRadius: "10px",
    fontSize: "0.88rem",
    fontWeight: "600",
    cursor: "pointer",
  },
  secondaryBtn: {
    padding: "0.7rem 1.6rem",
    background: "transparent",
    color: "#1a1a1a",
    border: "1px solid rgba(0,0,0,0.12)",
    borderRadius: "10px",
    fontSize: "0.88rem",
    fontWeight: "600",
    cursor: "pointer",
  },
};
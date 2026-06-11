import React from "react";

interface ErrorBoundaryProps {
  children: React.ReactNode;
  name?: string;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends React.Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error(
      `[ErrorBoundary${this.props.name ? `: ${this.props.name}` : ""}]`,
      error,
      errorInfo
    );
  }

  render() {
    if (this.state.hasError) {
      return (
        <div
          style={{
            padding: "24px",
            margin: "16px 0",
            border: "2px solid #e74c3c",
            borderRadius: "8px",
            background: "#fdf0ef",
            color: "#c0392b",
            fontFamily: "system-ui, sans-serif",
          }}
        >
          <strong>
            {window.wp.i18n.__("Ошибка", "childlab")}
            {this.props.name ? ` (${this.props.name})` : ""}
          </strong>
          <p style={{ margin: "8px 0 0", fontSize: "14px" }}>
            {this.state.error?.message}
          </p>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;

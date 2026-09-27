import React from "react";
import { FiAlertTriangle, FiRefreshCw } from "react-icons/fi";

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("ErrorBoundary caught:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="card" style={{ padding: 32, textAlign: "center", margin: "24px 0" }}>
          <FiAlertTriangle size={36} color="var(--warning)" style={{ marginBottom: 12 }} />
          <h3>Something went wrong while rendering this section</h3>
          <p className="text-muted text-sm" style={{ marginBottom: 20 }}>
            Don't worry, your booking data is safe. Click below to reload.
          </p>
          <button
            className="btn btn-primary btn-sm"
            onClick={() => {
              this.setState({ hasError: false });
              window.location.reload();
            }}
          >
            <FiRefreshCw /> Reload Page
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

// Error Boundary to prevent blank white screens
import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught an unhandled error:', error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
    window.location.href = '/';
  };

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: '60px 20px', textAlign: 'center', maxWidth: '600px', margin: '0 auto' }}>
          <div className="state-box">
            <div className="state-icon">⚠️</div>
            <h2 className="state-title">Something went wrong</h2>
            <p className="state-desc">
              We encountered an unexpected error while loading this page. Please try refreshing or return to CareerLink home.
            </p>
            <button type="button" className="state-btn" onClick={this.handleReset}>
              Return to CareerLink Home
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;


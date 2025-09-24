import React from 'react';

export class AppErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { error: null };
  }
  static getDerivedStateFromError(error) {
    return { error };
  }
  componentDidCatch(error, info) {
    // Basic log; could forward to telemetry service later
    // eslint-disable-next-line no-console
    console.error('[ErrorBoundary]', error, info);
  }
  handleReset = () => {
    this.setState({ error: null });
    if (this.props.onReset) this.props.onReset();
  };
  render() {
    if (this.state.error) {
      return (
        <div className="p-4 border border-red-300 bg-red-50 text-sm text-red-700 rounded">
          <p className="font-bold mb-2">Something went wrong.</p>
          <pre className="whitespace-pre-wrap text-xs mb-2">
            {this.state.error?.message || 'Unknown error'}
          </pre>
          <button
            type="button"
            onClick={this.handleReset}
            className="px-3 py-1 bg-red-600 text-white rounded text-xs"
          >
            Retry
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

export default AppErrorBoundary;

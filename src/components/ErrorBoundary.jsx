import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, info: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, info) {
    console.error('ErrorBoundary caught an error:', error, info);
    this.setState({ info });
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-6">
          <h2 className="text-2xl font-bold text-[#0F172A] mb-2">Something went wrong</h2>
          <p className="text-slate-500 mb-6">This section couldn't load. Try refreshing the page.</p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-3 rounded-xl bg-[#0F172A] text-white font-semibold shadow-soft hover:scale-105 transition-transform mb-6"
          >
            Refresh
          </button>
          {/* Shown always (not just DEV) so the real error is screenshot-able
              without needing to open DevTools — this is what we actually
              need to diagnose a crash that only reproduces on one machine. */}
          <details className="text-left max-w-2xl w-full bg-red-50 border border-red-200 rounded-xl p-4 text-xs text-red-800 whitespace-pre-wrap break-words">
            <summary className="cursor-pointer font-semibold mb-2">Technical details (screenshot this)</summary>
            {String(this.state.error?.message || this.state.error)}
            {this.state.error?.stack ? '\n\n' + this.state.error.stack : ''}
            {this.state.info?.componentStack ? '\n\nComponent stack:' + this.state.info.componentStack : ''}
          </details>
        </div>
      );
    }
    return this.props.children;
  }
}

export default ErrorBoundary;

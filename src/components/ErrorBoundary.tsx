/**
 * Error Boundary Component
 * 
 * Catches errors in child components and displays friendly error messages
 */

import React, { ReactNode, ErrorInfo } from 'react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="w-full max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
          <div className="p-4 bg-red-100 border border-red-400 rounded-lg">
            <h2 className="text-lg font-bold text-red-700 mb-2">出错了</h2>
            <p className="text-red-600 text-sm mb-4">
              应用程序遇到了一个错误。请刷新页面重试。
            </p>
            <details className="text-xs text-red-600">
              <summary className="cursor-pointer font-semibold">错误详情</summary>
              <pre className="mt-2 p-2 bg-red-50 rounded overflow-auto">
                {this.state.error?.toString()}
              </pre>
            </details>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

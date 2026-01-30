import React from 'react';
import { motion } from 'motion/react';
import { AlertTriangle, RefreshCw, Home, Bug } from 'lucide-react';
import { Card } from './ui/card';
import { Button } from './ui/button';

interface Props {
  children: React.ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: React.ErrorInfo | null;
}

export class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error, errorInfo: null };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
    this.setState({ error, errorInfo });
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
    window.location.reload();
  };

  handleGoHome = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
    window.location.href = '/';
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-black flex items-center justify-center p-6">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="max-w-2xl w-full"
          >
            <Card className="bg-gradient-to-br from-red-950/40 to-orange-950/20 border-red-500/50 p-8">
              {/* Icon */}
              <div className="flex justify-center mb-6">
                <motion.div
                  animate={{
                    rotate: [0, 10, -10, 0],
                    scale: [1, 1.1, 1]
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    repeatDelay: 1
                  }}
                  className="w-24 h-24 rounded-full bg-gradient-to-br from-red-500/20 to-orange-500/20 border-2 border-red-500/50 flex items-center justify-center"
                >
                  <AlertTriangle className="w-12 h-12 text-red-400" />
                </motion.div>
              </div>

              {/* Title */}
              <h1 className="text-3xl text-red-400 text-center mb-3">
                System Error Detected
              </h1>
              <p className="text-center text-red-300 mb-6">
                JARVIS encountered an unexpected error and needs to recover
              </p>

              {/* Error Details */}
              <div className="bg-black/60 border border-red-500/30 rounded-lg p-4 mb-6">
                <div className="flex items-center gap-2 mb-3">
                  <Bug className="w-4 h-4 text-red-400" />
                  <span className="text-sm text-red-400 font-mono">Error Details</span>
                </div>
                <div className="space-y-2">
                  <div className="text-sm text-red-300 font-mono">
                    {this.state.error?.name || 'Unknown Error'}
                  </div>
                  <div className="text-xs text-red-400/70 font-mono break-all">
                    {this.state.error?.message || 'No error message available'}
                  </div>
                </div>

                {this.state.errorInfo && (
                  <details className="mt-4">
                    <summary className="text-xs text-red-400 cursor-pointer hover:text-red-300 transition-colors">
                      Stack Trace (Click to expand)
                    </summary>
                    <pre className="mt-2 text-xs text-red-400/50 font-mono overflow-auto max-h-48 p-2 bg-black/40 rounded">
                      {this.state.errorInfo.componentStack}
                    </pre>
                  </details>
                )}
              </div>

              {/* Actions */}
              <div className="flex gap-3">
                <Button
                  onClick={this.handleReset}
                  className="flex-1 bg-gradient-to-r from-red-500 to-orange-500 text-white"
                >
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Reload System
                </Button>
                <Button
                  onClick={this.handleGoHome}
                  variant="outline"
                  className="flex-1 border-red-500/50 text-red-400 hover:bg-red-500/20"
                >
                  <Home className="w-4 h-4 mr-2" />
                  Go Home
                </Button>
              </div>

              {/* Additional Info */}
              <div className="mt-6 pt-6 border-t border-red-500/20 text-center">
                <p className="text-xs text-red-400/70">
                  If this error persists, please contact the JARVIS support team
                </p>
                <p className="text-xs text-red-400/50 mt-2 font-mono">
                  Error ID: {Date.now().toString(36).toUpperCase()}
                </p>
              </div>
            </Card>
          </motion.div>
        </div>
      );
    }

    return this.props.children;
  }
}

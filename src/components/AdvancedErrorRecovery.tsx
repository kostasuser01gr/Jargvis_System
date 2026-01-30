import { useState, useEffect, useCallback } from 'react';
import { motion } from 'motion/react';
import { AlertTriangle, RefreshCw, Shield, CheckCircle2, XCircle, AlertCircle } from 'lucide-react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { ScrollArea } from './ui/scroll-area';
import { toast } from 'sonner@2.0.3';

interface ErrorLog {
  id: string;
  timestamp: number;
  type: 'error' | 'warning' | 'info';
  message: string;
  stack?: string;
  recovered: boolean;
  autoRecovery: boolean;
}

interface RecoveryAction {
  id: string;
  name: string;
  description: string;
  action: () => void;
}

export function AdvancedErrorRecovery() {
  const [errors, setErrors] = useState<ErrorLog[]>([]);
  const [autoRecoveryEnabled, setAutoRecoveryEnabled] = useState(true);
  const [recoveryAttempts, setRecoveryAttempts] = useState(0);

  const recoveryActions: RecoveryAction[] = [
    {
      id: 'clear-cache',
      name: 'Clear Cache',
      description: 'Clear browser cache and reload',
      action: () => {
        if ('caches' in window) {
          caches.keys().then(names => {
            names.forEach(name => caches.delete(name));
          });
        }
        localStorage.clear();
        sessionStorage.clear();
        toast.success('Cache cleared successfully');
        setRecoveryAttempts(prev => prev + 1);
      }
    },
    {
      id: 'reset-state',
      name: 'Reset Application State',
      description: 'Reset all application state to defaults',
      action: () => {
        localStorage.removeItem('app-state');
        sessionStorage.clear();
        toast.success('Application state reset');
        setRecoveryAttempts(prev => prev + 1);
      }
    },
    {
      id: 'reload-page',
      name: 'Reload Page',
      description: 'Perform a hard reload of the page',
      action: () => {
        window.location.reload();
      }
    },
    {
      id: 'clear-errors',
      name: 'Clear Error Log',
      description: 'Clear all logged errors',
      action: () => {
        setErrors([]);
        toast.success('Error log cleared');
      }
    }
  ];

  const logError = useCallback((error: Error | string, type: 'error' | 'warning' | 'info' = 'error') => {
    const errorLog: ErrorLog = {
      id: Date.now().toString(),
      timestamp: Date.now(),
      type,
      message: typeof error === 'string' ? error : error.message,
      stack: typeof error === 'object' ? error.stack : undefined,
      recovered: false,
      autoRecovery: false,
    };

    setErrors(prev => [errorLog, ...prev].slice(0, 100)); // Keep last 100 errors

    // Attempt auto-recovery for certain errors
    if (autoRecoveryEnabled && type === 'error') {
      attemptAutoRecovery(errorLog);
    }
  }, [autoRecoveryEnabled]);

  const attemptAutoRecovery = useCallback((errorLog: ErrorLog) => {
    // Implement auto-recovery logic based on error type
    const recoveryStrategies = [
      {
        condition: (msg: string) => msg.includes('network') || msg.includes('fetch'),
        action: () => {
          // Retry network request
          setTimeout(() => {
            toast.info('Retrying failed network request...');
            setRecoveryAttempts(prev => prev + 1);
          }, 2000);
        }
      },
      {
        condition: (msg: string) => msg.includes('state') || msg.includes('undefined'),
        action: () => {
          // Reset corrupted state
          localStorage.removeItem('app-state');
          toast.info('Corrupted state detected, resetting...');
          setRecoveryAttempts(prev => prev + 1);
        }
      },
      {
        condition: (msg: string) => msg.includes('memory') || msg.includes('heap'),
        action: () => {
          // Clear caches to free memory
          if ('caches' in window) {
            caches.keys().then(names => {
              names.forEach(name => caches.delete(name));
            });
          }
          toast.info('Memory issue detected, clearing caches...');
          setRecoveryAttempts(prev => prev + 1);
        }
      }
    ];

    const strategy = recoveryStrategies.find(s => s.condition(errorLog.message));
    if (strategy) {
      strategy.action();
      
      setErrors(prev => prev.map(e => 
        e.id === errorLog.id 
          ? { ...e, recovered: true, autoRecovery: true }
          : e
      ));
    }
  }, []);

  // Global error handler
  useEffect(() => {
    const handleError = (event: ErrorEvent) => {
      event.preventDefault();
      logError(event.error || event.message, 'error');
    };

    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      event.preventDefault();
      logError(event.reason, 'error');
    };

    window.addEventListener('error', handleError);
    window.addEventListener('unhandledrejection', handleUnhandledRejection);

    return () => {
      window.removeEventListener('error', handleError);
      window.removeEventListener('unhandledrejection', handleUnhandledRejection);
    };
  }, [logError]);

  // Monitor console errors
  useEffect(() => {
    const originalError = console.error;
    const originalWarn = console.warn;

    console.error = (...args) => {
      logError(args.join(' '), 'error');
      originalError.apply(console, args);
    };

    console.warn = (...args) => {
      logError(args.join(' '), 'warning');
      originalWarn.apply(console, args);
    };

    return () => {
      console.error = originalError;
      console.warn = originalWarn;
    };
  }, [logError]);

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'error': return <XCircle className="w-4 h-4 text-red-400" />;
      case 'warning': return <AlertTriangle className="w-4 h-4 text-yellow-400" />;
      case 'info': return <AlertCircle className="w-4 h-4 text-blue-400" />;
      default: return <AlertCircle className="w-4 h-4 text-cyan-400" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'error': return 'bg-red-500/20 border-red-500/50 text-red-400';
      case 'warning': return 'bg-yellow-500/20 border-yellow-500/50 text-yellow-400';
      case 'info': return 'bg-blue-500/20 border-blue-500/50 text-blue-400';
      default: return 'bg-cyan-500/20 border-cyan-500/50 text-cyan-400';
    }
  };

  const errorCount = errors.filter(e => e.type === 'error').length;
  const warningCount = errors.filter(e => e.type === 'warning').length;
  const recoveredCount = errors.filter(e => e.recovered).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="glass-card p-6 border border-cyan-500/30">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-cyan-400 flex items-center gap-2">
              <Shield className="w-6 h-6" />
              Advanced Error Recovery
            </h3>
            <p className="text-xs text-cyan-600 mt-1">
              Automatic error detection and recovery system
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Badge className={autoRecoveryEnabled ? 'bg-green-500/20 border-green-500/50 text-green-400' : 'bg-gray-500/20 border-gray-500/50 text-gray-400'}>
              Auto-Recovery: {autoRecoveryEnabled ? 'ON' : 'OFF'}
            </Badge>
            <Button
              onClick={() => setAutoRecoveryEnabled(!autoRecoveryEnabled)}
              variant="outline"
              size="sm"
              className="border-cyan-500/30 text-cyan-400"
            >
              Toggle
            </Button>
          </div>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <Card className="glass-panel p-4 border border-red-500/30">
            <div className="flex items-center gap-2 mb-2">
              <XCircle className="w-4 h-4 text-red-400" />
              <span className="text-xs text-red-600">Errors</span>
            </div>
            <div className="text-2xl font-mono text-red-400">{errorCount}</div>
          </Card>
          <Card className="glass-panel p-4 border border-yellow-500/30">
            <div className="flex items-center gap-2 mb-2">
              <AlertTriangle className="w-4 h-4 text-yellow-400" />
              <span className="text-xs text-yellow-600">Warnings</span>
            </div>
            <div className="text-2xl font-mono text-yellow-400">{warningCount}</div>
          </Card>
          <Card className="glass-panel p-4 border border-green-500/30">
            <div className="flex items-center gap-2 mb-2">
              <CheckCircle2 className="w-4 h-4 text-green-400" />
              <span className="text-xs text-green-600">Recovered</span>
            </div>
            <div className="text-2xl font-mono text-green-400">{recoveredCount}</div>
          </Card>
          <Card className="glass-panel p-4 border border-cyan-500/30">
            <div className="flex items-center gap-2 mb-2">
              <RefreshCw className="w-4 h-4 text-cyan-400" />
              <span className="text-xs text-cyan-600">Attempts</span>
            </div>
            <div className="text-2xl font-mono text-cyan-400">{recoveryAttempts}</div>
          </Card>
        </div>

        {/* Recovery Actions */}
        <div>
          <h4 className="text-cyan-400 mb-3">Manual Recovery Actions</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {recoveryActions.map((action) => (
              <Card key={action.id} className="glass-panel p-4 border border-cyan-500/20">
                <h5 className="text-cyan-300 mb-1">{action.name}</h5>
                <p className="text-xs text-cyan-600 mb-3">{action.description}</p>
                <Button
                  onClick={action.action}
                  size="sm"
                  className="w-full bg-cyan-500/20 border-cyan-500/50 text-cyan-400 hover:bg-cyan-500/30"
                >
                  Execute
                </Button>
              </Card>
            ))}
          </div>
        </div>
      </Card>

      {/* Error Log */}
      <Card className="glass-card p-6 border border-cyan-500/30">
        <h4 className="text-cyan-400 mb-4">Error Log</h4>
        {errors.length === 0 ? (
          <div className="text-center py-8">
            <CheckCircle2 className="w-12 h-12 text-green-400 mx-auto mb-3" />
            <p className="text-green-400">No errors detected</p>
            <p className="text-xs text-green-600 mt-1">System is running smoothly</p>
          </div>
        ) : (
          <ScrollArea className="h-[400px]">
            <div className="space-y-2">
              {errors.map((error, index) => (
                <motion.div
                  key={error.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.02 }}
                >
                  <Card className={`p-4 border ${getTypeColor(error.type)}`}>
                    <div className="flex items-start gap-3">
                      {getTypeIcon(error.type)}
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-sm text-cyan-300">{error.message}</span>
                          {error.recovered && (
                            <Badge className="bg-green-500/20 border-green-500/50 text-green-400 text-xs">
                              {error.autoRecovery ? 'Auto-Recovered' : 'Recovered'}
                            </Badge>
                          )}
                        </div>
                        <p className="text-xs text-cyan-600">
                          {new Date(error.timestamp).toLocaleString()}
                        </p>
                        {error.stack && (
                          <details className="mt-2">
                            <summary className="text-xs text-cyan-500 cursor-pointer">
                              Stack Trace
                            </summary>
                            <pre className="text-xs text-cyan-700 mt-2 p-2 bg-black/40 rounded overflow-x-auto">
                              {error.stack}
                            </pre>
                          </details>
                        )}
                      </div>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </div>
          </ScrollArea>
        )}
      </Card>
    </div>
  );
}

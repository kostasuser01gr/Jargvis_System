import { useState, useEffect, lazy, Suspense } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ErrorBoundary } from './components/ErrorBoundary';
import { EnhancedBackground } from './components/EnhancedBackground';
import { Toaster } from './components/ui/sonner';
import { ThemeProvider } from './contexts/ThemeContext';

// Lazy load heavy components for better performance
const MainInterface = lazy(() => import('./components/MainInterface').then(m => ({ default: m.MainInterface })));
const BootSequence = lazy(() => import('./components/BootSequence').then(m => ({ default: m.BootSequence })));
const CommandPalette = lazy(() => import('./components/CommandPalette').then(m => ({ default: m.CommandPalette })));
const GestureController = lazy(() => import('./components/GestureController').then(m => ({ default: m.GestureController })));
const VoiceController = lazy(() => import('./components/VoiceController').then(m => ({ default: m.VoiceController })));
const EnhancedNotificationCenter = lazy(() => import('./components/EnhancedNotificationCenter').then(m => ({ default: m.EnhancedNotificationCenter })));
const PerformanceOverlay = lazy(() => import('./components/PerformanceOverlay').then(m => ({ default: m.PerformanceOverlay })));

// Loading fallback component
const LoadingFallback = () => (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black">
    <div className="text-center">
      <div className="text-4xl text-cyan-400 tracking-[0.3em] mb-2">J.A.R.V.I.S</div>
      <div className="text-sm text-cyan-600">Initializing...</div>
    </div>
  </div>
);

export default function App() {
  const [isBooting, setIsBooting] = useState(true);
  const [systemOnline, setSystemOnline] = useState(false);
  const [commandPaletteOpen, setCommandPaletteOpen] = useState(false);
  const [voiceEnabled, setVoiceEnabled] = useState(false);
  const [gestureEnabled, setGestureEnabled] = useState(false);
  const [hasError, setHasError] = useState<string | null>(null);

  // Set document title
  useEffect(() => {
    document.title = 'JARVIS System - Advanced AI Platform';
  }, []);

  // Error handler
  useEffect(() => {
    const handleError = (event: ErrorEvent) => {
      console.error('Global error:', event.error);
      setHasError(event.error?.message || 'Unknown error');
    };

    const handleRejection = (event: PromiseRejectionEvent) => {
      console.error('Unhandled promise rejection:', event.reason);
      setHasError(event.reason?.message || 'Promise rejection');
    };

    window.addEventListener('error', handleError);
    window.addEventListener('unhandledrejection', handleRejection);

    return () => {
      window.removeEventListener('error', handleError);
      window.removeEventListener('unhandledrejection', handleRejection);
    };
  }, []);

  useEffect(() => {
    // Boot sequence timer
    const timer = setTimeout(() => {
      setIsBooting(false);
      setTimeout(() => setSystemOnline(true), 500);
    }, 4000);

    // Keyboard shortcuts
    const handleKeyboard = (e: KeyboardEvent) => {
      // Cmd/Ctrl + K for command palette
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setCommandPaletteOpen(prev => !prev);
      }
      // Cmd/Ctrl + V for voice toggle
      if ((e.metaKey || e.ctrlKey) && e.key === 'v') {
        e.preventDefault();
        setVoiceEnabled(prev => !prev);
      }
      // Cmd/Ctrl + G for gesture toggle
      if ((e.metaKey || e.ctrlKey) && e.key === 'g') {
        e.preventDefault();
        setGestureEnabled(prev => !prev);
      }
    };

    window.addEventListener('keydown', handleKeyboard);

    return () => {
      clearTimeout(timer);
      window.removeEventListener('keydown', handleKeyboard);
    };
  }, []);

  // Show error overlay if there's an error
  if (hasError) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center p-6">
        <div className="max-w-2xl w-full bg-red-950/40 border border-red-500/50 rounded-lg p-8">
          <h1 className="text-2xl text-red-400 mb-4">Error Detected</h1>
          <p className="text-red-300 mb-4">{hasError}</p>
          <button
            onClick={() => {
              setHasError(null);
              window.location.reload();
            }}
            className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
          >
            Reload
          </button>
        </div>
      </div>
    );
  }

  return (
    <ErrorBoundary>
      <ThemeProvider>
        <div className="relative min-h-screen bg-black overflow-hidden">
        {/* Enhanced Animated Background */}
        <EnhancedBackground />

        {/* Boot Sequence */}
        <AnimatePresence mode="wait">
          {isBooting && (
            <Suspense fallback={<LoadingFallback />}>
              <BootSequence key="boot" onComplete={() => setIsBooting(false)} />
            </Suspense>
          )}
        </AnimatePresence>

        {/* Main Interface */}
        <AnimatePresence>
          {systemOnline && (
            <Suspense fallback={<LoadingFallback />}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
              >
                <MainInterface
                  key="main"
                  voiceEnabled={voiceEnabled}
                  gestureEnabled={gestureEnabled}
                  onVoiceToggle={() => setVoiceEnabled(prev => !prev)}
                  onGestureToggle={() => setGestureEnabled(prev => !prev)}
                  onCommandPalette={() => setCommandPaletteOpen(true)}
                />
              </motion.div>
            </Suspense>
          )}
        </AnimatePresence>

        {/* Command Palette */}
        <Suspense fallback={null}>
          <CommandPalette
            open={commandPaletteOpen}
            onOpenChange={setCommandPaletteOpen}
          />
        </Suspense>

        {/* Voice Controller */}
        <AnimatePresence>
          {voiceEnabled && (
            <Suspense fallback={null}>
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3 }}
              >
                <VoiceController />
              </motion.div>
            </Suspense>
          )}
        </AnimatePresence>

        {/* Gesture Controller */}
        <AnimatePresence>
          {gestureEnabled && (
            <Suspense fallback={null}>
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                <GestureController />
              </motion.div>
            </Suspense>
          )}
        </AnimatePresence>

        {/* Enhanced Notification Center */}
        <Suspense fallback={null}>
          <EnhancedNotificationCenter />
        </Suspense>

        {/* Performance Overlay */}
        <Suspense fallback={null}>
          <PerformanceOverlay />
        </Suspense>

        {/* Debug Info - Always show for troubleshooting */}
        <div className="fixed bottom-4 right-4 z-[9999] bg-black/90 text-cyan-400 text-xs p-3 rounded border border-cyan-500/50 font-mono shadow-lg">
          <div className="font-bold mb-2 text-cyan-300">JARVIS Debug</div>
          <div>Booting: <span className={isBooting ? 'text-green-400' : 'text-red-400'}>{isBooting ? 'Yes' : 'No'}</span></div>
          <div>Online: <span className={systemOnline ? 'text-green-400' : 'text-red-400'}>{systemOnline ? 'Yes' : 'No'}</span></div>
          <div>Error: <span className={hasError ? 'text-red-400' : 'text-green-400'}>{hasError || 'None'}</span></div>
          <div className="mt-2 text-[10px] text-cyan-600">React: Mounted</div>
        </div>
      </div>

      {/* Toast Notifications with Enhanced Styling */}
      <Toaster 
        position="top-right" 
        theme="dark"
        toastOptions={{
          style: {
            background: 'rgba(17, 25, 40, 0.95)',
            border: '1px solid rgba(34, 211, 238, 0.3)',
            color: '#22d3ee',
            backdropFilter: 'blur(12px)',
          },
        }}
      />
      </ThemeProvider>
    </ErrorBoundary>
  );
}

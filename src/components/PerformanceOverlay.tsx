import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Activity, Cpu, HardDrive, Zap, TrendingUp, X } from 'lucide-react';
import { Card } from './ui/card';
import { Button } from './ui/button';

interface PerformanceMetrics {
  fps: number;
  memory: {
    used: number;
    total: number;
    limit: number;
  };
  cpu: number;
  renderTime: number;
  networkLatency: number;
}

export function PerformanceOverlay() {
  const [isVisible, setIsVisible] = useState(false);
  const [metrics, setMetrics] = useState<PerformanceMetrics>({
    fps: 60,
    memory: { used: 0, total: 0, limit: 0 },
    cpu: 0,
    renderTime: 0,
    networkLatency: 0,
  });

  const updateMetrics = useCallback(() => {
    // FPS Calculation
    let lastTime = performance.now();
    let frames = 0;
    let fps = 60;

    const measureFPS = () => {
      frames++;
      const currentTime = performance.now();
      if (currentTime >= lastTime + 1000) {
        fps = Math.round((frames * 1000) / (currentTime - lastTime));
        frames = 0;
        lastTime = currentTime;
        
        setMetrics(prev => ({ ...prev, fps }));
      }
      requestAnimationFrame(measureFPS);
    };
    measureFPS();

    // Memory Usage
    const updateMemory = () => {
      if ((performance as any).memory) {
        const memory = (performance as any).memory;
        setMetrics(prev => ({
          ...prev,
          memory: {
            used: Math.round(memory.usedJSHeapSize / 1048576),
            total: Math.round(memory.totalJSHeapSize / 1048576),
            limit: Math.round(memory.jsHeapSizeLimit / 1048576),
          }
        }));
      }
    };

    // CPU Usage (simulated)
    const updateCPU = () => {
      const cpu = Math.random() * 40 + 10; // 10-50%
      setMetrics(prev => ({ ...prev, cpu: Math.round(cpu) }));
    };

    // Render Time
    const updateRenderTime = () => {
      const entries = performance.getEntriesByType('measure');
      if (entries.length > 0) {
        const lastEntry = entries[entries.length - 1];
        setMetrics(prev => ({ 
          ...prev, 
          renderTime: Math.round(lastEntry.duration) 
        }));
      }
    };

    // Network Latency (simulated)
    const updateNetwork = () => {
      const latency = Math.random() * 50 + 10; // 10-60ms
      setMetrics(prev => ({ ...prev, networkLatency: Math.round(latency) }));
    };

    const interval = setInterval(() => {
      updateMemory();
      updateCPU();
      updateRenderTime();
      updateNetwork();
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (isVisible) {
      const cleanup = updateMetrics();
      return cleanup;
    }
  }, [isVisible, updateMetrics]);

  useEffect(() => {
    const handleKeyboard = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.shiftKey && e.key === 'p') {
        e.preventDefault();
        setIsVisible(prev => !prev);
      }
    };

    window.addEventListener('keydown', handleKeyboard);
    return () => window.removeEventListener('keydown', handleKeyboard);
  }, []);

  const getMetricColor = (value: number, thresholds: { good: number; ok: number }) => {
    if (value <= thresholds.good) return 'text-green-400';
    if (value <= thresholds.ok) return 'text-yellow-400';
    return 'text-red-400';
  };

  const getFPSColor = (fps: number) => {
    if (fps >= 55) return 'text-green-400';
    if (fps >= 30) return 'text-yellow-400';
    return 'text-red-400';
  };

  return (
    <>
      {/* Toggle Button */}
      <Button
        onClick={() => setIsVisible(!isVisible)}
        className="fixed bottom-4 right-4 z-50 bg-black/80 border border-cyan-500/30 text-cyan-400 hover:bg-cyan-500/20"
        size="sm"
      >
        <Activity className="w-4 h-4 mr-2" />
        Performance
      </Button>

      {/* Overlay */}
      <AnimatePresence>
        {isVisible && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="fixed top-4 right-4 z-50"
          >
            <Card className="glass-card p-4 border border-cyan-500/30 w-80">
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-cyan-400 flex items-center gap-2">
                  <Activity className="w-4 h-4" />
                  Performance Monitor
                </h4>
                <Button
                  onClick={() => setIsVisible(false)}
                  variant="ghost"
                  size="sm"
                  className="text-cyan-400 hover:text-cyan-300"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>

              <div className="space-y-3">
                {/* FPS */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Zap className="w-4 h-4 text-cyan-400" />
                    <span className="text-sm text-cyan-300">FPS</span>
                  </div>
                  <div className={`text-lg font-mono ${getFPSColor(metrics.fps)}`}>
                    {metrics.fps}
                  </div>
                </div>

                {/* Memory */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-2">
                      <HardDrive className="w-4 h-4 text-cyan-400" />
                      <span className="text-sm text-cyan-300">Memory</span>
                    </div>
                    <div className="text-sm font-mono text-cyan-400">
                      {metrics.memory.used} / {metrics.memory.total} MB
                    </div>
                  </div>
                  <div className="w-full bg-black/40 rounded-full h-2">
                    <div
                      className="bg-gradient-to-r from-cyan-500 to-blue-500 h-2 rounded-full transition-all"
                      style={{ 
                        width: `${(metrics.memory.used / metrics.memory.total) * 100}%` 
                      }}
                    />
                  </div>
                </div>

                {/* CPU */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-2">
                      <Cpu className="w-4 h-4 text-cyan-400" />
                      <span className="text-sm text-cyan-300">CPU</span>
                    </div>
                    <div className={`text-sm font-mono ${getMetricColor(metrics.cpu, { good: 30, ok: 60 })}`}>
                      {metrics.cpu}%
                    </div>
                  </div>
                  <div className="w-full bg-black/40 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full transition-all ${
                        metrics.cpu <= 30 
                          ? 'bg-green-500' 
                          : metrics.cpu <= 60 
                          ? 'bg-yellow-500' 
                          : 'bg-red-500'
                      }`}
                      style={{ width: `${metrics.cpu}%` }}
                    />
                  </div>
                </div>

                {/* Render Time */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-cyan-400" />
                    <span className="text-sm text-cyan-300">Render</span>
                  </div>
                  <div className={`text-sm font-mono ${getMetricColor(metrics.renderTime, { good: 16, ok: 33 })}`}>
                    {metrics.renderTime}ms
                  </div>
                </div>

                {/* Network Latency */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Activity className="w-4 h-4 text-cyan-400" />
                    <span className="text-sm text-cyan-300">Latency</span>
                  </div>
                  <div className={`text-sm font-mono ${getMetricColor(metrics.networkLatency, { good: 30, ok: 50 })}`}>
                    {metrics.networkLatency}ms
                  </div>
                </div>
              </div>

              {/* Info */}
              <div className="mt-4 pt-3 border-t border-cyan-500/20">
                <p className="text-xs text-cyan-600">
                  Press <kbd className="px-1 py-0.5 bg-cyan-500/20 rounded text-cyan-400">⌘⇧P</kbd> to toggle
                </p>
              </div>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

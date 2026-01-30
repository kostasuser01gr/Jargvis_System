import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Cpu, HardDrive, Zap, Activity, Shield, Wifi } from 'lucide-react';
import { Progress } from './ui/progress';

interface SystemMetric {
  label: string;
  value: number;
  unit: string;
  icon: any;
  status: 'optimal' | 'warning' | 'critical';
}

export function SystemDiagnostics() {
  const [metrics, setMetrics] = useState<SystemMetric[]>([
    { label: 'CPU', value: 45, unit: '%', icon: Cpu, status: 'optimal' },
    { label: 'Memory', value: 67, unit: '%', icon: HardDrive, status: 'optimal' },
    { label: 'Power', value: 89, unit: '%', icon: Zap, status: 'optimal' },
    { label: 'Network', value: 98, unit: '%', icon: Wifi, status: 'optimal' },
    { label: 'Security', value: 100, unit: '%', icon: Shield, status: 'optimal' },
    { label: 'Uptime', value: 99, unit: '%', icon: Activity, status: 'optimal' }
  ]);

  useEffect(() => {
    const interval = setInterval(() => {
      setMetrics(prev =>
        prev.map(metric => ({
          ...metric,
          value: Math.min(100, Math.max(0, metric.value + (Math.random() - 0.5) * 5))
        }))
      );
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, x: -50 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.5 }}
      className="space-y-4"
    >
      {/* Header */}
      <div className="bg-gradient-to-br from-cyan-950/20 to-blue-950/20 border border-cyan-500/30 rounded-lg p-4 backdrop-blur-sm">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse" />
          <h3 className="text-cyan-400 text-sm uppercase tracking-wider">System Diagnostics</h3>
        </div>

        <div className="space-y-3">
          {metrics.map((metric, index) => (
            <motion.div
              key={metric.label}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 + 0.7 }}
              className="space-y-1"
            >
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <metric.icon className="w-3 h-3 text-cyan-400" />
                  <span className="text-cyan-300">{metric.label}</span>
                </div>
                <span className="text-cyan-400 font-mono">
                  {metric.value.toFixed(0)}{metric.unit}
                </span>
              </div>
              <div className="h-1 bg-cyan-950/50 rounded-full overflow-hidden">
                <motion.div
                  className={`h-full ${
                    metric.value > 80
                      ? 'bg-cyan-400'
                      : metric.value > 50
                      ? 'bg-yellow-400'
                      : 'bg-red-400'
                  }`}
                  initial={{ width: 0 }}
                  animate={{ width: `${metric.value}%` }}
                  transition={{ duration: 0.5 }}
                />
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Real-time Graph */}
      <div className="bg-gradient-to-br from-cyan-950/20 to-blue-950/20 border border-cyan-500/30 rounded-lg p-4 backdrop-blur-sm">
        <h3 className="text-cyan-400 text-xs uppercase tracking-wider mb-3">Performance Graph</h3>
        <svg width="100%" height="100" className="overflow-visible">
          <defs>
            <linearGradient id="graph-gradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="rgba(34, 211, 238, 0.4)" />
              <stop offset="100%" stopColor="rgba(34, 211, 238, 0)" />
            </linearGradient>
          </defs>
          
          {/* Grid Lines */}
          {[0, 25, 50, 75, 100].map((y) => (
            <line
              key={y}
              x1="0"
              y1={y}
              x2="100%"
              y2={y}
              stroke="rgba(34, 211, 238, 0.1)"
              strokeWidth="0.5"
            />
          ))}

          {/* Animated Wave */}
          <motion.path
            d="M 0 50 Q 25 30, 50 50 T 100 50 T 150 50 T 200 50 T 250 50 T 300 50"
            stroke="rgba(34, 211, 238, 0.8)"
            strokeWidth="2"
            fill="none"
            animate={{
              x: [-100, 0]
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: 'linear'
            }}
          />
          
          <motion.path
            d="M 0 50 Q 25 30, 50 50 T 100 50 T 150 50 T 200 50 T 250 50 T 300 50 L 300 100 L 0 100 Z"
            fill="url(#graph-gradient)"
            animate={{
              x: [-100, 0]
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: 'linear'
            }}
          />
        </svg>
      </div>

      {/* Status Log */}
      <div className="bg-gradient-to-br from-cyan-950/20 to-blue-950/20 border border-cyan-500/30 rounded-lg p-4 backdrop-blur-sm">
        <h3 className="text-cyan-400 text-xs uppercase tracking-wider mb-3">System Log</h3>
        <div className="space-y-1 text-xs font-mono">
          {[
            { time: '14:32:18', msg: 'All systems nominal', status: 'success' },
            { time: '14:32:05', msg: 'Security scan complete', status: 'success' },
            { time: '14:31:52', msg: 'Network synchronized', status: 'success' },
            { time: '14:31:40', msg: 'Core temperature optimal', status: 'success' }
          ].map((log, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1 + 1 }}
              className="flex items-center gap-2 text-cyan-500/70"
            >
              <span className="text-cyan-600">[{log.time}]</span>
              <div className="w-1 h-1 bg-green-400 rounded-full" />
              <span>{log.msg}</span>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Activity, Cpu, HardDrive, Wifi, Zap, Thermometer, Server, Database } from 'lucide-react';
import { Card } from './ui/card';
import { Progress } from './ui/progress';

interface SystemMetric {
  label: string;
  value: number;
  max: number;
  unit: string;
  icon: any;
  color: string;
  status: 'normal' | 'warning' | 'critical';
}

export function PerformanceMonitor() {
  const [metrics, setMetrics] = useState<SystemMetric[]>([
    { label: 'CPU Usage', value: 45, max: 100, unit: '%', icon: Cpu, color: 'cyan', status: 'normal' },
    { label: 'Memory', value: 6.4, max: 16, unit: 'GB', icon: HardDrive, color: 'blue', status: 'normal' },
    { label: 'Network', value: 234, max: 1000, unit: 'Mbps', icon: Wifi, color: 'cyan', status: 'normal' },
    { label: 'Power Draw', value: 145, max: 200, unit: 'W', icon: Zap, color: 'yellow', status: 'normal' },
    { label: 'Temperature', value: 45, max: 90, unit: '°C', icon: Thermometer, color: 'orange', status: 'normal' },
    { label: 'GPU Usage', value: 67, max: 100, unit: '%', icon: Server, color: 'purple', status: 'normal' },
    { label: 'Disk I/O', value: 123, max: 500, unit: 'MB/s', icon: Database, color: 'green', status: 'normal' },
    { label: 'Processes', value: 347, max: 1000, unit: '', icon: Activity, color: 'cyan', status: 'normal' }
  ]);

  const [processData, setProcessData] = useState<any[]>([]);

  useEffect(() => {
    // Update metrics
    const interval = setInterval(() => {
      setMetrics(prev => prev.map(metric => {
        const variance = (Math.random() - 0.5) * 10;
        const newValue = Math.max(0, Math.min(metric.max, metric.value + variance));
        const percentage = (newValue / metric.max) * 100;
        
        return {
          ...metric,
          value: newValue,
          status: percentage > 80 ? 'critical' : percentage > 60 ? 'warning' : 'normal'
        };
      }));

      // Update process data
      setProcessData(Array.from({ length: 10 }, (_, i) => ({
        id: i + 1,
        name: ['System', 'Chrome', 'JARVIS', 'Node', 'VS Code', 'Spotify', 'Docker', 'Postgres', 'Redis', 'Analytics'][i],
        cpu: Math.random() * 20,
        memory: Math.random() * 15,
        status: Math.random() > 0.9 ? 'high' : 'normal'
      })));
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'critical': return 'text-red-400';
      case 'warning': return 'text-yellow-400';
      default: return 'text-green-400';
    }
  };

  const getProgressColor = (status: string) => {
    switch (status) {
      case 'critical': return 'bg-red-400';
      case 'warning': return 'bg-yellow-400';
      default: return 'bg-cyan-400';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      {/* System Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {metrics.map((metric, index) => (
          <motion.div
            key={metric.label}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.05 }}
          >
            <Card className="bg-gradient-to-br from-cyan-950/20 to-blue-950/20 border-cyan-500/30 p-4 hover:border-cyan-500/50 transition-colors">
              <div className="flex items-center justify-between mb-3">
                <metric.icon className="w-6 h-6 text-cyan-400" />
                <span className={`text-xs font-mono ${getStatusColor(metric.status)}`}>
                  {metric.status.toUpperCase()}
                </span>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between items-baseline">
                  <p className="text-xs text-cyan-600">{metric.label}</p>
                  <p className="text-lg text-cyan-400 font-mono">
                    {metric.value.toFixed(metric.unit === '%' || !metric.unit ? 0 : 1)}
                    <span className="text-xs ml-1">{metric.unit}</span>
                  </p>
                </div>
                <div className="h-2 bg-cyan-950/50 rounded-full overflow-hidden">
                  <motion.div
                    className={`h-full ${getProgressColor(metric.status)}`}
                    initial={{ width: 0 }}
                    animate={{ width: `${(metric.value / metric.max) * 100}%` }}
                    transition={{ duration: 0.5 }}
                  />
                </div>
                <p className="text-xs text-cyan-700">
                  {metric.value.toFixed(1)} / {metric.max} {metric.unit}
                </p>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Detailed Monitoring */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Real-time Graph */}
        <Card className="bg-gradient-to-br from-cyan-950/20 to-blue-950/20 border-cyan-500/30 p-6">
          <h3 className="text-cyan-400 mb-4 flex items-center gap-2">
            <Activity className="w-4 h-4" />
            System Activity
          </h3>
          <div className="space-y-4">
            {metrics.slice(0, 4).map((metric) => (
              <div key={metric.label}>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-cyan-400">{metric.label}</span>
                  <span className="text-cyan-400 font-mono">
                    {metric.value.toFixed(1)}{metric.unit}
                  </span>
                </div>
                <div className="h-12 bg-black/40 rounded border border-cyan-500/20 p-2">
                  <svg width="100%" height="100%" className="overflow-visible">
                    <motion.path
                      d={`M 0 ${32 - (metric.value / metric.max) * 32} ${Array.from({ length: 20 }, (_, i) => {
                        const x = (i / 19) * 100;
                        const y = 32 - (Math.random() * metric.value / metric.max) * 32;
                        return `L ${x} ${y}`;
                      }).join(' ')}`}
                      stroke="#22d3ee"
                      strokeWidth="2"
                      fill="none"
                      initial={{ pathLength: 0 }}
                      animate={{ pathLength: 1 }}
                      transition={{ duration: 2 }}
                    />
                  </svg>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Process List */}
        <Card className="bg-gradient-to-br from-cyan-950/20 to-blue-950/20 border-cyan-500/30 p-6">
          <h3 className="text-cyan-400 mb-4 flex items-center gap-2">
            <Server className="w-4 h-4" />
            Top Processes
          </h3>
          <div className="space-y-2">
            <div className="grid grid-cols-4 gap-2 text-xs text-cyan-600 pb-2 border-b border-cyan-500/30">
              <span>Process</span>
              <span className="text-right">CPU</span>
              <span className="text-right">Memory</span>
              <span className="text-right">Status</span>
            </div>
            {processData.map((process) => (
              <motion.div
                key={process.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className="grid grid-cols-4 gap-2 text-xs py-2 border-b border-cyan-500/10 hover:bg-cyan-500/5 transition-colors"
              >
                <span className="text-cyan-400">{process.name}</span>
                <span className="text-cyan-300 text-right font-mono">
                  {process.cpu.toFixed(1)}%
                </span>
                <span className="text-cyan-300 text-right font-mono">
                  {process.memory.toFixed(1)}%
                </span>
                <span className={`text-right ${
                  process.status === 'high' ? 'text-red-400' : 'text-green-400'
                }`}>
                  {process.status === 'high' ? 'HIGH' : 'OK'}
                </span>
              </motion.div>
            ))}
          </div>
        </Card>
      </div>

      {/* System Logs */}
      <Card className="bg-gradient-to-br from-cyan-950/20 to-blue-950/20 border-cyan-500/30 p-6">
        <h3 className="text-cyan-400 mb-4 flex items-center gap-2">
          <Activity className="w-4 h-4" />
          System Logs
        </h3>
        <div className="bg-black/40 rounded border border-cyan-500/20 p-4 font-mono text-xs space-y-1 max-h-48 overflow-y-auto">
          {[
            { time: '14:32:45', level: 'INFO', msg: 'System performance optimal' },
            { time: '14:32:40', level: 'SUCCESS', msg: 'Neural network sync complete' },
            { time: '14:32:35', level: 'INFO', msg: 'Memory cache cleared' },
            { time: '14:32:30', level: 'WARN', msg: 'CPU temperature elevated' },
            { time: '14:32:25', level: 'INFO', msg: 'Network latency: 12ms' },
            { time: '14:32:20', level: 'SUCCESS', msg: 'Database backup completed' },
            { time: '14:32:15', level: 'INFO', msg: 'Security scan initiated' }
          ].map((log, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.05 }}
              className="flex gap-3"
            >
              <span className="text-cyan-600">[{log.time}]</span>
              <span className={`${
                log.level === 'SUCCESS' ? 'text-green-400' :
                log.level === 'WARN' ? 'text-yellow-400' :
                'text-cyan-500'
              }`}>
                {log.level}
              </span>
              <span className="text-cyan-400">{log.msg}</span>
            </motion.div>
          ))}
        </div>
      </Card>
    </motion.div>
  );
}

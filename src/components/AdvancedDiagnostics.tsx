import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Activity, Cpu, HardDrive, Wifi, Battery, Thermometer, Zap, TrendingUp } from 'lucide-react';
import { Card } from './ui/card';
import { Progress } from './ui/progress';
import { Badge } from './ui/badge';
import { LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface Metric {
  name: string;
  value: number;
  max: number;
  unit: string;
  status: 'normal' | 'warning' | 'critical';
  icon: any;
  color: string;
}

export function AdvancedDiagnostics() {
  const [metrics, setMetrics] = useState<Metric[]>([
    { name: 'CPU Usage', value: 45, max: 100, unit: '%', status: 'normal', icon: Cpu, color: 'cyan' },
    { name: 'Memory', value: 6.2, max: 16, unit: 'GB', status: 'normal', icon: HardDrive, color: 'blue' },
    { name: 'Network', value: 125, max: 1000, unit: 'Mbps', status: 'normal', icon: Wifi, color: 'green' },
    { name: 'GPU Load', value: 32, max: 100, unit: '%', status: 'normal', icon: Zap, color: 'purple' },
    { name: 'Temperature', value: 62, max: 100, unit: '°C', status: 'normal', icon: Thermometer, color: 'orange' },
    { name: 'Power', value: 87, max: 100, unit: '%', status: 'normal', icon: Battery, color: 'yellow' }
  ]);

  const [cpuHistory, setCpuHistory] = useState(
    Array.from({ length: 20 }, (_, i) => ({
      time: i,
      cpu: 40 + Math.random() * 20,
      memory: 50 + Math.random() * 20,
      network: 100 + Math.random() * 50
    }))
  );

  useEffect(() => {
    const interval = setInterval(() => {
      // Update metrics
      setMetrics(prev => prev.map(metric => {
        const newValue = metric.value + (Math.random() - 0.5) * 10;
        const clampedValue = Math.max(0, Math.min(metric.max, newValue));
        
        let status: 'normal' | 'warning' | 'critical' = 'normal';
        const percentage = (clampedValue / metric.max) * 100;
        if (percentage > 80) status = 'critical';
        else if (percentage > 60) status = 'warning';
        
        return { ...metric, value: clampedValue, status };
      }));

      // Update history
      setCpuHistory(prev => {
        const newData = {
          time: prev[prev.length - 1].time + 1,
          cpu: 40 + Math.random() * 30,
          memory: 50 + Math.random() * 20,
          network: 100 + Math.random() * 50
        };
        return [...prev.slice(1), newData];
      });
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'normal': return 'text-green-400';
      case 'warning': return 'text-yellow-400';
      case 'critical': return 'text-red-400';
      default: return 'text-cyan-400';
    }
  };

  const getProgressColor = (status: string) => {
    switch (status) {
      case 'normal': return 'bg-green-500';
      case 'warning': return 'bg-yellow-500';
      case 'critical': return 'bg-red-500';
      default: return 'bg-cyan-500';
    }
  };

  return (
    <div className="space-y-6">
      {/* Real-time Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {metrics.map((metric, i) => (
          <motion.div
            key={metric.name}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.1 }}
          >
            <Card className={`bg-gradient-to-br from-${metric.color}-950/20 to-${metric.color}-900/20 border-${metric.color}-500/30 p-4`}>
              <div className="flex items-center gap-3 mb-3">
                <div className={`w-10 h-10 bg-${metric.color}-500/20 border border-${metric.color}-500/50 rounded-lg flex items-center justify-center`}>
                  <metric.icon className={`w-5 h-5 text-${metric.color}-400`} />
                </div>
                <div className="flex-1">
                  <div className="text-xs text-cyan-600">{metric.name}</div>
                  <div className={`text-xl font-mono ${getStatusColor(metric.status)}`}>
                    {metric.value.toFixed(1)}{metric.unit}
                  </div>
                </div>
              </div>
              <Progress 
                value={(metric.value / metric.max) * 100} 
                className={`h-2 ${getProgressColor(metric.status)}`}
              />
              <div className="flex justify-between text-xs text-cyan-700 mt-2">
                <span>0{metric.unit}</span>
                <span>{metric.max}{metric.unit}</span>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Performance Graphs */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-gradient-to-br from-cyan-950/20 to-blue-950/20 border-cyan-500/30 p-6">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-cyan-400">CPU & Memory Usage</h4>
            <Badge className="bg-cyan-500/20 border-cyan-500/50 text-cyan-400">
              Real-time
            </Badge>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={cpuHistory}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e3a4a" />
              <XAxis dataKey="time" stroke="#0e7490" />
              <YAxis stroke="#0e7490" />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'rgba(0,0,0,0.9)', 
                  border: '1px solid #0e7490',
                  borderRadius: '8px'
                }}
              />
              <Line type="monotone" dataKey="cpu" stroke="#06b6d4" strokeWidth={2} dot={false} />
              <Line type="monotone" dataKey="memory" stroke="#3b82f6" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </Card>

        <Card className="bg-gradient-to-br from-green-950/20 to-emerald-950/20 border-green-500/30 p-6">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-green-400">Network Activity</h4>
            <Badge className="bg-green-500/20 border-green-500/50 text-green-400">
              <TrendingUp className="w-3 h-3 mr-1" />
              Live
            </Badge>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={cpuHistory}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e4a3a" />
              <XAxis dataKey="time" stroke="#059669" />
              <YAxis stroke="#059669" />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'rgba(0,0,0,0.9)', 
                  border: '1px solid #059669',
                  borderRadius: '8px'
                }}
              />
              <Area type="monotone" dataKey="network" stroke="#10b981" fill="#10b98130" />
            </AreaChart>
          </ResponsiveContainer>
        </Card>
      </div>

      {/* System Info */}
      <Card className="bg-gradient-to-br from-purple-950/20 to-pink-950/20 border-purple-500/30 p-6">
        <h4 className="text-purple-400 mb-4">System Information</h4>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="flex justify-between">
            <span className="text-purple-600">OS</span>
            <span className="text-purple-400 font-mono">JARVIS Ultra Quantum v5.0</span>
          </div>
          <div className="flex justify-between">
            <span className="text-purple-600">Architecture</span>
            <span className="text-purple-400 font-mono">x64</span>
          </div>
          <div className="flex justify-between">
            <span className="text-purple-600">Processor</span>
            <span className="text-purple-400 font-mono">Quantum Core 16Q</span>
          </div>
          <div className="flex justify-between">
            <span className="text-purple-600">Total Memory</span>
            <span className="text-purple-400 font-mono">16.0 GB</span>
          </div>
          <div className="flex justify-between">
            <span className="text-purple-600">Uptime</span>
            <span className="text-purple-400 font-mono">24d 12h 45m</span>
          </div>
          <div className="flex justify-between">
            <span className="text-purple-600">Kernel</span>
            <span className="text-purple-400 font-mono">5.0.0-quantum</span>
          </div>
        </div>
      </Card>
    </div>
  );
}
